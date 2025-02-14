import { useState, useEffect } from 'react';
import { Box, Button, Container, Toolbar, IconButton, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Header() {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [currentLanguage, setCurrentLanguage] = useState(() =>
        localStorage.getItem('language') || 'en'
    );

    useEffect(() => {
        // Handle scroll event to change header style based on scroll position
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleLanguage = () => {
        // Toggle between English and Spanish languages
        const newLang = currentLanguage === 'en' ? 'es' : 'en';
        setCurrentLanguage(newLang);
        i18n.changeLanguage(newLang);
        localStorage.setItem('language', newLang);
    };

    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                p: { xs: 1, sm: 2, md: 3 },
                boxSizing: 'border-box',
                width: '100%'
            }}
        >
            <Container
                maxWidth="lg"
                sx={{
                    maxWidth: '1200px !important',
                    margin: '0 auto',
                    bgcolor: isScrolled ? 'rgba(255, 255, 255, 0.8)' : '#ffffff',
                    borderRadius: '1rem',
                    backdropFilter: isScrolled ? 'blur(10px)' : 'none',
                    WebkitBackdropFilter: isScrolled ? 'blur(10px)' : 'none',
                    padding: '0 !important',
                }}
            >
                <Toolbar
                    sx={{
                        justifyContent: 'space-between',
                        px: { xs: 2, sm: 3, md: 4 },
                        py: { xs: 0.2, sm: 0 },
                        minHeight: 'unset !important'
                    }}
                >
                    <Box
                        component="img"
                        src="https://res.cloudinary.com/dnhlagojg/image/upload/v1726670794/AppPhotos/Brand/logoPL3.svg"
                        alt="logo"
                        sx={{
                            width: { xs: 120, sm: 150 },
                            cursor: 'pointer',
                            userSelect: 'none'
                        }}
                        onClick={() => navigate('/')}
                    />

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Tooltip title={t(`home.header.language.${currentLanguage === 'en' ? 'es' : 'en'}`)}>
                            <IconButton
                                onClick={toggleLanguage}
                                sx={{
                                    p: 0.5,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'scale(1.1)'
                                    }
                                }}
                            >
                                <Box
                                    component="img"
                                    src={`https://raw.githubusercontent.com/lipis/flag-icons/main/flags/4x3/${currentLanguage === 'en' ? 'us' : 'es'}.svg`}
                                    alt={t(`home.header.language.${currentLanguage}`)}
                                    sx={{
                                        width: 24,
                                        height: 'auto',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                />
                            </IconButton>
                        </Tooltip>

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
                                fontWeight: 500,
                                boxShadow: 'none',
                                whiteSpace: 'nowrap',
                                transition: 'all 0.3s ease-in-out',
                                '&:hover': {
                                    transform: 'scale(1.02)',
                                    backgroundColor: '#c84f03',
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