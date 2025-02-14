import { Box, Button, Container, Typography, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';

// Components
import Footer from './components/Footer';
import Header from './components/Header';

// Styles
import './Home.scss';

// Home component for the landing page
export default function Home() {
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const stepsContainerRef = useRef<HTMLDivElement>(null);

    const handleStepChange = (direction: 'prev' | 'next') => {
        if (direction === 'prev') {
            setActiveStep(prev => (prev > 0 ? prev - 1 : 3));
        } else {
            setActiveStep(prev => (prev < 3 ? prev + 1 : 0));
        }
    };

    return (
        <Box className="home-container">
            <Header />

            {/* Hero Section */}
            <Box component="section" sx={{
                pt: { xs: '100px', sm: 'clamp(100px, 10vw, 140px)' },
                pb: { xs: '40px', sm: 'clamp(40px, 8vw, 80px)' }
            }}>
                <Container maxWidth={false} sx={{ maxWidth: '1200px' }}>
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                        gap: { xs: '3rem', md: 'clamp(2rem, 4vw, 3rem)' },
                        alignItems: 'center',
                        px: { xs: 'clamp(1rem, 5vw, 2rem)' }
                    }}>
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
                                Manage your finances in a SMART way
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: 'clamp(1.125rem, 2vw, 1.5rem)',
                                    opacity: 0.8,
                                    mb: 'clamp(1.5rem, 3vw, 2rem)',
                                    lineHeight: 1.4
                                }}
                            >
                                Take control of your finances and save more with our platform
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
                                Start Now
                            </Button>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Box
                                component="img"
                                src="https://res.cloudinary.com/dnhlagojg/image/upload/v1739553639/AppPhotos/Brand/mockup/annualreport.png"
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
                                    boxShadow: '0 15px 20px 0 rgba(0, 0, 0, 0.3)',
                                    borderRadius: '0.5rem',
                                    transition: 'transform 0.3s ease',
                                    m: { xs: '0 auto', md: 0 },
                                    '&:hover': {
                                        transform: 'scale(1.02)'
                                    }
                                }}
                            />
                        </Box>
                    </Box>
                </Container>
            </Box>

            {/* How It Works Section */}
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
                            How It Works
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
                            Profit&Lost is designed to be simple, intuitive, and powerful. Here's how you can take control of your finances in just a few steps:
                        </Typography>
                        <Box sx={{
                            position: 'relative',
                            width: '100%',
                            overflow: 'hidden'
                        }}>
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
                                {[
                                    {
                                        number: 1,
                                        title: "Sign Up & Set Up",
                                        description: "Create your account and customize your categories (work, home, groceries, etc.). It only takes a few minutes!"
                                    },
                                    {
                                        number: 2,
                                        title: "Add Your Transactions",
                                        description: "Start adding your income and expenses. Profit&Lost automatically organizes them into your chosen categories."
                                    },
                                    {
                                        number: 3,
                                        title: "Visualize & Analyze",
                                        description: "Use our monthly and annual graphs to see where your money goes and make smarter financial decisions."
                                    },
                                    {
                                        number: 4,
                                        title: "Achieve Your Goals",
                                        description: "Set financial goals, track your progress, and watch your savings grow. Profit&Lost is here to help you succeed."
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

                            {/* Controles del carrusel (solo visibles en móvil) */}
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
                                    <span className="material-symbols-rounded">arrow_back_ios</span>
                                </IconButton>

                                {/* Indicadores de paso */}
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
                                    <span className="material-symbols-rounded">arrow_forward_ios</span>
                                </IconButton>
                            </Box>
                        </Box>
                    </Box>
                </Container>
            </Box>

            {/* Features Bento Section */}
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
                            Features
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
                            Discover all the tools you need to manage your finances effectively
                        </Typography>
                    </Box>
                </Container>
                <div className="features-container bento-grid">
                    <article className="feature-card highlight">
                        <span className="material-symbols-rounded no-select">bar_chart_4_bars</span>
                        <h4>Annual Report</h4>
                        <p>Visualize your annual expenses with monthly graphs and detailed category analysis. Stay on top of your finances all year round.</p>
                    </article>

                    <article className="feature-card">
                        <span className="material-symbols-rounded no-select">receipt_long</span>
                        <h4>Transactions</h4>
                        <p>Manage your monthly expenses with intuitive category and income vs. expense graphs. Know exactly where your money goes.</p>
                    </article>

                    <article className="feature-card">
                        <span className="material-symbols-rounded no-select">task_alt</span>
                        <h4>Goals <span className="soon-badge">Soon</span></h4>
                        <p>Set and achieve your financial goals with smart tracking. Save for what matters most.</p>
                    </article>

                    <article className="feature-card">
                        <span className="material-symbols-rounded no-select">note_alt</span>
                        <h4>Notes</h4>
                        <p>Keep important notes and reminders about your personal finances. Never miss a detail.</p>
                    </article>

                    <article className="feature-card highlight">
                        <span className="material-symbols-rounded no-select">account_balance</span>
                        <h4>Accounts</h4>
                        <p>Monitor your total account balance with a visual representation of your net worth. All your finances, in one place.</p>
                    </article>

                    <article className="feature-card">
                        <span className="material-symbols-rounded no-select">trending_up</span>
                        <h4>Investment Tracking <span className="soon-badge">Soon</span></h4>
                        <p>Monitor your investments and analyze their performance over time. Make smarter financial decisions.</p>
                    </article>

                    <article className="feature-card soon">
                        <span className="material-symbols-rounded no-select">inbox</span>
                        <h4>Inbox <span className="soon-badge">Soon</span></h4>
                        <p>Receive notifications and stay up to date with your personal finances. Always informed, always in control.</p>
                    </article>
                </div>
            </Box>

            <Footer />
        </Box>
    );
}