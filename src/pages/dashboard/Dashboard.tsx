import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { useUser } from '../../contexts/UserContext';
import DashboardHeader from './components/DashboardHeader';
import DashboardNav from './components/DashboardNav';
import DashboardContent from './components/DashboardContent';

export default function Dashboard() {
    const [activeSection, setActiveSection] = useState('Dashboard');
    const { user, isLoading } = useUser();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        if (!isLoading && !user) {
            navigate('/auth');
        }
    }, [user, isLoading, navigate]);

    useEffect(() => {
        const section = searchParams.get('section');
        if (section) {
            setActiveSection(section);
        }
    }, [searchParams]);

    const handleMenuItemClick = (sectionName: string) => {
        setActiveSection(sectionName);
        setSearchParams(sectionName === 'Dashboard' ? {} : { section: sectionName });
    };

    if (isLoading) {
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
        { label: 'Dashboard', icon: 'home' },
        { label: 'Annual Report', icon: 'bar_chart_4_bars' },
        { label: 'Transactions', icon: 'receipt_long' },
        { label: 'Accounts', icon: 'account_balance' },
        // { label: 'Goals', icon: 'task_alt' },
        { label: 'Notes', icon: 'note_alt' },
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