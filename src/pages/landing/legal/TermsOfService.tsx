import { Typography, Box } from '@mui/material';

// Components
import LegalLayout from './components/LegalLayout';

// Terms of Service page
export default function TermsOfService() {
    return (
        <LegalLayout title="Terms of Service">
            {/* Last updated date */}
            <Typography sx={{ mb: 4 }}>
                Last updated: 09/02/2025
            </Typography>

            {/* Section 1: Acceptance of the Terms */}
            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                1. Acceptance of the Terms
            </Typography>
            <Typography >
                By accessing and using Profit&Lost, you agree to be bound by these terms of service. If you do not agree with any part of the terms, you will not be able to access the service.
            </Typography>

            {/* Section 2: Service description */}
            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                2. Service description
            </Typography>
            <Typography >
                Profit&Lost is a web application for the management and visualization of personal financial data. The service is provided "as is" and "as available".
            </Typography>

            {/* Section 3: Registration and Account */}
            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                3. Registration and Account
            </Typography>
            <Box component="ul" sx={{ pl: 4, mb: 4 }}>
                <li>The registration information must be accurate and up-to-date</li>
                <li>You are responsible for maintaining the security of your account</li>
                <li>You must not share your access credentials</li>
            </Box>

            {/* Section 4: European User Rights */}
            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                4. European User Rights
            </Typography>
            <Typography >
                According to EU legislation, you have the right to:
            </Typography>
            <Box component="ul" sx={{ pl: 4, mb: 4 }}>
                <li>Cancel your subscription within 14 days after the purchase</li>
                <li>Receive all the information about the service in a clear and understandable way</li>
                <li>Access, correct or delete your personal data</li>
                <li>Present a complaint to the competent data protection authority</li>
                <li>Resolve disputes through the ODR platform of the EU (Online Dispute Resolution)</li>
            </Box>

            {/* Section 5: Conflict Resolution in the EU */}
            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                5. Conflict Resolution in the EU
            </Typography>
            <Typography >
                For users in the EU:
            </Typography>
            <Box component="ul" sx={{ pl: 4, mb: 4 }}>
                <li>You can access the online conflict resolution platform of the EU at: http://ec.europa.eu/consumers/odr/</li>
                <li>You have the right to present complaints to the consumer authority of your country</li>
                <li>You can choose the legislation of your country of residence for any dispute</li>
            </Box>

            {/* Section 6: Rights and Restrictions */}
            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                6. Rights and Restrictions
            </Typography>
            <Typography >
                We reserve the right to:
            </Typography>
            <Box component="ul" sx={{ pl: 4, mb: 4 }}>
                <li>Modify or interrupt the service without prior notice</li>
                <li>Reject the service to any user</li>
                <li>Delete content that violates these terms</li>
                <li>Update prices with 30 days prior notice</li>
            </Box>

            {/* Section 7: Data Protection */}
            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                7. Data Protection
            </Typography>
            <Typography >
                The processing of personal data is governed by our Privacy Policy, in compliance with the RGPD (UE) 2016/679.
            </Typography>

            {/* Section 8: Limitation of Liability */}
            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                8. Limitation of Liability
            </Typography>
            <Typography >
                In the maximum extent permitted by law, Profit&Lost will not be responsible for:
            </Typography>
            <Box component="ul" sx={{ pl: 4, mb: 4 }}>
                <li>Indirect or consequential damages</li>
                <li>Loss of data or service interruption</li>
                <li>Financial decisions based on the information provided</li>
            </Box>

            {/* Section 9: Modifications */}
            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                9. Modifications
            </Typography>
            <Typography >
                We reserve the right to modify these terms at any time. The changes will come into effect immediately after their publication.
            </Typography>

            {/* Section 10: Applicable Law and Jurisdiction */}
            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                10. Applicable Law and Jurisdiction
            </Typography>
            <Typography >
                For users in the EU, these terms are governed by Spanish law and applicable European legislation. Notwithstanding the mandatory legislation of the user's country of residence, any dispute will be subject to:
            </Typography>
            <Box component="ul" sx={{ pl: 4, mb: 4 }}>
                <li>The jurisdiction of the Spanish courts</li>
                <li>The alternative dispute resolution mechanisms available in the EU</li>
                <li>The consumer protection legislation of the user's country of residence</li>
            </Box>

            {/* Section 11: Validity and Nullity */}
            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                11. Validity and Nullity
            </Typography>
            <Typography >
                If any provision of these terms is declared null or inapplicable, such nullity will not affect the remaining provisions, which will remain fully effective and binding.
            </Typography>

            {/* Section 12: Contact */}
            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                12. Contact
            </Typography>
            <Typography paragraph>
                For any questions about these terms, contact: support@profit-lost.com
            </Typography>
        </LegalLayout>
    );
} 