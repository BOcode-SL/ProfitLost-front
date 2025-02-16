import { Box, Paper, Typography, alpha } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

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

    return (
        <Paper
            onClick={() => navigate(`/blog/${post.id}`)}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                cursor: 'pointer',
                overflow: 'hidden',
                borderRadius: 4,
                bgcolor: 'background.paper',
                transition: 'all 0.3s ease',
                p: 0,
                '&:hover': {
                    boxShadow: theme => `0 12px 24px ${alpha(theme.palette.primary.main, 0.12)}`,
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
                        p: 2,
                        zIndex: 1
                    }}
                >
                    <Typography
                        variant="caption"
                        sx={{
                            color: 'white',
                            bgcolor: 'primary.main',
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 2,
                            fontWeight: 500
                        }}
                    >
                        {t(`blog.categories.${post.category}`)}
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 700,
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        color: 'primary.main',
                        lineHeight: 1.3
                    }}
                >
                    {t(post.title)}
                </Typography>

                <Typography
                    variant="body2"
                    sx={{
                        color: 'text.secondary',
                        mb: 3,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: 1.6
                    }}
                >
                    {t(post.excerpt)}
                </Typography>

                <Box
                    sx={{
                        mt: 'auto',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            color: 'text.secondary',
                            fontWeight: 500
                        }}
                    >
                        <span className="material-symbols-rounded" style={{ fontSize: 20 }}>person</span>
                        {t(post.author)}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            color: 'text.secondary'
                        }}
                    >
                        <span className="material-symbols-rounded" style={{ fontSize: 20 }}>calendar_today</span>
                        {formatBlogDate(post.date)}
                    </Typography>
                </Box>
            </Box>
        </Paper>
    );
};