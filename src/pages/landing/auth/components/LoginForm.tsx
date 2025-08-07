/**
 * Login Form Component
 * 
 * Provides the interface for user authentication with fields for:
 * - Email address
 * - Password (with visibility toggle)
 * 
 * Includes field validation, input formatting, and accessibility features.
 * 
 * @module LoginForm
 */
import { TextField, Button, InputAdornment, IconButton, Box, Divider, Typography, Link } from '@mui/material';
import { TokenResponse, useGoogleLogin } from '@react-oauth/google';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff } from 'react-feather';

// Types
import type { LoginCredentials } from '../../../../types/api/responses';

/**
 * Props interface for the LoginForm component
 * 
 * @interface LoginFormProps
 */
interface LoginFormProps {
    loginData: LoginCredentials; // User login data
    loading: boolean; // Loading state for the button
    showPassword: boolean; // State to show/hide password
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Function to handle input changes
    setShowPassword: (show: boolean) => void; // Function to toggle password visibility
    setShowResetPassword: (show: boolean) => void; // Function to show/hide reset password form
    isFormValid: () => boolean; // Function to validate the form
    handleSubmit: (e: React.FormEvent) => void; // Function to handle form submission
    handleGoogleSuccess: (tokenResponse: TokenResponse) => Promise<void>; // Function to handle Google login success
}

/**
 * Login form component
 * 
 * Renders a form with email/username and password inputs,
 * Google OAuth login option, and forgot password link.
 * Handles form validation and submission.
 * 
 * @param {LoginFormProps} props - Component properties
 * @returns {JSX.Element} The rendered login form
 */
export default function LoginForm({
    loginData,
    loading,
    showPassword,
    handleChange,
    setShowPassword,
    setShowResetPassword,
    isFormValid,
    handleSubmit,
    handleGoogleSuccess
}: LoginFormProps) {
    const { t } = useTranslation();

    /**
     * Initializes Google login functionality
     * Handles success and error cases for Google authentication
     */
    const loginWithGoogle = useGoogleLogin({
        onSuccess: handleGoogleSuccess,
        onError: () => { toast.error(t('home.auth.login.form.googleError')); }
    });

    return (
        <Box component="form" onSubmit={handleSubmit}>
            {/* Google Login button */}
            <Box sx={{ width: '100%', mb: 2 }}>
                <Button
                    fullWidth
                    variant="outlined"
                    sx={{
                        color: 'black',
                        borderColor: '#808080'
                    }}
                    onClick={() => loginWithGoogle()}
                    startIcon={
                        <img
                            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                            alt="Google"
                            width="20"
                            height="20"
                            style={{ marginRight: 8 }} // Spacing between icon and text
                        />
                    }
                >
                    {t('home.auth.login.form.googleButton')}
                </Button>
            </Box>

            {/* Divider for visual separation */}
            <Divider sx={{ my: 2 }}>
                <Typography sx={{ color: '#666', px: 2 }}>
                    {t('home.auth.common.or')}
                </Typography>
            </Divider>

            {/* Input for email or username */}
            <TextField
                fullWidth
                required
                label={t('home.auth.login.form.identifier.label')}
                variant="outlined"
                name="identifier"
                placeholder={t('home.auth.login.form.identifier.placeholder')}
                value={loginData.identifier}
                onChange={handleChange}
            />

            {/* Password Input */}
            <TextField
                fullWidth
                required
                type={showPassword ? 'text' : 'password'}
                label={t('home.auth.login.form.password.label')}
                variant="outlined"
                margin="normal"
                name="password"
                value={loginData.password}
                onChange={handleChange}
                slotProps={{
                    input: {
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => setShowPassword(!showPassword)}
                                    edge="end"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </IconButton>
                            </InputAdornment>
                        )
                    }
                }}
            />

            {/* Forgot Password Link */}
            <Box sx={{ mt: 2 }}>
                <Link
                    sx={{
                        color: '#666',
                        cursor: 'pointer',
                        textDecoration: 'none'
                    }}
                    onClick={() => setShowResetPassword(true)}
                >
                    {t('home.auth.login.form.password.forgot')}
                </Link>
            </Box>

            {/* Submit Button */}
            <Button
                fullWidth
                variant="contained"
                type="submit"
                disabled={!isFormValid() || loading}
                sx={{
                    mt: 3,
                    mb: 2,
                    bgcolor: '#fe6f14',
                    '&:hover': { bgcolor: '#c84f03' }
                }}
            >
                {loading ? t('home.auth.common.loading') : t('home.auth.login.form.submit')}
            </Button>
        </Box>
    );
}
