import React, { useState, Suspense, useContext, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Box, Badge, Avatar, Paper, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Button, IconButton, Typography, CircularProgress, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';

// Services
import { authService } from '../../../services/auth.service';

// Types
import { User } from '../../../types/models/user';

// Contexts
import { ThemeContext } from '../../../contexts/ThemeContext';
import { useUser } from '../../../contexts/UserContext';

// Components
const UserSettings = React.lazy(() => import('../features/settings/UserSettings'));
const SecurityPrivacy = React.lazy(() => import('../features/settings/SecurityPrivacy'));
const Help = React.lazy(() => import('../features/settings/Help'));

import { toggleCurrencyVisibility, isCurrencyHidden, CURRENCY_VISIBILITY_EVENT } from '../../../utils/formatCurrency';

interface DashboardHeaderProps {
    user: User | null; // User object or null
}

// DashboardHeader component
export default function DashboardHeader({ user }: DashboardHeaderProps) {
    const { t } = useTranslation();
    const { setUser } = useUser();
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    const navigate = useNavigate();

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [settingsDrawer, setSettingsDrawer] = useState<{
        open: boolean;
        component: string;
    }>({
        open: false,
        component: ''
    });
    const [isDisabledCurrencyAmount, setIsDisabledCurrencyAmount] = useState(isCurrencyHidden());

    // Listen for changes in currency visibility
    useEffect(() => {
        const handleVisibilityChange = (event: Event) => {
            const customEvent = event as CustomEvent;
            setIsDisabledCurrencyAmount(customEvent.detail.isHidden);
        };

        window.addEventListener(CURRENCY_VISIBILITY_EVENT, handleVisibilityChange);
        return () => {
            window.removeEventListener(CURRENCY_VISIBILITY_EVENT, handleVisibilityChange);
        };
    }, []);

    // Handle user logout
    const handleLogout = async () => {
        try {
            await authService.logout();
            setUser(null);
            toast.success('See you soon!');
            navigate('/auth', { replace: true });
        } catch (error) {
            toast.error('Logout error');
            console.error('Logout error:', error);
        }
    };

    // Menu items for settings
    const menuItems1 = [
        { icon: 'person', text: t('dashboard.settings.userSettings.title') },
        { icon: 'security', text: t('dashboard.settings.securityPrivacy.title') },
    ];

    const menuItems2 = [
        { icon: 'help', text: t('dashboard.settings.help.title') },
    ];

    // Handle click on settings menu item
    const handleSettingsClick = (component: string) => {
        setDrawerOpen(false);
        setSettingsDrawer({
            open: true,
            component
        });
    };

    // Close the settings drawer
    const handleCloseSettingsDrawer = () => {
        setSettingsDrawer({ open: false, component: '' });
    };

    // Render the selected settings component
    const renderSettingsComponent = () => {
        switch (settingsDrawer.component) {
            case t('dashboard.settings.userSettings.title'):
                return <UserSettings onSuccess={handleCloseSettingsDrawer} />;
            case t('dashboard.settings.securityPrivacy.title'):
                return <SecurityPrivacy onSuccess={handleCloseSettingsDrawer} />;
            case t('dashboard.settings.help.title'):
                return <Help />;
            default:
                return null;
        }
    };

    // Handle toggling currency visibility
    const handleToggleCurrency = () => {
        toggleCurrencyVisibility();
    };

    // Main return statement for the DashboardHeader component
    return (
        <>
            {/* Box container for the header section */}
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
                {/* Paper component for the header content */}
                <Paper
                    elevation={3}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        gap: 2,
                        p: 1,
                        borderRadius: 3,
                        transition: 'all 0.3s ease',
                    }}
                >
                    {/* Box for theme toggle and notifications */}
                    <Box >
                        {/* IconButton for toggling currency visibility */}
                        <IconButton onClick={handleToggleCurrency}>
                            <Tooltip title={t(`dashboard.tooltips.${isDisabledCurrencyAmount ? 'enable_currency_amount' : 'disable_currency_amount'}`)}>
                                <span className="material-symbols-rounded">
                                    {isDisabledCurrencyAmount ? 'visibility' : 'visibility_off'}
                                </span>
                            </Tooltip>
                        </IconButton>

                        {/* IconButton for toggling theme */}
                        <IconButton onClick={toggleTheme}>
                            <Tooltip title={t(`dashboard.tooltips.${isDarkMode ? 'light_mode' : 'dark_mode'}`)}>
                                <span className="material-symbols-rounded">{isDarkMode ? 'light_mode' : 'dark_mode'}</span>
                            </Tooltip>
                        </IconButton>

                        {/* IconButton for notifications */}
                        <IconButton disabled={true}>
                            <Badge
                                color="primary"
                            // variant="dot"
                            >
                                <Tooltip title={t('dashboard.tooltips.inbox')}>
                                    <span className="material-symbols-rounded no-select">
                                        mail
                                    </span>
                                </Tooltip>
                            </Badge>
                        </IconButton>
                    </Box>

                    {/* Avatar for user profile */}
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
                        {user?.name?.[0].toUpperCase()}
                    </Avatar>
                </Paper >
            </Box >

            {/* Drawer for user settings */}
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
                        p: 2
                    }
                }}
            >
                <Box>
                    {/* Box for close button */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-start ', mb: 2 }}>
                        <IconButton onClick={() => setDrawerOpen(false)}>
                            <span className="material-symbols-rounded">close</span>
                        </IconButton>
                    </Box>

                    {/* Paper for user information */}
                    <Paper elevation={3} sx={{
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

                    {/* Paper for settings menu items */}
                    <Paper
                        elevation={3}
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

                    {/* Paper for additional settings menu items */}
                    <Paper
                        elevation={3}
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

                {/* Box for logout button */}
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
                        {t('dashboard.common.logout')}
                    </Button>
                </Box>
            </Drawer>

            {/* Drawer for settings component */}
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
                        p: 2
                    }
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    {/* IconButton for navigating back to the previous screen */}
                    <IconButton
                        onClick={() => {
                            setSettingsDrawer({ open: false, component: '' });
                            setDrawerOpen(true);
                        }}
                        sx={{ mr: 2 }}
                    >
                        <span className="material-symbols-rounded">arrow_back</span>
                    </IconButton>
                    {/* Typography for settings title */}
                    <Typography variant="h6">
                        {settingsDrawer.component === t('dashboard.settings.userSettings.title') && t('dashboard.settings.userSettings.title')}
                        {settingsDrawer.component === t('dashboard.settings.securityPrivacy.title') && t('dashboard.settings.securityPrivacy.title')}
                        {settingsDrawer.component === t('dashboard.settings.help.title') && t('dashboard.settings.help.title')}
                    </Typography>
                </Box>
                {/* Suspense for loading the settings component */}
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