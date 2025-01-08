import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';

import { userService } from '../../../../services/user.service';
import { useUser } from '../../../../contexts/UserContext';
import './SecurityPrivacy.scss';
import type { UserApiErrorResponse } from '../../../../types/services/user.types';

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
        <Box className="security-privacy">
            <Box className="security-privacy__details">
                {/* Two Factor Authentication Section */}
                <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                    <h3>Two-Factor Authentication <span className="soon-badge">SOON</span></h3>
                    <Box className="two-factor-section">
                        <p>Add an extra layer of security to your account by enabling two-factor authentication.</p>
                        <Box className="two-factor-status">
                            <Box className="status-indicator">
                                <span className="material-symbols-rounded">
                                    {/* {false ? 'lock' : 'lock_open'} */}
                                    lock_open
                                </span>
                                {/* <p>2FA is currently {false ? 'enabled' : 'disabled'}</p> */}
                                <p>2FA is currently disabled</p>
                            </Box>
                            <Button
                                variant="outlined"
                                disabled={true}
                                onClick={() => {/* handle 2FA toggle */ }}
                                startIcon={
                                    <span className="material-symbols-rounded">
                                        {/* {false ? 'lock_open' : 'lock'} */}
                                        lock
                                    </span>
                                }
                            >
                                {/* {false ? 'Disable' : 'Enable'} 2FA */}
                                Enable 2FA
                            </Button>
                        </Box>
                    </Box>
                </Paper>

                {/* Password Change Section */}
                <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                    <h3>Change Password</h3>
                    <form onSubmit={handlePasswordChange}>
                        <Box className="form-fields">
                            <TextField
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
                <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                    <h3>Delete Account</h3>
                    <Typography variant="body1" color="error" sx={{ mb: 2 }}>
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
                                width: '100%',
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
                                gap: 2,
                                alignItems: 'flex-start'
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
