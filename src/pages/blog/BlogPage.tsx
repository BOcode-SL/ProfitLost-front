import { useEffect, useState } from 'react';
import { Container, Typography, Box, TextField, InputAdornment, Chip, Pagination, useTheme, useMediaQuery } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CategoryType } from '../../types/models/blogPost';
import { blogPosts } from './data/blogData';

// Retrieve unique categories from the existing blog posts
const availableCategories = ['all', ...new Set(blogPosts.map(post => post.category))] as ('all' | CategoryType)[];

// Components
import BlogPost from './components/BlogPost';
import Header from '../landing/components/Header';
import Footer from '../landing/components/Footer';
import LanguageSelector from '../landing/components/LanguageSelector';
// Helper function to normalize text by removing accents, punctuation, and converting to lowercase
const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '') // Remove punctuation
    .trim();
};

// Function to search for matches in the post content
const searchInContent = (content: string, searchTerm: string): boolean => {
  if (!content || !searchTerm) return false;
  const normalizedContent = normalizeText(content);
  const normalizedSearch = normalizeText(searchTerm);
  const searchWords = normalizedSearch.split(' ').filter(word => word.length > 2);
  return searchWords.every(word => normalizedContent.includes(word));
};

// Blog page component
export default function BlogPage() {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedCategory, setSelectedCategory] = useState<'all' | CategoryType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = isMobile ? 3 : 4; // Fewer posts per page on mobile

  // Scroll to the top of the page when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCategoryFilter = (category: 'all' | CategoryType) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredPosts = blogPosts
    .filter(post =>
      selectedCategory === 'all' || post.category === selectedCategory
    )
    .filter(post => {
      if (!searchTerm.trim()) return true;

      // Search across multiple fields in the post
      return (
        searchInContent(post.title, searchTerm) ||
        searchInContent(post.excerpt, searchTerm) ||
        searchInContent(post.content, searchTerm) ||
        searchInContent(post.author, searchTerm) ||
        searchInContent(post.category, searchTerm)
      );
    });

  // Calculate the starting and ending index for pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(indexOfFirstPost, indexOfLastPost);

  return (
    <>
      <LanguageSelector />
      <Header />
      <Container maxWidth="lg" sx={{ 
        py: { xs: 3, sm: 5, md: 8 }, 
        pt: { xs: 14, sm: 16, md: 20 },
        px: { xs: 2, sm: 3, md: 4 }
      }}>
        <Box sx={{ mb: { xs: 5, sm: 6, md: 8 }, textAlign: 'center' }}>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 800,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              background: 'linear-gradient(135deg, #f9701a 10%, #662803 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              position: 'relative',
              display: 'inline-block',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: { xs: '-8px', sm: '-10px' },
                left: '50%',
                transform: 'translateX(-50%)',
                width: { xs: '40px', sm: '50px', md: '60px' },
                height: { xs: '3px', sm: '4px' },
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
              maxWidth: { xs: '100%', sm: '90%', md: '800px' },
              mx: 'auto',
              mt: { xs: 3, sm: 4 },
              fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
              opacity: 0.8,
              lineHeight: 1.5,
              px: { xs: 1, sm: 0 }
            }}
          >
            {t('blog.subtitle')}
          </Typography>
        </Box>

        {/* Display blog categories */}
        <Box sx={{ 
          mb: { xs: 3, sm: 4 }, 
          display: 'flex', 
          justifyContent: 'center', 
          gap: { xs: 1, sm: 1.5, md: 2 }, 
          flexWrap: 'wrap',
          px: { xs: 1, sm: 0 }
        }}>
          {availableCategories.map((category) => (
            <Chip
              key={category}
              label={t(`blog.categories.${category.toLowerCase()}`)}
              onClick={() => handleCategoryFilter(category)}
              sx={{
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                height: { xs: '28px', sm: '32px' },
                '&:hover': { backgroundColor: 'primary.light' },
                backgroundColor: selectedCategory === category ? 'primary.main' : 'default',
                color: selectedCategory === category ? 'white' : 'inherit',
                fontWeight: selectedCategory === category ? 600 : 400,
                transition: 'all 0.2s ease'
              }}
            />
          ))}
        </Box>

        {/* Search bar for filtering posts */}
        <Box sx={{ mb: { xs: 4, sm: 5, md: 6 } }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder={t('blog.searchPlaceholder')}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <span className="material-symbols-rounded">search</span>
                </InputAdornment>
              ),
              sx: {
                borderRadius: '8px',
                height: { xs: '48px', sm: '56px' },
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }
            }}
            onChange={(e) => handleSearch(e.target.value)}
            sx={{ 
              maxWidth: { xs: '100%', sm: '500px', md: '600px' }, 
              mx: 'auto', 
              display: 'block', 
              backgroundColor: 'primary.contrastText',
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                  borderWidth: 2
                }
              }
            }}
          />
        </Box>

        {/* Grid layout for displaying existing posts */}
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: { 
            xs: '1fr',
            sm: 'repeat(auto-fill, minmax(280px, 1fr))',
            md: 'repeat(auto-fill, minmax(320px, 1fr))' 
          },
          gap: { xs: 3, sm: 3, md: 4 }
        }}>
          {currentPosts.length > 0 ? (
            currentPosts.map((post) => (
              <Box key={post.id}>
                <BlogPost post={post} />
              </Box>
            ))
          ) : (
            <Box sx={{ 
              gridColumn: '1 / -1', 
              textAlign: 'center', 
              py: 8,
              px: 2
            }}>
              <Typography variant="h6" color="text.secondary">
                {t('blog.noPostsFound')}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Pagination controls */}
        <Box sx={{ mt: { xs: 4, sm: 5, md: 6 }, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={Math.ceil(filteredPosts.length / postsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size={isMobile ? "small" : "medium"}
            siblingCount={isMobile ? 0 : 1}
          />
        </Box>
      </Container>
      <Footer />
    </>
  );
}