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

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(formData.newPassword)) {
            toast.error(t('dashboard.common.error.PASSWORD_TOO_WEAK'));
            return;
        }

        try {
            await userService.changePassword(
                formData.currentPassword, 
                formData.newPassword,
                user?.language || 'esES'
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

    const handleDeleteAccount = async () => {
        if (!user || deleteConfirmation !== user.username) {
            toast.error(t('dashboard.settings.securityPrivacy.usernameDoesNotMatch'));
            return;
        }

        try {
            await userService.deleteAccount(user?.language || 'enUS');
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
                        {t('dashboard.settings.securityPrivacy.changePassword')}
                    </Typography>
                    <Box component="form" onSubmit={handlePasswordChange} sx={{ width: '100%' }}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            width: '100%',
                            mt: 2
                        }}>
                            <TextField
                                fullWidth
                                size="small"
                                type={showPassword.current ? 'text' : 'password'}
                                label={t('dashboard.settings.securityPrivacy.currentPassword')}
                                value={formData.currentPassword}
                                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
                                                edge="end"
                                            >
                                                {showPassword.current ? <span className="material-symbols-rounded">visibility_off</span> : <span className="material-symbols-rounded">visibility</span>}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <TextField
                                fullWidth
                                size="small"
                                type={showPassword.new ? 'text' : 'password'}
                                label={t('dashboard.settings.securityPrivacy.newPassword')}
                                value={formData.newPassword}
                                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                                                edge="end"
                                            >
                                                {showPassword.new ? <span className="material-symbols-rounded">visibility_off</span> : <span className="material-symbols-rounded">visibility</span>}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <TextField
                                fullWidth
                                size="small"
                                type={showPassword.confirm ? 'text' : 'password'}
                                label={t('dashboard.settings.securityPrivacy.confirmNewPassword')}
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                                                edge="end"
                                            >
                                                {showPassword.confirm ? <span className="material-symbols-rounded">visibility_off</span> : <span className="material-symbols-rounded">visibility</span>}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

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
