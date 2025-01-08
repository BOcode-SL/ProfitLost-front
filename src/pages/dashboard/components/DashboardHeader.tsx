import { useEffect, useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { authService } from '../../../services/auth.service';
import { User } from '../../../types/models/user.types';

import './DashboardHeader.scss';

import UserSettings from '../features/settings/UserSettings';
import SecurityPrivacy from '../features/settings/SecurityPrivacy';
// import Help from '../features/settings/Help';

interface DashboardHeaderProps {
    user: User | null;
}

const DashboardHeader = ({ user }: DashboardHeaderProps) => {
    const navigate = useNavigate();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [settingsDrawer, setSettingsDrawer] = useState<{
        open: boolean;
        component: string;
    }>({
        open: false,
        component: ''
    });

    const handleScroll = useCallback(() => {
        const headerContainer = document.querySelector('.dashboard__header-container');
        if (headerContainer) {
            headerContainer.classList.toggle('scrolled', window.scrollY > 0);
        }
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    const handleLogout = async () => {
        try {
            await authService.logout();
            toast.success('See you soon!');
            navigate('/login');
        } catch (error) {
            toast.error('Logout error');
            console.error('Logout error:', error);
        }
    };

    const menuItems1 = [
        { icon: 'person', text: 'Profile Settings' },
        { icon: 'security', text: 'Security and Privacy' },
    ];

    const menuItems2 = [
        { icon: 'help', text: 'Help' },
    ];

    const handleSettingsClick = (component: string) => {
        setDrawerOpen(false);
        setSettingsDrawer({
            open: true,
            component
        });
    };

    const renderSettingsComponent = () => {
        switch (settingsDrawer.component) {
            case 'profile':
                return <UserSettings />;
            case 'security':
            return <SecurityPrivacy />;
            // case 'help':
            //     return <Help />;
            default:
                return null;
        }
    };

    return (
        <>
            <Box className='dashboard__header'>
                <Paper
                    className='dashboard__header-container'
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        gap: 2,
                        p: 1,
                        borderRadius: 3
                    }}
                >
                    <Badge
                        color="primary"
                        variant="dot"
                        sx={{
                            cursor: 'pointer',
                            '&:hover': {
                                opacity: 0.8,
                            }
                        }}
                    >
                        <span className="material-symbols-rounded">
                            mail
                        </span>
                    </Badge>
                    <Avatar
                        variant="square"
                        onClick={() => setDrawerOpen(true)}
                        src={user?.profileImage}
                        alt={user?.name}
                        sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 2,
                            cursor: 'pointer',
                            bgcolor: 'primary.main'
                        }}
                    >
                        {user?.name?.[0]}
                    </Avatar>
                </Paper>
            </Box>

            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                className="dashboard__header-drawer"
                PaperProps={{
                    sx: {
                        width: 450,
                        p: 2,
                        bgcolor: 'background.default'
                    }
                }}
            >
                <Box>
                    {/* User Info Section */}
                    <Paper elevation={2} sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        mb: 3,
                        mt: 2,
                        p: 2,
                        borderRadius: 3
                    }}>
                        <Avatar
                            variant="square"
                            src={user?.profileImage}
                            alt={user?.name}
                            sx={{
                                width: 48,
                                height: 48,
                                bgcolor: 'primary.main',
                                borderRadius: 2
                            }}
                        >
                            {user?.name?.[0]}
                        </Avatar>
                        <Box>
                            <p className='dashboard__header-name'>{user?.name}</p>
                            <p className='dashboard__header-email'>{user?.email}</p>
                        </Box>
                    </Paper>

                    {/* Menu Items 1*/}
                    <Paper
                        elevation={2}
                        sx={{
                            mb: 2,
                            borderRadius: 3,
                            overflow: 'hidden'
                        }}
                    >
                        <List disablePadding>
                            {menuItems1.map((item) => (
                                <ListItem key={item.text} disablePadding>
                                    <ListItemButton
                                        onClick={() => handleSettingsClick(item.icon === 'person' ? 'profile' : 'security')}
                                        sx={{
                                            py: 1.5,
                                            '&:hover': {
                                                bgcolor: 'rgba(254, 111, 20, 0.08)',
                                            }
                                        }}
                                    >
                                        <ListItemIcon>
                                            <span className="material-symbols-rounded">
                                                {item.icon}
                                            </span>
                                        </ListItemIcon>
                                        <ListItemText primary={item.text} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Paper>

                    {/* Menu Items 2*/}
                    <Paper
                        elevation={2}
                        sx={{
                            borderRadius: 3,
                            overflow: 'hidden'
                        }}
                    >
                        <List disablePadding>
                            {menuItems2.map((item) => (
                                <ListItem key={item.text} disablePadding>
                                    <ListItemButton
                                        sx={{
                                            py: 1.5,
                                            '&:hover': {
                                                bgcolor: 'rgba(254, 111, 20, 0.08)',
                                            }
                                        }}
                                    >
                                        <ListItemIcon>
                                            <span className="material-symbols-rounded">
                                                {item.icon}
                                            </span>
                                        </ListItemIcon>
                                        <ListItemText primary={item.text} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Box>

                {/* Logout Button */}
                <Box sx={{ mt: 'auto', mb: 2 }}>
                    <Button
                        fullWidth
                        variant="outlined"
                        color="primary"
                        onClick={handleLogout}
                        startIcon={
                            <span className="material-symbols-rounded">
                                logout
                            </span>
                        }
                    >
                        Log out
                    </Button>
                </Box>
            </Drawer>

            {/* Drawer de Configuraciones */}
            <Drawer
                anchor="right"
                open={settingsDrawer.open}
                onClose={() => setSettingsDrawer({ open: false, component: '' })}
                PaperProps={{
                    sx: {
                        width: 450,
                        bgcolor: 'background.default',
                        px: 1,
                        py: 1
                    }
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <IconButton
                        onClick={() => {
                            setSettingsDrawer({ open: false, component: '' });
                            setDrawerOpen(true);
                        }}
                        sx={{ mr: 2 }}
                    >
                        <span className="material-symbols-rounded">arrow_back</span>
                    </IconButton>
                    <Typography variant="h6">
                        {settingsDrawer.component === 'profile' && 'Profile Settings'}
                        {settingsDrawer.component === 'security' && 'Security & Privacy'}
                        {settingsDrawer.component === 'help' && 'Help'}
                    </Typography>
                </Box>
                {renderSettingsComponent()}
            </Drawer>
        </>
    );
};

export default DashboardHeader;
