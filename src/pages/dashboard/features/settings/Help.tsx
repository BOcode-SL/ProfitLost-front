import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

import './Help.scss';

export default function Help() {
    return (
        <Box className="help-container">
            <Box className="help-content">
                <h2>Frequently Asked Questions</h2>

                <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                    <Accordion >
                        <AccordionSummary expandIcon={<span className="material-symbols-rounded">expand_more</span>}>
                            <h3>How to start using Profit & Lost?</h3>
                        </AccordionSummary>
                        <AccordionDetails>
                            <p>Starting with Profit & Lost is very easy:</p>
                            <p>1. Personalize your initial preferences to adapt them to your needs.</p>
                            <p>2. Go to the "Annual Report" section and create your categories to organize your financial movements.</p>
                            <p>3. In "Transactions", start recording your income and expenses to keep a detailed control.</p>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion>
                        <AccordionSummary expandIcon={<span className="material-symbols-rounded">expand_more</span>}>
                            <h3>How to manage my accounts?</h3>
                        </AccordionSummary>
                        <AccordionDetails>
                            <p>In the "Accounts" section, you have full control over your accounts. You can:</p>
                            <ul>
                                <li>Create new accounts for different purposes (e.g. bank accounts, savings, etc.).</li>
                                <li>Edit existing accounts to adjust details like name or configuration.</li>
                                <li>Customize each account with unique colors to easily identify it.</li>
                                <li>Delete accounts that you no longer need.</li>
                                <li>Hide accounts that you don't want to see in your reports.</li>
                            </ul>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion>
                        <AccordionSummary expandIcon={<span className="material-symbols-rounded">expand_more</span>}>
                            <h3>How do categories work?</h3>
                        </AccordionSummary>
                        <AccordionDetails>
                            <p>Categories are the key to keeping your finances organized. With them you can:</p>
                            <ul>
                                <li>Create custom categories according to your needs.</li>
                                <li>Assign colors to them to easily identify them in your graphs and reports.</li>
                                <li>Use them to classify and analyze your financial movements effectively.</li>
                            </ul>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion>
                        <AccordionSummary expandIcon={<span className="material-symbols-rounded">expand_more</span>}>
                            <h3>How do I protect my data in Profit & Lost?</h3>
                        </AccordionSummary>
                        <AccordionDetails>
                            <p>Profit & Lost prioritizes the security of your data:</p>
                            <ul>
                                <li>All information is encrypted to ensure its protection.</li>
                                <li>You can change your password at any time from the "Security & Privacy" section.</li>
                                <li>Activate two-factor authentication for greater security. <span className="soon-badge">SOON</span></li>
                            </ul>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion>
                        <AccordionSummary expandIcon={<span className="material-symbols-rounded">expand_more</span>}>
                            <h3>How do I view my financial reports?</h3>
                        </AccordionSummary>
                        <AccordionDetails>
                            <p>In the "Reports" section, you can generate detailed reports that include:</p>
                            <ul>
                                <li>Monthly or annual summaries of your movements.</li>
                                <li>Graphical analysis of your expenses and income by category.</li>
                                <li>Download reports in formats like PDF or Excel for review at any time.</li>
                            </ul>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion>
                        <AccordionSummary expandIcon={<span className="material-symbols-rounded">expand_more</span>}>
                            <h3>Can I use Profit & Lost on my mobile?</h3>
                        </AccordionSummary>
                        <AccordionDetails>
                            <p>Yes! Profit & Lost is optimized for mobile devices. You just need to access our platform from your mobile browser entering profit-lost.com to enjoy all the features.</p>
                            <span className="soon-badge">You can put the direct access to our web on your home screen so it appears as an app on your device.</span>
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
                            <h3>How do I contact support?</h3>
                        </AccordionSummary>
                        <AccordionDetails>
                            <p>Our support team is here to help you. You can contact us through:</p>
                            <ul>
                                <li>Email: support@profit-lost.com</li>
                                <li>Consult our online documentation to find detailed guides and quick solutions.</li>
                            </ul>
                        </AccordionDetails>
                    </Accordion>
                </Paper>
            </Box>
        </Box >
    );
}