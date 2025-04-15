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
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

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

    return (
        <Box component="form" onSubmit={handleSubmit}>
            {/* Name field */}
            <TextField
                fullWidth
                required
                label={t('home.auth.register.form.name.label')}
                variant="outlined"
                margin="normal"
                name="name"
                value={registerData.name}
                onChange={handleChange}
                placeholder={t('home.auth.register.form.name.placeholder')}
            />
            
            {/* Surname field */}
            <TextField
                fullWidth
                required
                label={t('home.auth.register.form.surname.label')}
                variant="outlined"
                margin="normal"
                name="surname"
                value={registerData.surname}
                onChange={handleChange}
                placeholder={t('home.auth.register.form.surname.placeholder')}
            />
            
            {/* Username field with alphanumeric validation */}
            <TextField
                fullWidth
                required
                label={t('home.auth.register.form.username.label')}
                variant="outlined"
                margin="normal"
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
            />
            
            {/* Email field */}
            <TextField
                fullWidth
                required
                label={t('home.auth.register.form.email.label')}
                type="email"
                variant="outlined"
                margin="normal"
                name="email"
                value={registerData.email}
                onChange={handleChange}
                placeholder={t('home.auth.register.form.email.placeholder')}
            />
            
            {/* Password field with visibility toggle */}
            <TextField
                fullWidth
                required
                type={showPassword ? 'text' : 'password'}
                label={t('home.auth.register.form.password.label')}
                variant="outlined"
                margin="normal"
                name="password"
                helperText={t('home.auth.register.form.password.helper')}
                value={registerData.password}
                onChange={handleChange}
                slotProps={{
                    input: {
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
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
                disabled={!isFormValid() || loading}
                sx={{
                    mt: 3,
                    mb: 2,
                    bgcolor: '#fe6f14',
                    '&:hover': { bgcolor: '#c84f03' }
                }}
            >
                {loading ? t('home.auth.common.loading') : t('home.auth.register.form.submit')}
            </Button>
        </Box>
    );
}
