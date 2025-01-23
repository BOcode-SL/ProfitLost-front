import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Box, Paper, Button, TextField, IconButton, InputAdornment, Typography } from '@mui/material';

import { userService } from '../../../../services/user.service';
import { useUser } from '../../../../contexts/UserContext';
import type { UserApiErrorResponse } from '../../../../types/api/responses';

export default function SecurityPrivacy() {
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
            toast.error('The passwords do not match');
            return;
        }

        try {
            await userService.changePassword(formData.currentPassword, formData.newPassword);
            toast.success('Password updated successfully');
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
        } catch (error) {
            const apiError = error as UserApiErrorResponse;
            switch (apiError.error) {
                case 'INVALID_PASSWORD':
                    toast.error('The current password is incorrect');
                    break;
                case 'CONNECTION_ERROR':
                    toast.error('Connection error. Please check your internet connection');
                    break;
                case 'UNAUTHORIZED':
                    toast.error('Session expired. Please login again');
                    setUser(null);
                    navigate('/login');
                    break;
                default:
                    toast.error('Error changing password');
            }
        }
    };

    const handleDeleteAccount = async () => {
        if (!user || deleteConfirmation !== user.username) {
            toast.error('The username does not match');
            return;
        }

        try {
            await userService.deleteAccount();
            setUser(null);
            toast.success('Account deleted successfully');
            navigate('/');
        } catch (error) {
            const apiError = error as UserApiErrorResponse;
            switch (apiError.error) {
                case 'CONNECTION_ERROR':
                    toast.error('Connection error. Please check your internet connection');
                    break;
                case 'UNAUTHORIZED':
                    toast.error('Session expired. Please login again');
                    setUser(null);
                    navigate('/login');
                    break;
                case 'USER_NOT_FOUND':
                    toast.error('User not found');
                    setUser(null);
                    navigate('/login');
                    break;
                default:
                    toast.error('Error deleting account');
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
                        Change Password <span className="soon-badge">SOON</span>
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
                                label="Current Password"
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
                                label="New Password"
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
                                label="Confirm New Password"
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
                                Update Password
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
                        Delete Account
                    </Typography>
                    <Typography
                        variant="body2"
                        color="error"
                        sx={{ mb: 2 }}
                    >
                        This action is irreversible. All your data will be deleted permanently.
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
                            Delete my account
                        </Button>
                    ) : (
                        <Box sx={{ mt: 2 }}>
                            <Typography sx={{ mb: 2 }}>
                                To confirm, write your username: <strong>{user?.username}</strong>
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
                                    placeholder="Username"
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
                                    Confirm
                                </Button>
                            </Box>
                        </Box>
                    )}
                </Paper>
            </Box>
        </Box>
    );
}
