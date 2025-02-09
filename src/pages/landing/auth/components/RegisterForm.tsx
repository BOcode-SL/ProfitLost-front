import { ChangeEvent } from 'react';
import { TextField, Button, InputAdornment, IconButton, Box } from '@mui/material';

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

    return (
        <Box component="form" onSubmit={handleSubmit}>
            {/* Input for Name */}
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
            {/* Input for Surname */}
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
            {/* Input for Username */}
            <TextField
                fullWidth
                required
                label="Username"
                variant="outlined"
                margin="normal"
                name="username"
                helperText="Only lowercase letters and numbers allowed"
                placeholder="username"
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
                label="Email"
                type="email"
                variant="outlined"
                margin="normal"
                name="email"
                value={registerData.email}
                onChange={handleChange}
                placeholder="tu@email.com"
            />
            {/* Input for Password */}
            <TextField
                fullWidth
                required
                type={showPassword ? 'text' : 'password'}
                label="Password"
                variant="outlined"
                margin="normal"
                name="password"
                helperText="Minimum 8 characters, one uppercase letter, one lowercase letter, one number and one symbol"
                value={registerData.password}
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
                {loading ? 'Loading...' : 'Register'}
            </Button>
        </Box>
    );
}
