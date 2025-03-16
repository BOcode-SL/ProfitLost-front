import { Box, Container, Stack, List, ListItem, ListItemText, Typography, Divider } from '@mui/material';
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
        { text: 'Blog', href: '/blog' }
    ];

    return (
        <Box
            component="footer"
            sx={{
                bgcolor: '#F7F7F7',
                pb: { xs: 3, sm: 4 },
                mt: 'auto'
            }}
        >
            <Divider sx={{ mb: { xs: 3, sm: 4 } }} />
            <Container maxWidth="lg">
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={{ xs: 4, sm: 5, md: 6 }}
                    justifyContent="space-between"
                    alignItems={{ xs: 'center', md: 'flex-start' }}
                >
                    {/* Logo and Description Section */}
                    <Box sx={{ 
                        width: { xs: '100%', md: '60%' },
                        px: { xs: 2, sm: 0 },
                        textAlign: { xs: 'center', md: 'left' }
                    }}>
                        <Box
                            component="img"
                            src="https://res.cloudinary.com/dnhlagojg/image/upload/v1726670794/AppPhotos/Brand/logoPL3.svg"
                            alt="logo"
                            sx={{
                                width: { xs: 160, sm: 160, md: 200 },
                                mb: { xs: 2, sm: 3 },
                                height: 'auto',
                                display: 'block',
                                marginLeft: { xs: 'auto', md: 0 },
                                marginRight: { xs: 'auto', md: 0 }
                            }}
                        />
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.95rem' },
                                width: { xs: '100%', sm: '90%', md: '80%' },
                                lineHeight: 1.7,
                                mb: 2,
                                mx: { xs: 'auto', md: 0 }
                            }}
                        >
                            {t('home.footer.description')}
                        </Typography>
                    </Box>

                    {/* Links Section */}
                    <Box sx={{
                        textAlign: { xs: 'center', md: 'right' },
                        minWidth: { sm: '180px', md: '220px' },
                        width: { xs: '100%', md: 'auto' }
                    }}>
                        <Typography
                            variant="h6"
                            gutterBottom
                            sx={{
                                fontSize: { xs: '1.1rem', sm: '1.2rem', md: '1.25rem' },
                                mb: { xs: 1.5, sm: 2 },
                                fontWeight: 600
                            }}
                        >
                            {t('home.footer.company')}
                        </Typography>
                        <List sx={{ 
                            p: 0,
                            display: { xs: 'flex', md: 'block' },
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            gap: { xs: 1, sm: 2 }
                        }}>
                            {footerLinks.map(({ text, href }) => (
                                <ListItem
                                    key={text}
                                    sx={{
                                        p: 0,
                                        mb: { xs: 0.5, sm: 1, md: 1.5 },
                                        justifyContent: { xs: 'center', md: 'flex-end' },
                                        width: { xs: 'auto', md: '100%' },
                                        mx: { xs: 1, md: 0 }
                                    }}
                                >
                                    {href.startsWith('mailto:') ? (
                                        <a href={href} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            <ListItemText
                                                primary={text}
                                                primaryTypographyProps={{
                                                    sx: {
                                                        fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.95rem' },
                                                        '&:hover': { color: '#fe6f14' },
                                                        transition: 'color 0.2s ease'
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
                                                        fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.95rem' },
                                                        '&:hover': { color: '#fe6f14' },
                                                        transition: 'color 0.2s ease'
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
                        mt: { xs: 4, sm: 5 },
                        pt: { xs: 2, sm: 3 },
                        borderTop: 1,
                        borderColor: 'divider',
                        textAlign: 'center'
                    }}
                >
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' },
                            py: { xs: 1, md: 0 }
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