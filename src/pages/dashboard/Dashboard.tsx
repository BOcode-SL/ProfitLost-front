import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Contexts
import { useUser } from '../../contexts/UserContext';

// Components
import DashboardHeader from './components/DashboardHeader';
import DashboardNav from './components/DashboardNav';
import DashboardContent from './components/DashboardContent';

// Dashboard component
export default function Dashboard() {
    const { t } = useTranslation();
    const { user, isLoading } = useUser();
    const navigate = useNavigate();

    const [activeSection, setActiveSection] = useState('dashhome');
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        // Redirect to auth if user is not logged in
        if (!isLoading && !user) {
            navigate('/auth');
        }
    }, [user, isLoading, navigate]);

    useEffect(() => {
        // Get section from search parameters
        const section = searchParams.get('section');
        if (section) {
            setActiveSection(section);
        } else {
            setActiveSection('dashhome');
        }
    }, [searchParams]);

    const handleMenuItemClick = (sectionKey: string) => {
        // Handle menu item click
        setActiveSection(sectionKey);
        setSearchParams(sectionKey === 'dashhome' ? {} : { section: sectionKey });
    };

    if (isLoading) {
        // Show loading state
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                bgcolor: 'background.default'
            }}>
                <Box
                    component="img"
                    src="https://res.cloudinary.com/dnhlagojg/image/upload/v1726670794/AppPhotos/Brand/logoPL.svg"
                    alt="logo"
                    sx={{
                        width: 200,
                        userSelect: 'none'
                    }}
                />
            </Box>
        );
    }

    const menuItems = [
        { label: t('dashboard.dashhome.title'), icon: 'home', key: 'dashhome' },
        { label: t('dashboard.annualReport.title'), icon: 'bar_chart_4_bars', key: 'annualReport' },
        { label: t('dashboard.transactions.title'), icon: 'receipt_long', key: 'transactions' },
        { label: t('dashboard.accounts.title'), icon: 'account_balance', key: 'accounts' },
        // { label: 'Goals', icon: 'task_alt', key: 'goals' },
        { label: t('dashboard.notes.title'), icon: 'note_alt', key: 'notes' },
    ];

    return (
        <Box sx={{
            display: {
                xs: 'flex',
                md: 'grid'
            },
            flexDirection: {
                xs: 'column'
            },
            gridTemplateColumns: {
                md: '280px 1fr'
            },
            gridTemplateRows: {
                md: '90px 1fr'
            },
            gridTemplateAreas: {
                md: `
                    "Nav Header"
                    "Nav Content"
                `
            },
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
    );
}