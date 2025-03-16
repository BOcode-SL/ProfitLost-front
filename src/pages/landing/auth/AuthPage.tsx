import { useState, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CredentialResponse } from '@react-oauth/google';
import { useTranslation } from 'react-i18next';

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
import AuthLayout from './components/AuthLayout';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ResetPasswordForm from './components/ResetPasswordForm';

// Declare dataLayer for GTM
declare global {
    interface Window {
        dataLayer: Array<{
            event?: string;
            login_method?: 'email' | 'google';
            [key: string]: string | undefined;
        }>;
    }
}

// AuthPage component
export default function AuthPage() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { loadUserData } = useUser();
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
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
    const [resetEmail, setResetEmail] = useState('');
    const [resetToken, setResetToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [resetStep, setResetStep] = useState<'email' | 'token' | 'password'>('email');
    const [showResetPassword, setShowResetPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Function to validate the password against defined criteria
    const validatePassword = (password: string): boolean => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
        return passwordRegex.test(password);
    };

    // Handle input changes for both login and registration forms
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

    // Function to push login_success event to dataLayer
    const pushLoginSuccessEvent = (method: 'email' | 'google') => {
        // Push to dataLayer for GTM
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: 'login_success',
            login_method: method
        });
    };

    // Handle form submission for login and registration processes
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isLogin) {
                const response = await authService.login(loginData);
                if (response.success) {
                    await loadUserData();
                    // Push login_success event to dataLayer
                    pushLoginSuccessEvent('email');
                    toast.success(t('home.auth.login.title'));
                    navigate('/dashboard', { replace: true });
                }
            } else {
                if (!validatePassword(registerData.password)) {
                    setLoading(false);
                    toast.error(t('home.auth.errors.passwordRequirements'));
                    return;
                }

                if (!registerData.username || !registerData.email || !registerData.password || !registerData.name || !registerData.surname) {
                    setLoading(false);
                    toast.error(t('home.auth.errors.missingFields'));
                    return;
                }

                const response = await authService.register(registerData);
                if (response.success) {
                    await loadUserData();
                    toast.success(t('home.auth.success.registration'));
                    navigate('/dashboard');
                }
            }
        } catch (err: unknown) {
            const error = err as AuthApiErrorResponse;

            // Handle various error types and display appropriate messages
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

    // Handle the functionality for forgotten passwords
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

    // Handle the verification of the token for password reset
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

    // Handle the functionality for resetting the password
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

    // Check if the form is valid for submission
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

    // Handle the successful login via Google
    const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
        setLoading(true);
        try {
            if (!credentialResponse.credential) {
                toast.error(t('home.auth.login.form.googleError'));
                return;
            }

            const response = await authService.googleLogin(credentialResponse.credential);

            if (response.success) {
                await loadUserData();
                // Push login_success event to dataLayer
                pushLoginSuccessEvent('google');
                toast.success(t('home.auth.success.welcome'));
                
                // On iOS PWA, add a slight delay to ensure the token is saved
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

    // Render the authentication layout with the appropriate title and subtitle based on the current state
    return (
        <>
            <AuthLayout
                title={showResetPassword ? t('home.auth.resetPassword.title') : (isLogin ? t('home.auth.login.title') : t('home.auth.register.title'))}
                subtitle={showResetPassword
                    ? t('home.auth.resetPassword.subtitle')
                    : (isLogin ? t('home.auth.login.subtitle') : t('home.auth.register.subtitle'))}
                showDivider={!showResetPassword}
                showAlternativeAction={!showResetPassword}
                alternativeActionText={isLogin ? t('home.auth.login.form.alternativeAction') : t('home.auth.register.form.alternativeAction')}
                onAlternativeActionClick={() => setIsLogin(!isLogin)}
            >
                {/* Conditional rendering for the form based on the reset password state */}
                {showResetPassword ? (
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
                ) : isLogin ? (
                    // Render the login form if in login mode
                    <LoginForm
                        loginData={loginData}
                        loading={loading}
                        showPassword={showPassword}
                        handleChange={handleChange}
                        setShowPassword={setShowPassword}
                        setShowResetPassword={setShowResetPassword}
                        isFormValid={isFormValid}
                        handleSubmit={handleSubmit}
                        handleGoogleSuccess={handleGoogleSuccess}
                    />
                ) : (
                    // Render the registration form if in registration mode
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
            </AuthLayout>
            {/* Render the footer component */}
            <Footer />
        </>
    );
};