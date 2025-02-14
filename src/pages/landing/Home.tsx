import { useEffect } from 'react';
import Button from '@mui/material/Button';

// Components
import Footer from './components/Footer';
import Header from './components/Header';

// Styles
import './Home.scss';

// Home component for the landing page
export default function Home() {

    useEffect(() => {
        // Function to handle scroll events
        const handleScroll = () => {
            const header = document.querySelector('.nav-container');
            // Check if the scroll position is greater than 50
            if (window.scrollY > 50) {
                header?.classList.add('scrolled'); // Add 'scrolled' class if true
            } else {
                header?.classList.remove('scrolled'); // Remove 'scrolled' class if false
            }
        };

        // Add scroll event listener
        window.addEventListener('scroll', handleScroll);
        // Cleanup function to remove the event listener
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="home-container">
            <Header />

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-container">
                    <div className="hero-content">
                        <h2 className="hero-title">
                            Manage your finances in a SMART way
                        </h2>
                        <p className="hero-subtitle">
                            Take control of your finances and save more with our platform
                        </p>
                        <Button
                            variant="contained"
                            className="cta-button"
                            onClick={() => window.location.href = '/auth'}>
                            Start Now
                        </Button>
                    </div>
                    <div className="hero-image">
                        <img
                            className="no-select"
                            src="https://res.cloudinary.com/dnhlagojg/image/upload/v1739553639/AppPhotos/Brand/mockup/annualreport.png"
                            alt="Dashboard Preview"
                        />
                    </div>
                </div>
            </section>

            {/* Features Bento Section */}
            <section className="features-section">
                <div className="features-container bento-grid">
                    <article className="feature-card highlight">
                        <span className="material-symbols-rounded no-select">bar_chart_4_bars</span>
                        <h4>Annual Report</h4>
                        <p>Visualize your annual expenses with monthly graphs and detailed category analysis</p>
                    </article>

                    <article className="feature-card">
                        <span className="material-symbols-rounded no-select">receipt_long</span>
                        <h4>Transactions</h4>
                        <p>Manage your monthly expenses with intuitive category and income vs expense graphs</p>
                    </article>

                    <article className="feature-card">
                        <span className="material-symbols-rounded no-select">task_alt</span>
                        <h4>Goals <span className="soon-badge">Soon</span></h4>
                        <p>Set and achieve your financial goals with smart tracking</p>
                    </article>

                    <article className="feature-card">
                        <span className="material-symbols-rounded no-select">note_alt</span>
                        <h4>Notes</h4>
                        <p>Keep important notes and reminders about your personal finances</p>
                    </article>

                    <article className="feature-card highlight">
                        <span className="material-symbols-rounded no-select">account_balance</span>
                        <h4>Accounts</h4>
                        <p>Monitor your total account balance with a visual representation of your net worth</p>
                    </article>

                    <article className="feature-card">
                        <span className="material-symbols-rounded no-select">trending_up</span>
                        <h4>Investment Tracking <span className="soon-badge">Soon</span></h4>
                        <p>Monitor your investments and analyze their performance over time</p>
                    </article>

                    <article className="feature-card soon">
                        <span className="material-symbols-rounded no-select">inbox</span>
                        <h4>Inbox <span className="soon-badge">Soon</span></h4>
                        <p>Receive notifications and stay up to date with your personal finances</p>
                    </article>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
};