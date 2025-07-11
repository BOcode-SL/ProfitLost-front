/**
 * Authentication Page Component
 * 
 * Handles user authentication with three modes:
 * 1. Login - For existing users via email or Google OAuth
 * 2. Registration - For new users with form validation
 * 3. Password Reset - Multi-step flow for password recovery
 * 
 * Includes form validation, error handling, and analytics tracking.
 * 
 * @module AuthPage
 */
import { useState, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
// import { TokenResponse } from '@react-oauth/google';
import { useTranslation } from 'react-i18next';
import { Box, Typography, Button, Paper } from '@mui/material';

// Types
import type { LoginCredentials, RegisterCredentials, AuthApiErrorResponse } from '../../../types/api/responses';
import { AuthErrorType } from '../../../types/api/errors';

// Services
import { authService } from '../../../services/auth.service';

// Contexts
import { useUser } from '../../../contexts/UserContext';

// Utils
import { isIOS } from '../../../utils/deviceDetection';

// Components
import Footer from '../components/Footer';
import LanguageSelector from '../components/LanguageSelector';
// Import only the AUTH_HEADER_HEIGHT and LOGO_HEIGHT constants
import { AUTH_HEADER_HEIGHT, LOGO_HEIGHT } from './components/AuthLayout';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ResetPasswordForm, { getResetPasswordStepTitle } from './components/ResetPasswordForm';

// Google Tag Manager type definition
declare global {
    interface Window {
        dataLayer: Array<{
            event?: string;
            login_method?: 'email' | 'google';
            register_method?: 'email' | 'google';
            [key: string]: string | undefined;
        }>;
    }
}

/**
 * Authentication page component
 * 
 * Main container for user authentication flows including login,
 * registration, and password reset functionality.
 * Manages form state, validation, API interactions, and error handling.
 * 
 * @returns {JSX.Element} The rendered authentication page
 */
export default function AuthPage() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { loadUserData } = useUser();

    // UI state management
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // Form data state
    const [loginData, setLoginData] = useState<LoginCredentials>({
        identifier: '',
        password: ''
    });
    const [registerData, setRegisterData] = useState<RegisterCredentials>({
        username: '',
        email: '',
        password: '',
        name: '',
        surname: ''
    });

    // Password reset flow state
    const [resetEmail, setResetEmail] = useState('');
    const [resetToken, setResetToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [resetStep, setResetStep] = useState<'email' | 'token' | 'password'>('email');
    const [showResetPassword, setShowResetPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    /**
     * Validates password strength using regex pattern
     * Requires at least one lowercase, uppercase, digit, and special character
     * 
     * @param {string} password - Password string to validate
     * @returns {boolean} True if password meets requirements
     */
    const validatePassword = (password: string): boolean => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
        return passwordRegex.test(password);
    };

    /**
     * Handles form input changes for login and registration
     * Updates the appropriate state based on current mode
     * 
     * @param {ChangeEvent<HTMLInputElement>} e - Input change event
     */
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (isLogin) {
            setLoginData(prev => ({
                ...prev,
                [name]: value.trim()
            }));
        } else {
            setRegisterData(prev => ({
                ...prev,
                [name]: value.trim()
            }));
        }
    };

    /**
     * Tracks successful login events in Google Tag Manager
     * Adds the login method used for analytics tracking
     * 
     * @param {'email' | 'google'} method - Authentication method used
     */
    const pushLoginSuccessEvent = (method: 'email' | 'google') => {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: 'login_success',
            login_method: method
        });
    };

    /**
     * Tracks successful registration events in Google Tag Manager
     * Adds the registration method used for analytics tracking
     * 
     * @param {'email' | 'google'} method - Registration method used
     */
    const pushRegisterSuccessEvent = (method: 'email' | 'google') => {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: 'register_success',
            register_method: method
        });
    };

    /**
     * Handles form submission for login and registration
     * Performs validation, API calls, and error handling
     * 
     * @param {FormEvent} e - Form submission event
     * @returns {Promise<void>}
     */
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isLogin) {
                // Process login
                const response = await authService.login(loginData);
                if (response.success) {
                    await loadUserData();
                    pushLoginSuccessEvent('email');
                    toast.success(t('home.auth.login.title'));

                    // iOS PWA workaround for token persistence
                    if (isIOS() && window.matchMedia('(display-mode: standalone)').matches) {
                        setTimeout(() => {
                            navigate('/dashboard', { replace: true });
                        }, 500);
                    } else {
                        navigate('/dashboard', { replace: true });
                    }
                }
            } else {
                // Process registration with validation
                if (!validatePassword(registerData.password)) {
                    setLoading(false);
                    toast.error(t('home.auth.errors.passwordRequirements'));
                    return;
                }

                if (!registerData.username || !registerData.email || !registerData.password ||
                    !registerData.name || !registerData.surname) {
                    setLoading(false);
                    toast.error(t('home.auth.errors.missingFields'));
                    return;
                }

                const response = await authService.register(registerData);
                if (response.success) {
                    await loadUserData();
                    pushRegisterSuccessEvent('email');
                    toast.success(t('home.auth.success.registration'));
                    navigate('/dashboard');
                }
            }
        } catch (err: unknown) {
            const error = err as AuthApiErrorResponse;

            // Handle various authentication error types
            switch (error.error as AuthErrorType) {
                case 'MISSING_FIELDS':
                    toast.error(t('home.auth.errors.missingFields'));
                    break;
                case 'INVALID_FORMAT':
                    toast.error(t('home.auth.errors.invalidFormat'));
                    break;
                case 'EMAIL_EXISTS':
                    toast.error(t('home.auth.errors.emailExists'));
                    break;
                case 'USERNAME_EXISTS':
                    toast.error(t('home.auth.errors.usernameExists'));
                    break;
                case 'PASSWORD_TOO_WEAK':
                    toast.error(t('home.auth.errors.passwordRequirements'));
                    break;
                case 'INVALID_CREDENTIALS':
                    toast.error(t('home.auth.errors.invalidCredentials'));
                    break;
                case 'ACCOUNT_INACTIVE':
                    toast.error(t('home.auth.errors.accountInactive'));
                    break;
                case 'ACCOUNT_LOCKED':
                    {
                        const minutes = Math.ceil((error.remainingTime || 0) / (60 * 1000));
                        toast.error(t('home.auth.errors.accountLocked', {
                            minutes: minutes
                        }));
                        break;
                    }
                case 'SERVER_ERROR':
                    toast.error(t('home.auth.errors.serverError'));
                    break;
                case 'CONNECTION_ERROR':
                    toast.error(t('home.auth.errors.connectionError'));
                    break;
                default:
                    toast.error(error.message || t('home.auth.errors.serverError'));
            }
        } finally {
            setLoading(false);
        }
    };

    /**
     * Initiates password reset process by sending recovery email
     * Advances to token verification step on success
     * 
     * @param {FormEvent} e - Form submission event
     * @returns {Promise<void>}
     */
    const handleForgotPassword = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await authService.forgotPassword(resetEmail);
            toast.success(t('home.auth.success.recoveryCodeSent'));
            setResetStep('token');
        } catch (err: unknown) {
            const error = err as AuthApiErrorResponse;
            switch (error.error as AuthErrorType) {
                case 'EMAIL_NOT_FOUND':
                    toast.error(t('home.auth.errors.emailNotFound'));
                    break;
                default:
                    toast.error(t('home.auth.errors.serverError'));
            }
        } finally {
            setLoading(false);
        }
    };

    /**
     * Verifies the reset token provided by the user
     * Advances to new password step on successful verification
     * 
     * @param {FormEvent} e - Form submission event
     * @returns {Promise<void>}
     */
    const handleVerifyToken = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await authService.verifyResetToken(resetToken);
            setResetStep('password');
        } catch {
            toast.error(t('home.auth.errors.invalidToken'));
        } finally {
            setLoading(false);
        }
    };

    /**
     * Completes the password reset process with new password
     * Validates password match and strength before submission
     * 
     * @param {FormEvent} e - Form submission event
     * @returns {Promise<void>}
     */
    const handleResetPassword = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (newPassword !== confirmPassword) {
                toast.error(t('home.auth.errors.passwordsDoNotMatch'));
                setLoading(false);
                return;
            }

            await authService.resetPassword(resetToken, newPassword);
            toast.success(t('home.auth.success.passwordReset'));
            setShowResetPassword(false);
            setIsLogin(true);
        } catch (err: unknown) {
            const error = err as AuthApiErrorResponse;
            switch (error.error as AuthErrorType) {
                case 'PASSWORD_TOO_WEAK':
                    toast.error(t('home.auth.errors.passwordRequirements'));
                    break;
                case 'INVALID_RESET_TOKEN':
                    toast.error(t('home.auth.errors.invalidToken'));
                    break;
                default:
                    toast.error(t('home.auth.errors.serverError'));
            }
        } finally {
            setLoading(false);
        }
    };

    /**
     * Validates if the current form has all required fields completed
     * Different validation based on login or registration mode
     * 
     * @returns {boolean} True if form is valid and complete
     */
    const isFormValid = () => {
        if (isLogin) {
            return loginData.identifier.trim() !== '' && loginData.password.trim() !== '';
        } else {
            return (
                registerData.username.trim() !== '' &&
                registerData.email.trim() !== '' &&
                registerData.password.trim() !== '' &&
                registerData.name.trim() !== '' &&
                registerData.surname.trim() !== ''
            );
        }
    };

    /**
     * Handles successful Google OAuth login
     * Processes the token and navigates to dashboard on success
     * 
     * @param {TokenResponse} tokenResponse - OAuth token response from Google
     * @returns {Promise<void>}
     */
    /*
    const handleGoogleSuccess = async (tokenResponse: TokenResponse) => {
        setLoading(true);
        try {
            if (!tokenResponse.access_token) {
                toast.error(t('home.auth.login.form.googleError'));
                return;
            }

            const response = await authService.googleLogin(tokenResponse.access_token);
            if (response.success) {
                await loadUserData();

                // Track appropriate analytics event
                if (response.isNewUser) {
                    pushRegisterSuccessEvent('google');
                } else {
                    pushLoginSuccessEvent('google');
                }
                toast.success(t('home.auth.success.welcome'));

                // iOS PWA workaround for token persistence
                if (isIOS() && window.matchMedia('(display-mode: standalone)').matches) {
                    setTimeout(() => {
                        navigate('/dashboard', { replace: true });
                    }, 500);
                } else {
                    navigate('/dashboard', { replace: true });
                }
                return;
            }
        } catch (error) {
            const authError = error as AuthApiErrorResponse;
            if (authError.error === 'GOOGLE_AUTH_ERROR') {
                toast.error(t('home.auth.login.form.googleError'));
            } else {
                toast.error(t('home.auth.errors.serverError'));
            }
        } finally {
            setLoading(false);
        }
    };
    */

    return (
        <>
            <LanguageSelector />
            {showResetPassword ? (
                <>
                    {/* Desktop Header - only visible on desktop */}
                    <Box sx={{
                        display: { xs: 'none', md: 'flex' },
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: `${AUTH_HEADER_HEIGHT}px`,
                        width: '100%',
                        backgroundColor: 'white',
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        zIndex: 100,
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                    }}>
                        <img
                            src="/logo/logoPL3.svg"
                            alt="Profit & Lost Logo"
                            style={{ height: `${LOGO_HEIGHT}px`, cursor: 'pointer' }}
                            onClick={() => navigate('/')}
                        />
                    </Box>
                    
                    <Box sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        minHeight: { xs: '100vh', md: `calc(100vh - ${AUTH_HEADER_HEIGHT}px)` },
                        marginTop: { xs: 0, md: `${AUTH_HEADER_HEIGHT}px` },
                        overflow: 'hidden',
                        justifyContent: 'center',
                        backgroundColor: '#ffffff'
                    }}>
                        <Box sx={{
                            flex: { xs: '1', md: '1' },
                            p: { xs: 3, sm: 5, md: 8 },
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            maxWidth: '600px',
                            width: '100%'
                        }}>
                            {/* Mobile logo - only visible on mobile */}
                            <Box
                                sx={{
                                    display: { xs: 'flex', md: 'none' },
                                    justifyContent: 'center',
                                    mb: 4
                                }}
                            >
                                <img src="/logo/logoPL3.svg" alt="Profit & Lost Logo" style={{ width: '180px', height: 'auto', cursor: 'pointer' }} onClick={() => navigate('/')}/>
                            </Box>

                            <Paper elevation={0} sx={{
                                p: { xs: 3, sm: 5 },
                                maxWidth: '500px',
                                width: '100%',
                                mx: 'auto',
                                backgroundColor: 'transparent'
                            }}>
                                <Typography variant="h4" component="h1" align="center" gutterBottom>
                                    {getResetPasswordStepTitle(resetStep, t)}
                                </Typography>
                                
                                <Box sx={{ mb: 4 }} />

                                <ResetPasswordForm
                                    resetStep={resetStep}
                                    resetEmail={resetEmail}
                                    resetToken={resetToken}
                                    newPassword={newPassword}
                                    confirmPassword={confirmPassword}
                                    loading={loading}
                                    showNewPassword={showNewPassword}
                                    showConfirmPassword={showConfirmPassword}
                                    setResetEmail={setResetEmail}
                                    setResetToken={setResetToken}
                                    setNewPassword={setNewPassword}
                                    setConfirmPassword={setConfirmPassword}
                                    setShowNewPassword={setShowNewPassword}
                                    setShowConfirmPassword={setShowConfirmPassword}
                                    handleForgotPassword={handleForgotPassword}
                                    handleVerifyToken={handleVerifyToken}
                                    handleResetPassword={handleResetPassword}
                                />
                                
                                <Box sx={{ textAlign: 'center', mt: 3 }}>
                                    <Typography variant="body2">
                                        <Box
                                            component="span"
                                            onClick={() => setShowResetPassword(false)}
                                            sx={{
                                                color: '#fe6f14',
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    textDecoration: 'underline'
                                                }
                                            }}
                                        >
                                            {t('home.auth.resetPassword.backToLogin')}
                                        </Box>
                                    </Typography>
                                </Box>
                            </Paper>
                        </Box>
                    </Box>
                </>
            ) : (
                <>
                    {/* Desktop Header - only visible on desktop */}
                    <Box sx={{
                        display: { xs: 'none', md: 'flex' },
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: `${AUTH_HEADER_HEIGHT}px`,
                        width: '100%',
                        backgroundColor: 'white',
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        zIndex: 100,
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                    }}>
                        <img
                            src="/logo/logoPL3.svg"
                            alt="Profit & Lost Logo"
                            style={{ height: `${LOGO_HEIGHT}px`, cursor: 'pointer' }}
                            onClick={() => navigate('/')}
                        />
                    </Box>
                    
                    <Box sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        minHeight: { xs: '100vh', md: `calc(100vh - ${AUTH_HEADER_HEIGHT}px)` },
                        marginTop: { xs: 0, md: `${AUTH_HEADER_HEIGHT}px` },
                        overflow: 'hidden'
                    }}>
                        {/* Left column - Login Form */}
                        <Box sx={{
                            flex: { xs: '1', md: '1' },
                            p: { xs: 3, sm: 5, md: 8 },
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            backgroundColor: '#ffffff'
                        }}>
                            {/* Mobile logo - only visible on mobile */}
                            <Box
                                sx={{
                                    display: { xs: 'flex', md: 'none' },
                                    justifyContent: 'center',
                                    mb: 4
                                }}
                            >
                                <img src="/logo/logoPL3.svg" alt="Profit & Lost Logo" style={{ width: '180px', height: 'auto', cursor: 'pointer' }} onClick={() => navigate('/')}/>
                            </Box>

                            <Paper elevation={0} sx={{
                                p: { xs: 3, sm: 5 },
                                maxWidth: '500px',
                                width: '100%',
                                mx: 'auto',
                                backgroundColor: 'transparent'
                            }}>
                                <Typography variant="h4" component="h1" align="center" gutterBottom>
                                    {isLogin ? t('home.auth.login.title') : t('home.auth.register.title')}
                                </Typography>
                                <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 4 }}>
                                    {isLogin ? t('home.auth.login.subtitle') : t('home.auth.register.subtitle')}
                                </Typography>

                                {isLogin ? (
                                    <LoginForm
                                        loginData={loginData}
                                        loading={loading}
                                        showPassword={showPassword}
                                        handleChange={handleChange}
                                        setShowPassword={setShowPassword}
                                        setShowResetPassword={setShowResetPassword}
                                        isFormValid={isFormValid}
                                        handleSubmit={handleSubmit}
                                        // handleGoogleSuccess={handleGoogleSuccess}
                                    />
                                ) : (
                                    <RegisterForm
                                        registerData={registerData}
                                        loading={loading}
                                        showPassword={showPassword}
                                        handleChange={handleChange}
                                        setShowPassword={setShowPassword}
                                        isFormValid={isFormValid}
                                        handleSubmit={handleSubmit}
                                    />
                                )}

                                {/* Mobile-only toggle between login/register */}
                                <Box sx={{ display: { xs: 'block', md: 'none' }, textAlign: 'center', mt: 3 }}>
                                    <Typography variant="body2" sx={{ mb: 2 }}>
                                        {isLogin
                                            ? t('home.auth.register.cta.title')
                                            : t('home.auth.login.cta.title')}
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        onClick={() => setIsLogin(!isLogin)}
                                        sx={{
                                            color: '#fe6f14',
                                            borderColor: '#fe6f14',
                                            '&:hover': { borderColor: '#c84f03', color: '#c84f03' }
                                        }}
                                    >
                                        {isLogin
                                            ? t('home.auth.register.cta.button')
                                            : t('home.auth.login.cta.button')}
                                    </Button>
                                </Box>
                            </Paper>
                        </Box>

                        {/* Right column - CTA for Register */}
                        <Box sx={{
                            flex: { xs: '1', md: '1' },
                            display: { xs: 'none', md: 'flex' },
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            p: { xs: 3, sm: 5, md: 8 },
                            backgroundColor: '#fe6f14',
                            color: 'white',
                            textAlign: 'center',
                            position: 'relative'
                        }}>
                            <Box sx={{ maxWidth: '500px' }}>
                                {isLogin ? (
                                    <>
                                        <Typography
                                            variant="h2"
                                            sx={{
                                                fontSize: 'clamp(2rem, 4vw, 3rem)',
                                                fontWeight: 800,
                                                mb: 'clamp(1rem, 2vw, 1.5rem)',
                                                color: '#ffffff',
                                                lineHeight: 1.2
                                            }}
                                        >
                                            {t('home.auth.register.cta.title')}
                                        </Typography>
                                        <Typography variant="body1" sx={{ mb: 4 }}>
                                            {t('home.auth.register.cta.description')}
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            size="large"
                                            onClick={() => setIsLogin(false)}
                                            sx={{
                                                backgroundColor: 'white',
                                                color: '#fe6f14',
                                                '&:hover': {
                                                    backgroundColor: '#f5f5f5',
                                                }
                                            }}
                                        >
                                            {t('home.auth.register.cta.button')}
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Typography
                                            variant="h2"
                                            sx={{
                                                fontSize: 'clamp(2rem, 4vw, 3rem)',
                                                fontWeight: 800,
                                                mb: 'clamp(1rem, 2vw, 1.5rem)',
                                                color: '#ffffff',
                                                lineHeight: 1.2
                                            }}
                                        >
                                            {t('home.auth.login.cta.title')}
                                        </Typography>
                                        <Typography variant="body1" sx={{ mb: 4 }}>
                                            {t('home.auth.login.cta.description')}
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            size="large"
                                            onClick={() => setIsLogin(true)}
                                            sx={{
                                                backgroundColor: 'white',
                                                color: '#fe6f14',
                                                '&:hover': {
                                                    backgroundColor: '#f5f5f5',
                                                }
                                            }}
                                        >
                                            {t('home.auth.login.cta.button')}
                                        </Button>
                                    </>
                                )}
                            </Box>
                        </Box>
                    </Box>
                </>
            )}
            <Footer />
        </>
    );
};