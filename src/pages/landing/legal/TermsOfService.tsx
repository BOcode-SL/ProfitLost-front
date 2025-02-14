import { Typography, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

// Components
import LegalLayout from './components/LegalLayout';

// Terms of Service page
export default function TermsOfService() {
    const { t } = useTranslation();

    // Helper function to safely convert translation to array
    const getTranslationArray = (key: string): string[] => {
        const translation = t(key, { returnObjects: true });
        return Array.isArray(translation) ? translation : [];
    };

    return (
        <LegalLayout title={t('home.legal.terms.title')}>
            {/* Last updated date */}
            <Typography sx={{ mb: 4 }}>
                {t('home.legal.lastUpdated', { date: '09/02/2025' })}
            </Typography>

            {/* Section 1: Acceptance of the Terms */}
            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                {t('home.legal.terms.sections.acceptance.title')}
            </Typography>
            <Typography>
                {t('home.legal.terms.sections.acceptance.content')}
            </Typography>

            {/* Section 2: Service description */}
            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                {t('home.legal.terms.sections.description.title')}
            </Typography>
            <Typography>
                {t('home.legal.terms.sections.description.content')}
            </Typography>

            {/* Section 3: Registration and Account */}
            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                {t('home.legal.terms.sections.registration.title')}
            </Typography>
            <Box component="ul" sx={{ pl: 4, mb: 4 }}>
                {getTranslationArray('home.legal.terms.sections.registration.items').map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                ))}
            </Box>

            {/* Section 4: European User Rights */}
            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                {t('home.legal.terms.sections.europeanRights.title')}
            </Typography>
            <Typography>
                {t('home.legal.terms.sections.europeanRights.subtitle')}
            </Typography>
            <Box component="ul" sx={{ pl: 4, mb: 4 }}>
                {getTranslationArray('home.legal.terms.sections.europeanRights.items').map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                ))}
            </Box>

            {/* Section 5: Conflict Resolution in the EU */}
            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                {t('home.legal.terms.sections.conflictResolution.title')}
            </Typography>
            <Typography>
                {t('home.legal.terms.sections.conflictResolution.subtitle')}
            </Typography>
            <Box component="ul" sx={{ pl: 4, mb: 4 }}>
                {getTranslationArray('home.legal.terms.sections.conflictResolution.items').map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                ))}
            </Box>

            {/* Section 6: Rights and Restrictions */}
            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                {t('home.legal.terms.sections.rights.title')}
            </Typography>
            <Typography>
                {t('home.legal.terms.sections.rights.subtitle')}
            </Typography>
            <Box component="ul" sx={{ pl: 4, mb: 4 }}>
                {getTranslationArray('home.legal.terms.sections.rights.items').map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                ))}
            </Box>

            {/* Section 7: Data Protection */}
            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                {t('home.legal.terms.sections.dataProtection.title')}
            </Typography>
            <Typography>
                {t('home.legal.terms.sections.dataProtection.content')}
            </Typography>

            {/* Section 8: Limitation of Liability */}
            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                {t('home.legal.terms.sections.liability.title')}
            </Typography>
            <Typography>
                {t('home.legal.terms.sections.liability.subtitle')}
            </Typography>
            <Box component="ul" sx={{ pl: 4, mb: 4 }}>
                {getTranslationArray('home.legal.terms.sections.liability.items').map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                ))}
            </Box>

            {/* Section 9: Modifications */}
            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                {t('home.legal.terms.sections.modifications.title')}
            </Typography>
            <Typography>
                {t('home.legal.terms.sections.modifications.content')}
            </Typography>

            {/* Section 10: Applicable Law and Jurisdiction */}
            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                {t('home.legal.terms.sections.law.title')}
            </Typography>
            <Typography>
                {t('home.legal.terms.sections.law.subtitle')}
            </Typography>
            <Box component="ul" sx={{ pl: 4, mb: 4 }}>
                {getTranslationArray('home.legal.terms.sections.law.items').map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                ))}
            </Box>

            {/* Section 11: Validity and Nullity */}
            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                {t('home.legal.terms.sections.validity.title')}
            </Typography>
            <Typography>
                {t('home.legal.terms.sections.validity.content')}
            </Typography>

            {/* Section 12: Contact */}
            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                {t('home.legal.terms.sections.contact.title')}
            </Typography>
            <Typography>
                {t('home.legal.terms.sections.contact.content')}
            </Typography>
        </LegalLayout>
    );
} 