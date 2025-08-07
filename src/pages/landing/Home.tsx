/**
 * Home Landing Page Component
 * 
 * Displays marketing content with sections for:
 * - Hero section with app introduction
 * - How it works step-by-step guide
 * - Features showcase with bento grid layout
 * 
 * @module Home
 */
import { Box, Button, Container, Typography, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, CheckCircle, TrendingUp, BarChart2, PieChart, Edit3, CreditCard, Pocket } from 'react-feather';

// UI Components
import Footer from './components/Footer';
import Header from './components/Header';
import LanguageSelector from './components/LanguageSelector';
import ScrollToTop from './components/ScrollToTop';

// Styles
import './Home.css';

/**
 * Home component - Landing page of the application
 * 
 * Presents the marketing content for the application with responsive design.
 * Includes animated elements, step carousel, and feature showcases.
 * Provides navigation to authentication pages.
 * 
 * @returns {JSX.Element} The rendered home page component
 */
export default function Home() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const stepsContainerRef = useRef<HTMLDivElement>(null);

    /**
     * Handles step change for the mobile carousel view
     * Updates the active step based on direction (prev/next)
     * Implements circular navigation through the step cards
     * 
     * @param {('prev'|'next')} direction - Direction to move: 'prev' or 'next'
     * @returns {void}
     */
    const handleStepChange = (direction: 'prev' | 'next') => {
        if (direction === 'prev') {
            setActiveStep(prev => (prev > 0 ? prev - 1 : 3));
        } else {
            setActiveStep(prev => (prev < 3 ? prev + 1 : 0));
        }
    };

    return (
        <Box className="home-container">
            <ScrollToTop />
            <LanguageSelector />
            <Header />

            {/* Hero Section - Main promotional area */}
            <Box component="section" sx={{
                pt: { xs: '140px', sm: 'clamp(140px, 10vw, 180px)' },
                pb: { xs: '80px', sm: 'clamp(80px, 10vw, 120px)' }
            }}>
                <Container maxWidth={false} sx={{ maxWidth: '1200px' }}>
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                        gap: { xs: '3rem', md: 'clamp(2rem, 4vw, 3rem)' },
                        alignItems: 'center',
                        px: { xs: 'clamp(1rem, 5vw, 2rem)' }
                    }}>
                        {/* Left column - Text content */}
                        <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                            <Typography
                                variant="h1"
                                sx={{
                                    fontSize: 'clamp(2rem, 4vw, 3rem)',
                                    fontWeight: 800,
                                    mb: 'clamp(1rem, 2vw, 1.5rem)',
                                    background: 'linear-gradient(135deg, #f9701a 10%, #662803 90%)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    color: 'transparent',
                                    lineHeight: 1.2
                                }}
                            >
                                {t('home.hero.title')}
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: 'clamp(1.125rem, 2vw, 1.5rem)',
                                    opacity: 0.8,
                                    mb: 'clamp(1.5rem, 3vw, 2rem)',
                                    lineHeight: 1.4
                                }}
                            >
                                {t('home.hero.subtitle')}
                            </Typography>
                            <Button
                                variant="contained"
                                onClick={() => navigate('/auth')}
                                sx={{
                                    bgcolor: '#fe6f14',
                                    color: '#ffffff',
                                    borderRadius: '8px',
                                    p: 'clamp(0.6rem, 1.5vw, 0.8rem) clamp(1.2rem, 2.5vw, 1.6rem)',
                                    fontSize: 'clamp(1rem, 1.5vw, 1.2rem)',
                                    fontWeight: 500,
                                    transition: 'all 0.3s ease-in-out',
                                    mx: { xs: 'auto', md: 0 },
                                    display: { xs: 'block', md: 'inline-flex' },
                                    '&:hover': {
                                        transform: 'scale(1.02)',
                                        bgcolor: '#c84f03'
                                    }
                                }}
                            >
                                {t('home.hero.startButton')}
                            </Button>
                        </Box>
                        {/* Right column - Image */}
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Box
                                component="img"
                                src="/assets/mockup/mockupHome.png"
                                alt="Dashboard Preview"
                                className="no-select"
                                sx={{
                                    width: '100%',
                                    maxWidth: {
                                        xs: '100%',
                                        sm: 'min(500px, 95%)',
                                        md: 'min(600px, 90%)'
                                    },
                                    height: 'auto',
                                    animation: 'float 6s ease-in-out infinite',
                                    borderRadius: '0.5rem',
                                    transition: 'transform 0.3s ease',
                                    m: { xs: '0 auto', md: 0 },
                                    filter: 'drop-shadow(0 15px 20px rgba(0, 0, 0, 0.3))',
                                    '&:hover': {
                                        transform: 'scale(1.02)'
                                    }
                                }}
                            />
                        </Box>
                    </Box>
                </Container>
            </Box>

            {/* How It Works Section - Step-by-step guide */}
            <Box component="section" sx={{
                p: { xs: '4rem 1rem', md: 'clamp(4rem, 8vw, 6rem) 1rem' },
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
                <Container maxWidth={false} sx={{ maxWidth: '1400px', position: 'relative', zIndex: 1 }}>
                    <Box sx={{ textAlign: 'center' }}>
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
                            {t('home.howItWorks.title')}
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
                            {t('home.howItWorks.subtitle')}
                        </Typography>
                        <Box sx={{
                            position: 'relative',
                            width: '100%',
                            overflow: 'hidden'
                        }}>
                            {/* Step cards container with responsive behavior */}
                            <Box
                                ref={stepsContainerRef}
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: {
                                        xs: '1fr',
                                        md: 'repeat(2, 1fr)',
                                        lg: 'repeat(4, 1fr)'
                                    },
                                    gap: '2rem',
                                    p: '1rem',
                                    transition: 'transform 0.5s ease',
                                    '@media (max-width: 900px)': {
                                        display: 'flex',
                                        transform: `translateX(-${activeStep * 100}%)`,
                                        '& > *': {
                                            flex: '0 0 100%'
                                        }
                                    }
                                }}
                            >
                                {/* Map through the steps data to render step cards */}
                                {[
                                    {
                                        number: 1,
                                        title: t('home.howItWorks.steps.step1.title'),
                                        description: t('home.howItWorks.steps.step1.description')
                                    },
                                    {
                                        number: 2,
                                        title: t('home.howItWorks.steps.step2.title'),
                                        description: t('home.howItWorks.steps.step2.description')
                                    },
                                    {
                                        number: 3,
                                        title: t('home.howItWorks.steps.step3.title'),
                                        description: t('home.howItWorks.steps.step3.description')
                                    },
                                    {
                                        number: 4,
                                        title: t('home.howItWorks.steps.step4.title'),
                                        description: t('home.howItWorks.steps.step4.description')
                                    }
                                ].map((step, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            bgcolor: 'white',
                                            borderRadius: '24px',
                                            p: '2rem',
                                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                                            transition: 'all 0.4s ease',
                                            textAlign: 'left',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            border: '1px solid rgba(0, 0, 0, 0.08)',
                                        }}
                                    >
                                        <Box sx={{
                                            background: 'linear-gradient(135deg, #fe6f14 0%, #ff8f4c 100%)',
                                            color: 'white',
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: '16px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '1.25rem',
                                            fontWeight: 600,
                                            mb: '1.5rem',
                                            boxShadow: '0 4px 12px rgba(254, 111, 20, 0.3)'
                                        }}>
                                            {step.number}
                                        </Box>
                                        <Typography
                                            variant="h4"
                                            sx={{
                                                fontSize: '1.375rem',
                                                fontWeight: 700,
                                                color: '#333',
                                                mb: '1rem',
                                                position: 'relative'
                                            }}
                                        >
                                            {step.title}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                color: '#666',
                                                lineHeight: 1.6,
                                                fontSize: '1rem'
                                            }}
                                        >
                                            {step.description}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>

                            {/* Mobile carousel navigation controls */}
                            <Box
                                sx={{
                                    display: { xs: 'flex', md: 'none' },
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: 2,
                                    mt: 3
                                }}
                            >
                                <IconButton
                                    onClick={() => handleStepChange('prev')}
                                    sx={{
                                        bgcolor: 'rgba(254, 111, 20, 0.1)',
                                        '&:hover': {
                                            bgcolor: 'rgba(254, 111, 20, 0.2)'
                                        }
                                    }}
                                >
                                    <ChevronLeft size={24} />
                                </IconButton>

                                {/* Step indicator dots for mobile */}
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    {[0, 1, 2, 3].map((step) => (
                                        <Box
                                            key={step}
                                            sx={{
                                                width: '8px',
                                                height: '8px',
                                                borderRadius: '50%',
                                                bgcolor: activeStep === step ? '#fe6f14' : 'rgba(254, 111, 20, 0.2)',
                                                transition: 'all 0.3s ease'
                                            }}
                                        />
                                    ))}
                                </Box>

                                <IconButton
                                    onClick={() => handleStepChange('next')}
                                    sx={{
                                        bgcolor: 'rgba(254, 111, 20, 0.1)',
                                        '&:hover': {
                                            bgcolor: 'rgba(254, 111, 20, 0.2)'
                                        }
                                    }}
                                >
                                    <ChevronRight size={24} />
                                </IconButton>
                            </Box>
                        </Box>
                    </Box>
                </Container>
            </Box>

            {/* Features Bento Section - Showcase app features in a grid */}
            <Box component="section" className="features-section">
                <Container maxWidth={false} sx={{ maxWidth: '1200px', mb: 4 }}>
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
                            {t('home.features.title')}
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
                            {t('home.features.subtitle')}
                        </Typography>
                    </Box>
                </Container>
                {/* Bento grid features layout */}
                <div className="features-container bento-grid">
                    {/* Annual Report Feature Card */}
                    <article className="feature-card highlight">
                        <BarChart2 size={40} color="#fff" style={{ marginBottom: '1rem' }} />
                        <h4>{t('home.features.cards.annualReport.title')}</h4>
                        <p>{t('home.features.cards.annualReport.description')}</p>
                    </article>

                    {/* Transactions Feature Card */}
                    <article className="feature-card">
                        <PieChart size={40} color="#fe6f14" style={{ marginBottom: '1rem' }} />
                        <h4>{t('home.features.cards.transactions.title')}</h4>
                        <p>{t('home.features.cards.transactions.description')}</p>
                    </article>

                    {/* Goals Feature Card */}
                    <article className="feature-card">
                        <CheckCircle size={40} color="#fe6f14" style={{ marginBottom: '1rem' }} />
                        <h4>{t('home.features.cards.goals.title')}<span className="soon-badge">Soon</span></h4>
                        <p>{t('home.features.cards.goals.description')}</p>
                    </article>

                    {/* Notes Feature Card */}
                    <article className="feature-card">
                        <Edit3 size={40} color="#fe6f14" style={{ marginBottom: '1rem' }} />
                        <h4>{t('home.features.cards.notes.title')}</h4>
                        <p>{t('home.features.cards.notes.description')}</p>
                    </article>

                    {/* Bank Integration Feature Card */}
                    <article className="feature-card highlight">
                        <Pocket size={40} color="#fff" style={{ marginBottom: '1rem' }} />
                        <h4>{t('home.features.cards.bankIntegration.title')}<span className="soon-badge">Soon</span></h4>
                        <p>{t('home.features.cards.bankIntegration.description')}</p>
                    </article>

                    {/* Investments Feature Card */}
                    <article className="feature-card">
                        <TrendingUp size={40} color="#fe6f14" style={{ marginBottom: '1rem' }} />
                        <h4>{t('home.features.cards.investments.title')}<span className="soon-badge">Soon</span></h4>
                        <p>{t('home.features.cards.investments.description')}</p>
                    </article>

                    {/* Accounts Feature Card */}
                    <article className="feature-card">
                        <CreditCard size={40} color="#fe6f14" style={{ marginBottom: '1rem' }} />
                        <h4>{t('home.features.cards.accounts.title')}</h4>
                        <p>{t('home.features.cards.accounts.description')}</p>
                    </article>
                </div>
            </Box>

            {/* Pricing Section */}
            <Box component="section" sx={{
                p: { xs: '4rem 1rem', md: 'clamp(4rem, 8vw, 6rem) 1rem' },
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
                    <Box sx={{ textAlign: 'center' }}>
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
                            {t('home.pricing.title', 'Pricing Plans')}
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                                color: '#666',
                                maxWidth: '800px',
                                mx: 'auto',
                                mt: '2rem',
                                mb: '1rem',
                                lineHeight: 1.6
                            }}
                        >
                            {t('home.pricing.subtitle', 'Simple, transparent pricing for everyone')}
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
                                color: '#fe6f14',
                                fontWeight: 600,
                                maxWidth: '800px',
                                mx: 'auto',
                                mb: '3rem',
                                lineHeight: 1.4,
                                p: 2,
                                bgcolor: 'rgba(254, 111, 20, 0.05)',
                                borderRadius: '12px',
                                border: '1px solid rgba(254, 111, 20, 0.1)',
                                display: 'inline-block'
                            }}
                        >
                            {t('home.pricing.trial', 'Try all Premium features free for 30 days — No credit card required')}
                        </Typography>

                        <Box className="pricing-container">
                            {/* Monthly Plan */}
                            <Box className="pricing-card">
                                <Typography
                                    variant="h4"
                                    sx={{
                                        fontSize: { xs: '1.25rem', sm: '1.5rem' },
                                        fontWeight: 700,
                                        mb: 2,
                                        textAlign: 'center'
                                    }}
                                >
                                    {t('home.pricing.monthly.title', 'Monthly Plan')}
                                </Typography>
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'baseline',
                                    justifyContent: 'center',
                                    mb: 3
                                }}>
                                    <Typography
                                        sx={{
                                            fontSize: { xs: '2rem', sm: '2.5rem' },
                                            fontWeight: 800,
                                            color: '#333'
                                        }}
                                    >
                                        0,99 €
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontSize: '1rem',
                                            color: '#666',
                                            ml: 1
                                        }}
                                    >
                                        / {t('home.pricing.monthly.period', 'month')}
                                    </Typography>
                                </Box>
                                <Typography
                                    sx={{
                                        fontWeight: 600,
                                        color: '#fe6f14',
                                        mb: 3,
                                        textAlign: 'center'
                                    }}
                                >
                                    {t('home.pricing.monthly.advantage', 'Flexible payment, cancel anytime')}
                                </Typography>
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate('/auth')}
                                    sx={{
                                        color: '#fe6f14',
                                        borderColor: '#fe6f14',
                                        borderRadius: '8px',
                                        p: { xs: '0.6rem 1.2rem', sm: '0.75rem 1.5rem' },
                                        fontWeight: 600,
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            borderColor: '#c84f03',
                                            bgcolor: 'rgba(254, 111, 20, 0.04)',
                                            transform: 'scale(1.02)'
                                        }
                                    }}
                                >
                                    {t('home.pricing.startTrial', 'Start Free Trial')}
                                </Button>
                            </Box>

                            {/* Annual Plan */}
                            <Box className="pricing-card highlight">
                                <Box sx={{
                                    position: 'absolute',
                                    top: { xs: '8px', sm: '12px' },
                                    right: { xs: '8px', sm: '12px' },
                                    bgcolor: 'white',
                                    color: '#fe6f14',
                                    borderRadius: '20px',
                                    px: { xs: 1.5, sm: 2 },
                                    py: 0.5,
                                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                    fontWeight: 700,
                                    whiteSpace: 'nowrap'
                                }}>
                                    {t('home.pricing.annual.popular', 'Most Popular')}
                                </Box>
                                <Typography
                                    variant="h4"
                                    sx={{
                                        fontSize: { xs: '1.25rem', sm: '1.5rem' },
                                        fontWeight: 700,
                                        mb: 2,
                                        color: 'white',
                                        textAlign: 'center'
                                    }}
                                >
                                    {t('home.pricing.annual.title', 'Annual Plan')}
                                </Typography>
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'baseline',
                                    justifyContent: 'center',
                                    mb: 3
                                }}>
                                    <Typography
                                        sx={{
                                            fontSize: { xs: '2rem', sm: '2.5rem' },
                                            fontWeight: 800,
                                            color: 'white'
                                        }}
                                    >
                                        9,99 €
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontSize: '1rem',
                                            color: 'rgba(255,255,255,0.8)',
                                            ml: 1
                                        }}
                                    >
                                        / {t('home.pricing.annual.period', 'year')}
                                    </Typography>
                                </Box>
                                <Box sx={{
                                    bgcolor: 'rgba(255,255,255,0.2)',
                                    borderRadius: '8px',
                                    p: 1,
                                    mb: 3,
                                    fontWeight: 600,
                                    textAlign: 'center',
                                    width: '100%'
                                }}>
                                    {t('home.pricing.annual.advantage', 'Save 16% compared to monthly plan')}
                                </Box>
                                <Button
                                    variant="contained"
                                    onClick={() => navigate('/auth')}
                                    sx={{
                                        bgcolor: 'white',
                                        color: '#fe6f14',
                                        borderRadius: '8px',
                                        p: { xs: '0.6rem 1.2rem', sm: '0.75rem 1.5rem' },
                                        fontWeight: 600,
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            bgcolor: '#f5f5f5',
                                            transform: 'scale(1.02)'
                                        }
                                    }}
                                >
                                    {t('home.pricing.startTrial', 'Start Free Trial')}
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Container>
            </Box>

            <Footer />
        </Box>
    );
}