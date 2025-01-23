import { Box, Paper, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';

export default function Help() {
    return (
        <Box sx={{
            width: '100%',
            maxWidth: '1200px',
            margin: '0 auto'
        }}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3
            }}>
                <Typography
                    variant="h2"
                    sx={{
                        margin: '0 auto',
                        fontSize: '1.5rem',
                        fontWeight: 500
                    }}
                >
                    Frequently Asked Questions
                </Typography>

                <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
                    <Accordion>
                        <AccordionSummary 
                            expandIcon={<span className="material-symbols-rounded">expand_more</span>}
                        >
                            <Typography
                                variant="h3"
                                sx={{
                                    fontSize: '1rem',
                                    fontWeight: 500,
                                    margin: 0
                                }}
                            >
                                How to start using Profit & Lost?
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography sx={{ lineHeight: 1.6, mb: 1 }}>
                                Starting with Profit & Lost is very easy:
                            </Typography>
                            <Typography sx={{ lineHeight: 1.6, mb: 1 }}>
                                1. Personalize your initial preferences to adapt them to your needs.
                            </Typography>
                            <Typography sx={{ lineHeight: 1.6, mb: 1 }}>
                                2. Go to the "Annual Report" section and create your categories to organize your financial movements.
                            </Typography>
                            <Typography sx={{ lineHeight: 1.6 }}>
                                3. In "Transactions", start recording your income and expenses to keep a detailed control.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion>
                        <AccordionSummary expandIcon={<span className="material-symbols-rounded">expand_more</span>}>
                            <Typography
                                variant="h3"
                                sx={{
                                    fontSize: '1rem',
                                    fontWeight: 500,
                                    margin: 0
                                }}
                            >
                                How to manage my accounts?
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography sx={{ lineHeight: 1.6, mb: 1 }}>
                                In the "Accounts" section, you have full control over your accounts. You can:
                            </Typography>
                            <Typography sx={{ lineHeight: 1.6, mb: 1 }}>
                                <ul>
                                    <li>Create new accounts for different purposes (e.g. bank accounts, savings, etc.).</li>
                                    <li>Edit existing accounts to adjust details like name or configuration.</li>
                                    <li>Customize each account with unique colors to easily identify it.</li>
                                    <li>Delete accounts that you no longer need.</li>
                                    <li>Hide accounts that you don't want to see in your reports.</li>
                                </ul>
                            </Typography>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion>
                        <AccordionSummary expandIcon={<span className="material-symbols-rounded">expand_more</span>}>
                            <Typography
                                variant="h3"
                                sx={{
                                    fontSize: '1rem',
                                    fontWeight: 500,
                                    margin: 0
                                }}
                            >
                                How do categories work?
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography sx={{ lineHeight: 1.6, mb: 1 }}>
                                Categories are the key to keeping your finances organized. With them you can:
                            </Typography>
                            <Typography sx={{ lineHeight: 1.6, mb: 1 }}>
                                <ul>
                                    <li>Create custom categories according to your needs.</li>
                                    <li>Assign colors to them to easily identify them in your graphs and reports.</li>
                                    <li>Use them to classify and analyze your financial movements effectively.</li>
                                </ul>
                            </Typography>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion>
                        <AccordionSummary expandIcon={<span className="material-symbols-rounded">expand_more</span>}>
                            <Typography
                                variant="h3"
                                sx={{
                                    fontSize: '1rem',
                                    fontWeight: 500,
                                    margin: 0
                                }}
                            >
                                How do I protect my data in Profit & Lost?
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography sx={{ lineHeight: 1.6, mb: 1 }}>
                                Profit & Lost prioritizes the security of your data:
                            </Typography>
                            <Typography sx={{ lineHeight: 1.6, mb: 1 }}>
                                <ul>
                                    <li>All information is encrypted to ensure its protection.</li>
                                    <li>You can change your password at any time from the "Security & Privacy" section.</li>
                                    <li>Activate two-factor authentication for greater security. <span className="soon-badge">SOON</span></li>
                                </ul>
                            </Typography>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion>
                        <AccordionSummary expandIcon={<span className="material-symbols-rounded">expand_more</span>}>
                            <Typography
                                variant="h3"
                                sx={{
                                    fontSize: '1rem',
                                    fontWeight: 500,
                                    margin: 0
                                }}
                            >
                                How do I view my financial reports?
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography sx={{ lineHeight: 1.6, mb: 1 }}>
                                In the "Reports" section, you can generate detailed reports that include:
                            </Typography>
                            <Typography sx={{ lineHeight: 1.6 }}>
                                <ul>
                                    <li>Monthly or annual summaries of your movements.</li>
                                    <li>Graphical analysis of your expenses and income by category.</li>
                                    <li>Download reports in formats like PDF or Excel for review at any time.</li>
                                </ul>
                            </Typography>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion>
                        <AccordionSummary expandIcon={<span className="material-symbols-rounded">expand_more</span>}>
                            <Typography
                                variant="h3"
                                sx={{
                                    fontSize: '1rem',
                                    fontWeight: 500,
                                    margin: 0
                                }}
                            >
                                Can I use Profit & Lost on my mobile?
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography sx={{ lineHeight: 1.6, mb: 1 }}>
                                Yes! Profit & Lost is optimized for mobile devices. You just need to access our platform from your mobile browser entering profit-lost.com to enjoy all the features.
                            </Typography>
                            <Typography sx={{ lineHeight: 1.6 }}>
                                <span className="soon-badge">You can put the direct access to our web on your home screen so it appears as an app on your device.</span>
                            </Typography>
                        </AccordionDetails>
                    </Accordion>

                    {/* <Accordion>
                        <AccordionSummary expandIcon={<span className="material-symbols-rounded">expand_more</span>}>
                            <h3>How do I update my subscription?</h3>
                        </AccordionSummary>
                        <AccordionDetails>
                            <p>To update your subscription, follow these steps:</p>
                            <ul>
                                <li>Access the "Billing" section in your profile.</li>
                                <li>Select the plan that best suits your needs.</li>
                                <li>Confirm the change and enjoy the additional benefits.</li>
                            </ul>
                        </AccordionDetails>
                    </Accordion> */}


                    <Accordion>
                        <AccordionSummary expandIcon={<span className="material-symbols-rounded">expand_more</span>}>
                            <Typography
                                variant="h3"
                                sx={{
                                    fontSize: '1rem',
                                    fontWeight: 500,
                                    margin: 0
                                }}
                            >
                                How do I contact support?
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography sx={{ lineHeight: 1.6, mb: 1 }}>
                                Our support team is here to help you. You can contact us through:
                            </Typography>
                            <Typography sx={{ lineHeight: 1.6 }}>
                                <ul>
                                    <li>Email: support@profit-lost.com</li>
                                    <li>Consult our online documentation to find detailed guides and quick solutions.</li>
                                </ul>
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                </Paper>
            </Box>
        </Box>
    );
}