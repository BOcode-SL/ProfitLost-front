/**
 * Contact Information Page Component
 * 
 * Displays the website's contact information, support details,
 * and available hours of operation for user inquiries.
 * Content is internationalized through translation keys.
 */
import { Typography, Box, Link } from '@mui/material';
import { useTranslation } from 'react-i18next';

// Shared layout component
import LegalLayout from './components/LegalLayout';

// Contact page
export default function Contact() {
    const { t } = useTranslation();

    return (
        <LegalLayout title={t('home.legal.contact.title')}>
            {/* Document last updated date information */}
            <Typography sx={{ mb: 4 }}>
                {t('home.legal.lastUpdated', { date: '09/02/2025' })}
            </Typography>

            <Box sx={{ maxWidth: 800 }}>
                {/* General introduction and contact policy information */}
                <Typography paragraph sx={{ mb: 4 }}>
                    {t('home.legal.contact.generalInfo')}
                </Typography>

                {/* Technical support contact information and response time */}
                <Box sx={{ mb: 6 }}>
                    <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem' }}>
                        {t('home.legal.contact.sections.technicalSupport.title')}
                    </Typography>
                    <Typography>
                        {t('home.legal.contact.sections.technicalSupport.description')}
                    </Typography>
                    <Link href={`mailto:${t('home.legal.contact.sections.technicalSupport.email')}`}>
                        {t('home.legal.contact.sections.technicalSupport.email')}
                    </Link>
                    <Typography variant="body2" color="text.secondary">
                        {t('home.legal.contact.sections.technicalSupport.responseTime')}
                    </Typography>
                </Box>

                {/* Support hours and availability information */}
                <Box sx={{ mb: 6 }}>
                    <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem' }}>
                        {t('home.legal.contact.sections.supportHours.title')}
                    </Typography>
                    <Box component="ul" sx={{ pl: 4, mb: 4 }}>
                        <li>{t('home.legal.contact.sections.supportHours.schedule')}</li>
                    </Box>
                </Box>
            </Box>
        </LegalLayout>
    );
}