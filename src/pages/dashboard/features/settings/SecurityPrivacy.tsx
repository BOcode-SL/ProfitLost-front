/**
 * SecurityPrivacy Component
 * 
 * Allows users to manage security and privacy settings including:
 * - Password changes with validation
 * - Account deletion functionality with confirmation
 * - Error handling with user feedback
 * - Comprehensive security measures for sensitive actions
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Box, Paper, Button, TextField, IconButton, InputAdornment, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

// Services
import { userService } from '../../../../services/user.service';

// Contexts
import { useUser } from '../../../../contexts/UserContext';

// Types
import type { UserApiErrorResponse } from '../../../../types/api/responses';

// Interface for the props of the SecurityPrivacy component
interface SecurityPrivacyProps {
    onSuccess?: () => void; // Optional callback function to be called on success
}

// SecurityPrivacy component
export default function SecurityPrivacy({ onSuccess }: SecurityPrivacyProps) {
    const { t } = useTranslation();
    const { user, setUser } = useUser();
    const navigate = useNavigate();

    // State for password visibility toggles and form data
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState('');

    // Handle password change with validation and API communication
    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate password match
        if (formData.newPassword !== formData.confirmPassword) {
            toast.error(t('dashboard.settings.securityPrivacy.passwordsDoNotMatch'));
            return;
        }

        // Validate password strength using regex
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
        if (!passwordRegex.test(formData.newPassword)) {
            toast.error(t('dashboard.common.error.PASSWORD_TOO_WEAK'));
            return;
        }

        try {
            await userService.changePassword(
                formData.currentPassword,
                formData.newPassword
            );
            toast.success(t('dashboard.settings.securityPrivacy.passwordUpdatedSuccess'));
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
            onSuccess?.();
        } catch (error) {
            const apiError = error as UserApiErrorResponse;
            // Handle different error cases with specific user feedback
            switch (apiError.error) {
                case 'INVALID_PASSWORD':
                    toast.error(t('dashboard.common.error.INVALID_PASSWORD'));
                    break;
                case 'PASSWORD_TOO_WEAK':
                    toast.error(t('dashboard.common.error.PASSWORD_TOO_WEAK'));
                    break;
                case 'MISSING_FIELDS':
                    toast.error(t('dashboard.common.error.MISSING_FIELDS'));
                    break;
                case 'CONNECTION_ERROR':
                    toast.error(t('dashboard.common.error.CONNECTION_ERROR'));
                    break;
                case 'UNAUTHORIZED':
                    toast.error(t('dashboard.common.error.UNAUTHORIZED'));
                    setUser(null);
                    navigate('/login');
                    break;
                default:
                    toast.error(t('dashboard.settings.securityPrivacy.passwordUpdatedError'));
            }
        }
    };

    // Handle account deletion with confirmation check
    const handleDeleteAccount = async () => {
        // Validate the confirmation text matches username
        if (!user || deleteConfirmation !== user.username) {
            toast.error(t('dashboard.settings.securityPrivacy.usernameDoesNotMatch'));
            return;
        }

        try {
            await userService.deleteAccount();
            setUser(null);
            toast.success(t('dashboard.settings.securityPrivacy.deleteAccountSuccess'));
            onSuccess?.();
            navigate('/');
        } catch (error) {
            const apiError = error as UserApiErrorResponse;
            // Handle different error cases with specific user feedback
            switch (apiError.error) {
                case 'CONNECTION_ERROR':
                    toast.error(t('dashboard.common.error.CONNECTION_ERROR'));
                    break;
                case 'UNAUTHORIZED':
                    toast.error(t('dashboard.common.error.UNAUTHORIZED'));
                    setUser(null);
                    navigate('/login');
                    break;
                case 'USER_NOT_FOUND':
                    toast.error(t('dashboard.common.error.USER_NOT_FOUND'));
                    setUser(null);
                    navigate('/login');
                    break;
                default:
                    toast.error(t('dashboard.settings.securityPrivacy.deleteAccountError'));
            }
            setShowDeleteConfirmation(false);
        }
    };

    return (
        <Box sx={{
            width: '100%',
            maxWidth: '600px',
            margin: '0 auto'
        }}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3
            }}>
                {/* Password Change Section */}
                <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
                    <Typography
                        variant="h3"
                        sx={{
                            fontSize: '1rem',
                            fontWeight: 500,
                            mt: 0,
                            mb: 2
                        }}
                    >
                        {t('dashboard.settings.securityPrivacy.changePassword')}
                    </Typography>
                    <Box component="form" onSubmit={handlePasswordChange} sx={{ width: '100%' }}>
                        {/* Password change form fields */}
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            width: '100%',
                            mt: 2
                        }}>
                            {/* Current Password Field with visibility toggle */}
                            <TextField
                                fullWidth
                                size="small"
                                type={showPassword.current ? 'text' : 'password'}
                                label={t('dashboard.settings.securityPrivacy.currentPassword')}
                                value={formData.currentPassword}
                                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                            onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
                                                    edge="end"
                                                >
                                                    {showPassword.current ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }
                                }}
                            />

                            {/* New Password Field with visibility toggle */}
                            <TextField
                                fullWidth
                                size="small"
                                type={showPassword.new ? 'text' : 'password'}
                                label={t('dashboard.settings.securityPrivacy.newPassword')}
                                value={formData.newPassword}
                                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                                                    edge="end"
                                                >
                                                    {showPassword.new ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }
                                }}
                            />

                            {/* Confirm New Password Field with visibility toggle */}
                            <TextField
                                fullWidth
                                size="small"
                                type={showPassword.confirm ? 'text' : 'password'}
                                label={t('dashboard.settings.securityPrivacy.confirmNewPassword')}
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                            onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                                                    edge="end"
                                                >
                                                    {showPassword.confirm ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }
                                }}
                            />

                            {/* Update Password Button - disabled until all fields are filled */}
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={!formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
                            >
                                {t('dashboard.settings.securityPrivacy.updatePassword')}
                            </Button>
                        </Box>
                    </Box>
                </Paper>

                {/* Account Deletion Section with Warning */}
                <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
                    <Typography
                        variant="h3"
                        sx={{
                            fontSize: '1rem',
                            fontWeight: 500,
                            mt: 0,
                            mb: 2
                        }}
                    >
                        {t('dashboard.settings.securityPrivacy.deleteAccount')}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="error"
                        sx={{ mb: 2 }}
                    >
                        {t('dashboard.settings.securityPrivacy.deleteAccountConfirmation')}
                    </Typography>

                    {!showDeleteConfirmation ? (
                        // Initial Delete Account Button
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={() => setShowDeleteConfirmation(true)}
                            startIcon={<DeleteForeverIcon />}
                            sx={{
                                borderColor: 'red',
                                color: 'red',
                                width: '100%'
                            }}
                        >
                            {t('dashboard.settings.securityPrivacy.deleteAccount')}
                        </Button>
                    ) : (
                        // Confirmation UI with username input validation
                        <Box sx={{ mt: 2 }}>
                            <Typography sx={{ mb: 2 }}>
                                {t('dashboard.settings.securityPrivacy.deleteConfirmation')}: <strong>{user?.username}</strong>
                            </Typography>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2
                            }}>
                                {/* Username confirmation input */}
                                <TextField
                                    fullWidth
                                    size="small"
                                    value={deleteConfirmation}
                                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                                    placeholder={t('dashboard.settings.securityPrivacy.username')}
                                />
                                {/* Final confirmation button - disabled until username matches */}
                                <Button
                                    variant="outlined"
                                    onClick={handleDeleteAccount}
                                    disabled={deleteConfirmation !== user?.username}
                                    sx={{
                                        borderColor: 'red',
                                        color: 'red',
                                        width: '100%',
                                        '&:hover': {
                                            backgroundColor: 'red',
                                            color: 'white',
                                        }
                                    }}
                                >
                                    {t('dashboard.common.confirm')}
                                </Button>
                            </Box>
                        </Box>
                    )}
                </Paper>
            </Box>
        </Box>
    );
}
