import { TextField, Button, InputAdornment, IconButton, Box, Divider, Typography, Link } from '@mui/material';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { toast } from 'react-hot-toast';

// Types
import type { LoginCredentials } from '../../../types/api/responses';
interface LoginFormProps {
    loginData: LoginCredentials; // User login data
    loading: boolean; // Loading state for the button
    showPassword: boolean; // State to show/hide password
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Function to handle input changes
    setShowPassword: (show: boolean) => void; // Function to toggle password visibility
    setShowResetPassword: (show: boolean) => void; // Function to show/hide reset password form
    isFormValid: () => boolean; // Function to validate the form
    handleSubmit: (e: React.FormEvent) => void; // Function to handle form submission
    handleGoogleSuccess: (credentialResponse: CredentialResponse) => Promise<void>; // Function to handle Google login success
}

// LoginForm component definition
export default function LoginForm({
    loginData,
    loading,
    showPassword,
    handleChange,
    setShowPassword,
    setShowResetPassword,
    isFormValid,
    handleSubmit,
    handleGoogleSuccess
}: LoginFormProps) {

    return (
        <Box component="form" onSubmit={handleSubmit}>
            {/* Google Login button */}
            <Box sx={{ width: '100%', mb: 2 }}>
                <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => {
                        toast.error('Error authenticating with Google');
                    }}
                    useOneTap
                    width="100%"
                    text="continue_with"
                    shape="rectangular"
                />
            </Box>

            {/* Divider for visual separation */}
            <Divider sx={{ my: 2 }}>
                <Typography sx={{ color: '#666', px: 2 }}>
                    or
                </Typography>
            </Divider>

            {/* Input for email or username */}
            <TextField
                fullWidth
                required
                label="Email o username"
                variant="outlined"
                margin="normal"
                name="identifier"
                placeholder="email@example.com o username"
                value={loginData.identifier}
                onChange={handleChange}
            />
            {/* Input for password */}
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

            {/* Link to reset password */}
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

            {/* Submit button for login */}
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
                {loading ? 'Loading...' : 'Login'}
            </Button>
        </Box>
    );
}
