import { useState, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CredentialResponse } from '@react-oauth/google';

// Types
import type { LoginCredentials, RegisterCredentials, AuthApiErrorResponse } from '../../../types/api/responses';
import { AuthErrorType } from '../../../types/api/errors';

// Services
import { authService } from '../../../services/auth.service';

// Contexts
import { useUser } from '../../../contexts/UserContext';

// Components
import Footer from '../components/Footer';
import AuthLayout from './components/AuthLayout';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ResetPasswordForm from './components/ResetPasswordForm';

// AuthPage component
export default function AuthPage() {
    const navigate = useNavigate();
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

    // Function to validate password strength
    const validatePassword = (password: string): boolean => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
        return passwordRegex.test(password);
    };

    // Handle input changes for login and registration forms
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

    // Handle form submission for login and registration
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isLogin) {
                const response = await authService.login(loginData);
                if (response.success) {
                    await loadUserData();
                    toast.success('Welcome back!');
                    navigate('/dashboard', { replace: true });
                }
            } else {
                if (!validatePassword(registerData.password)) {
                    setLoading(false);
                    toast.error('The password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter and one number');
                    return;
                }

                if (!registerData.username || !registerData.email || !registerData.password || !registerData.name || !registerData.surname) {
                    setLoading(false);
                    toast.error('All fields are required');
                    return;
                }

                const response = await authService.register(registerData);
                if (response.success) {
                    await loadUserData();
                    toast.success('Registration successful!');
                    navigate('/dashboard');
                }
            }
        } catch (err: unknown) {
            const error = err as AuthApiErrorResponse;

            // Handle different error types
            switch (error.error as AuthErrorType) {
                case 'MISSING_FIELDS':
                    toast.error('All fields are required');
                    break;
                case 'INVALID_FORMAT':
                    toast.error('Formato inválido. Verifica los campos');
                    break;
                case 'EMAIL_EXISTS':
                    toast.error('Email already registered');
                    break;
                case 'USERNAME_EXISTS':
                    toast.error('Username already in use');
                    break;
                case 'PASSWORD_TOO_WEAK':
                    toast.error('The password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter and one number');
                    break;
                case 'INVALID_CREDENTIALS':
                    toast.error('Invalid credentials');
                    break;
                case 'ACCOUNT_INACTIVE':
                    toast.error('Account inactive. Contact support');
                    break;
                case 'ACCOUNT_LOCKED':
                    {
                        const minutes = Math.ceil((error.remainingTime || 0) / (60 * 1000));
                        toast.error(`Account locked temporarily. Try again in ${minutes} minutes`);
                        break;
                    }
                case 'SERVER_ERROR':
                    toast.error('Server error. Please try again later');
                    break;
                case 'CONNECTION_ERROR':
                    toast.error('Connection error.');
                    break;
                default:
                    toast.error(error.message || 'Unknown error');
            }
        } finally {
            setLoading(false);
        }
    };

    // Handle forgot password functionality
    const handleForgotPassword = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await authService.forgotPassword(resetEmail);
            toast.success('Recovery code sent to your email');
            setResetStep('token');
        } catch (err: unknown) {
            const error = err as AuthApiErrorResponse;
            switch (error.error as AuthErrorType) {
                case 'EMAIL_NOT_FOUND':
                    toast.error('Email not found');
                    break;
                default:
                    toast.error('Error sending recovery code');
            }
        } finally {
            setLoading(false);
        }
    };

    // Handle token verification for password reset
    const handleVerifyToken = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await authService.verifyResetToken(resetToken);
            setResetStep('password');
        } catch {
            toast.error('Invalid or expired token');
        } finally {
            setLoading(false);
        }
    };

    // Handle password reset functionality
    const handleResetPassword = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (newPassword !== confirmPassword) {
                toast.error('Passwords do not match');
                setLoading(false);
                return;
            }

            await authService.resetPassword(resetToken, newPassword);
            toast.success('Password reset successfully');
            setShowResetPassword(false);
            setIsLogin(true);
        } catch (err: unknown) {
            const error = err as AuthApiErrorResponse;
            switch (error.error as AuthErrorType) {
                case 'PASSWORD_TOO_WEAK':
                    toast.error('Password must be at least 8 characters long and contain uppercase, lowercase, numbers and special characters');
                    break;
                case 'INVALID_RESET_TOKEN':
                    toast.error('Invalid or expired token');
                    break;
                default:
                    toast.error('Error resetting password');
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

    // Handle successful Google login
    const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
        setLoading(true);
        try {
            if (!credentialResponse.credential) {
                toast.error('Invalid Google token');
                return;
            }

            const response = await authService.googleLogin(credentialResponse.credential);

            if (response.success) {
                await loadUserData();
                toast.success('Welcome!');
                navigate('/dashboard', { replace: true });
            }
        } catch (error) {
            const authError = error as AuthApiErrorResponse;
            if (authError.error === 'GOOGLE_AUTH_ERROR') {
                toast.error('Error authenticating with Google');
            } else {
                toast.error('An error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    // Render the authentication layout with appropriate title and subtitle based on the state
    return (
        <>
            <AuthLayout
                title={showResetPassword ? 'Reset Password' : (isLogin ? 'Login' : 'Register')}
                subtitle={showResetPassword
                    ? 'Enter your email to receive a recovery code'
                    : (isLogin ? 'Welcome back!' : 'Create an account to start')}
                showDivider={!showResetPassword}
                showAlternativeAction={!showResetPassword}
                alternativeActionText={isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
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