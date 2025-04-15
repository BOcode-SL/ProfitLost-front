import { TextField, Button, InputAdornment, IconButton, Box } from '@mui/material';
import { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

/**
 * Reset Password Form Component
 * 
 * Multi-step form that handles the password recovery process:
 * 1. Email step - Collects user email to send recovery code
 * 2. Token step - Validates the verification code sent to email
 * 3. Password step - Allows setting a new password with confirmation
 */

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
    const { t } = useTranslation();

    switch (resetStep) {
        // Email step
        case 'email':
            return (
                <Box component="form" onSubmit={handleForgotPassword}>
                    {/* Email Input */}
                    <TextField
                        fullWidth
                        required
                        label={t('home.auth.resetPassword.steps.email.label')}
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
                        {loading ? t('home.auth.common.loading') : t('home.auth.resetPassword.steps.email.submit')}
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
                        label={t('home.auth.resetPassword.steps.token.label')}
                        value={resetToken}
                        onChange={(e) => {
                            const value = e.target.value;
                            // Only allow digits and maximum 6 characters
                            if (/^\d*$/.test(value) && value.length <= 6) {
                                setResetToken(value);
                            }
                        }}
                        sx={{ mb: 2 }}
                        inputProps={{
                            maxLength: 6,
                            pattern: '[0-9]*',
                            inputMode: 'numeric'
                        }}
                        helperText={t('home.auth.resetPassword.steps.token.helper', { defaultValue: '6-digit code sent to your email' })}
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
                        {loading ? t('home.auth.common.loading') : t('home.auth.resetPassword.steps.token.submit')}
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
                        label={t('home.auth.resetPassword.steps.password.newPassword.label')}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        margin="normal"
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end">
                                            {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }
                        }}
                    />
                    {/* Confirm New Password Input */}
                    <TextField
                        fullWidth
                        required
                        type={showConfirmPassword ? 'text' : 'password'}
                        label={t('home.auth.resetPassword.steps.password.confirmPassword.label')}
                        helperText={t('home.auth.resetPassword.steps.password.confirmPassword.helper')}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        margin="normal"
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                                            {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }
                        }}
                    />
                    {/* Reset Password Button */}
                    <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                        disabled={!newPassword || !confirmPassword || loading}
                        sx={{
                            mt: 3,
                            bgcolor: '#fe6f14',
                            '&:hover': { bgcolor: '#c84f03' }
                        }}
                    >
                        {loading ? t('home.auth.common.loading') : t('home.auth.resetPassword.steps.password.submit')}
                    </Button>
                </Box>
            );
        default:
            return null;
    }
}
