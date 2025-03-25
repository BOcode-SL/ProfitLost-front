import { ChangeEvent } from 'react';
import { TextField, Button, InputAdornment, IconButton, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

// Types
import type { RegisterCredentials } from '../../../../types/api/responses';

interface RegisterFormProps {
    registerData: RegisterCredentials; // Data for registration
    loading: boolean; // Loading state for the button
    showPassword: boolean; // State to show/hide password
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Function to handle input changes
    setShowPassword: (show: boolean) => void; // Function to toggle password visibility
    isFormValid: () => boolean; // Function to validate the form
    handleSubmit: (e: React.FormEvent) => void; // Function to handle form submission
}

// RegisterForm component definition
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
            {/* Input for Name */}
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
            {/* Input for Surname */}
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
            {/* Input for Username */}
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
            {/* Input for Email */}
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
            {/* Input for Password */}
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
                {loading ? t('home.auth.common.loading') : t('home.auth.register.form.submit')}
            </Button>
        </Box>
    );
}
