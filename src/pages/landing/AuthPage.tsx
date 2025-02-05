import { useState, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Box, TextField, Button, InputAdornment, IconButton, Typography, Container, Divider, Link } from '@mui/material'
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useTranslation } from 'react-i18next';

import type { LoginCredentials, RegisterCredentials, AuthApiErrorResponse } from '../../types/api/responses';
import { AuthErrorType } from '../../types/api/errors';
import { authService } from '../../services/auth.service';
import { useUser } from '../../contexts/UserContext';
import Footer from './components/Footer';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
    showDivider?: boolean;
    showAlternativeAction?: boolean;
    alternativeActionText?: string;
    onAlternativeActionClick?: () => void;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
    children,
    title,
    subtitle,
    showDivider = true,
    showAlternativeAction = true,
    alternativeActionText,
    onAlternativeActionClick
}) => {
    const navigate = useNavigate();

    return (
        <>
            <Box sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: { xs: 2, sm: 4 },
                background: 'linear-gradient(135deg, rgba(255, 163, 106, 0.403) 0%, rgba(183, 79, 14, 0.501) 100%)'
            }}>
                <Container maxWidth="sm">
                    <Box sx={{
                        bgcolor: 'white',
                        borderRadius: 4,
                        p: { xs: 3, sm: 5 },
                        width: '100%',
                        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)'
                    }}>
                        <Box sx={{ textAlign: 'center', mb: 4 }}>
                            <Box
                                component="img"
                                src="https://res.cloudinary.com/dnhlagojg/image/upload/v1726670794/AppPhotos/Brand/logoPL3.svg"
                                alt="logo"
                                sx={{
                                    width: 200,
                                    cursor: 'pointer',
                                    mb: 2
                                }}
                                onClick={() => navigate('/')}
                            />
                            <Typography variant="h4" sx={{
                                fontSize: '2rem',
                                fontWeight: 700,
                                color: '#333',
                                mb: 0.5
                            }}>
                                {title}
                            </Typography>
                            <Typography sx={{
                                color: '#666',
                                fontSize: '1.1rem'
                            }}>
                                {subtitle}
                            </Typography>
                        </Box>

                        {children}

                        {showDivider && (
                            <>
                                <Box sx={{
                                    position: 'relative',
                                    textAlign: 'center',
                                    my: 3
                                }}>
                                    <Divider>
                                        <Typography sx={{ color: '#666', px: 2 }}>
                                            or
                                        </Typography>
                                    </Divider>
                                </Box>

                                {showAlternativeAction && (
                                    <Box sx={{ textAlign: 'center', mt: 3, color: '#666' }}>
                                        <Typography>
                                            {alternativeActionText?.split('? ')[0]}?{' '}
                                            <Box
                                                component="span"
                                                onClick={onAlternativeActionClick}
                                                sx={{
                                                    color: '#fe6f14',
                                                    cursor: 'pointer',
                                                    '&:hover': {
                                                        textDecoration: 'underline'
                                                    }
                                                }}
                                            >
                                                {alternativeActionText?.split('? ')[1]}
                                            </Box>
                                        </Typography>
                                    </Box>
                                )}
                            </>
                        )}
                    </Box>
                </Container>
            </Box>
            <Footer />
        </>
    );
};

interface LoginFormProps {
    loginData: LoginCredentials;
    loading: boolean;
    showPassword: boolean;
    handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
    setShowPassword: (show: boolean) => void;
    setShowResetPassword: (show: boolean) => void;
    isFormValid: () => boolean;
    handleSubmit: (e: FormEvent) => void;
    handleGoogleSuccess: (credentialResponse: CredentialResponse) => Promise<void>;
}

const LoginForm: React.FC<LoginFormProps> = ({
    loginData,
    loading,
    showPassword,
    handleChange,
    setShowPassword,
    setShowResetPassword,
    isFormValid,
    handleSubmit,
    handleGoogleSuccess
}) => {
    const { t } = useTranslation();
    
    return (
        <Box component="form" onSubmit={handleSubmit}>
            <Box sx={{ width: '100%', mb: 2 }}>
                <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => {
                        toast.error(t('dashboard.common.error.GOOGLE_AUTH_ERROR'));
                    }}
                    useOneTap
                    width="100%"
                    text="continue_with"
                    shape="rectangular"
                />
            </Box>

            <Divider sx={{ my: 2 }}>
                <Typography sx={{ color: '#666', px: 2 }}>
                    or
                </Typography>
            </Divider>

            <TextField
                fullWidth
                required
                label="Email o username"
                variant="outlined"
                margin="normal"
                name="identifier"
                value={loginData.identifier}
                onChange={handleChange}
                placeholder="email@example.com o username"
            />
            <TextField
                fullWidth
                required
                type={showPassword ? 'text' : 'password'}
                label="Password"
                variant="outlined"
                margin="normal"
                name="password"
                value={loginData.password}
                onChange={handleChange}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                <span className="material-symbols-rounded">
                                    {showPassword ? 'visibility' : 'visibility_off'}
                                </span>
                            </IconButton>
                        </InputAdornment>
                    )
                }}
            />

            <Box sx={{ mt: 2 }}>
                <Link
                    sx={{
                        color: '#666',
                        cursor: 'pointer',
                        textDecoration: 'none'
                    }}
                    onClick={() => setShowResetPassword(true)}
                >
                    Forgot password?
                </Link>
            </Box>

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
                Login
            </Button>
        </Box>
    );
};

const RegisterForm: React.FC<{
    registerData: RegisterCredentials;
    loading: boolean;
    showPassword: boolean;
    handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
    setShowPassword: (show: boolean) => void;
    isFormValid: () => boolean;
    handleSubmit: (e: FormEvent) => void;
}> = ({ registerData, loading, showPassword, handleChange, setShowPassword, isFormValid, handleSubmit }) => (
    <Box component="form" onSubmit={handleSubmit}>
        <TextField
            fullWidth
            required
            label="Name"
            variant="outlined"
            margin="normal"
            name="name"
            value={registerData.name}
            onChange={handleChange}
            placeholder="Your name"
        />
        <TextField
            fullWidth
            required
            label="Surname"
            variant="outlined"
            margin="normal"
            name="surname"
            value={registerData.surname}
            onChange={handleChange}
            placeholder="Your surname"
        />
        <TextField
            fullWidth
            required
            label="Username"
            variant="outlined"
            margin="normal"
            name="username"
            value={registerData.username}
            onChange={(e) => {
                const value = e.target.value.toLowerCase();
                if (/^[a-z0-9]*$/.test(value)) {
                    handleChange({
                        target: {
                            name: 'username',
                            value: value
                        }
                    } as ChangeEvent<HTMLInputElement>);
                }
            }}
            helperText="Only lowercase letters and numbers allowed"
            placeholder="username"
        />
        <TextField
            fullWidth
            required
            label="Email"
            type="email"
            variant="outlined"
            margin="normal"
            name="email"
            value={registerData.email}
            onChange={handleChange}
            placeholder="tu@email.com"
        />
        <TextField
            fullWidth
            required
            type={showPassword ? 'text' : 'password'}
            label="Password"
            variant="outlined"
            margin="normal"
            name="password"
            value={registerData.password}
            onChange={handleChange}
            helperText="Minimum 8 characters, one uppercase letter, one lowercase letter, one number and one symbol"
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                            <span className="material-symbols-rounded">
                                {showPassword ? 'visibility' : 'visibility_off'}
                            </span>
                        </IconButton>
                    </InputAdornment>
                )
            }}
        />
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
            Register
        </Button>
    </Box>
);

const ResetPasswordForm: React.FC<{
    resetStep: 'email' | 'token' | 'password';
    resetEmail: string;
    resetToken: string;
    newPassword: string;
    confirmPassword: string;
    loading: boolean;
    showNewPassword: boolean;
    showConfirmPassword: boolean;
    setResetEmail: (email: string) => void;
    setResetToken: (token: string) => void;
    setNewPassword: (password: string) => void;
    setConfirmPassword: (password: string) => void;
    setShowNewPassword: (show: boolean) => void;
    setShowConfirmPassword: (show: boolean) => void;
    handleForgotPassword: (e: FormEvent) => void;
    handleVerifyToken: (e: FormEvent) => void;
    handleResetPassword: (e: FormEvent) => void;
    setShowResetPassword: (show: boolean) => void;
}> = ({
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
    handleResetPassword
}) => {
        switch (resetStep) {
            case 'email':
                return (
                    <Box component="form" onSubmit={handleForgotPassword}>
                        <TextField
                            fullWidth
                            required
                            label="Email"
                            type="email"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value.trim())}
                            sx={{ mb: 2 }}
                        />
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
                            Send Recovery Code
                        </Button>
                    </Box>
                );
            case 'token':
                return (
                    <Box component="form" onSubmit={handleVerifyToken}>
                        <TextField
                            fullWidth
                            required
                            label="Recovery Code"
                            value={resetToken}
                            onChange={(e) => setResetToken(e.target.value.trim())}
                            sx={{ mb: 2 }}
                            type="number"
                        />
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
                            Verify Code
                        </Button>
                    </Box>
                );
            case 'password':
                return (
                    <Box component="form" onSubmit={handleResetPassword}>
                        <TextField
                            fullWidth
                            required
                            type={showNewPassword ? 'text' : 'password'}
                            label="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            sx={{ mb: 2 }}
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
                        <TextField
                            fullWidth
                            required
                            type={showConfirmPassword ? 'text' : 'password'}
                            label="Confirm New Password"
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
                            Reset Password
                        </Button>
                    </Box>
                );
        }
    };

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

    const validatePassword = (password: string): boolean => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
        return passwordRegex.test(password);
    };

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

    return (
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
                    setShowResetPassword={setShowResetPassword}
                />
            ) : isLogin ? (
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
    );
};