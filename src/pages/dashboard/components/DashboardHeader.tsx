import React, { useState, Suspense, useContext, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Avatar,
    Paper,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Button,
    IconButton,
    Typography,
    CircularProgress,
    Tooltip,
    useTheme,
    alpha
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

// Services
import { authService } from '../../../services/auth.service';
import notificationService from '../../../services/notification.service';

// Types
import { User } from '../../../types/models/user';

// Contexts
import { ThemeContext } from '../../../contexts/ThemeContext';
import { useUser } from '../../../contexts/UserContext';

/**
 * Lazy-loaded components for better performance
 * These components are only loaded when needed
 */
const UserSettings = React.lazy(() => import('../features/settings/UserSettings'));
const SecurityPrivacy = React.lazy(() => import('../features/settings/SecurityPrivacy'));
const Help = React.lazy(() => import('../features/settings/Help'));
const NotificationsInbox = React.lazy(() => import('../features/notifications/inbox/NotificationsInbox'));
const NotificationPreferences = React.lazy(() => import('../features/settings/NotificationPreferences'));
import DrawerBase from './ui/DrawerBase';

import { toggleCurrencyVisibility, isCurrencyHidden, CURRENCY_VISIBILITY_EVENT } from '../../../utils/currencyUtils';

interface DashboardHeaderProps {
    user: User | null; // User object or null
}

/**
 * Settings drawer state interface
 * Tracks the current component to display and navigation source
 */
interface SettingsDrawerState {
    open: boolean;
    component: string;
    source?: 'notifications' | 'settings';
}

/**
 * Dashboard Header Component
 * 
 * Main header component that provides:
 * - User account access and settings
 * - Theme toggling (dark/light mode)
 * - Currency visibility control
 * - Notifications access (for admin users)
 * - Profile drawer with account options
 */
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
            { icon: <PersonOutlineOutlinedIcon />, text: t('dashboard.settings.userSettings.title') },
            { icon: <SecurityOutlinedIcon />, text: t('dashboard.settings.securityPrivacy.title') },
            { icon: <NotificationsNoneOutlinedIcon />, text: t('dashboard.settings.notifications.title') },
        ],
        secondary: [
            { icon: <HelpOutlineOutlinedIcon />, text: t('dashboard.settings.help.title') },
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

    /**
     * Event Handlers
     */
    // Handles user logout process
    const handleLogout = async () => {
        try {
            await authService.logout();
            setUser(null);
            toast.success(t('home.auth.logout.success'));
            navigate('/auth', { replace: true });
        } catch (error) {
            toast.error(t('home.auth.logout.error'));
            console.error('Error during logout:', error);
        }
    };

    // Opens the settings drawer with the selected component
    const handleSettingsClick = (component: string) => {
        setDrawerOpen(false);
        setSettingsDrawer({
            open: true,
            component,
            source: 'settings'
        });
    };

    // Closes the settings drawer
    const handleCloseSettingsDrawer = () => {
        setSettingsDrawer({ open: false, component: '' });
    };

    // Toggles currency visibility throughout the app
    const handleToggleCurrency = () => {
        toggleCurrencyVisibility();
    };

    // Opens the notifications drawer
    const handleOpenNotifications = () => {
        setNotificationsDrawerOpen(true);
    };

    // Closes the notifications drawer
    const handleCloseNotifications = () => {
        setNotificationsDrawerOpen(false);
    };

    // Marks all notifications as read
    const handleMarkAllAsRead = () => {
        setUnreadNotifications(0);
        toast.success(t('dashboard.notifications.success.markedAllAsRead'));
    };

    /**
     * Renders the appropriate settings component based on selection
     * Used inside the settings drawer
     */
    const renderSettingsComponent = () => {
        switch (settingsDrawer.component) {
            case t('dashboard.settings.userSettings.title'):
                return <UserSettings onSuccess={handleCloseSettingsDrawer} />;
            case t('dashboard.settings.securityPrivacy.title'):
                return <SecurityPrivacy onSuccess={handleCloseSettingsDrawer} />;
            case t('dashboard.settings.help.title'):
                return <Help />;
            case t('dashboard.settings.notifications.title'):
                return <NotificationPreferences onSuccess={handleCloseSettingsDrawer} source={settingsDrawer.source} />;
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
                    setSettingsDrawer({
                        open: true,
                        component: t('dashboard.settings.notifications.title'),
                        source: 'notifications'
                    });
                }}
            />

            {/* Settings Component Drawer */}
            <SettingsDrawer
                open={settingsDrawer.open}
                component={settingsDrawer.component}
                onClose={handleCloseSettingsDrawer}
                onBack={() => {
                    if (settingsDrawer.component === t('dashboard.settings.notifications.title') &&
                        settingsDrawer.source === 'notifications') {
                        setSettingsDrawer({ open: false, component: '' });
                        setNotificationsDrawerOpen(true);
                    } else {
                        setSettingsDrawer({ open: false, component: '' });
                        setDrawerOpen(true);
                    }
                }}
            >
                {renderSettingsComponent()}
            </SettingsDrawer>
        </>
    );
}

/**
 * Header Bar Component
 * 
 * Top navigation bar with user profile and action buttons
 * Provides access to theme toggle, currency visibility, and notifications
 */
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
                    {/* Currency visibility toggle */}
                    <IconButton onClick={onToggleCurrency}>
                        <Tooltip 
                            title={t(`dashboard.tooltips.${isDisabledCurrencyAmount ? 
                                'enable_currency_amount' : 
                                'disable_currency_amount'}`)}>
                            {isDisabledCurrencyAmount ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon />}
                        </Tooltip>
                    </IconButton>

                    {/* Theme toggle (dark/light mode) */}
                    <IconButton onClick={toggleTheme}>
                        <Tooltip title={t(`dashboard.tooltips.${isDarkMode ? 'light_mode' : 'dark_mode'}`)}>
                            {isDarkMode ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
                        </Tooltip>
                    </IconButton>

                    {/* Notifications button (admins only) */}
                    {user?.role === 'admin' && (
                        <IconButton
                            onClick={onOpenNotifications}
                            sx={{
                                position: 'relative',
                                '&::after': unreadNotifications > 0 ? {
                                    content: '""',
                                    position: 'absolute',
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    bgcolor: 'primary.main',
                                    top: '10px',
                                    right: '10px',
                                    boxShadow: '0 0 0 2px #fff',
                                    animation: 'pulse 2s infinite',
                                    '@keyframes pulse': {
                                        '0%': {
                                            boxShadow: '0 0 0 0 rgba(var(--mui-palette-primary-mainChannel) / 0.7)'
                                        },
                                        '70%': {
                                            boxShadow: '0 0 0 6px rgba(var(--mui-palette-primary-mainChannel) / 0)'
                                        },
                                        '100%': {
                                            boxShadow: '0 0 0 0 rgba(var(--mui-palette-primary-mainChannel) / 0)'
                                        }
                                    }
                                } : {}
                            }}
                        >
                            <Tooltip title={t('dashboard.tooltips.inbox')}>
                                {unreadNotifications > 0 ? <NotificationsActiveOutlinedIcon /> : <NotificationsOutlinedIcon />}
                            </Tooltip>
                        </IconButton>
                    )}
                </Box>

                {/* User profile avatar */}
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

/**
 * User Drawer Component
 * 
 * Slide-in panel with user profile information and settings options
 * Provides navigation to settings pages and logout functionality
 */
interface UserDrawerProps {
    open: boolean;
    user: User | null;
    menuItems: {
        primary: Array<{ icon: React.ReactNode; text: string }>;
        secondary: Array<{ icon: React.ReactNode; text: string }>;
    };
    onClose: () => void;
    onSettingsClick: (component: string) => void;
    onLogout: () => void;
}

function UserDrawer({ open, user, menuItems, onClose, onSettingsClick, onLogout }: UserDrawerProps) {
    const { t } = useTranslation();

    return (
        <DrawerBase
            open={open}
            onClose={onClose}
        >
            <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
                {/* Drawer header with close button */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
                    <IconButton onClick={onClose}>
                        <CloseOutlinedIcon />
                    </IconButton>
                </Box>

                {/* User profile card */}
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
                            {user?.name} {user?.surname}
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: '0.8rem',
                                fontWeight: 400,
                                m: 0
                            }}
                        >
                            @{user?.username}
                        </Typography>
                    </Box>
                </Paper>

                {/* Primary menu items */}
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
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={item.text} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Paper>

                {/* Secondary menu items */}
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
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={item.text} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Paper>

                {/* Logout button */}
                <Box sx={{ mt: 'auto', mb: 2 }}>
                    <Button
                        fullWidth
                        variant="outlined"
                        color="primary"
                        onClick={onLogout}
                        startIcon={<LogoutOutlinedIcon />}
                    >
                        {t('dashboard.common.logout')}
                    </Button>
                </Box>
            </Box>
        </DrawerBase>
    );
}

/**
 * Notifications Drawer Component
 * 
 * Slide-in panel displaying user notifications
 * Provides options to mark all as read and access notification settings
 */
interface NotificationsDrawerProps {
    open: boolean;
    unreadCount: number;
    onClose: () => void;
    onMarkAllAsRead: () => void;
    onOpenSettings: () => void;
}

function NotificationsDrawer({ open, unreadCount, onClose, onMarkAllAsRead, onOpenSettings }: NotificationsDrawerProps) {
    const { t } = useTranslation();
    const theme = useTheme();

    return (
        <DrawerBase
            open={open}
            onClose={onClose}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%'
                }}
            >
                {/* Drawer header with title and action buttons */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: 1,
                        borderColor: 'divider',
                        px: 3,
                        py: 2,
                        position: 'sticky',
                        top: 0,
                        backdropFilter: 'blur(8px)',
                        zIndex: 1000
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton
                            onClick={onClose}
                            sx={{
                                mr: 2,
                                color: 'text.primary',
                                '&:hover': {
                                    bgcolor: alpha(theme.palette.primary.main, 0.1)
                                }
                            }}
                        >
                            <ArrowBackOutlinedIcon />
                        </IconButton>
                        <Box>
                            <Typography variant="h6" fontWeight={600}>
                                {t('dashboard.notifications.title')}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {/* Mark all as read button (shows only when unread notifications exist) */}
                        {unreadCount > 0 && (
                            <Tooltip title={t('dashboard.notifications.markAllAsRead')}>
                                <IconButton
                                    size="small"
                                    onClick={onMarkAllAsRead}
                                    sx={{
                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                        color: 'primary.main',
                                        '&:hover': {
                                            bgcolor: alpha(theme.palette.primary.main, 0.2)
                                        }
                                    }}
                                >
                                    <MarkEmailReadOutlinedIcon sx={{ fontSize: 20 }} />
                                </IconButton>
                            </Tooltip>
                        )}

                        {/* Notification settings button */}
                        <Tooltip title={t('dashboard.settings.notifications.title')}>
                            <IconButton
                                size="small"
                                onClick={onOpenSettings}
                                sx={{
                                    bgcolor: alpha(theme.palette.background.paper, 0.6),
                                    border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                                    color: 'text.secondary',
                                    '&:hover': {
                                        bgcolor: alpha(theme.palette.background.paper, 0.8)
                                    }
                                }}
                            >
                                <SettingsOutlinedIcon sx={{ fontSize: 20 }} />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>

                {/* Notifications content with lazy loading */}
                <Box sx={{ flexGrow: 1, overflow: 'hidden', p: 3 }}>
                    <Suspense fallback={
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexGrow: 1,
                            height: '100%'
                        }}>
                            <CircularProgress size={40} thickness={4} />
                        </Box>
                    }>
                        <NotificationsInbox
                            onClose={onClose}
                            onMarkAllAsRead={onMarkAllAsRead}
                            unreadCount={unreadCount}
                        />
                    </Suspense>
                </Box>
            </Box>
        </DrawerBase>
    );
}

/**
 * Settings Drawer Component
 * 
 * Slide-in panel displaying various settings components
 * Includes a back button for navigation between drawers
 */
interface SettingsDrawerProps {
    open: boolean;
    component: string;
    onClose: () => void;
    onBack: () => void;
    children: React.ReactNode;
}

function SettingsDrawer({ open, component, onClose, onBack, children }: SettingsDrawerProps) {
    return (
        <DrawerBase
            open={open}
            onClose={onClose}
        >
            <Box sx={{ p: 3 }}>
                {/* Drawer header with back button and title */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <IconButton onClick={onBack} sx={{ mr: 2 }}>
                        <ArrowBackOutlinedIcon />
                    </IconButton>
                    <Typography variant="h6">{component}</Typography>
                </Box>

                {/* Lazily loaded settings component */}
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
            </Box>
        </DrawerBase>
    );
}