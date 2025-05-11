/**
 * Cookie Policy Page Component
 * 
 * Displays the website's cookie policy, explaining what cookies are used,
 * how they're managed, and what rights users have regarding cookie data.
 * Content is internationalized through translation keys.
 * 
 * @module CookiePolicy
 */
import { Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';

// Components
import LegalLayout from './components/LegalLayout';

/**
 * Interface for cookie type items with title and description
 * 
 * @interface CookieType
 */
interface CookieType {
    title: string;
    description: string;
}

/**
 * Interface for specific cookie information
 * 
 * @interface SpecificCookie
 */
interface SpecificCookie {
    name: string;
    purpose: string;
    duration: string;
    type: string;
}

/**
 * Cookie Policy page component
 * 
 * Presents detailed information about cookie usage, types of cookies,
 * user rights regarding cookies, and retention policies.
 * Uses translation keys for multi-language support.
 * 
 * @returns {JSX.Element} The rendered cookie policy page
 */
export default function CookiePolicy() {
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
        return Array.isArray(translation) ? translation : [];
    };

    /**
     * Safely converts translation objects to arrays of CookieType objects
     * 
     * @param {string} key - Translation key to retrieve
     * @returns {CookieType[]} Array of CookieType objects or empty array if not found
     */
    const getCookieTypesArray = (key: string): CookieType[] => {
        const translation = t(key, { returnObjects: true });
        return Array.isArray(translation) ? translation : [];
    };

    /**
     * Safely converts translation objects to arrays of SpecificCookie objects
     * 
     * @param {string} key - Translation key to retrieve
     * @returns {SpecificCookie[]} Array of SpecificCookie objects or empty array if not found
     */
    const getSpecificCookiesArray = (key: string): SpecificCookie[] => {
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

            {/* Section 4: Specific cookies used */}
            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                {t('home.legal.cookiesPolicy.sections.specificCookies.title')}
            </Typography>
            <Typography sx={{ mb: 2 }}>
                {t('home.legal.cookiesPolicy.sections.specificCookies.subtitle')}
            </Typography>
            <TableContainer component={Paper} sx={{ mb: 4, overflowX: 'auto' }}>
                <Table aria-label="cookies table">
                    <TableHead>
                        <TableRow sx={{ backgroundColor: 'primary.main' }}>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Purpose</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Duration</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Type</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {getSpecificCookiesArray('home.legal.cookiesPolicy.sections.specificCookies.table').map((cookie: SpecificCookie, index: number) => (
                            <TableRow key={index} sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}>
                                <TableCell component="th" scope="row">{cookie.name}</TableCell>
                                <TableCell>{cookie.purpose}</TableCell>
                                <TableCell>{cookie.duration}</TableCell>
                                <TableCell>{cookie.type}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Section 5: Cookies management */}
            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                {t('home.legal.cookiesPolicy.sections.management.title')}
            </Typography>
            <Typography>
                {t('home.legal.cookiesPolicy.sections.management.content')}
            </Typography>
            
            {/* Browser instructions */}
            <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 'bold' }}>
                {t('home.legal.cookiesPolicy.sections.management.browsers.title')}
            </Typography>
            <Box component="ul" sx={{ pl: 4, mb: 4 }}>
                {getTranslationArray('home.legal.cookiesPolicy.sections.management.browsers.items').map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                ))}
            </Box>

            {/* Section 6: Third-party cookies */}
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

            {/* Section 7: Cookies retention period */}
            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                {t('home.legal.cookiesPolicy.sections.retention.title')}
            </Typography>
            <Typography>
                {t('home.legal.cookiesPolicy.sections.retention.content')}
            </Typography>

            {/* Section 8: Your rights */}
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

            {/* Section 9: Modifications */}
            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                {t('home.legal.cookiesPolicy.sections.modifications.title')}
            </Typography>
            <Typography>
                {t('home.legal.cookiesPolicy.sections.modifications.content')}
            </Typography>
        </LegalLayout>
    );
} 