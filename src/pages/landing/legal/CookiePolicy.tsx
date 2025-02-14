import { Typography, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

// Components
import LegalLayout from './components/LegalLayout';

// Types
interface CookieType {
    title: string;
    description: string;
}

// Cookie Policy page
export default function CookiePolicy() {
    const { t } = useTranslation();

    // Helper functions to safely convert translations to arrays
    const getTranslationArray = (key: string): string[] => {
        const translation = t(key, { returnObjects: true });
        return Array.isArray(translation) ? translation : [];
    };

    const getCookieTypesArray = (key: string): CookieType[] => {
        const translation = t(key, { returnObjects: true });
        return Array.isArray(translation) ? translation : [];
    };

    return (
        <LegalLayout title={t('home.legal.cookiesPolicy.title')}>
            {/* Last updated date */}
            <Typography sx={{ mb: 4 }}>
                {t('home.legal.lastUpdated', { date: '09/02/2025' })}
            </Typography>

            {/* Section 1: What are cookies? */}
            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                {t('home.legal.cookiesPolicy.sections.whatAreCookies.title')}
            </Typography>
            <Typography>
                {t('home.legal.cookiesPolicy.sections.whatAreCookies.content')}
            </Typography>

            {/* Section 2: Legal basis */}
            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                {t('home.legal.cookiesPolicy.sections.legalBasis.title')}
            </Typography>
            <Typography>
                {t('home.legal.cookiesPolicy.sections.legalBasis.content')}
            </Typography>

            {/* Section 3: Types of cookies we use */}
            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                {t('home.legal.cookiesPolicy.sections.types.title')}
            </Typography>
            <Box component="ul" sx={{ pl: 4, mb: 4 }}>
                {getCookieTypesArray('home.legal.cookiesPolicy.sections.types.items').map((item: CookieType, index: number) => (
                    <li key={index}>
                        <Typography component="span" fontWeight="bold">{item.title}</Typography>
                        {' '}{item.description}
                    </li>
                ))}
            </Box>

            {/* Section 4: Cookies management */}
            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                {t('home.legal.cookiesPolicy.sections.management.title')}
            </Typography>
            <Typography>
                {t('home.legal.cookiesPolicy.sections.management.content')}
            </Typography>

            {/* Section 5: Third-party cookies */}
            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                {t('home.legal.cookiesPolicy.sections.thirdParty.title')}
            </Typography>
            <Typography>
                {t('home.legal.cookiesPolicy.sections.thirdParty.content')}
            </Typography>
            <Box component="ul" sx={{ pl: 4, mb: 4 }}>
                {getTranslationArray('home.legal.cookiesPolicy.sections.thirdParty.items').map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                ))}
            </Box>

            {/* Section 6: Cookies retention period */}
            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                {t('home.legal.cookiesPolicy.sections.retention.title')}
            </Typography>
            <Typography>
                {t('home.legal.cookiesPolicy.sections.retention.content')}
            </Typography>

            {/* Section 7: Your rights */}
            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                {t('home.legal.cookiesPolicy.sections.rights.title')}
            </Typography>
            <Typography>
                {t('home.legal.cookiesPolicy.sections.rights.content')}
            </Typography>
            <Box component="ul" sx={{ pl: 4, mb: 4 }}>
                <li>{t('home.legal.cookiesPolicy.sections.rights.contact.email')}</li>
                <li>{t('home.legal.cookiesPolicy.sections.rights.contact.website')}</li>
            </Box>

            {/* Section 8: Modifications */}
            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                {t('home.legal.cookiesPolicy.sections.modifications.title')}
            </Typography>
            <Typography>
                {t('home.legal.cookiesPolicy.sections.modifications.content')}
            </Typography>
        </LegalLayout>
    );
} 