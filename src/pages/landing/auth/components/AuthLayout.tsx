import { Box, Container, Typography, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Define the props for the AuthLayout component
interface AuthLayoutProps {
    children: React.ReactNode; // Children elements to be rendered inside the layout
    title: string; // Title of the layout
    subtitle: string; // Subtitle of the layout
    showDivider?: boolean; // Flag to show/hide the divider
    showAlternativeAction?: boolean; // Flag to show/hide alternative action
    alternativeActionText?: string; // Text for the alternative action
    onAlternativeActionClick?: () => void; // Function to handle alternative action click
}

// Define the AuthLayout functional component
export default function AuthLayout({
    children,
    title,
    subtitle,
    showDivider = true,
    showAlternativeAction = true,
    alternativeActionText,
    onAlternativeActionClick
}: AuthLayoutProps) {
    const navigate = useNavigate();

    return (
        // Main container for the layout
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: { xs: 2, sm: 4 },
            background: 'linear-gradient(135deg, rgba(255, 163, 106, 0.403) 0%, rgba(183, 79, 14, 0.501) 100%)'
        }}>
            {/* Container for the content */}
            <Container maxWidth="sm">
                <Box sx={{
                    bgcolor: 'white',
                    borderRadius: 4,
                    p: { xs: 3, sm: 5 },
                    width: '100%',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)'
                }}>
                    {/* Logo and title */}
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
                        {/* Title */}
                        <Typography variant="h4" sx={{
                            fontSize: '2rem',
                            fontWeight: 700,
                            color: '#333',
                            mb: 0.5
                        }}>
                            {title}
                        </Typography>
                        {/* Subtitle */}
                        <Typography sx={{
                            color: '#666',
                            fontSize: '1.1rem'
                        }}>
                            {subtitle}
                        </Typography>
                    </Box>

                    {/* Children components */}                        
                    {children}

                    {/* Divider */}
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

                            {/* Alternative action */}
                            {showAlternativeAction && (
                                <Box sx={{ textAlign: 'center', mt: 3, color: '#666' }}>
                                    {/* Alternative action text */}
                                    <Typography>
                                        {alternativeActionText?.split('? ')[0]}?{' '}
                                        {/* Alternative action link */}
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
    );
}
