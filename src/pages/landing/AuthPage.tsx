import { useState, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';

import type { LoginCredentials, RegisterCredentials, AuthApiErrorResponse } from '../../types/api/responses';
import { AuthErrorType } from '../../types/api/errors';
import { authService } from '../../services/auth.service';
import { useUser } from '../../contexts/UserContext';

import './AuthPage.scss';

const AuthPage = () => {
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

    const validatePassword = (password: string): boolean => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
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

                // Validar campos vacíos
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

    return (
        <div className="auth-container">

            <div className="auth-card">
                <div className="auth-header">
                    <img
                        onClick={() => navigate('/')}
                        src="https://res.cloudinary.com/dnhlagojg/image/upload/v1726670794/AppPhotos/Brand/logoPL3.svg"
                        alt="logo"
                        className="auth-logo no-select"
                    />
                    <h2>{isLogin ? 'Login' : 'Register'}</h2>
                    <p>
                        {isLogin
                            ? 'Welcome back!'
                            : 'Create an account to start'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {!isLogin ? (
                        <>
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
                                onChange={handleChange}
                                placeholder="username"
                                helperText="Between 3 and 20 characters, only letters, numbers and hyphens"
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
                        </>
                    ) : (
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
                    )}

                    <TextField
                        fullWidth
                        required
                        label="Password"
                        variant="outlined"
                        margin="normal"
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={isLogin ? loginData.password : registerData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        helperText={!isLogin ? "Minimum 8 characters, one uppercase letter, one lowercase letter, one number and one symbol" : ""}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                    >
                                        <span className="material-symbols-rounded">
                                            {showPassword ? 'visibility' : 'visibility_off'}
                                        </span>
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={loading || !isFormValid()}
                        sx={{
                            mt: 2,
                            backgroundColor: '#fe6f14',
                            '&:hover': {
                                backgroundColor: '#c84f03',
                            },
                        }}
                    >
                        {loading ? 'Loading...' : isLogin ? 'Login' : 'Register'}
                    </Button>

                    <div className="auth-divider">
                        <span>or</span>
                    </div>

                    <Button
                        variant="outlined"
                        className="google-button"
                        fullWidth
                        disabled
                        startIcon={<img src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA" alt="Google" />}
                    >
                        Continue with Google
                    </Button>
                </form>

                <div className="auth-footer">
                    <p>
                        {isLogin
                            ? 'Don\'t have an account? '
                            : 'Already have an account? '}
                        <Button
                            onClick={() => setIsLogin(prev => !prev)}
                            sx={{
                                color: '#fe6f14',
                                padding: '0',
                                minWidth: 'auto',
                                fontWeight: 600,
                                textTransform: 'none',
                                '&:hover': {
                                    backgroundColor: 'transparent',
                                    textDecoration: 'underline',
                                }
                            }}
                        >
                            {isLogin ? 'Register' : 'Login'}
                        </Button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
