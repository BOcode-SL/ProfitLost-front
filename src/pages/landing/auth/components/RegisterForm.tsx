/**
 * Registration Form Component
 * 
 * Provides the interface for new user account creation with fields for:
 * - Name and surname (personal information)
 * - Username (with alphanumeric validation)
 * - Email address
 * - Password (with visibility toggle)
 * 
 * Includes field validation, input formatting, and accessibility features.
 * Username input is restricted to lowercase alphanumeric characters only.
 * 
 * @module RegisterForm
 */
import { ChangeEvent } from 'react';
import { TextField, Button, InputAdornment, IconButton, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff } from 'react-feather';

// Types for registration form data and handlers
import type { RegisterCredentials } from '../../../../types/api/responses';

/**
 * Props interface for the RegisterForm component
 * 
 * @interface RegisterFormProps
 */
interface RegisterFormProps {
    registerData: RegisterCredentials; // User registration data
    loading: boolean; // Loading state during submission
    showPassword: boolean; // Toggle for password visibility
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Input change handler
    setShowPassword: (show: boolean) => void; // Password visibility toggle handler
    isFormValid: () => boolean; // Validator function for form completion
    handleSubmit: (e: React.FormEvent) => void; // Form submission handler
}

/**
 * Registration form component
 * 
 * Provides a form for user account creation with validation.
 * Includes fields for personal information, username, email, and password.
 * Applies restrictions and formatting to ensure valid input.
 * 
 * @param {RegisterFormProps} props - Component properties
 * @returns {JSX.Element} The rendered registration form
 */
export default function RegisterForm({
    registerData,
    loading,
    showPassword,
    handleChange,
    setShowPassword,
    isFormValid,
    handleSubmit
}: RegisterFormProps) {
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

    return (
        <Box component="form" onSubmit={handleSubmit}>
            {/* Name and Surname Row */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <TextField
                    required
                    label={t('home.auth.register.form.name.label')}
                    variant="outlined"
                    name="name"
                    value={registerData.name}
                    onChange={handleChange}
                    placeholder={t('home.auth.register.form.name.placeholder')}
                    sx={{
                        flex: 1,
                        ...textFieldStyles,
                        mb: 0
                    }}
                />
                <TextField
                    required
                    label={t('home.auth.register.form.surname.label')}
                    variant="outlined"
                    name="surname"
                    value={registerData.surname}
                    onChange={handleChange}
                    placeholder={t('home.auth.register.form.surname.placeholder')}
                    sx={{
                        flex: 1,
                        ...textFieldStyles,
                        mb: 0
                    }}
                />
            </Box>

            {/* Username field with alphanumeric validation */}
            <TextField
                fullWidth
                required
                label={t('home.auth.register.form.username.label')}
                variant="outlined"
                name="username"
                helperText={t('home.auth.register.form.username.helper')}
                placeholder={t('home.auth.register.form.username.placeholder')}
                value={registerData.username}
                onChange={(e) => {
                    // Restrict to lowercase alphanumeric characters only
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
                sx={{
                    ...textFieldStyles,
                    '& .MuiFormHelperText-root': {
                        color: '#fe6f14',
                        fontSize: '0.8rem'
                    }
                }}
            />

            {/* Email field */}
            <TextField
                fullWidth
                required
                label={t('home.auth.register.form.email.label')}
                type="email"
                variant="outlined"
                name="email"
                value={registerData.email}
                onChange={handleChange}
                placeholder={t('home.auth.register.form.email.placeholder')}
                sx={textFieldStyles}
            />

            {/* Password field with visibility toggle */}
            <TextField
                fullWidth
                required
                type={showPassword ? 'text' : 'password'}
                label={t('home.auth.register.form.password.label')}
                variant="outlined"
                name="password"
                helperText={t('home.auth.register.form.password.helper')}
                value={registerData.password}
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
                    },
                    '& .MuiFormHelperText-root': {
                        color: '#fe6f14',
                        fontSize: '0.8rem'
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

            {/* Register button */}
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
                {loading ? t('home.auth.common.loading') : t('home.auth.register.form.submit')}
            </Button>
        </Box>
    );
}
