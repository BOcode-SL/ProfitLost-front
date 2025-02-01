import { Box, Paper, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function Help() {
    const { t } = useTranslation();
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
                    {t('dashboard.settings.help.faq')}
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
                                {t('dashboard.settings.help.howToStart')}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography sx={{ lineHeight: 1.6, mb: 1 }}>
                                {t('dashboard.settings.help.howToStartDescription')}
                            </Typography>
                            <Typography sx={{ lineHeight: 1.6, mb: 1 }}>
                                {t('dashboard.settings.help.howToStartStep1')}
                            </Typography>
                            <Typography sx={{ lineHeight: 1.6, mb: 1 }}>
                                {t('dashboard.settings.help.howToStartStep2')}
                            </Typography>
                            <Typography sx={{ lineHeight: 1.6 }}>
                                {t('dashboard.settings.help.howToStartStep3')}
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
                                {t('dashboard.settings.help.manageAccounts')}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography sx={{ lineHeight: 1.6, mb: 1 }}>
                                {t('dashboard.settings.help.manageAccountsDescription')}
                            </Typography>
                            <Typography sx={{ lineHeight: 1.6, mb: 1 }}>
                                <ul>
                                    <li>{t('dashboard.settings.help.manageAccountsStep1')}</li>
                                    <li>{t('dashboard.settings.help.manageAccountsStep2')}</li>
                                    <li>{t('dashboard.settings.help.manageAccountsStep3')}</li>
                                    <li>{t('dashboard.settings.help.manageAccountsStep4')}</li>
                                    <li>{t('dashboard.settings.help.manageAccountsStep5')}</li>
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
                                {t('dashboard.settings.help.categoriesWork')}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography sx={{ lineHeight: 1.6, mb: 1 }}>
                                {t('dashboard.settings.help.categoriesWorkDescription')}
                            </Typography>
                            <Typography sx={{ lineHeight: 1.6, mb: 1 }}>
                                <ul>
                                    <li>{t('dashboard.settings.help.categoriesWorkStep1')}</li>
                                    <li>{t('dashboard.settings.help.categoriesWorkStep2')}</li>
                                    <li>{t('dashboard.settings.help.categoriesWorkStep3')}</li>
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
                                {t('dashboard.settings.help.protectData')}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography sx={{ lineHeight: 1.6, mb: 1 }}>
                                {t('dashboard.settings.help.protectDataDescription')}
                            </Typography>
                            <Typography sx={{ lineHeight: 1.6, mb: 1 }}>
                                <ul>
                                    <li>{t('dashboard.settings.help.protectDataStep1')}</li>
                                    <li>{t('dashboard.settings.help.protectDataStep2')}</li>
                                    <li>{t('dashboard.settings.help.protectDataStep3')}<span className="soon-badge">SOON</span></li>
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
                                {t('dashboard.settings.help.viewReports')}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography sx={{ lineHeight: 1.6, mb: 1 }}>
                                {t('dashboard.settings.help.viewReportsDescription')}
                            </Typography>
                            <Typography sx={{ lineHeight: 1.6 }}>
                                <ul>
                                    <li>{t('dashboard.settings.help.viewReportsStep1')}</li>
                                    <li>{t('dashboard.settings.help.viewReportsStep2')}</li>
                                    <li>{t('dashboard.settings.help.viewReportsStep3')}</li>
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
                                {t('dashboard.settings.help.mobileUsage')}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography sx={{ lineHeight: 1.6, mb: 1 }}>
                                {t('dashboard.settings.help.mobileUsageDescription')}
                            </Typography>
                            <Typography sx={{ lineHeight: 1.6 }}>
                               {t('dashboard.settings.help.mobileUsageStep1')}
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
                                {t('dashboard.settings.help.contactSupport')}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography sx={{ lineHeight: 1.6, mb: 1 }}>
                                {t('dashboard.settings.help.contactSupportDescription')}
                            </Typography>
                            <Typography sx={{ lineHeight: 1.6 }}>
                                <ul>
                                    <li>{t('dashboard.settings.help.contactSupportStep1')}</li>
                                    <li>{t('dashboard.settings.help.contactSupportStep2')}</li>
                                </ul>
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                </Paper>
            </Box>
        </Box>
    );
}