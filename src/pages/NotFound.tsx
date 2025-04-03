/**
 * 404 Page Not Found Component
 * 
 * Displays a visually appealing error page when users navigate to a route that doesn't exist.
 * Features an animated 404 message, brand logo, and a button to return to the home page.
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Typography, Button, Container, useTheme, useMediaQuery, Fade } from '@mui/material';

const NotFound: React.FC = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();

    // Handle navigation back to the home page
    const handleNavigateHome = () => {
        navigate('/');
    };

    return (
        <Fade in={true} timeout={1000}>
            <Container
                maxWidth={false}
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: theme.palette.background.default,
                    overflow: 'hidden',
                    position: 'relative'
                }}
            >
                {/* Decorative background elements to enhance visual appeal */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: '10%',
                        right: '5%',
                        width: { xs: 200, md: 300 },
                        height: { xs: 200, md: 300 },
                        borderRadius: '50%',
                        background: `radial-gradient(circle, ${theme.palette.primary.main}20 0%, transparent 70%)`,
                        filter: 'blur(40px)',
                        zIndex: 0
                    }}
                />
                
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: '15%',
                        left: '10%',
                        width: { xs: 150, md: 250 },
                        height: { xs: 150, md: 250 },
                        borderRadius: '50%',
                        background: `radial-gradient(circle, ${theme.palette.secondary.main}20 0%, transparent 70%)`,
                        filter: 'blur(40px)',
                        zIndex: 0
                    }}
                />

                {/* Main content container */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        zIndex: 1,
                        px: { xs: 2, sm: 4 },
                        maxWidth: '800px'
                    }}
                >
                    {/* 404 number with glitch effect and gradient */}
                    <Typography
                        variant="h1"
                        sx={{
                            fontSize: { xs: '8rem', sm: '12rem', md: '16rem' },
                            fontWeight: 900,
                            lineHeight: 0.8,
                            letterSpacing: '-0.05em',
                            background: `linear-gradient(135deg, 
                                ${theme.palette.primary.main} 0%, 
                                ${theme.palette.secondary.main} 100%)`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            position: 'relative',
                            mb: { xs: 4, md: 6 },
                            textShadow: `3px 3px 0px ${theme.palette.primary.main}40`,
                            '&::before, &::after': {
                                content: '"404"',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                zIndex: -1
                            },
                            '&::before': {
                                color: theme.palette.primary.main,
                                opacity: 0.4,
                                transform: 'translate(-5px, -5px)',
                            },
                            '&::after': {
                                color: theme.palette.secondary.main,
                                opacity: 0.4,
                                transform: 'translate(5px, 5px)',
                            }
                        }}
                    >
                        404
                    </Typography>

                    {/* Company logo */}
                    <img
                        src="https://res.cloudinary.com/dnhlagojg/image/upload/v1726670794/AppPhotos/Brand/logoPL.svg"
                        alt="Profit Lost Logo"
                        style={{
                            width: isMobile ? '120px' : '150px',
                            marginBottom: '2rem'
                        }}
                    />

                    {/* Error message title */}
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 700,
                            mb: 3,
                            color: theme.palette.text.primary,
                            fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' }
                        }}
                    >
                        {t('notFound.title')}
                    </Typography>

                    {/* Detailed error message */}
                    <Typography
                        variant="body1"
                        sx={{
                            mb: 5,
                            color: theme.palette.text.secondary,
                            maxWidth: '600px',
                            fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
                            lineHeight: 1.6
                        }}
                    >
                        {t('notFound.message')}
                    </Typography>

                    {/* Return to home page button */}
                    <Button
                        onClick={handleNavigateHome}
                        variant="contained"
                        size={isMobile ? "large" : "large"}
                        sx={{
                            borderRadius: '50px',
                            px: { xs: 4, sm: 5, md: 6 },
                            py: { xs: 1.5, sm: 1.75, md: 2 },
                            backgroundColor: theme.palette.primary.main,
                            color: '#fff',
                            fontSize: { xs: '1rem', md: '1.1rem' },
                            fontWeight: 600,
                            boxShadow: `0 8px 20px -4px ${theme.palette.primary.main}60`,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                backgroundColor: theme.palette.secondary.main,
                                transform: 'translateY(-3px)',
                                boxShadow: `0 12px 25px -5px ${theme.palette.secondary.main}60`,
                            }
                        }}
                    >
                        {t('notFound.backHome')}
                    </Button>

                    {/* Additional support information */}
                    <Typography
                        variant="body2"
                        sx={{
                            mt: 4,
                            color: theme.palette.text.secondary,
                            opacity: 0.7,
                            fontSize: { xs: '0.8rem', md: '0.9rem' }
                        }}
                    >
                        {t('notFound.contactSupport', 'If you believe this is an error, please contact support')}
                    </Typography>
                </Box>
            </Container>
        </Fade>
    );
};

export default NotFound; 