import { Typography, Box } from '@mui/material';
import LegalLayout from './components/LegalLayout';

export default function CookiePolicy() {
    return (
        <LegalLayout title="Política de Cookies">
            <Typography sx={{ mb: 4 }}>
                Last update: 1/18/2025
            </Typography>

            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                1. What are cookies?
            </Typography>
            <Typography >
                Cookies are small text files that are stored on your device when you visit our website.
                They allow us to remember your preferences and improve your navigation experience.
            </Typography>

            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                2. Legal basis
            </Typography>
            <Typography >
                In compliance with the Law 34/2002, of the Information Society and Electronic Commerce Service (LSSI-CE),
                and the General Data Protection Regulation (GDPR) 2016/679, we inform you about the use of cookies on our website.
            </Typography>

            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                3. Types of cookies we use
            </Typography>
            <Box component="ul" sx={{ pl: 4, mb: 4 }}>
                <li>
                    <Typography component="span" fontWeight="bold">Technical cookies (necessary):</Typography>
                    {' '}They allow navigation and the use of basic functions.
                </li>
                <li>
                    <Typography component="span" fontWeight="bold">Analytical cookies:</Typography>
                    {' '}They help us understand how users interact with the website (Google Analytics).
                </li>
            </Box>

            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                4. Cookies management
            </Typography>
            <Typography >
                You can configure your browser to reject all cookies or to receive a notification when a cookie is sent.
                However, some features of our website may not work correctly without cookies.
            </Typography>

            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                5. Third-party cookies
            </Typography>
            <Typography >
                We use third-party services that may set cookies on your device:
            </Typography>
            <Box component="ul" sx={{ pl: 4, mb: 4 }}>
                <li>Google Analytics: website usage analysis</li>
            </Box>

            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                6. Cookies retention period
            </Typography>
            <Typography >
                Session cookies are deleted when the browser is closed.
                Persistent cookies remain on your device for a maximum period of 24 months.
            </Typography>

            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                7. Your rights
            </Typography>
            <Typography >
                You can exercise your rights of access, rectification, deletion and opposition by contacting:
            </Typography>
            <Box component="ul" sx={{ pl: 4, mb: 4 }}>
                <li>Email: support@profit-lost.com</li>
                <li>Website: https://profit-lost.com</li>
            </Box>

            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                8. Modifications
            </Typography>
            <Typography >
                We reserve the right to update this cookie policy at any time.
                The changes will come into force immediately after their publication on the website.
            </Typography>
        </LegalLayout>
    );
} 