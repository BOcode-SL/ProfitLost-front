import { Typography, Box, Link } from '@mui/material';

import LegalLayout from './components/LegalLayout';

export default function Contact() {
    return (
        <LegalLayout title="Contact">
            <Box sx={{ maxWidth: 800 }}>
                <Typography paragraph sx={{ mb: 4 }}>
                    If you have any questions or suggestions, we are here to help you.
                    Our team is committed to providing the best support possible to all our users.
                </Typography>

                <Box sx={{ mb: 6 }}>
                    <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem' }}>
                        Technical Support
                    </Typography>
                    <Typography>
                        For technical questions, application issues or general help:
                    </Typography>
                    <Link href="mailto:support@profit-lost.com">support@profit-lost.com</Link>
                    <Typography variant="body2" color="text.secondary">
                        Usual response time: 24-48 hours working days
                    </Typography>
                </Box>

                <Box sx={{ mb: 6 }}>
                    <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem' }}>
                        Support Hours
                    </Typography>
                    <Box component="ul" sx={{ pl: 4, mb: 4 }}>
                        <li>Monday to Friday: 9:00 - 18:00 (CET)</li>
                    </Box>
                </Box>
            </Box>
        </LegalLayout>
    );
}