import { useState, useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Contexts
import { useUser } from '../../contexts/UserContext';

// Components
import DashboardHeader from './components/DashboardHeader';
import DashboardNav from './components/DashboardNav';
import DashboardContent from './components/DashboardContent';
import GlobalOnboardingDialog from './components/GlobalOnboardingDialog';
import LoadingScreen from './components/LoadingScreen';

// Dashboard component
export default function Dashboard() {
    const { t } = useTranslation();
    const { user, isLoading } = useUser();
    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();
    const [activeSection, setActiveSection] = useState('dashhome');
    const [showOnboarding, setShowOnboarding] = useState(false);

    // Redirect to the authentication page if the user is not logged in
    useEffect(() => {
        if (!isLoading && !user) {
            navigate('/auth');
        }
    }, [user, isLoading, navigate]);

    // Manage the visibility of the onboarding dialog
    useEffect(() => {
        const shouldShowOnboarding = user && 
            (!user.onboarding || !user.onboarding.completed) && 
            activeSection !== 'analytics';
            
        if (shouldShowOnboarding) {
            setShowOnboarding(true);
            
            // Clear section parameters while onboarding is active
            const section = searchParams.get('section');
            if (section) {
                setSearchParams({});
            }
            setActiveSection('dashhome');
        }
    }, [user, searchParams, setSearchParams, activeSection]);

    // Synchronize the active section with URL parameters
    useEffect(() => {
        const section = searchParams.get('section');
        setActiveSection(section || 'dashhome');
    }, [searchParams]);

    // Define menu items with translations
    const menuItems = useMemo(() => [
        { label: t('dashboard.dashhome.title'), icon: 'home', key: 'dashhome' },
        { label: t('dashboard.annualReport.title'), icon: 'bar_chart_4_bars', key: 'annualReport' },
        { label: t('dashboard.transactions.title'), icon: 'receipt_long', key: 'transactions' },
        { label: t('dashboard.accounts.title'), icon: 'account_balance', key: 'accounts' },
        // { label: 'Goals', icon: 'task_alt', key: 'goals' },
        { label: t('dashboard.notes.title'), icon: 'note_alt', key: 'notes' },
        { label: t('dashboard.analytics.title'), icon: 'analytics', key: 'analytics', adminOnly: true },
        { label: t('dashboard.notifications.title'), icon: 'notifications', key: 'notifications', adminOnly: true }
    ], [t]);

    // Event handlers
    const handleMenuItemClick = (sectionKey: string) => {
        setActiveSection(sectionKey);
        setSearchParams(sectionKey === 'dashhome' ? {} : { section: sectionKey });
    };

    const handleOnboardingClose = () => {
        localStorage.removeItem('onboarding_progress');
        setShowOnboarding(false);
    };

    // Display loading screen while data is being fetched
    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <>
            <Box sx={{
                display: { xs: 'flex', md: 'grid' },
                flexDirection: { xs: 'column' },
                gridTemplateColumns: { md: '280px 1fr' },
                gridTemplateRows: { md: '90px 1fr' },
                gridTemplateAreas: { md: `"Nav Header" "Nav Content"` },
                minHeight: '100vh',
                bgcolor: 'background.default'
            }}>
                <DashboardHeader user={user} />
                <DashboardNav
                    activeSection={activeSection}
                    handleMenuItemClick={handleMenuItemClick}
                    menuItems={menuItems}
                />
                <DashboardContent activeSection={activeSection} />
            </Box>

            <GlobalOnboardingDialog
                open={showOnboarding}
                onClose={handleOnboardingClose}
            />
        </>
    );
}