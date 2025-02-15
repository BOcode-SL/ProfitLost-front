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
        { text: t('home.footer.links.contact'), href: '/contact' },
        { text: 'Blog', href: '/blog' } // Añadido el link al blog
    ];

    return (
        <Box
            component="footer"
            sx={{
                bgcolor: '#F7F7F7',
                py: { xs: 4, sm: 6 },
                mt: 'auto'
            }}
        >
            <Container maxWidth="lg">
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={{ xs: 3, md: 4 }}
                    justifyContent="space-between"
                    alignItems={{ xs: 'flex-start', md: 'flex-start' }}
                >
                    {/* Logo and Description Section */}
                    <Box sx={{ width: { xs: '100%', md: '60%' } }}>
                        <Box
                            component="img"
                            src="https://res.cloudinary.com/dnhlagojg/image/upload/v1726670794/AppPhotos/Brand/logoPL3.svg"
                            alt="logo"
                            sx={{
                                width: { xs: 150, sm: 200 },
                                mb: { xs: 1.5, sm: 2 },
                                height: 'auto',
                                display: 'block',
                                marginLeft: { xs: 'auto', md: 0 },
                                marginRight: { xs: 'auto', md: 0 },
                                textAlign: { xs: 'center', md: 'left' }
                            }}
                        />
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                fontSize: { xs: '0.85rem', sm: '0.9rem' },
                                width: { xs: '100%', md: '80%' },
                                lineHeight: 1.6
                            }}
                        >
                            {t('home.footer.description')}
                        </Typography>
                    </Box>

                    {/* Links Section */}
                    <Box sx={{
                        textAlign: { xs: 'left', md: 'right' },
                        minWidth: { md: '200px' }
                    }}>
                        <Typography
                            variant="h6"
                            gutterBottom
                            sx={{
                                fontSize: { xs: '1.1rem', sm: '1.25rem' },
                                mb: { xs: 1, sm: 2 }
                            }}
                        >
                            {t('home.footer.company')}
                        </Typography>
                        <List sx={{ p: 0 }}>
                            {footerLinks.map(({ text, href }) => (
                                <ListItem
                                    key={text}
                                    sx={{
                                        p: 0,
                                        mb: { xs: 1, sm: 1.5 },
                                        justifyContent: { xs: 'flex-start', md: 'flex-end' }
                                    }}
                                >
                                    {href.startsWith('mailto:') ? (
                                        <a href={href} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            <ListItemText
                                                primary={text}
                                                primaryTypographyProps={{
                                                    sx: {
                                                        fontSize: { xs: '0.85rem', sm: '0.9rem' },
                                                        '&:hover': { color: '#fe6f14' }
                                                    }
                                                }}
                                            />
                                        </a>
                                    ) : (
                                        <Link to={href} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            <ListItemText
                                                primary={text}
                                                primaryTypographyProps={{
                                                    sx: {
                                                        fontSize: { xs: '0.85rem', sm: '0.9rem' },
                                                        '&:hover': { color: '#fe6f14' }
                                                    }
                                                }}
                                            />
                                        </Link>
                                    )}
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </Stack>

                {/* Copyright Section */}
                <Box
                    sx={{
                        mt: { xs: 3, sm: 4 },
                        pt: { xs: 2, sm: 4 },
                        borderTop: 1,
                        borderColor: 'divider',
                        textAlign: 'center'
                    }}
                >
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            fontSize: { xs: '0.8rem', sm: '0.85rem' }
                        }}
                    >
                        {t('home.footer.copyright')} {' '}
                        <a
                            href="https://brian-novoa.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                color: '#fe6f14',
                                textDecoration: 'none'
                            }}
                        >
                            Brian G. Novoa
                        </a>
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}