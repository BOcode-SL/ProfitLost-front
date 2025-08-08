/**
 * Reset Password Form Component
 * 
 * Provides a multi-step interface for password reset functionality:
 * - Step 1: Email input for password reset request
 * - Step 2: Token verification from email
 * - Step 3: New password and confirmation input
 * 
 * Includes field validation, password visibility toggles, and accessibility features.
 * 
 * @module ResetPasswordForm
 */
import { FormEvent } from 'react';
import { TextField, Button, InputAdornment, IconButton, Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff } from 'react-feather';

/**
 * Props interface for the ResetPasswordForm component
 * 
 * @interface ResetPasswordFormProps
 */
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

/**
 * Helper function to get the step title based on current step
 * 
 * @param {('email' | 'token' | 'password')} step - Current reset step
 * @returns {string} The title for the current step
 */
export const getResetPasswordStepTitle = (
    step: 'email' | 'token' | 'password',
    t: (key: string) => string
): string => {
    switch (step) {
        case 'email':
            return t('home.auth.resetPassword.steps.email.title');
        case 'token':
            return t('home.auth.resetPassword.steps.token.title');
        case 'password':
            return t('home.auth.resetPassword.steps.password.title');
        default:
            return '';
    }
};

/**
 * Reset password form component
 * 
 * Provides a multi-step password recovery interface.
 * Changes form fields and validation based on the current step.
 * Features numeric validation for token and visibility toggles for passwords.
 * 
 * @param {ResetPasswordFormProps} props - Component properties
 * @returns {JSX.Element | null} The rendered reset password form or null if invalid step
 */
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

    // Common styles for text fields
    const textFieldStyles = {
        mb: 3,
        '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            backgroundColor: 'white',
            '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#fe6f14'
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#fe6f14'
            }
        },
        '& .MuiInputLabel-root.Mui-focused': {
            color: '#fe6f14'
        }
    };

    // Common button styles
    const buttonStyles = {
        py: 1.5,
        fontSize: '1.1rem',
        fontWeight: 600,
        borderRadius: 2,
        background: 'linear-gradient(135deg, #fe6f14 0%, #c84f03 100%)',
        boxShadow: '0 4px 15px rgba(254, 111, 20, 0.3)',
        '&:hover': {
            background: 'linear-gradient(135deg, #c84f03 0%, #a63c02 100%)',
            boxShadow: '0 6px 20px rgba(254, 111, 20, 0.4)',
            transform: 'scale(1.02)'
        },
        '&:disabled': {
            background: '#e0e0e0',
            color: '#999',
            boxShadow: 'none',
            transform: 'none'
        },
        transition: 'all 0.3s ease'
    };

    switch (resetStep) {
        // Email step
        case 'email':
            return (
                <Box component="form" onSubmit={handleForgotPassword}>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            textAlign: 'center',
                            mb: 3,
                            fontSize: '1rem',
                            lineHeight: 1.6
                        }}
                    >
                        {t('home.auth.resetPassword.steps.email.description')}
                    </Typography>

                    {/* Email Input */}
                    <TextField
                        fullWidth
                        required
                        variant="outlined"
                        label={t('home.auth.resetPassword.steps.email.label')}
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value.trim())}
                        placeholder={t('home.auth.resetPassword.steps.email.placeholder')}
                        sx={textFieldStyles}
                    />

                    {/* Send Recovery Code Button */}
                    <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                        size="large"
                        disabled={!resetEmail || loading}
                        sx={buttonStyles}
                    >
                        {loading ? t('home.auth.common.loading') : t('home.auth.resetPassword.steps.email.submit')}
                    </Button>
                </Box>
            );

        // Token step
        case 'token':
            return (
                <Box component="form" onSubmit={handleVerifyToken}>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            textAlign: 'center',
                            mb: 3,
                            fontSize: '1rem',
                            lineHeight: 1.6
                        }}
                    >
                        {t('home.auth.resetPassword.steps.token.description')}
                    </Typography>

                    {/* Recovery Code Input */}
                    <TextField
                        fullWidth
                        required
                        variant="outlined"
                        label={t('home.auth.resetPassword.steps.token.label')}
                        value={resetToken}
                        onChange={(e) => {
                            const value = e.target.value;
                            // Only allow digits and maximum 6 characters
                            if (/^\d*$/.test(value) && value.length <= 6) {
                                setResetToken(value);
                            }
                        }}
                        sx={{
                            ...textFieldStyles,
                            '& .MuiFormHelperText-root': {
                                color: '#fe6f14',
                                fontSize: '0.8rem'
                            }
                        }}
                        inputProps={{
                            maxLength: 6,
                            pattern: '[0-9]*',
                            inputMode: 'numeric'
                        }}
                        helperText={t('home.auth.resetPassword.steps.token.helper')}
                    />

                    {/* Verify Code Button */}
                    <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                        size="large"
                        disabled={!resetToken || loading || resetToken.length !== 6}
                        sx={buttonStyles}
                    >
                        {loading ? t('home.auth.common.loading') : t('home.auth.resetPassword.steps.token.submit')}
                    </Button>
                </Box>
            );

        // Password step
        case 'password':
            return (
                <Box component="form" onSubmit={handleResetPassword}>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            textAlign: 'center',
                            mb: 3,
                            fontSize: '1rem',
                            lineHeight: 1.6
                        }}
                    >
                        {t('home.auth.resetPassword.steps.password.description')}
                    </Typography>

                    {/* New Password Input */}
                    <TextField
                        fullWidth
                        required
                        variant="outlined"
                        type={showNewPassword ? 'text' : 'password'}
                        label={t('home.auth.resetPassword.steps.password.newPassword.label')}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        sx={{
                            ...textFieldStyles,
                            '& .MuiFormHelperText-root': {
                                color: '#fe6f14',
                                fontSize: '0.8rem'
                            }
                        }}
                        helperText={t('home.auth.resetPassword.steps.password.newPassword.helper')}
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            edge="end"
                                            sx={{
                                                color: '#fe6f14',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(254, 111, 20, 0.08)'
                                                }
                                            }}
                                        >
                                            {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
                        variant="outlined"
                        type={showConfirmPassword ? 'text' : 'password'}
                        label={t('home.auth.resetPassword.steps.password.confirmPassword.label')}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        sx={{
                            ...textFieldStyles,
                            '& .MuiFormHelperText-root': {
                                color: '#fe6f14',
                                fontSize: '0.8rem'
                            }
                        }}
                        helperText={t('home.auth.resetPassword.steps.password.confirmPassword.helper')}
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            edge="end"
                                            sx={{
                                                color: '#fe6f14',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(254, 111, 20, 0.08)'
                                                }
                                            }}
                                        >
                                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
                        size="large"
                        disabled={!newPassword || !confirmPassword || loading}
                        sx={buttonStyles}
                    >
                        {loading ? t('home.auth.common.loading') : t('home.auth.resetPassword.steps.password.submit')}
                    </Button>
                </Box>
            );

        default:
            return null;
    }
}
