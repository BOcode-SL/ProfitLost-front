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
            <Button
                fullWidth
                variant="outlined"
                size="large"
                sx={{
                    mb: 3,
                    py: 1.5,
                    borderColor: '#e0e0e0',
                    color: '#333',
                    backgroundColor: 'white',
                    fontSize: '1rem',
                    fontWeight: 500,
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    '&:hover': {
                        borderColor: '#d0d0d0',
                        backgroundColor: '#f8f9fa',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    },
                    transition: 'all 0.2s ease'
                }}
                onClick={() => loginWithGoogle()}
                startIcon={
                    <img
                        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                        alt="Google"
                        width="20"
                        height="20"
                        style={{ marginRight: 8 }}
                    />
                }
            >
                {t('home.auth.login.form.googleButton')}
            </Button>

            {/* Divider */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Divider sx={{ flex: 1 }} />
                <Typography
                    variant="body2"
                    sx={{
                        px: 2,
                        color: 'text.secondary',
                        fontWeight: 500
                    }}
                >
                    {t('home.auth.common.or')}
                </Typography>
                <Divider sx={{ flex: 1 }} />
            </Box>

            {/* Email/Username Input */}
            <TextField
                fullWidth
                required
                label={t('home.auth.login.form.identifier.label')}
                variant="outlined"
                name="identifier"
                placeholder={t('home.auth.login.form.identifier.placeholder')}
                value={loginData.identifier}
                onChange={handleChange}
                sx={{
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
                }}
            />

            {/* Password Input */}
            <TextField
                fullWidth
                required
                type={showPassword ? 'text' : 'password'}
                label={t('home.auth.login.form.password.label')}
                variant="outlined"
                name="password"
                value={loginData.password}
                onChange={handleChange}
                sx={{
                    mb: 2,
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
                }}
                slotProps={{
                    input: {
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => setShowPassword(!showPassword)}
                                    edge="end"
                                    sx={{
                                        color: '#fe6f14',
                                        '&:hover': {
                                            backgroundColor: 'rgba(254, 111, 20, 0.08)'
                                        }
                                    }}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </IconButton>
                            </InputAdornment>
                        )
                    }
                }}
            />

            {/* Forgot Password Link */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                <Link
                    sx={{
                        color: '#fe6f14',
                        cursor: 'pointer',
                        textDecoration: 'none',
                        fontWeight: 500,
                        fontSize: '0.9rem',
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
                size="large"
                disabled={!isFormValid() || loading}
                sx={{
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
                }}
            >
                {loading ? t('home.auth.common.loading') : t('home.auth.login.form.submit')}
            </Button>
        </Box>
    );
}
