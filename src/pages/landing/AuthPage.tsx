import { useState } from 'react';
import {
    TextField,
    Button,
    InputAdornment,
    IconButton
} from '@mui/material';

import './AuthPage.scss';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    return (
        <div className="auth-container">
            <img
                onClick={() => window.location.href = '/'}
                src="https://res.cloudinary.com/dnhlagojg/image/upload/v1726670794/AppPhotos/Brand/logoPL3.svg" alt="logo" />

            <div className="auth-card">
                <div className="auth-header">
                    <h2>{isLogin ? 'Iniciar Sesión' : 'Registrarse'}</h2>
                    <p>
                        {isLogin
                            ? '¡Bienvenido de nuevo!'
                            : 'Crea una cuenta para comenzar'}
                    </p>
                </div>

                <div className="auth-form">
                    {!isLogin && (
                        <TextField
                            fullWidth
                            label="Nombre completo"
                            variant="outlined"
                            margin="normal"
                            placeholder="Ingresa tu nombre"
                        />
                    )}

                    <TextField
                        fullWidth
                        label="Correo electrónico"
                        variant="outlined"
                        margin="normal"
                        type="email"
                        placeholder="ejemplo@correo.com"
                    />

                    <TextField
                        fullWidth
                        label="Contraseña"
                        variant="outlined"
                        margin="normal"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
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
                        variant="contained"
                        fullWidth
                        sx={{
                            mt: 2,
                            backgroundColor: '#fe6f14',
                            '&:hover': {
                                backgroundColor: '#c84f03',
                            },
                        }}
                    >
                        {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
                    </Button>

                    <div className="auth-divider">
                        <span>o</span>
                    </div>

                    <Button
                        variant="outlined"
                        className="google-button"
                        fullWidth
                        disabled
                        startIcon={<img src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA" alt="Google" />}
                    >
                        Continuar con Google
                    </Button>
                </div>

                <div className="auth-footer">
                    <p>
                        {isLogin
                            ? '¿No tienes una cuenta? '
                            : '¿Ya tienes una cuenta? '}
                        <Button
                            onClick={() => setIsLogin(!isLogin)}
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
                            {isLogin ? 'Regístrate' : 'Inicia sesión'}
                        </Button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
