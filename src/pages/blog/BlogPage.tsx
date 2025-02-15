import { useEffect } from 'react';
import { Container, Typography, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

// Data
import { blogPosts } from './data/blogData';

// Components
import BlogPost from './components/BlogPost';
import Header from '../landing/components/Header';
import Footer from '../landing/components/Footer';

// Blog page component
export default function BlogPage() {
  const { t } = useTranslation();

  // Scroll to the top of the page on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ py: 8, pt: 20 }}>
        <Box sx={{ mb: 8, textAlign: 'center' }}>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 800,
              background: 'linear-gradient(135deg, #f9701a 10%, #662803 90%)',
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
            {t('blog.title')}
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{
              maxWidth: '800px',
              mx: 'auto',
              mt: 4,
              fontSize: 'clamp(1.125rem, 2vw, 1.5rem)',
              opacity: 0.8,
              lineHeight: 1.4
            }}
          >
            {t('blog.subtitle')}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(2, 1fr)'
            },
            gap: 4,
          }}
        >
          {blogPosts
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((post) => (
              <Box key={post.id}>
                <BlogPost post={post} />
              </Box>
            ))}
        </Box>
      </Container>
      <Footer />
    </>
  );
}