/**
 * Language Selector Component
 * 
 * Provides a floating button allowing users to toggle between supported languages (English/Spanish).
 * Persists language selection to localStorage and updates the i18n context.
 */
import { Box, IconButton, Tooltip } from '@mui/material';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageSelector() {
    const { t, i18n } = useTranslation();
    
    // Initialize language state from localStorage or default to English
    const [currentLanguage, setCurrentLanguage] = useState(() => {
        const i18nextLng = localStorage.getItem('i18nextLng') || 'en';
        return i18nextLng.startsWith('es') ? 'es' : 'en';
    });

    // Listen for language changes in the browser
    useEffect(() => {
        const handleLanguageChange = () => {
            const i18nextLng = localStorage.getItem('i18nextLng') || 'en';
            setCurrentLanguage(i18nextLng.startsWith('es') ? 'es' : 'en');
        };

        window.addEventListener('languagechange', handleLanguageChange);
        return () => window.removeEventListener('languagechange', handleLanguageChange);
    }, []);

    // Toggle between English and Spanish
    const toggleLanguage = () => {
        const newLang = currentLanguage === 'en' ? 'es' : 'en';
        setCurrentLanguage(newLang);
        i18n.changeLanguage(newLang);
    };

    return (
        <Box sx={{
            position: 'fixed',
            bottom: { xs: 24, lg: 'auto' },
            top: { xs: 'auto', lg: 16 },
            right: { xs: 24, lg: 16 },
            zIndex: 1100,
            '@media (max-width: 1385px)': {
                bottom: 24,
                top: 'auto',
                right: 24
            }
        }}>
            <Tooltip title={t(`home.header.language.${currentLanguage === 'en' ? 'es' : 'en'}`)}>
                <IconButton
                    onClick={toggleLanguage}
                    sx={{
                        p: 2,
                        borderRadius: 4,
                        bgcolor: 'white',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            bgcolor: 'primary.main',
                            color: 'white',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 16px rgba(0,0,0,0.2)'
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
        </Box>
    );
}