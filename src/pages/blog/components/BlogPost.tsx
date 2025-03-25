import { Box, Paper, Typography, alpha, useTheme, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';

// Types
import { BlogPost as BlogPostType } from '../../../types/models/blogPost';

export interface BlogPostProps {
    post: BlogPostType;
}

// Function to format the blog post date based on the user's language preference
const formatBlogDate = (dateString: string) => {
    const date = new Date(dateString);
    const language = localStorage.getItem('i18nextLng') || 'en';

    // Return the date formatted according to the selected language
    return date.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
};

export default function BlogPost({ post }: BlogPostProps) {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Paper
            onClick={() => navigate(`/blog/${post.id}`)}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                cursor: 'pointer',
                overflow: 'hidden',
                borderRadius: { xs: 3, sm: 4 },
                bgcolor: 'background.paper',
                transition: 'all 0.3s ease',
                p: 0,
                '&:hover': {
                    boxShadow: theme => `0 12px 24px ${alpha(theme.palette.primary.main, 0.12)}`,
                    transform: 'translateY(-4px)',
                    '& .blog-image-container': {
                        transform: 'scale(1.1)'
                    }
                }
            }}
        >
            <Box
                sx={{
                    position: 'relative',
                    paddingTop: '56.25%',
                    overflow: 'hidden',
                }}
            >
                <Box
                    className="blog-image-container"
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundImage: `url(${post.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(180deg, transparent -10%, rgba(0,0,0,0.2) 100%)',
                            opacity: 0.8,
                            transition: 'opacity 0.3s ease'
                        }
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        p: { xs: 1.5, sm: 2 },
                        zIndex: 1
                    }}
                >
                    <Typography
                        variant="caption"
                        sx={{
                            color: 'white',
                            bgcolor: 'primary.main',
                            px: { xs: 1.2, sm: 1.5 },
                            py: { xs: 0.4, sm: 0.5 },
                            borderRadius: { xs: 1.5, sm: 2 },
                            fontWeight: 500,
                            fontSize: { xs: '0.7rem', sm: '0.75rem' }
                        }}
                    >
                        {t(`blog.categories.${post.category}`)}
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ 
                p: { xs: 2, sm: 2.5, md: 3 }, 
                flexGrow: 1, 
                display: 'flex', 
                flexDirection: 'column' 
            }}>
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 700,
                        mb: { xs: 1.5, sm: 2 },
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        color: 'primary.main',
                        lineHeight: 1.3,
                        fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.35rem' }
                    }}
                >
                    {t(post.title)}
                </Typography>

                <Typography
                    variant="body2"
                    sx={{
                        color: 'text.secondary',
                        mb: { xs: 2, sm: 2.5, md: 3 },
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: 1.6,
                        fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' }
                    }}
                >
                    {t(post.excerpt)}
                </Typography>

                <Box
                    sx={{
                        mt: 'auto',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: isMobile ? 'wrap' : 'nowrap',
                        gap: isMobile ? 1 : 0
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            color: 'text.secondary',
                            fontWeight: 500,
                            fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem' },
                            width: isMobile ? '100%' : 'auto'
                        }}
                    >
                        <PersonOutlineOutlinedIcon sx={{ fontSize: isMobile ? 16 : 20 }} />
                        {t(post.author)}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            color: 'text.secondary',
                            fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem' },
                            width: isMobile ? '100%' : 'auto',
                            justifyContent: isMobile ? 'flex-start' : 'flex-end'
                        }}
                    >
                        <CalendarTodayOutlinedIcon sx={{ fontSize: isMobile ? 16 : 20 }} />
                        {formatBlogDate(post.date)}
                    </Typography>
                </Box>
            </Box>
        </Paper>
    );
};