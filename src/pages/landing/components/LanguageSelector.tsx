/**
 * Language Selector Component
 * 
 * Provides a floating button allowing users to toggle between supported languages (English/Spanish).
 * Persists language selection to localStorage and updates the i18n context.
 * Repositions based on screen size for optimal visibility on all devices.
 * 
 * @module LanguageSelector
 */
import { Box, IconButton, Tooltip } from '@mui/material';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Language selector floating button component
 * 
 * Displays a floating button with the current language flag that toggles
 * between English and Spanish when clicked. Position adapts to screen size.
 * 
 * @returns {JSX.Element} The rendered language selector button
 */
export default function LanguageSelector() {
    const { t, i18n } = useTranslation();

    // Initialize language state from localStorage or default to English
    const [currentLanguage, setCurrentLanguage] = useState(() => {
        const i18nextLng = localStorage.getItem('i18nextLng') || 'en';
        return i18nextLng.startsWith('es') ? 'es' : 'en';
    });

    // Listen for language changes in the browser
    useEffect(() => {
        /**
         * Updates the language state when browser language settings change
         */
        const handleLanguageChange = () => {
            const i18nextLng = localStorage.getItem('i18nextLng') || 'en';
            setCurrentLanguage(i18nextLng.startsWith('es') ? 'es' : 'en');
        };

        window.addEventListener('languagechange', handleLanguageChange);
        return () => window.removeEventListener('languagechange', handleLanguageChange);
    }, []);

    /**
     * Toggles between English and Spanish languages
     * Updates both the local state and i18n context language
     */
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
                        p: 2.5,
                        borderRadius: '16px',
                        background: '#FFFFFF',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(0, 0, 0, 0.1)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'linear-gradient(135deg, rgba(254, 111, 20, 0.05) 0%, rgba(200, 79, 3, 0.05) 100%)',
                            borderRadius: '16px',
                            opacity: 0,
                            transition: 'opacity 0.3s ease',
                            zIndex: -1
                        },
                        '&:hover': {
                            transform: 'scale(1.05)',
                            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.18)',
                            border: '1px solid rgba(254, 111, 20, 0.3)',
                            background: 'rgba(255, 255, 255, 0.95)',
                            '&::before': {
                                opacity: 1
                            }
                        },
                        '&:active': {
                            transform: 'scale(0.98)',
                            transition: 'transform 0.1s ease'
                        }
                    }}
                >
                    <Box
                        component="img"
                        src={`https://raw.githubusercontent.com/lipis/flag-icons/main/flags/4x3/${currentLanguage === 'en' ? 'us' : 'es'}.svg`}
                        alt={t(`home.header.language.${currentLanguage}`)}
                        sx={{
                            width: 28,
                            height: 'auto',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15))'
                            }
                        }}
                    />
                </IconButton>
            </Tooltip>
        </Box>
    );
}