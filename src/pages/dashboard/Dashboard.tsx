import { useState } from 'react';
import Box from '@mui/material/Box';

import DashboardHeader from './components/DashboardHeader';
import DashboardNav from './components/DashboardNav';
import DashboardContent from './components/DashboardContent';

import './Dashboard.scss';

export default function Dashboard() {
    const [activeSection, setActiveSection] = useState('Dashboard');

    const menuItems = [
        {
            label: 'Dashboard',
            icon: 'home',
        },
        {
            label: 'Annual Report',
            icon: 'bar_chart_4_bars',
        },
        {
            label: 'Movements',
            icon: 'receipt_long',
        },
        {
            label: 'Accounts',
            icon: 'credit_card',
        },
        {
            label: 'Goals',
            icon: 'task_alt',
        },
        {
            label: 'Notes',
            icon: 'description',
        }
    ];

    return (
        <Box className='dashboard' sx={{ bgcolor: 'background.default' }}>
            <DashboardHeader
                userImage=""
                userName=""
            />

            <DashboardNav
                activeSection={activeSection}
                handleMenuItemClick={setActiveSection}
                menuItems={menuItems}
            />

            <DashboardContent activeSection={activeSection} />
        </Box>
    );
}