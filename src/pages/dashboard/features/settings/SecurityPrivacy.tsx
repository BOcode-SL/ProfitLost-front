/**
 * SecurityPrivacy Module
 * 
 * Provides comprehensive security and privacy management interface with robust
 * validation and confirmation workflows for sensitive operations.
 * 
 * Key Features:
 * - Password management with strong validation requirements
 * - Progressive account deletion process with multiple safeguards
 * - Comprehensive error handling with specific user feedback
 * - Password visibility toggles for improved user experience
 * - Secured form submissions with validation checks
 * - Responsive design adapting to different screen sizes
 * - Multi-step confirmation for critical account operations
 * 
 * @module SecurityPrivacy
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Box, Paper, Button, TextField, IconButton, InputAdornment, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, Trash2 } from 'react-feather';

// Services
import { userService } from '../../../../services/user.service';

// Contexts
import { useUser } from '../../../../contexts/UserContext';

// Types
import type { UserApiErrorResponse } from '../../../../types/api/responses';

/**
 * Props interface for the SecurityPrivacy component
 * 
 * @interface SecurityPrivacyProps
 */
interface SecurityPrivacyProps {
    /** Optional callback function triggered after successful operations */
    onSuccess?: () => void;
}

/**
 * SecurityPrivacy Component
 * 
 * Manages user security settings including password changes and account deletion
 * with appropriate validation and confirmation workflows.
 * 
 * @param {SecurityPrivacyProps} props - Component properties
 * @returns {JSX.Element} The rendered security and privacy settings interface
 */
export default function SecurityPrivacy({ onSuccess }: SecurityPrivacyProps) {
    const { t } = useTranslation();
    const { user, setUser } = useUser();
    const navigate = useNavigate();

    /**
     * Component State Management
     */
    /** Controls visibility of password fields for better user experience */
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false
    });

    /** Manages password change form input values */
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    /** Controls visibility of account deletion confirmation UI */
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    /** Tracks user-entered confirmation text for account deletion */
    const [deleteConfirmation, setDeleteConfirmation] = useState('');

    /**
     * Handles password change with comprehensive validation
     * Ensures password strength and matching confirmation
     * 
     * @param {React.FormEvent} e - Form submission event
     */
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

    /**
     * Handles account deletion with username confirmation
     * Requires exact username match to prevent accidental deletion
     */
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
                gap: 2
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
                                                    onClick={
                                                        () => setShowPassword({ ...showPassword, current: !showPassword.current })
                                                    }
                                                    edge="end"
                                                >
                                                    {showPassword.current ? <EyeOff size={20} /> : <Eye size={20} />}
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
                                                    {showPassword.new ? <EyeOff size={20} /> : <Eye size={20} />}
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
                                                    onClick={
                                                        () => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })
                                                    }
                                                    edge="end"
                                                >
                                                    {showPassword.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
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
                        // Initial Delete Account Button - triggers confirmation UI
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={() => setShowDeleteConfirmation(true)}
                            startIcon={<Trash2 size={20} />}
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
                                {/* Username confirmation input - must match exactly */}
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
