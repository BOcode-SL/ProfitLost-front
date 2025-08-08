/**
 * Header Component
 * 
 * Fixed navigation header that appears across the landing pages.
 * Includes brand logo, navigation links, and login button.
 * Features a scroll-based styling that changes opacity and blur when scrolling.
 * 
 * @module Header
 */
import { useState, useEffect } from 'react';
import { Box, Button, Container, Toolbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * Landing page header component
 * 
 * Provides navigation across the website with responsive design.
 * Includes branding, navigation links, and authentication button.
 * Changes appearance based on scroll position for better UX.
 * 
 * @returns {JSX.Element} The rendered header component
 */
export default function Header() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [isScrolled, setIsScrolled] = useState(false);

    /**
     * Sets up scroll event listener for header appearance changes
     * Updates isScrolled state when page is scrolled beyond 50px
     */
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                p: { xs: 1, sm: 2, md: 3 },
                pt: { xs: 2, sm: 2, md: 3 },
                boxSizing: 'border-box',
                width: '100%'
            }}
        >
            <Container
                maxWidth="lg"
                sx={{
                    maxWidth: '1200px !important',
                    margin: '0 auto',
                    bgcolor: isScrolled ? 'rgba(255, 255, 255, 0.4)' : '#ffffff',
                    borderRadius: '16px',
                    backdropFilter: isScrolled ? 'blur(20px)' : 'blur(10px)',
                    WebkitBackdropFilter: isScrolled ? 'blur(20px)' : 'blur(10px)',
                    padding: '0 !important',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: isScrolled
                        ? '0 8px 32px rgba(0, 0, 0, 0.1)'
                        : '0 4px 16px rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.3s ease'
                }}
            >
                <Toolbar
                    sx={{
                        justifyContent: 'space-between',
                        px: { xs: 2, sm: 3, md: 4 },
                        py: { xs: 1, sm: 1.25, md: 1.5 },
                        minHeight: 'unset !important'
                    }}
                >
                    {/* Brand logo with navigation to home page */}
                    <Box
                        component="img"
                        src="/logo/logoLandMix.svg"
                        alt="logo"
                        sx={{
                            width: { xs: 120, sm: 150 },
                            cursor: 'pointer',
                            userSelect: 'none',
                            transition: 'transform 0.2s ease-in-out',
                            '&:hover': {
                                transform: 'scale(1.05)'
                            }
                        }}
                        onClick={() => navigate('/')}
                    />

                    {/* Navigation links and login button */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={() => navigate('/auth')}
                            sx={{
                                backgroundColor: '#fe6f14',
                                color: '#ffffff',
                                borderRadius: '8px',
                                px: { xs: 2, sm: 3 },
                                py: { xs: 0.8, sm: 1 },
                                fontSize: { xs: '0.875rem', sm: '1rem' },
                                fontWeight: 600,
                                boxShadow: '0 4px 16px rgba(254, 111, 20, 0.3)',
                                whiteSpace: 'nowrap',
                                transition: 'all 0.3s ease-in-out',
                                '&:hover': {
                                    transform: 'scale(1.02)',
                                    backgroundColor: '#c84f03',
                                    boxShadow: '0 6px 24px rgba(254, 111, 20, 0.4)'
                                }
                            }}
                        >
                            {t('home.header.login')}
                        </Button>
                    </Box>
                </Toolbar>
            </Container>
        </Box>
    );
} 