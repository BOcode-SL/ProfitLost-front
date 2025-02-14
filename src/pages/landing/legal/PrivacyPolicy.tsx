import { Typography, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

// Components
import LegalLayout from './components/LegalLayout';

// Privacy Policy page
export default function PrivacyPolicy() {
    const { t } = useTranslation();

    // Helper function to safely convert translation to array
    const getTranslationArray = (key: string): string[] => {
        const translation = t(key, { returnObjects: true });
        return Array.isArray(translation) ? translation : [];
    };

    return (
        <LegalLayout title={t('home.legal.privacyPolicy.title')}>
            {/* Last updated date */}
            <Typography sx={{ mb: 4 }}>
                {t('home.legal.lastUpdated', { date: '09/02/2025' })}
            </Typography>

            {/* Section 1: Responsible for the Treatment */}
            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                {t('home.legal.privacyPolicy.sections.responsible.title')}
            </Typography>
            <Typography>
                {t('home.legal.privacyPolicy.sections.responsible.subtitle')}
            </Typography>
            <Box component="ul" sx={{ pl: 4, mb: 4 }}>
                <li>{t('home.legal.privacyPolicy.sections.responsible.items.name')}</li>
                <li>{t('home.legal.privacyPolicy.sections.responsible.items.email')}</li>
                <li>{t('home.legal.privacyPolicy.sections.responsible.items.website')}</li>
            </Box>

            {/* Section 2: Information we collect */}
            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                {t('home.legal.privacyPolicy.sections.information.title')}
            </Typography>
            <Typography>
                {t('home.legal.privacyPolicy.sections.information.subtitle')}
            </Typography>
            <Box component="ul" sx={{ pl: 4, mb: 4 }}>
                {getTranslationArray('home.legal.privacyPolicy.sections.information.items').map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                ))}
            </Box>

            {/* Section 3: Legal basis */}
            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                {t('home.legal.privacyPolicy.sections.legalBasis.title')}
            </Typography>
            <Typography>
                {t('home.legal.privacyPolicy.sections.legalBasis.subtitle')}
            </Typography>
            <Box component="ul" sx={{ pl: 4, mb: 4 }}>
                {getTranslationArray('home.legal.privacyPolicy.sections.legalBasis.items').map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                ))}
            </Box>

            {/* Section 4: Purpose */}
            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                {t('home.legal.privacyPolicy.sections.purpose.title')}
            </Typography>
            <Typography>
                {t('home.legal.privacyPolicy.sections.purpose.subtitle')}
            </Typography>
            <Box component="ul" sx={{ pl: 4, mb: 4 }}>
                {getTranslationArray('home.legal.privacyPolicy.sections.purpose.items').map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                ))}
            </Box>

            {/* Section 5: ARCO+ Rights */}
            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                {t('home.legal.privacyPolicy.sections.rights.title')}
            </Typography>
            <Typography>
                {t('home.legal.privacyPolicy.sections.rights.subtitle')}
            </Typography>
            <Box component="ul" sx={{ pl: 4, mb: 4 }}>
                {getTranslationArray('home.legal.privacyPolicy.sections.rights.items').map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                ))}
            </Box>
            <Typography>
                {t('home.legal.privacyPolicy.sections.rights.contact')}
            </Typography>

            {/* Section 6: Data retention */}
            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                {t('home.legal.privacyPolicy.sections.retention.title')}
            </Typography>
            <Typography>
                {t('home.legal.privacyPolicy.sections.retention.subtitle')}
            </Typography>
            <Box component="ul" sx={{ pl: 4, mb: 4 }}>
                {getTranslationArray('home.legal.privacyPolicy.sections.retention.items').map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                ))}
            </Box>

            {/* Section 7: Security measures */}
            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                {t('home.legal.privacyPolicy.sections.security.title')}
            </Typography>
            <Typography>
                {t('home.legal.privacyPolicy.sections.security.subtitle')}
            </Typography>
            <Box component="ul" sx={{ pl: 4, mb: 4 }}>
                {getTranslationArray('home.legal.privacyPolicy.sections.security.items').map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                ))}
            </Box>

            {/* Section 8: Minors */}
            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                {t('home.legal.privacyPolicy.sections.minors.title')}
            </Typography>
            <Typography>
                {t('home.legal.privacyPolicy.sections.minors.content')}
            </Typography>

            {/* Section 9: Modifications */}
            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                {t('home.legal.privacyPolicy.sections.modifications.title')}
            </Typography>
            <Typography>
                {t('home.legal.privacyPolicy.sections.modifications.content')}
            </Typography>

            {/* Section 10: Contact */}
            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                {t('home.legal.privacyPolicy.sections.contact.title')}
            </Typography>
            <Typography>
                {t('home.legal.privacyPolicy.sections.contact.content')}
            </Typography>
        </LegalLayout>
    );
} 