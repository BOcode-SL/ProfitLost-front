import React, { useState, Suspense, useContext, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Box, Badge, Avatar, Paper, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Button, IconButton, Typography, CircularProgress, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';

// Services
import { authService } from '../../../services/auth.service';
import notificationService from '../../../services/notification.service';

// Types
import { User } from '../../../types/models/user';

// Contexts
import { ThemeContext } from '../../../contexts/ThemeContext';
import { useUser } from '../../../contexts/UserContext';

// Components
const UserSettings = React.lazy(() => import('../features/settings/UserSettings'));
const SecurityPrivacy = React.lazy(() => import('../features/settings/SecurityPrivacy'));
const Help = React.lazy(() => import('../features/settings/Help'));
const NotificationsInbox = React.lazy(() => import('../features/notifications/inbox/NotificationsInbox'));
const NotificationPreferences = React.lazy(() => import('../features/settings/NotificationPreferences'));

import { toggleCurrencyVisibility, isCurrencyHidden, CURRENCY_VISIBILITY_EVENT } from '../../../utils/currencyUtils';

interface DashboardHeaderProps {
    user: User | null; // User object or null
}

// Settings drawer component type
interface SettingsDrawerState {
    open: boolean;
    component: string;
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
    const { t } = useTranslation();
    const { setUser } = useUser();
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    const navigate = useNavigate();

    // State management
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [notificationsDrawerOpen, setNotificationsDrawerOpen] = useState(false);
    const [settingsDrawer, setSettingsDrawer] = useState<SettingsDrawerState>({
        open: false,
        component: ''
    });
    const [isDisabledCurrencyAmount, setIsDisabledCurrencyAmount] = useState(isCurrencyHidden());
    const [unreadNotifications, setUnreadNotifications] = useState(0);

    // Menu items for settings
    const menuItems = {
        primary: [
            { icon: 'person', text: t('dashboard.settings.userSettings.title') },
            { icon: 'security', text: t('dashboard.settings.securityPrivacy.title') },
            { icon: 'notifications', text: t('dashboard.settings.notifications.title') },
        ],
        secondary: [
            { icon: 'help', text: t('dashboard.settings.help.title') },
        ]
    };

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

    // Load the unread notifications count when the component mounts
    useEffect(() => {
        const loadUnreadCount = async () => {
            try {
                const count = await notificationService.getUnreadCount();
                setUnreadNotifications(count);
            } catch (error) {
                console.error('Error loading unread notifications count:', error);
            }
        };

        loadUnreadCount();
    }, []);

    // Event handlers
    const handleLogout = async () => {
        try {
            await authService.logout();
            setUser(null);
            toast.success('See you soon!');
            navigate('/auth', { replace: true });
        } catch (error) {
            toast.error('Logout error');
            console.error('Error during logout:', error);
        }
    };

    const handleSettingsClick = (component: string) => {
        setDrawerOpen(false);
        setSettingsDrawer({
            open: true,
            component
        });
    };

    const handleCloseSettingsDrawer = () => {
        setSettingsDrawer({ open: false, component: '' });
    };

    const handleToggleCurrency = () => {
        toggleCurrencyVisibility();
    };

    const handleOpenNotifications = () => {
        setNotificationsDrawerOpen(true);
    };

    const handleCloseNotifications = () => {
        setNotificationsDrawerOpen(false);
    };

    const handleMarkAllAsRead = () => {
        setUnreadNotifications(0);
        toast.success(t('dashboard.notifications.success.markedAllAsRead'));
    };

    // Component renderers
    const renderSettingsComponent = () => {
        switch (settingsDrawer.component) {
            case t('dashboard.settings.userSettings.title'):
                return <UserSettings onSuccess={handleCloseSettingsDrawer} />;
            case t('dashboard.settings.securityPrivacy.title'):
                return <SecurityPrivacy onSuccess={handleCloseSettingsDrawer} />;
            case t('dashboard.settings.help.title'):
                return <Help />;
            case t('dashboard.settings.notifications.title'):
                return <NotificationPreferences onSuccess={handleCloseSettingsDrawer} />;
            default:
                return null;
        }
    };

    return (
        <>
            {/* Header Bar */}
            <HeaderBar 
                user={user}
                isDarkMode={isDarkMode}
                toggleTheme={toggleTheme}
                isDisabledCurrencyAmount={isDisabledCurrencyAmount}
                unreadNotifications={unreadNotifications}
                onToggleCurrency={handleToggleCurrency}
                onOpenNotifications={handleOpenNotifications}
                onOpenUserDrawer={() => setDrawerOpen(true)}
            />

            {/* User Settings Drawer */}
            <UserDrawer
                open={drawerOpen}
                user={user}
                menuItems={menuItems}
                onClose={() => setDrawerOpen(false)}
                onSettingsClick={handleSettingsClick}
                onLogout={handleLogout}
            />

            {/* Notifications Drawer */}
            <NotificationsDrawer
                open={notificationsDrawerOpen}
                unreadCount={unreadNotifications}
                onClose={handleCloseNotifications}
                onMarkAllAsRead={handleMarkAllAsRead}
                onOpenSettings={() => {
                    handleCloseNotifications();
                    handleSettingsClick(t('dashboard.settings.notifications.title'));
                }}
            />

            {/* Settings Component Drawer */}
            <SettingsDrawer
                open={settingsDrawer.open}
                component={settingsDrawer.component}
                onClose={handleCloseSettingsDrawer}
                onBack={() => {
                    setSettingsDrawer({ open: false, component: '' });
                    setDrawerOpen(true);
                }}
            >
                {renderSettingsComponent()}
            </SettingsDrawer>
        </>
    );
}

// Header Bar Component
interface HeaderBarProps {
    user: User | null;
    isDarkMode: boolean;
    isDisabledCurrencyAmount: boolean;
    unreadNotifications: number;
    toggleTheme: () => void;
    onToggleCurrency: () => void;
    onOpenNotifications: () => void;
    onOpenUserDrawer: () => void;
}

function HeaderBar({
    user,
    isDarkMode,
    isDisabledCurrencyAmount,
    unreadNotifications,
    toggleTheme,
    onToggleCurrency,
    onOpenNotifications,
    onOpenUserDrawer
}: HeaderBarProps) {
    const { t } = useTranslation();
    
    return (
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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton onClick={onToggleCurrency}>
                        <Tooltip title={t(`dashboard.tooltips.${isDisabledCurrencyAmount ? 'enable_currency_amount' : 'disable_currency_amount'}`)}>
                            <span className="material-symbols-rounded">
                                {isDisabledCurrencyAmount ? 'visibility' : 'visibility_off'}
                            </span>
                        </Tooltip>
                    </IconButton>

                    <IconButton onClick={toggleTheme}>
                        <Tooltip title={t(`dashboard.tooltips.${isDarkMode ? 'light_mode' : 'dark_mode'}`)}>
                            <span className="material-symbols-rounded">{isDarkMode ? 'light_mode' : 'dark_mode'}</span>
                        </Tooltip>
                    </IconButton>

                    <IconButton onClick={onOpenNotifications} disabled={user?.role !== 'admin'}>
                        <Badge
                            color="primary"
                            variant="dot"
                            invisible={unreadNotifications === 0}
                        >
                            <Tooltip title={t('dashboard.tooltips.inbox')}>
                                <span className="material-symbols-rounded">
                                    notifications
                                </span>
                            </Tooltip>
                        </Badge>
                    </IconButton>
                </Box>

                <Avatar
                    variant="square"
                    onClick={onOpenUserDrawer}
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
            </Paper>
        </Box>
    );
}

// User Drawer Component
interface UserDrawerProps {
    open: boolean;
    user: User | null;
    menuItems: {
        primary: Array<{ icon: string; text: string }>;
        secondary: Array<{ icon: string; text: string }>;
    };
    onClose: () => void;
    onSettingsClick: (component: string) => void;
    onLogout: () => void;
}

function UserDrawer({ open, user, menuItems, onClose, onSettingsClick, onLogout }: UserDrawerProps) {
    const { t } = useTranslation();
    
    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    width: {
                        xs: '100%',
                        sm: 450
                    },
                    height: '100dvh',
                    maxHeight: '100dvh',
                    p: 2
                }
            }}
        >
            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
                    <IconButton onClick={onClose}>
                        <span className="material-symbols-rounded">close</span>
                    </IconButton>
                </Box>

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

                <Paper
                    elevation={3}
                    sx={{
                        mb: 2,
                        borderRadius: 3,
                        overflow: 'hidden'
                    }}
                >
                    <List disablePadding>
                        {menuItems.primary.map((item) => (
                            <ListItem key={item.text} disablePadding>
                                <ListItemButton onClick={() => onSettingsClick(item.text)}>
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
                    elevation={3}
                    sx={{
                        borderRadius: 3,
                        overflow: 'hidden'
                    }}
                >
                    <List disablePadding>
                        {menuItems.secondary.map((item) => (
                            <ListItem key={item.text} disablePadding>
                                <ListItemButton onClick={() => onSettingsClick(item.text)}>
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
                    onClick={onLogout}
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
    );
}

// Notifications Drawer Component
interface NotificationsDrawerProps {
    open: boolean;
    unreadCount: number;
    onClose: () => void;
    onMarkAllAsRead: () => void;
    onOpenSettings: () => void;
}

function NotificationsDrawer({ open, unreadCount, onClose, onMarkAllAsRead, onOpenSettings }: NotificationsDrawerProps) {
    const { t } = useTranslation();
    
    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    width: {
                        xs: '100%',
                        sm: 450
                    },
                    p: 2,
                    height: '100dvh',
                    maxHeight: '100dvh',
                    display: 'flex',
                    flexDirection: 'column'
                }
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton onClick={onClose} sx={{ mr: 2 }}>
                        <span className="material-symbols-rounded">close</span>
                    </IconButton>
                    <Typography variant="h6">
                        {t('dashboard.notifications.title')}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Tooltip title={t('dashboard.settings.notifications.title')}>
                        <IconButton
                            size="small"
                            onClick={onOpenSettings}
                        >
                            <span className="material-symbols-rounded">settings</span>
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            <Suspense fallback={
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexGrow: 1
                }}>
                    <CircularProgress />
                </Box>
            }>
                <NotificationsInbox 
                    onClose={onClose} 
                    onMarkAllAsRead={onMarkAllAsRead} 
                    unreadCount={unreadCount} 
                />
            </Suspense>
        </Drawer>
    );
}

// Settings Drawer Component
interface SettingsDrawerProps {
    open: boolean;
    component: string;
    onClose: () => void;
    onBack: () => void;
    children: React.ReactNode;
}

function SettingsDrawer({ open, component, onClose, onBack, children }: SettingsDrawerProps) {
    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    width: {
                        xs: '100%',
                        sm: 450
                    },
                    height: '100dvh',
                    maxHeight: '100dvh',
                    p: 2
                }
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <IconButton onClick={onBack} sx={{ mr: 2 }}>
                    <span className="material-symbols-rounded">arrow_back</span>
                </IconButton>
                <Typography variant="h6">{component}</Typography>
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
                {children}
            </Suspense>
        </Drawer>
    );
}