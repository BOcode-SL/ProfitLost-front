/**
 * Authentication Layout Component
 * 
 * Provides a consistent container layout for all authentication forms (login, registration, password reset).
 * Features a centered card with responsive styling, branding elements, and language selector.
 * 
 * @module AuthLayout
 */
import { Box, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Components
import LanguageSelector from '../../components/LanguageSelector';

/**
 * Props interface for the AuthLayout component
 * 
 * @interface AuthLayoutProps
 */
interface AuthLayoutProps {
    children: React.ReactNode; // Children elements to be rendered inside the layout
    title: string; // Title of the layout
    subtitle: string; // Subtitle of the layout
    showDivider?: boolean; // Flag to show/hide the divider
    showAlternativeAction?: boolean; // Flag to show/hide alternative action
    alternativeActionText?: string; // Text for the alternative action
    onAlternativeActionClick?: () => void; // Function to handle alternative action click
}

/**
 * Authentication Layout component
 * 
 * Provides a consistent branded container for all authentication forms.
 * Includes responsive layout with header, content area, and footer elements.
 * Used for login, registration, and password reset screens.
 * 
 * @param {AuthLayoutProps} props - Component properties
 * @returns {JSX.Element} The rendered authentication layout
 */
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
        <>
            <LanguageSelector />
            {/* Main container for the layout */}
            <Box sx={{
                minHeight: '100vh',
                p: { xs: 2, sm: 3, md: 4 },
                overflow: 'auto',
                background: 'linear-gradient(135deg, rgba(255, 163, 106, 0.403) 0%, rgba(183, 79, 14, 0.501) 100%)'
            }}>
                {/* Container for the content */}
                <Container maxWidth="sm" sx={{
                    width: { xs: '100%', sm: '90%', md: '80%' },
                    my: { xs: 2, sm: 3, md: 4 }
                }}>
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
                                src="/logo/logoPL3.svg"
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
        </>
    );
}
