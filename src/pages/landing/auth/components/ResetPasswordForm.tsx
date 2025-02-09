import { TextField, Button, InputAdornment, IconButton, Box } from '@mui/material';
import { FormEvent } from 'react';

// Types
interface ResetPasswordFormProps {
    resetStep: 'email' | 'token' | 'password'; // Step of the reset process
    resetEmail: string; // Email for password reset
    resetToken: string; // Token for verifying the reset
    newPassword: string; // New password input
    confirmPassword: string; // Confirm new password input
    loading: boolean; // Loading state for buttons
    showNewPassword: boolean; // State to show/hide new password
    showConfirmPassword: boolean; // State to show/hide confirm password
    setResetEmail: (email: string) => void; // Function to set reset email
    setResetToken: (token: string) => void; // Function to set reset token
    setNewPassword: (password: string) => void; // Function to set new password
    setConfirmPassword: (password: string) => void; // Function to set confirm password
    setShowNewPassword: (show: boolean) => void; // Function to toggle new password visibility
    setShowConfirmPassword: (show: boolean) => void; // Function to toggle confirm password visibility
    handleForgotPassword: (e: FormEvent) => void; // Function to handle forgot password
    handleVerifyToken: (e: FormEvent) => void; // Function to handle token verification
    handleResetPassword: (e: FormEvent) => void; // Function to handle password reset
}

// ResetPasswordForm component definition
export default function ResetPasswordForm({
    resetStep,
    resetEmail,
    resetToken,
    newPassword,
    confirmPassword,
    loading,
    showNewPassword,
    showConfirmPassword,
    setResetEmail,
    setResetToken,
    setNewPassword,
    setConfirmPassword,
    setShowNewPassword,
    setShowConfirmPassword,
    handleForgotPassword,
    handleVerifyToken,
    handleResetPassword,
}: ResetPasswordFormProps) {

    switch (resetStep) {
        // Email step
        case 'email':
            return (
                <Box component="form" onSubmit={handleForgotPassword}>
                    {/* Email Input */}
                    <TextField
                        fullWidth
                        required
                        label="Email"
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value.trim())}
                        sx={{ mb: 2 }}
                    />
                    {/* Send Recovery Code Button */}
                    <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                        disabled={!resetEmail || loading}
                        sx={{
                            bgcolor: '#fe6f14',
                            '&:hover': { bgcolor: '#c84f03' }
                        }}
                    >
                        {loading ? 'Loading...' : 'Send Recovery Code'}
                    </Button>
                </Box>
            );
        // Token step
        case 'token':
            return (
                <Box component="form" onSubmit={handleVerifyToken}>
                    {/* Recovery Code Input */}
                    <TextField
                        fullWidth
                        required
                        label="Recovery Code"
                        value={resetToken}
                        onChange={(e) => setResetToken(e.target.value.trim())}
                        sx={{ mb: 2 }}
                        type="number"
                    />
                    {/* Verify Code Button */}
                    <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                        disabled={!resetToken || loading}
                        sx={{
                            bgcolor: '#fe6f14',
                            '&:hover': { bgcolor: '#c84f03' }
                        }}
                    >
                        {loading ? 'Loading...' : 'Verify Code'}
                    </Button>
                </Box>
            );
        // Password step
        case 'password':
            return (
                <Box component="form" onSubmit={handleResetPassword}>
                    {/* New Password Input */}
                    <TextField
                        fullWidth
                        required
                        type={showNewPassword ? 'text' : 'password'}
                        label="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        margin="normal"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end">
                                        <span className="material-symbols-rounded">
                                            {showNewPassword ? 'visibility' : 'visibility_off'}
                                        </span>
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                    {/* Confirm New Password Input */}
                    <TextField
                        fullWidth
                        required
                        type={showConfirmPassword ? 'text' : 'password'}
                        label="Confirm New Password"
                        helperText="Minimum 8 characters, one uppercase letter, one lowercase letter, one number and one symbol"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        sx={{ mb: 2 }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                                        <span className="material-symbols-rounded">
                                            {showConfirmPassword ? 'visibility' : 'visibility_off'}
                                        </span>
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                    {/* Reset Password Button */}
                    <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                        disabled={!newPassword || !confirmPassword || loading}
                        sx={{
                            bgcolor: '#fe6f14',
                            '&:hover': { bgcolor: '#c84f03' }
                        }}
                    >
                        {loading ? 'Loading...' : 'Reset Password'}
                    </Button>
                </Box>
            );
        default:
            return null;
    }
}
