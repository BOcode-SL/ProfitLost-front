import React, { useEffect, useCallback, useState, Suspense } from 'react';
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
import CircularProgress from '@mui/material/CircularProgress';

import { authService } from '../../../services/auth.service';
import { User } from '../../../types/models/user';

const UserSettings = React.lazy(() => import('../features/settings/UserSettings'));
const SecurityPrivacy = React.lazy(() => import('../features/settings/SecurityPrivacy'));
const Help = React.lazy(() => import('../features/settings/Help'));

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
            case 'Profile Settings':
                return <UserSettings />;
            case 'Security and Privacy':
                return <SecurityPrivacy />;
            case 'Help':
                return <Help />;
            default:
                return null;
        }
    };

    return (
        <>
            <Box sx={{
                gridArea: 'Header',
                position: 'fixed',
                top: 0,
                right: 0,
                left: { xs: 0, md: '280px' },
                width: { xs: '100%', md: 'calc(100% - 280px)' },
                padding: { xs: '1rem', md: '1rem 1rem 0 0' },
                zIndex: 999
            }}>
                <Paper
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        gap: 2,
                        p: 1,
                        borderRadius: 3,
                        transition: 'all 0.3s ease',
                        '&.scrolled': {
                            bgcolor: 'rgba(255, 255, 255, 0.8)',
                            backdropFilter: 'blur(10px)'
                        }
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
                        <span className="material-symbols-rounded no-select">
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
                PaperProps={{
                    sx: {
                        width: {
                            xs: '100%',
                            sm: 450
                        },
                        p: 2,
                        bgcolor: 'background.default'
                    }
                }}
            >
                <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-start ', mb: 2 }}>
                        <IconButton onClick={() => setDrawerOpen(false)}>
                            <span className="material-symbols-rounded">close</span>
                        </IconButton>
                    </Box>

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
                            <Typography
                                sx={{
                                    fontWeight: 500,
                                    m: 0
                                }}
                            >
                                {user?.name}
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: '0.8rem',
                                    fontWeight: 400,
                                    m: 0
                                }}
                            >
                                {user?.email}
                            </Typography>
                        </Box>
                    </Paper>

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
                                    <ListItemButton onClick={() => handleSettingsClick(item.text)}>
                                        <ListItemIcon>
                                            <span className="material-symbols-rounded">{item.icon}</span>
                                        </ListItemIcon>
                                        <ListItemText primary={item.text} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Paper>

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
                                    <ListItemButton onClick={() => handleSettingsClick(item.text)}>
                                        <ListItemIcon>
                                            <span className="material-symbols-rounded">{item.icon}</span>
                                        </ListItemIcon>
                                        <ListItemText primary={item.text} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Box>

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

            <Drawer
                anchor="right"
                open={settingsDrawer.open}
                onClose={() => setSettingsDrawer({ open: false, component: '' })}
                PaperProps={{
                    sx: {
                        width: {
                            xs: '100%',
                            sm: 450
                        },
                        bgcolor: 'background.default',
                        p: 2
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
                        {settingsDrawer.component === 'Profile Settings' && 'Profile Settings'}
                        {settingsDrawer.component === 'Security and Privacy' && 'Security & Privacy'}
                        {settingsDrawer.component === 'Help' && 'Help'}
                    </Typography>
                </Box>
                <Suspense fallback={
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <CircularProgress />
                    </Box>
                }>
                    {renderSettingsComponent()}
                </Suspense>
            </Drawer>
        </>
    );
};

export default DashboardHeader;
