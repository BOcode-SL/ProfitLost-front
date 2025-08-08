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
            <Header />

            {/* Hero Section - Main promotional area */}
            <Box component="section" sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #fe6f14 0%, #c84f03 100%)',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                    pointerEvents: 'none'
                }
            }}>
                <Container maxWidth={false} sx={{
                    maxWidth: '1200px',
                    position: 'relative',
                    zIndex: 10
                }}>
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                        gap: { xs: '3rem', md: 'clamp(2rem, 4vw, 3rem)' },
                        alignItems: 'center',
                        px: { xs: 'clamp(1rem, 5vw, 2rem)' },
                        py: { xs: 'clamp(2rem, 8vw, 4rem)' }
                    }}>
                        {/* Left column - Text content */}
                        <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                            <Typography
                                variant="h1"
                                sx={{
                                    fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                                    fontWeight: 800,
                                    mb: 'clamp(1rem, 2vw, 1.5rem)',
                                    color: 'white',
                                    lineHeight: 1.1,
                                    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                                }}
                            >
                                {t('home.hero.title')}
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)',
                                    color: 'rgba(255,255,255,0.9)',
                                    mb: 'clamp(2rem, 4vw, 3rem)',
                                    lineHeight: 1.4,
                                    textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                                }}
                            >
                                {t('home.hero.subtitle')}
                            </Typography>
                            <Button
                                variant="contained"
                                onClick={() => navigate('/auth')}
                                sx={{
                                    backgroundColor: 'white',
                                    color: '#fe6f14',
                                    borderRadius: '12px',
                                    p: 'clamp(0.8rem, 2vw, 1rem) clamp(2rem, 4vw, 2.5rem)',
                                    fontSize: 'clamp(1rem, 1.5vw, 1.2rem)',
                                    fontWeight: 600,
                                    transition: 'all 0.3s ease-in-out',
                                    mx: { xs: 'auto', md: 0 },
                                    display: { xs: 'block', md: 'inline-flex' },
                                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                        backgroundColor: '#f8f9fa',
                                        boxShadow: '0 12px 35px rgba(0,0,0,0.2)'
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
                                        sm: 'min(600px, 100%)',
                                        md: 'min(700px, 100%)',
                                        lg: 'min(800px, 100%)'
                                    },
                                    height: 'auto',
                                    animation: 'float 6s ease-in-out infinite',
                                    borderRadius: '16px',
                                    transition: 'transform 0.3s ease',
                                    m: { xs: '0 auto', md: 0 },
                                    filter: 'drop-shadow(0 20px 40px rgba(0, 0, 0, 0.3))',
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
                                background: 'linear-gradient(135deg, #fe6f14 0%, #c84f03 100%)',
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
                                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                                            transition: 'all 0.4s ease',
                                            textAlign: 'left',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            border: '1px solid rgba(0, 0, 0, 0.08)',
                                            '&:hover': {
                                                transform: 'scale(1.02)',
                                                boxShadow: '0 16px 48px rgba(0, 0, 0, 0.12)'
                                            }
                                        }}
                                    >
                                        <Box sx={{
                                            background: 'linear-gradient(135deg, #fe6f14 0%, #ff8f4c 100%)',
                                            color: 'white',
                                            width: '56px',
                                            height: '56px',
                                            borderRadius: '16px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '1.5rem',
                                            fontWeight: 700,
                                            mb: '1.5rem',
                                            boxShadow: '0 8px 24px rgba(254, 111, 20, 0.3)'
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
                                background: 'linear-gradient(135deg, #fe6f14 0%, #c84f03 100%)',
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
                                background: 'linear-gradient(135deg, #fe6f14 0%, #c84f03 100%)',
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
                        <Box
                            sx={{
                                fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
                                color: '#fe6f14',
                                fontWeight: 600,
                                maxWidth: '800px',
                                mx: 'auto',
                                mb: '3rem',
                                lineHeight: 1.4,
                                p: 3,
                                bgcolor: 'rgba(254, 111, 20, 0.05)',
                                borderRadius: '16px',
                                border: '1px solid rgba(254, 111, 20, 0.1)',
                                display: 'inline-block',
                                position: 'relative',
                                overflow: 'hidden',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '2px',
                                    background: 'linear-gradient(90deg, #fe6f14 0%, #ff8f4c 100%)'
                                }
                            }}
                        >
                            {t('home.pricing.trial', 'Try all Premium features free for 30 days — No credit card required')}
                        </Box>

                        <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                            gap: { xs: 2, md: 3 },
                            maxWidth: '900px',
                            mx: 'auto'
                        }}>
                            {/* Monthly Plan */}
                            <Box sx={{
                                bgcolor: 'white',
                                borderRadius: '20px',
                                p: { xs: 3, md: 4 },
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                                border: '1px solid rgba(0, 0, 0, 0.08)',
                                transition: 'all 0.3s ease',
                                position: 'relative',
                                '&:hover': {
                                    boxShadow: '0 16px 48px rgba(0, 0, 0, 0.12)'
                                }
                            }}>
                                <Typography
                                    variant="h4"
                                    sx={{
                                        fontSize: { xs: '1.25rem', sm: '1.5rem' },
                                        fontWeight: 700,
                                        mb: 2,
                                        textAlign: 'center',
                                        color: '#333'
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
                                            fontSize: { xs: '2.5rem', sm: '3rem' },
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
                                        textAlign: 'center',
                                        fontSize: '0.9rem'
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
                                        borderRadius: '12px',
                                        p: { xs: '0.8rem 1.5rem', sm: '1rem 2rem' },
                                        fontWeight: 600,
                                        fontSize: '1rem',
                                        transition: 'all 0.3s ease',
                                        width: '100%',
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
                            <Box sx={{
                                bgcolor: 'linear-gradient(135deg, #fe6f14 0%, #c84f03 100%)',
                                background: 'linear-gradient(135deg, #fe6f14 0%, #c84f03 100%)',
                                borderRadius: '20px',
                                p: { xs: 3, md: 4 },
                                boxShadow: '0 8px 32px rgba(254, 111, 20, 0.2)',
                                transition: 'all 0.3s ease',
                                position: 'relative',
                                overflow: 'hidden',
                                '&:hover': {
                                    boxShadow: '0 16px 48px rgba(254, 111, 20, 0.3)'
                                },
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '100%',
                                    background: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                                    pointerEvents: 'none'
                                }
                            }}>
                                <Box sx={{
                                    position: 'absolute',
                                    top: { xs: '12px', sm: '16px' },
                                    right: { xs: '12px', sm: '16px' },
                                    bgcolor: 'white',
                                    color: '#fe6f14',
                                    borderRadius: '20px',
                                    px: { xs: 1.5, sm: 2 },
                                    py: 0.5,
                                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                    fontWeight: 700,
                                    whiteSpace: 'nowrap',
                                    zIndex: 1
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
                                        textAlign: 'center',
                                        position: 'relative',
                                        zIndex: 1
                                    }}
                                >
                                    {t('home.pricing.annual.title', 'Annual Plan')}
                                </Typography>
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'baseline',
                                    justifyContent: 'center',
                                    mb: 3,
                                    position: 'relative',
                                    zIndex: 1
                                }}>
                                    <Typography
                                        sx={{
                                            fontSize: { xs: '2.5rem', sm: '3rem' },
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
                                    bgcolor: 'rgba(255,255,255,0.15)',
                                    borderRadius: '12px',
                                    p: 1.5,
                                    mb: 3,
                                    fontWeight: 600,
                                    textAlign: 'center',
                                    width: '100%',
                                    fontSize: '0.9rem',
                                    color: 'white',
                                    position: 'relative',
                                    zIndex: 1
                                }}>
                                    {t('home.pricing.annual.advantage', 'Save 16% compared to monthly plan')}
                                </Box>
                                <Button
                                    variant="contained"
                                    onClick={() => navigate('/auth')}
                                    sx={{
                                        bgcolor: 'white',
                                        color: '#fe6f14',
                                        borderRadius: '12px',
                                        p: { xs: '0.8rem 1.5rem', sm: '1rem 2rem' },
                                        fontWeight: 600,
                                        fontSize: '1rem',
                                        transition: 'all 0.3s ease',
                                        width: '100%',
                                        position: 'relative',
                                        zIndex: 1,
                                        '&:hover': {
                                            bgcolor: '#f8f9fa',
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