/**
 * Footer Component
 * 
 * Site-wide footer displayed at the bottom of landing pages.
 * Contains logo, company description, legal links, and copyright information.
 * Responsive layout that adapts to different screen sizes.
 * 
 * @module Footer
 */
import { Box, Container, Stack, List, ListItem, ListItemText, Typography, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * Footer component for landing pages
 * 
 * Provides consistent site-wide footer with company branding,
 * legal/policy links, and copyright attribution.
 * Adjusts layout responsively based on screen dimensions.
 * 
 * @returns {JSX.Element} The rendered footer component
 */
export default function Footer() {
    const { t } = useTranslation();

    /**
     * Navigation links configuration for the footer
     * Each item contains translated text and target route
     */
    const footerLinks = [
        { text: t('home.footer.links.privacy'), href: '/privacy' },
        { text: t('home.footer.links.terms'), href: '/terms' },
        { text: t('home.footer.links.legal'), href: '/legal' },
        { text: t('home.footer.links.cookies'), href: '/cookies' },
        { text: t('home.footer.links.contact'), href: '/contact' }
    ];

    return (
        <Box
            component="footer"
            sx={{
                bgcolor: '#f8f9fa',
                pb: { xs: 3, sm: 4 },
                mt: 'auto',
                position: 'relative',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent 0%, rgba(254, 111, 20, 0.2) 50%, transparent 100%)'
                }
            }}
        >
            <Divider sx={{
                mb: { xs: 3, sm: 4 },
                borderColor: 'rgba(254, 111, 20, 0.1)'
            }} />
            <Container maxWidth="lg">
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={{ xs: 4, sm: 5, md: 6 }}
                    justifyContent="space-between"
                    alignItems={{ xs: 'center', md: 'flex-start' }}
                >
                    {/* Logo and company description section */}
                    <Box sx={{
                        width: { xs: '100%', md: '60%' },
                        px: { xs: 2, sm: 0 },
                        textAlign: { xs: 'center', md: 'left' }
                    }}>
                        <Box
                            component="img"
                            src="/logo/logoTextMix.svg"
                            alt="logo"
                            sx={{
                                width: { xs: 80, sm: 100, md: 120 },
                                mb: { xs: 2, sm: 3 },
                                height: 'auto',
                                display: 'block',
                                marginLeft: { xs: 'auto', md: 0 },
                                marginRight: { xs: 'auto', md: 0 },
                                transition: 'transform 0.2s ease-in-out',
                                '&:hover': {
                                    transform: 'scale(1.05)'
                                }
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
                                mx: { xs: 'auto', md: 0 },
                                opacity: 0.8
                            }}
                        >
                            {t('home.footer.description')}
                        </Typography>
                    </Box>

                    {/* Legal and navigation links section */}
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
                                fontWeight: 600,
                                color: '#333'
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
                                    {/* External links (mailto) vs internal router links */}
                                    {href.startsWith('mailto:') ? (
                                        <a href={href} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            <ListItemText
                                                primary={text}
                                                primaryTypographyProps={{
                                                    sx: {
                                                        fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.95rem' },
                                                        '&:hover': {
                                                            color: '#fe6f14',
                                                            transform: 'translateX(2px)'
                                                        },
                                                        transition: 'all 0.2s ease',
                                                        cursor: 'pointer'
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
                                                        '&:hover': {
                                                            color: '#fe6f14',
                                                            transform: 'translateX(2px)'
                                                        },
                                                        transition: 'all 0.2s ease',
                                                        cursor: 'pointer'
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

                {/* Copyright and attribution section */}
                <Box
                    sx={{
                        mt: { xs: 4, sm: 5 },
                        pt: { xs: 2, sm: 3 },
                        borderTop: 1,
                        borderColor: 'rgba(254, 111, 20, 0.1)',
                        textAlign: 'center'
                    }}
                >
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' },
                            py: { xs: 1, md: 0 },
                            opacity: 0.7
                        }}
                    >
                        {t('home.footer.copyright')} {' '}
                        <a
                            href="https://brian-novoa.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                color: '#fe6f14',
                                textDecoration: 'none',
                                fontWeight: 500,
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.05)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
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