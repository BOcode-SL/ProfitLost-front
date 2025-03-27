import { Box, Container, Typography, Avatar, IconButton, Link } from '@mui/material';
import { useTranslation } from 'react-i18next';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Team = () => {
    const { t } = useTranslation();

    const teamMembers = [
        {
            name: 'Brian Novoa',
            role: 'Founder & Developer',
            image: 'https://res.cloudinary.com/dnhlagojg/image/upload/v1739794876/AppPhotos/Team/brian.jpg',
            bio: t('home.team.brian.bio'),
            social: {
                github: 'https://github.com/brianglezn',
                linkedin: 'https://www.linkedin.com/in/brianglezn/'
            }
        },
        {
            name: 'Oscar Blanco',
            role: 'Developer',
            image: 'https://res.cloudinary.com/dnhlagojg/image/upload/v1739794876/AppPhotos/Team/oscar.jpg',
            bio: t('home.team.oscar.bio'),
            social: {
                github: 'https://github.com/byChamaco',
                linkedin: 'https://www.linkedin.com/in/oscarblancolorenzo/'
            }
        }
    ];

    return (
        <Box component="section" sx={{
            py: { xs: '4rem', md: '6rem' },
            bgcolor: '#fff',
            position: 'relative',
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '100%',
                background: 'radial-gradient(circle at 50% 50%, rgba(254, 111, 20, 0.03) 0%, rgba(254, 111, 20, 0) 70%)',
                zIndex: 0
            }
        }}>
            <Container maxWidth={false} sx={{ maxWidth: '1200px', position: 'relative', zIndex: 1 }}>
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography
                        variant="h2"
                        sx={{
                            fontSize: { xs: '2rem', md: 'clamp(2.5rem, 4vw, 3rem)' },
                            fontWeight: 800,
                            mb: '0.5rem',
                            background: 'linear-gradient(135deg, #f9701a 0%, #662803 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent',
                            position: 'relative',
                            display: 'inline-block',
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: '-10px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '60px',
                                height: '4px',
                                background: 'linear-gradient(135deg, #fe6f14 0%, #ff8f4c 100%)',
                                borderRadius: '2px'
                            }
                        }}
                    >
                        {t('home.team.title')}
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                            color: '#666',
                            maxWidth: '800px',
                            mx: 'auto',
                            mt: '2rem',
                            mb: '2rem',
                            lineHeight: 1.6
                        }}
                    >
                        {t('home.team.subtitle')}
                    </Typography>
                </Box>

                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                    gap: { xs: '2rem', md: '3rem' },
                    px: { xs: '1rem', md: 0 }
                }}>
                    {teamMembers.map((member, index) => (
                        <Box
                            key={index}
                            sx={{
                                bgcolor: 'white',
                                borderRadius: '24px',
                                p: '2rem',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                                transition: 'all 0.4s ease',
                                textAlign: 'center',
                                position: 'relative',
                                overflow: 'hidden',
                                border: '1px solid rgba(0, 0, 0, 0.08)',
                                '&:hover': {
                                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)'
                                }
                            }}
                        >
                            <Avatar
                                src={member.image}
                                alt={member.name}
                                sx={{
                                    width: 150,
                                    height: 150,
                                    mx: 'auto',
                                    mb: 2,
                                    border: '4px solid #fe6f14',
                                    boxShadow: '0 4px 12px rgba(254, 111, 20, 0.3)'
                                }}
                            />
                            <Typography
                                variant="h4"
                                sx={{
                                    fontSize: '1.5rem',
                                    fontWeight: 700,
                                    color: '#333',
                                    mb: 0.5
                                }}
                            >
                                {member.name}
                            </Typography>
                            <Typography
                                sx={{
                                    color: '#fe6f14',
                                    fontSize: '1.1rem',
                                    fontWeight: 500,
                                    mb: 2
                                }}
                            >
                                {member.role}
                            </Typography>
                            <Typography
                                sx={{
                                    color: '#666',
                                    lineHeight: 1.6,
                                    mb: 2
                                }}
                            >
                                {member.bio}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                <IconButton
                                    component={Link}
                                    href={member.social.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{
                                        color: '#333',
                                        '&:hover': {
                                            color: '#fe6f14'
                                        }
                                    }}
                                >
                                    <GitHubIcon />
                                </IconButton>
                                <IconButton
                                    component={Link}
                                    href={member.social.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{
                                        color: '#333',
                                        '&:hover': {
                                            color: '#fe6f14'
                                        }
                                    }}
                                >
                                    <LinkedInIcon />
                                </IconButton>
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Container>
        </Box>
    );
};

export default Team;
