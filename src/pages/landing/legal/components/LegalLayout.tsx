/**
 * Legal Layout Component
 * 
 * Provides a consistent layout structure for all legal pages including:
 * - Header with language selector
 * - Decorative gradient background
 * - White content container with shadow
 * - Breadcrumb navigation
 * - Consistent heading styles
 * - Footer
 * 
 * @module LegalLayout
 */
import { useEffect } from 'react';
import { Box, Container, Typography, Breadcrumbs, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Components
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import LanguageSelector from '../../components/LanguageSelector';

/**
 * Props for the LegalLayout component
 * 
 * @interface LegalLayoutProps
 */
interface LegalLayoutProps {
    title: string; // Title displayed in the header and breadcrumbs
    children: React.ReactNode; // Content to be rendered within the layout
}

/**
 * Layout component for legal pages
 * 
 * Provides consistent structure and styling for all legal documents
 * including terms of service, privacy policy, and cookie policies.
 * Implements responsive design with appropriate spacing for different devices.
 * 
 * @param {LegalLayoutProps} props - Component properties
 * @param {string} props.title - Page title displayed in breadcrumbs and header
 * @param {React.ReactNode} props.children - Content to render within the layout
 * @returns {JSX.Element} The rendered legal page with consistent layout
 */
export default function LegalLayout({ title, children }: LegalLayoutProps) {
    const navigate = useNavigate();

    // Scroll to top when component mounts for better user experience
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <LanguageSelector />
            <Header />
            {/* Main container with decorative gradient header */}
            <Box
                sx={{
                    position: 'relative',
                    minHeight: '100vh',
                    bgcolor: '#FAFAFA',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '300px',
                        background: 'linear-gradient(135deg, #fe6f14 0%, #f98a48 100%)',
                        zIndex: 0
                    }
                }}
            >
                {/* Content container with shadow and padding */}
                <Container
                    maxWidth="lg"
                    sx={{
                        position: 'relative',
                        zIndex: 1,
                        pt: { xs: 12, sm: 14, md: 18 },
                        pb: { xs: 4, sm: 6, md: 8 },
                        px: { xs: 2, sm: 3, md: 6 }
                    }}
                >
                    {/* White content card with shadow */}
                    <Box
                        sx={{
                            bgcolor: 'white',
                            borderRadius: 2,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                            p: { xs: 2, sm: 3, md: 6 }
                        }}
                    >
                        {/* Breadcrumb navigation */}
                        <Breadcrumbs sx={{ mb: 4 }}>
                            <Link
                                component="button"
                                onClick={() => navigate('/')}
                                underline="hover"
                                sx={{
                                    color: '#fe6f14',
                                    '&:hover': {
                                        color: '#d45a0f'
                                    }
                                }}
                            >
                                Home
                            </Link>
                            <Typography color="text.secondary">{title}</Typography>
                        </Breadcrumbs>

                        {/* Page title with decorative underline */}
                        <Typography
                            variant="h1"
                            gutterBottom
                            sx={{
                                fontSize: { xs: '2rem', md: '2.5rem' },
                                fontWeight: 700,
                                color: '#2c3e50',
                                mb: 4,
                                borderBottom: '3px solid #fe6f14',
                                pb: 2,
                                display: 'inline-block'
                            }}
                        >
                            {title}
                        </Typography>

                        {/* Content container with consistent styling for headings and lists */}
                        <Box sx={{
                            '& h2': {
                                color: '#2c3e50',
                                borderLeft: '4px solid #fe6f14',
                                pl: 2,
                                py: 1
                            },
                            '& ul': {
                                listStyle: 'none',
                                '& li': {
                                    position: 'relative',
                                    '&::before': {
                                        content: '"•"',
                                        color: '#fe6f14',
                                        fontWeight: 'bold',
                                        position: 'absolute',
                                        left: '-1em'
                                    }
                                }
                            }
                        }}>
                            {children}
                        </Box>
                    </Box>
                </Container>
            </Box>
            <Footer />
        </>
    );
} 