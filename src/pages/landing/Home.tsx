import { useEffect } from 'react';
import Button from '@mui/material/Button';

import './Home.scss';

const Home = () => {

    useEffect(() => {
        const handleScroll = () => {
            const header = document.querySelector('.nav-container');
            if (window.scrollY > 50) {
                header?.classList.add('scrolled');
            } else {
                header?.classList.remove('scrolled');
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="home-container">
            {/* Header */}
            <header className="header">
                <nav className="nav-container">
                    <img className="no-select" src="https://res.cloudinary.com/dnhlagojg/image/upload/v1726670794/AppPhotos/Brand/logoPL3.svg" alt="logo" />

                    <div className="nav-buttons">
                        <button
                            className="cta-button"
                            onClick={() => window.location.href = '/login'}>
                            Login
                        </button>
                    </div>
                </nav>
            </header>

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
                            onClick={() => window.location.href = '/login'}>
                            Start Now
                        </Button>
                    </div>
                    <div className="hero-image">
                        <img
                            className="no-select"
                            src="https://res.cloudinary.com/dnhlagojg/image/upload/v1736263487/AppPhotos/Brand/mockup/ujcemumjttmpe3mnjfmt.png"
                            alt="Dashboard Preview"
                        />
                    </div>
                </div>
            </section>

            {/* Features Bento Section */}
            <section className="features-section">
                <div className="features-container bento-grid">
                    <article className="feature-card highlight">
                        <span className="material-symbols-rounded no-select">query_stats</span>
                        <h4>Annual Report</h4>
                        <p>Visualize your annual expenses with monthly graphs and detailed category analysis</p>
                    </article>

                    <article className="feature-card">
                        <span className="material-symbols-rounded no-select">receipt_long</span>
                        <h4>Transactions</h4>
                        <p>Manage your monthly expenses with intuitive category and income vs expense graphs</p>
                    </article>

                    <article className="feature-card">
                        <span className="material-symbols-rounded no-select">savings</span>
                        <h4>Goals</h4>
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
                        <p>Recive notifications and stay up to date with your personal finances</p>
                    </article>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-container">
                    <div className="footer-content">
                        <div className="footer-section">
                            <img className="no-select" src="https://res.cloudinary.com/dnhlagojg/image/upload/v1726670794/AppPhotos/Brand/logoPL3.svg" alt="logo" />
                            <p>Simplifying personal finance management for everyone.</p>
                        </div>

                        <div className="footer-section">
                            <h4>Company</h4>
                            <ul>
                                <li>About Us</li>
                                <li>Contact</li>
                                <li>Privacy Policy</li>
                                <li>Terms of Service</li>
                            </ul>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>&copy; 2024 Profit&Lost. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;