import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { useUser } from '../../contexts/UserContext';
import { useNavigate, useSearchParams } from 'react-router-dom';

import DashboardHeader from './components/DashboardHeader';
import DashboardNav from './components/DashboardNav';
import DashboardContent from './components/DashboardContent';

import './Dashboard.scss';

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
            <div className='loading-container'>
                <img className="no-select" src="https://res.cloudinary.com/dnhlagojg/image/upload/v1726670794/AppPhotos/Brand/logoPL.svg" alt="logo" />
            </div>
        );
    }

    const menuItems = [
        { label: 'Dashboard', icon: 'home' },
        { label: 'Annual Report', icon: 'bar_chart_4_bars' },
        { label: 'Transactions', icon: 'receipt_long' },
        { label: 'Accounts', icon: 'credit_card' },
        { label: 'Goals', icon: 'task_alt' },
        { label: 'Notes', icon: 'description' }
    ];

    return (
        <Box className='dashboard' sx={{ bgcolor: 'background.default' }}>
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