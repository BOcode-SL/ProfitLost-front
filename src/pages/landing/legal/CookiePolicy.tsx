/**
 * Cookie Policy Page Component
 * 
 * Displays the website's cookie policy, explaining what cookies are used,
 * how they're managed, and what rights users have regarding cookie data.
 * Content is internationalized through translation keys.
 */
import { Typography, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

// Components
import LegalLayout from './components/LegalLayout';

/**
 * Interface for cookie type items with title and description
 */
interface CookieType {
    title: string;
    description: string;
}

export default function CookiePolicy() {
    const { t } = useTranslation();

    /**
     * Safely converts translation objects to arrays
     * Handles both array returns and non-array returns for flexibility
     * 
     * @param key - Translation key to retrieve
     * @returns Array of translation strings or empty array if not found
     */
    const getTranslationArray = (key: string): string[] => {
        const translation = t(key, { returnObjects: true });
        return Array.isArray(translation) ? translation : [];
    };

    /**
     * Safely converts translation objects to arrays of CookieType objects
     * 
     * @param key - Translation key to retrieve
     * @returns Array of CookieType objects or empty array if not found
     */
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