import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Box, Paper, Button, TextField, IconButton, InputAdornment, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { userService } from '../../../../services/user.service';
import { useUser } from '../../../../contexts/UserContext';
import type { UserApiErrorResponse } from '../../../../types/api/responses';

interface SecurityPrivacyProps {
    onSuccess?: () => void;
}

export default function SecurityPrivacy({ onSuccess }: SecurityPrivacyProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user, setUser } = useUser();
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

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            toast.error(t('dashboard.settings.securityPrivacy.passwordsDoNotMatch'));
            return;
        }

        try {
            await userService.changePassword(formData.currentPassword, formData.newPassword);
            toast.success(t('dashboard.settings.securityPrivacy.passwordUpdatedSuccess'));
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
            onSuccess?.();
        } catch (error) {
            const apiError = error as UserApiErrorResponse;
            switch (apiError.error) {
                case 'INVALID_PASSWORD':
                    toast.error(t('dashboard.common.error.INVALID_PASSWORD'));
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

    const handleDeleteAccount = async () => {
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
                        {t('dashboard.settings.securityPrivacy.changePassword')}<span className="soon-badge">SOON</span>
                    </Typography>
                    <form onSubmit={handlePasswordChange}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            width: '100%',
                            mt: 2
                        }}>
                            <TextField
                                disabled
                                size="small"
                                label={t('dashboard.settings.securityPrivacy.currentPassword')}
                                type={showPassword.current ? 'text' : 'password'}
                                value={formData.currentPassword}
                                onChange={() => {/* handle current password */ }}
                                fullWidth
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(prev => ({ ...prev, current: !prev.current }))}
                                                edge="end"
                                            >
                                                <span className="material-symbols-rounded">
                                                    {showPassword.current ? 'visibility_off' : 'visibility'}
                                                </span>
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <TextField
                                disabled
                                size="small"
                                label={t('dashboard.settings.securityPrivacy.newPassword')}
                                type={showPassword.new ? 'text' : 'password'}
                                value={formData.newPassword}
                                onChange={() => {/* handle new password */ }}
                                fullWidth
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
                                                edge="end"
                                            >
                                                <span className="material-symbols-rounded">
                                                    {showPassword.new ? 'visibility_off' : 'visibility'}
                                                </span>
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <TextField
                                disabled
                                size="small"
                                label={t('dashboard.settings.securityPrivacy.confirmNewPassword')}
                                type={showPassword.confirm ? 'text' : 'password'}
                                value={formData.confirmPassword}
                                onChange={() => {/* handle confirm password */ }}
                                fullWidth
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                                                edge="end"
                                            >
                                                <span className="material-symbols-rounded">
                                                    {showPassword.confirm ? 'visibility_off' : 'visibility'}
                                                </span>
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <Button
                                disabled
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                            >
                                {t('dashboard.settings.securityPrivacy.updatePassword')}
                            </Button>
                        </Box>
                    </form>
                </Paper>

                {/* Delete Account Section */}
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
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={() => setShowDeleteConfirmation(true)}
                            startIcon={<span className="material-symbols-rounded">delete_forever</span>}
                            sx={{
                                borderColor: 'red',
                                color: 'red',
                                width: '100%'
                            }}
                        >
                            {t('dashboard.settings.securityPrivacy.deleteAccount')}
                        </Button>
                    ) : (
                        <Box sx={{ mt: 2 }}>
                            <Typography sx={{ mb: 2 }}>
                                {t('dashboard.settings.securityPrivacy.deleteConfirmation')}: <strong>{user?.username}</strong>
                            </Typography>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2
                            }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    value={deleteConfirmation}
                                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                                    placeholder={t('dashboard.settings.securityPrivacy.username')}
                                />
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
