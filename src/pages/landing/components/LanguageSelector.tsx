import { Box, IconButton, Tooltip } from '@mui/material';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageSelector() {
    const { t, i18n } = useTranslation();
    const [currentLanguage, setCurrentLanguage] = useState(() => {
        const i18nextLng = localStorage.getItem('i18nextLng') || 'en';
        return i18nextLng.startsWith('es') ? 'es' : 'en';
    });

    useEffect(() => {
        const handleLanguageChange = () => {
            const i18nextLng = localStorage.getItem('i18nextLng') || 'en';
            setCurrentLanguage(i18nextLng.startsWith('es') ? 'es' : 'en');
        };

        window.addEventListener('languagechange', handleLanguageChange);
        return () => window.removeEventListener('languagechange', handleLanguageChange);
    }, []);

    const toggleLanguage = () => {
        const newLang = currentLanguage === 'en' ? 'es' : 'en';
        setCurrentLanguage(newLang);
        i18n.changeLanguage(newLang);
    };

    return (
        <Box sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 1100,
            '@media (max-width: 600px)': {
                bottom: 24,
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