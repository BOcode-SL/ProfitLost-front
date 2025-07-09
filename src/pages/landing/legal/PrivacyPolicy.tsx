/**
 * Privacy Policy Page Component
 * 
 * Displays detailed information about data collection practices,
 * user rights, data protection measures, and retention policies.
 * Content is internationalized through translation keys.
 * 
 * @module PrivacyPolicy
 */
import { Typography, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

// Components
import LegalLayout from './components/LegalLayout';

/**
 * Privacy Policy page component
 * 
 * Presents comprehensive information about data handling practices,
 * including what data is collected, how it's used, user rights,
 * and data security measures implemented by the organization.
 * Uses translation keys for multi-language support.
 * 
 * @returns {JSX.Element} The rendered privacy policy page
 */
export default function PrivacyPolicy() {
    const { t } = useTranslation();

    /**
     * Safely converts translation objects to arrays
     * Handles both array returns and non-array returns for flexibility
     * 
     * @param {string} key - Translation key to retrieve
     * @returns {string[]} Array of translation strings or empty array if not found
     */
    const getTranslationArray = (key: string): string[] => {
        const translation = t(key, { returnObjects: true });
        return Array.isArray(translation) ? translation as string[] : [];
    };

    return (
        <LegalLayout title={t('home.legal.privacyPolicy.title')}>
            {/* Document last updated date information */}
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
                <li>{t('home.legal.privacyPolicy.sections.information.paymentData')}</li>
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

            {/* Section 4: Purpose of the Treatment */}
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

            {/* Section 9: International Data Transfers */}
            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                {t('home.legal.privacyPolicy.sections.dataTransfers.title')}
            </Typography>
            <Typography>
                {t('home.legal.privacyPolicy.sections.dataTransfers.content')}
            </Typography>

            {/* Section 10: Accessibility */}
            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                {t('home.legal.privacyPolicy.sections.accessibility.title')}
            </Typography>
            <Typography>
                {t('home.legal.privacyPolicy.sections.accessibility.content')}
            </Typography>

            {/* Section 11: California Residents' Rights */}
            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                {t('home.legal.privacyPolicy.sections.californiaRights.title')}
            </Typography>
            <Typography sx={{ mb: 2 }}>
                {t('home.legal.privacyPolicy.sections.californiaRights.content')}
            </Typography>
            <Typography>
                {t('home.legal.privacyPolicy.sections.californiaRights.contact')}
            </Typography>

            {/* Section 12: Modifications */}
            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                {t('home.legal.privacyPolicy.sections.modifications.title')}
            </Typography>
            <Typography>
                {t('home.legal.privacyPolicy.sections.modifications.content')}
            </Typography>
        </LegalLayout>
    );
} 