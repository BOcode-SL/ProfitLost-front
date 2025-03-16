import { useState, useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Drawer, useTheme } from '@mui/material';

// Contexts
import { useUser } from '../../contexts/UserContext';

// Components
import DashboardHeader from './components/DashboardHeader';
import DashboardNav from './components/DashboardNav';
import DashboardContent from './components/DashboardContent';
import GlobalOnboardingDialog from './components/GlobalOnboardingDialog';
import LoadingScreen from './components/LoadingScreen';
import TransactionForm from './features/transactions/components/TransactionForm';

// Services
import { categoryService } from '../../services/category.service';

// Types
import type { Category } from '../../types/models/category';

// Dashboard component
export default function Dashboard() {
    const { t } = useTranslation();
    const { user, isLoading } = useUser();
    const navigate = useNavigate();
    const theme = useTheme();

    const [searchParams, setSearchParams] = useSearchParams();
    const [activeSection, setActiveSection] = useState('dashhome');
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [transactionDrawerOpen, setTransactionDrawerOpen] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);

    // Redirect to the authentication page if the user is not logged in
    useEffect(() => {
        if (!isLoading && !user) {
            navigate('/auth');
        }
    }, [user, isLoading, navigate]);

    // Fetch categories for transaction form
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await categoryService.getAllCategories();
                if (response.success) {
                    setCategories(response.data as Category[]);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

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

    const handleAddTransaction = () => {
        setTransactionDrawerOpen(true);
    };

    const handleTransactionDrawerClose = () => {
        setTransactionDrawerOpen(false);
    };

    const handleTransactionSubmit = () => {
        setTransactionDrawerOpen(false);
        // If we're on the transactions page, navigate to it to refresh the data
        if (activeSection === 'transactions') {
            handleMenuItemClick('transactions');
        }
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
                    onAddTransaction={handleAddTransaction}
                />
                <DashboardContent activeSection={activeSection} />
            </Box>

            <GlobalOnboardingDialog
                open={showOnboarding}
                onClose={handleOnboardingClose}
            />

            <Drawer
                anchor="bottom"
                open={transactionDrawerOpen}
                onClose={handleTransactionDrawerClose}
                PaperProps={{
                    sx: {
                        width: { xs: '100%', sm: '450px' },
                        borderRadius: { xs: '15px 15px 0 0', sm: '0' },
                        height: { xs: 'calc(100% - 56px)', sm: '100%' },
                        top: { xs: 'auto', sm: '0' },
                        bottom: { xs: '0', sm: 'auto' },
                        [theme.breakpoints.up('sm')]: {
                            left: 'auto',
                            right: 0
                        }
                    }
                }}
                SlideProps={{
                    direction: 'up'
                }}
            >
                <TransactionForm
                    onClose={handleTransactionDrawerClose}
                    onSubmit={handleTransactionSubmit}
                    categories={categories}
                />
            </Drawer>
        </>
    );
}