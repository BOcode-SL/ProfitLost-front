import { useState, useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * Dashboard Component
 * 
 * Main application container that manages:
 * - Navigation between different sections
 * - User authentication verification
 * - Onboarding process for new users
 * - Transaction creation flow
 * - Global layout structure (header, nav, content)
 */

// Contexts
import { useUser } from '../../contexts/UserContext';

// Components
import DashboardHeader from './components/DashboardHeader';
import DashboardNav from './components/DashboardNav';
import DashboardContent from './components/DashboardContent';
import GlobalOnboardingDialog from './components/GlobalOnboardingDialog';
import LoadingScreen from './components/LoadingScreen';
import TransactionForm from './features/transactions/components/TransactionForm';
import DrawerBase from './components/ui/DrawerBase';

// Utils
import { dispatchTransactionUpdated } from '../../utils/events';

export default function Dashboard() {
    const { t } = useTranslation();
    const { user, isLoading, userPreferences, userRole } = useUser();
    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();
    const [activeSection, setActiveSection] = useState('dashhome');
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [transactionDrawerOpen, setTransactionDrawerOpen] = useState(false);

    // Redirect to the authentication page if the user is not logged in
    useEffect(() => {
        if (!isLoading && !user) {
            navigate('/auth');
        }
    }, [user, isLoading, navigate]);

    // Manage the visibility of the onboarding dialog for new users
    useEffect(() => {
        // Check if onboarding data exists in user's preferences from context
        const onboardingCompleted = userPreferences?.onboarding?.completed || false;
        
        const shouldShowOnboarding = user && !onboardingCompleted;
            
        if (shouldShowOnboarding) {
            setShowOnboarding(true);
            
            // Clear section parameters while onboarding is active
            const section = searchParams.get('section');
            if (section) {
                setSearchParams({});
            }
            setActiveSection('dashhome');
        }
    }, [user, userPreferences, searchParams, setSearchParams]);

    // Synchronize the active section with URL parameters
    useEffect(() => {
        const section = searchParams.get('section');
        setActiveSection(section || 'dashhome');
    }, [searchParams]);

    // Define menu items with translations for the navigation
    const menuItems = useMemo(() => [
        { label: t('dashboard.dashhome.title'), icon: 'home', key: 'dashhome' },
        { label: t('dashboard.annualReport.title'), icon: 'bar_chart_4_bars', key: 'annualReport' },
        { label: t('dashboard.transactions.title'), icon: 'receipt_long', key: 'transactions' },
        { label: t('dashboard.accounts.title'), icon: 'account_balance', key: 'accounts' },
        { label: t('dashboard.notes.title'), icon: 'note_alt', key: 'notes' },
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

    const handleAddTransaction = () => {
        setTransactionDrawerOpen(true);
    };

    const handleTransactionDrawerClose = () => {
        setTransactionDrawerOpen(false);
    };

    const handleTransactionSubmit = () => {
        setTransactionDrawerOpen(false);
        
        // Dispatch global event to notify all components to refresh their data
        dispatchTransactionUpdated();
        
        // Also refresh the current section if it's relevant
        if (['transactions', 'annualReport', 'dashhome'].includes(activeSection)) {
            handleMenuItemClick(activeSection);
        }
    };

    // Display loading screen while authentication state is being verified
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
                    onAddTransaction={handleAddTransaction}
                    userRole={userRole}
                />
                <DashboardContent activeSection={activeSection} />
            </Box>

            {/* Onboarding dialog for new users */}
            <GlobalOnboardingDialog
                open={showOnboarding}
                onClose={handleOnboardingClose}
            />

            {/* Transaction creation drawer */}
            <DrawerBase
                open={transactionDrawerOpen}
                onClose={handleTransactionDrawerClose}
            >
                <TransactionForm
                    onClose={handleTransactionDrawerClose}
                    onSubmit={handleTransactionSubmit}
                />
            </DrawerBase>
        </>
    );
}