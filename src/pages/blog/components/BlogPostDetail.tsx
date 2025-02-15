import { useEffect } from 'react';
import { Container, Typography, Box, Divider, Paper, Breadcrumbs, Link } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Data
import { blogPosts } from '../data/blogData';

// Function to format the blog post date
const formatBlogDate = (dateString: string) => {
    const date = new Date(dateString);
    const language = localStorage.getItem('i18nextLng') || 'en';

    // Return the date in the appropriate format based on the language
    return date.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
};

// Blog post detail component
export default function BlogPostDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const post = blogPosts.find(post => post.id === Number(id));

    // Scroll to the top of the page when the component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // If the post is not found, display a message
    if (!post) {
        return (
            <Container>
                <Typography variant="h4">{t('blog.postNotFound')}</Typography>
            </Container>
        );
    }

    return (
        <>
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Breadcrumbs sx={{ mb: 4, mt: 2 }}>
                    <Link
                        component="button"
                        onClick={() => navigate('/blog')}
                        underline="hover"
                        sx={{
                            color: '#fe6f14',
                            '&:hover': {
                                color: '#d45a0f'
                            }
                        }}
                    >
                        Blog
                    </Link>
                    <Typography color="text.secondary">{post.title}</Typography>
                </Breadcrumbs>

                {post.image && (
                    <Box sx={{
                        width: '100%',
                        height: '100%',
                        overflow: 'hidden',
                        borderRadius: 4,
                        mb: 4
                    }}>
                        <img
                            src={post.image}
                            alt={post.title}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }}
                        />
                    </Box>
                )}

                <Paper elevation={0} sx={{ p: 4, backgroundColor: 'background.default' }}>
                    <Typography variant="h3" component="h1" gutterBottom>
                        {post.title}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                        <Typography variant="subtitle1" color="text.secondary">
                            {t('blog.by')} {post.author}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                            {formatBlogDate(post.date)}
                        </Typography>
                    </Box>

                    <Divider sx={{ mb: 4 }} />

                    <Box 
                        sx={{
                            typography: 'body1',
                            lineHeight: 1.8,
                            '& p': { mb: 2 },
                            '& h3': { 
                                fontSize: '1.5rem', 
                                fontWeight: 600,
                                my: 3 
                            },
                            '& ul': { 
                                pl: 3,
                                mb: 2 
                            },
                            '& li': { 
                                mb: 1 
                            },
                            '& a': {
                                color: 'primary.main',
                                textDecoration: 'none',
                                '&:hover': {
                                    textDecoration: 'underline'
                                }
                            }
                        }}
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </Paper>
            </Container>
        </>
    );
};