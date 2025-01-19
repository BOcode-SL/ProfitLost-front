import { Typography, Box } from '@mui/material';
import LegalLayout from './components/LegalLayout';

export default function PrivacyPolicy() {
    return (
        <LegalLayout title="Privacy Policy">
            <Typography sx={{ mb: 4 }}>
                Last updated: 1/18/2025
            </Typography>

            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                1. Responsible for the Treatment
            </Typography>
            <Typography >
                In accordance with the General Data Protection Regulation (EU) 2016/679:
            </Typography>
            <Box component="ul" sx={{ pl: 4, mb: 4 }}>
                <li>Responsable: Brian González Novoa</li>
                <li>Email: support@profit-lost.com</li>
                <li>Website: https://profit-lost.com</li>
            </Box>

            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                2. Information we collect
            </Typography>
            <Typography >
                In Profit&Lost, we collect and process:
            </Typography>
            <Box component="ul" sx={{ pl: 4, mb: 4 }}>
                <li>Identifying data: email and username</li>
                <li>Financial data voluntarily introduced</li>
                <li>Usage and analytical data</li>
                <li>Technical and analytical cookies</li>
                <li>IP address and browser data</li>
            </Box>

            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                3. Legal basis for the treatment
            </Typography>
            <Typography>
                We process your personal data based on:
            </Typography>
            <Box component="ul" sx={{ pl: 4, mb: 4 }}>
                <li>The execution of the service contract (Art. 6.1.b RGPD)</li>
                <li>Your explicit consent (Art. 6.1.a RGPD)</li>
                <li>Our legitimate interest in improving our services (Art. 6.1.f RGPD)</li>
                <li>Compliance with legal obligations (Art. 6.1.c RGPD)</li>
            </Box>

            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                4. Purpose of the Treatment
            </Typography>
            <Typography>
                Your data will be processed with the following specific purposes:
            </Typography>
            <Box component="ul" sx={{ pl: 4, mb: 4 }}>
                <li>Manage your account and provide our services</li>
                <li>Process and visualize your financial data</li>
                <li>Improve and personalize your experience</li>
                <li>Send communications about the service</li>
                <li>Comply with legal obligations</li>
                <li>Fraud prevention and platform security</li>
                <li>Statistical analysis and service improvement</li>
            </Box>

            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                5. ARCO+ Rights
            </Typography>
            <Typography >
                You can exercise your rights of:
            </Typography>
            <Box component="ul" sx={{ pl: 4, mb: 4 }}>
                <li>Access to your personal data</li>
                <li>Rectification of inaccurate data</li>
                <li>Cancellation (deletion) of your data</li>
                <li>Opposition to the treatment</li>
                <li>Limitation of the treatment</li>
                <li>Portability of your data</li>
            </Box>

            <Typography >
                To exercise these rights, contact support@profit-lost.com.
                You also have the right to make a complaint to the Spanish Data Protection Agency (www.aepd.es).
            </Typography>

            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                6. Data retention
            </Typography>
            <Typography >
                We will retain your personal data while:
            </Typography>
            <Box component="ul" sx={{ pl: 4, mb: 4 }}>
                <li>Maintain an active account</li>
                <li>Necessary to comply with legal obligations</li>
                <li>Necessary to protect our legal interests</li>
            </Box>

            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                7. Security measures
            </Typography>
            <Typography >
                We implement technical and organizational measures appropriate to ensure an adequate level of security, including:
            </Typography>
            <Box component="ul" sx={{ pl: 4, mb: 4 }}>
                <li>Data encryption</li>
                <li>Restricted access to personal data</li>
                <li>Regular backups</li>
                <li>Security monitoring</li>
            </Box>

            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                8. Minors
            </Typography>
            <Typography >
                Our services are not directed to minors under 18 years of age. We do not knowingly collect
                intencionadamente information personal of minors. If you are aware that a minor has provided
                personal information to us, please contact us and we will proceed to its deletion.
            </Typography>

            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                9. Modifications
            </Typography>
            <Typography >
                We reserve the right to modify this privacy policy.
                Changes will be published on this page and, in case of substantial modifications,
                we will notify you by email.
            </Typography>

            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                10. Contact
            </Typography>
            <Typography >
                For any privacy-related questions: support@profit-lost.com
            </Typography>

        </LegalLayout>
    );
} 