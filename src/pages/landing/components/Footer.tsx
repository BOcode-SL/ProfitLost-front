import { Box, Container, Stack, List, ListItem, ListItemText, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Define the Footer component
export default function Footer() {
    const { t } = useTranslation();

    // Define footer links with their corresponding text and href attributes
    const footerLinks = [
        { text: t('home.footer.links.privacy'), href: '/privacy' },
        { text: t('home.footer.links.terms'), href: '/terms' },
        { text: t('home.footer.links.legal'), href: '/legal' },
        { text: t('home.footer.links.cookies'), href: '/cookies' },
        { text: t('home.footer.links.contact'), href: '/contact' }
    ];

    return (
        // Main footer container with background color and vertical padding
        <Box component="footer" sx={{ bgcolor: '#F7F7F7', py: 6 }}>
            <Container maxWidth="lg">
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={4}
                    justifyContent="space-between"
                >
                    <Box>
                        {/* Logo image displayed in the footer */}
                        <Box
                            component="img"
                            src="https://res.cloudinary.com/dnhlagojg/image/upload/v1726670794/AppPhotos/Brand/logoPL3.svg"
                            alt="logo"
                            sx={{ width: 200, mb: 2 }}
                        />
                        {/* Description text for the footer */}
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem', width: '60%' }}>
                            {t('home.footer.description')}
                        </Typography>
                    </Box>
                    <Box sx={{
                        textAlign: { xs: 'left', md: 'right' },
                        minWidth: { md: '200px' }
                    }}>
                        <Typography variant="h6" gutterBottom>
                            {t('home.footer.company')}
                        </Typography>
                        <List>
                            {/* Iterate through footer links to create list items */}
                            {footerLinks.map(({ text, href }) => (
                                <ListItem
                                    key={text}
                                    sx={{
                                        p: 0,
                                        justifyContent: { xs: 'flex-start', md: 'flex-end' }
                                    }}
                                >
                                    {/* Render links conditionally based on href */}
                                    {href.startsWith('mailto:') ? (
                                        <a href={href}>
                                            <ListItemText primary={text} />
                                        </a>
                                    ) : (
                                        <Link to={href} style={{ textDecoration: 'none' }}>
                                            <ListItemText primary={text} />
                                        </Link>
                                    )}
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </Stack>
                {/* Section for copyright information */}
                <Box
                    sx={{
                        mt: 4,
                        pt: 4,
                        borderTop: 1,
                        borderColor: 'divider',
                        textAlign: 'center'
                    }}
                >
                    <Typography variant="body2" color="text.secondary">
                        {t('home.footer.copyright')} {' '}
                        <a
                            href="https://brian-novoa.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#fe6f14' }}
                        >
                            Brian G. Novoa
                        </a>
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}