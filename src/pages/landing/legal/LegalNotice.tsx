import { Typography, Box } from '@mui/material';

// Components
import LegalLayout from './components/LegalLayout';

// Legal Notice page
export default function LegalNotice() {
    return (
        <LegalLayout title="Legal Notice">
            {/* Last updated date */}
            <Typography sx={{ mb: 4 }}>
                Last updated: 09/02/2025
            </Typography>

            {/* Section 1: Title information */}
            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                1. Title information
            </Typography>
            <Typography>
                In compliance with the Law 34/2002, of the Information Society and Electronic Commerce Service (LSSI-CE):
            </Typography>
            <Box component="ul" sx={{ pl: 4, mb: 4 }}>
                <li>Titular: Brian González Novoa</li>
                <li>Email: support@profit-lost.com</li>
                <li>Sitio Web: https://profit-lost.com</li>
            </Box>

            {/* Section 2: Object and scope of application */}
            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                2. Object and scope of application
            </Typography>
            <Typography>
                Profit&Lost is a web application dedicated to the management and visualization of personal financial data.
                This legal notice regulates the use of the website and the profit-lost.com application.
            </Typography>

            {/* Section 3: Intellectual and industrial property */}
            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                3. Intellectual and industrial property
            </Typography>
            <Typography>
                All intellectual and industrial property rights of this website, including its source code,
                design, navigation structure, databases and content, are property of Profit&Lost or have licenses for their use.
            </Typography>

            {/* Section 4: Use conditions */}
            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                4. Use conditions
            </Typography>
            <Typography>The user commits to:</Typography>
            <Box component="ul" sx={{ pl: 4, mb: 4 }}>
                <li>Not to perform illegal or contrary to good faith activities</li>
                <li>Not to disseminate content or propaganda of racist or xenophobic character</li>
                <li>Not to cause technical problems to the platform</li>
                <li>Not to use the platform to send advertising</li>
            </Box>

            {/* Section 5: Responsibility */}
            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                5. Responsibility
            </Typography>
            <Typography >
                Profit&Lost is not responsible for:
            </Typography>
            <Box component="ul" sx={{ pl: 4, mb: 4 }}>
                <li>Decisions based on the information provided</li>
                <li>The continuity and availability of the service</li>
                <li>The presence of viruses or malicious programs</li>
                <li>The improper use of the platform by third parties</li>
            </Box>

            {/* Section 6: Applicable legislation */}
            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                6. Applicable legislation
            </Typography>
            <Typography >
                This legal notice is governed by the Spanish and European legislation.
                Any controversy will be resolved in the courts of Spain,
                without prejudice to the jurisdiction that corresponds according to consumer legislation.
            </Typography>

            {/* Section 7: Modifications */}
            <Typography variant="h2" gutterBottom sx={{ fontSize: '1.75rem', mt: 4 }}>
                7. Modifications
            </Typography>
            <Typography >
                We reserve the right to modify this legal notice at any time.
                The changes will come into force from their publication on the website.
            </Typography>
        </LegalLayout>
    );
}