import { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import './SecurityPrivacy.scss';

export default function SecurityPrivacy() {
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false
    });
    // const [formData, setFormData] = useState({
    const [formData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        usernameConfirmation: ''
    });
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

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
                            variant="contained"
                            onClick={() => {/* handle password change */ }}
                            fullWidth
                        >
                            Change Password
                        </Button>
                    </Box>
                </Paper>

                {/* Delete Account Section */}
                <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                    <h3>Delete Account</h3>
                    <p className="warning-text">
                        This action cannot be undone. Please be certain.
                    </p>

                    {!showDeleteConfirmation ? (
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={() => setShowDeleteConfirmation(true)}
                            startIcon={<span className="material-symbols-rounded">delete</span>}
                            fullWidth
                        >
                            Delete Account
                        </Button>
                    ) : (
                        <Box className="form-fields">
                            <p>Please enter your username to confirm:</p>
                            <TextField
                                label="Username"
                                value={formData.usernameConfirmation}
                                onChange={() => {/* handle username confirmation */ }}
                                fullWidth
                            />
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={() => {/* handle delete account */ }}
                                startIcon={<span className="material-symbols-rounded">delete_forever</span>}
                                fullWidth
                            >
                                Confirm Delete
                            </Button>
                        </Box>
                    )}
                </Paper>
            </Box>
        </Box>
    );
}
