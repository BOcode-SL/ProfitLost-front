import { useEffect } from 'react';
import { Container, Typography, Box, Divider, Paper, Breadcrumbs, Link, Chip } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Data
import { blogPosts } from '../data/blogData';
import { useProcessBlogContent } from '../../../utils/blogUtils';

// Components
import Footer from '../../landing/components/Footer';
import LanguageSelector from '../../landing/components/LanguageSelector';

// Function to format the blog post date
const formatBlogDate = (dateString: string) => {
    const date = new Date(dateString);
    const language = localStorage.getItem('i18nextLng') || 'en';

    // Returns the date in the appropriate format based on the selected language
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
    const { processContent } = useProcessBlogContent();
    const post = blogPosts.find(post => post.id === Number(id));

    // Effect to scroll to the top of the page
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Debug effect - always present, not conditional
    useEffect(() => {
        if (!post) return;

        const processedContent = processContent(post.content);
        if (processedContent.includes('blog.post')) {
            console.warn('Untranslated content detected:', processedContent);
            console.log('Available translation keys:',
                t('blog.post.2.content.step1.items', { returnObjects: true }));
        }
    }, [post, t, processContent]);

    if (!post) {
        return (
            <Container>
                <Typography variant="h4">{t('blog.postNotFound')}</Typography>
            </Container>
        );
    }

    const processedContent = processContent(post.content);

    return (
        <>
            <LanguageSelector />
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
                    <Typography color="text.secondary">{t(post.title)}</Typography>
                </Breadcrumbs>

                {post.image && (
                    <Box sx={{
                        position: 'relative',
                        width: '100%',
                        overflow: 'hidden',
                        borderRadius: 4,
                        mb: 4,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }}>
                        <img
                            src={post.image}
                            alt={t(post.title)}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                            }}
                        />
                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: { xs: 8, sm: 16 }, // Espaciado responsivo
                                left: { xs: 8, sm: 16 }, // Espaciado responsivo
                                zIndex: 2
                            }}
                        >
                            <Chip
                                label={t(`blog.categories.${post.category}`)}
                                sx={{
                                    backgroundColor: 'primary.main',
                                    color: 'white',
                                    fontWeight: 600,
                                    fontSize: { xs: '0.75rem', sm: '0.875rem' }, // Tamaño de fuente responsivo
                                    px: 2,
                                    '& .MuiChip-label': {
                                        px: 1
                                    },
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                                }}
                            />
                        </Box>
                    </Box>
                )}

                <Paper elevation={0} sx={{ p: 4, borderRadius: 4 }}>
                    <Typography variant="h3" component="h1" gutterBottom>
                        {t(post.title)}
                    </Typography>

                    <Box
                        sx={{
                            display: 'flex',
                            gap: 2,
                            mb: 4,
                            alignItems: 'center',
                            flexWrap: 'wrap'
                        }}
                    >
                        <Typography
                            variant="subtitle1"
                            sx={{
                                color: 'text.secondary',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}
                        >
                            <span className="material-symbols-rounded" style={{ fontSize: 20 }}>person</span>
                            {t('blog.by')} {t(post.author)}
                        </Typography>
                        <Typography
                            variant="subtitle1"
                            sx={{
                                color: 'text.secondary',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}
                        >
                            <span className="material-symbols-rounded" style={{ fontSize: 20 }}>calendar_today</span>
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
                        dangerouslySetInnerHTML={{
                            __html: processedContent
                        }}
                    />
                </Paper>
            </Container>
            <Footer />
        </>
    );
};