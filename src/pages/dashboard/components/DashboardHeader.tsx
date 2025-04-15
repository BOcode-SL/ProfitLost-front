/**
 * Dashboard Header Module
 * 
 * Provides the main header component for the dashboard interface.
 * 
 * Responsibilities:
 * - Displays user profile and account access
 * - Manages theme toggling between dark/light modes
 * - Controls currency visibility throughout the application
 * - Provides access to user settings and preferences
 * - Handles user logout functionality
 * 
 * @module DashboardHeader
 */

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
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';

// Services
import { authService } from '../../../services/auth.service';

// Types
import { User } from '../../../types/supabase/users';

// Contexts
import { ThemeContext } from '../../../contexts/ThemeContext';
import { useUser } from '../../../contexts/UserContext';

// Utils
import { toggleCurrencyVisibility, isCurrencyHidden, CURRENCY_VISIBILITY_EVENT } from '../../../utils/currencyUtils';

// Components
import DrawerBase from './ui/DrawerBase';
const UserSettings = React.lazy(() => import('../features/settings/UserSettings'));
const SecurityPrivacy = React.lazy(() => import('../features/settings/SecurityPrivacy'));
const Help = React.lazy(() => import('../features/settings/Help'));


/**
 * Interface for DashboardHeader component props
 * 
 * @interface DashboardHeaderProps
 */
interface DashboardHeaderProps {
    /** User object or null if not logged in */
    user: User | null;
}

/**
 * Settings drawer state interface
 * Tracks the current component to display and navigation source
 * 
 * @interface SettingsDrawerState
 */
interface SettingsDrawerState {
    /** Whether the drawer is open */
    open: boolean;
    
    /** The current component to display */
    component: string;
    
    /** Optional source of navigation */
    source?: 'settings';
}

/**
 * Dashboard Header Component
 * 
 * Main header component that provides user account access and global application controls.
 * 
 * @param {DashboardHeaderProps} props - The component props
 * @param {User|null} props.user - The current user object or null
 * @returns {JSX.Element} The rendered DashboardHeader component
 */
export default function DashboardHeader({ user }: DashboardHeaderProps) {
    const { t } = useTranslation();
    const { setUser, userRole } = useUser();
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    const navigate = useNavigate();

    // State management
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [settingsDrawer, setSettingsDrawer] = useState<SettingsDrawerState>({
        open: false,
        component: ''
    });
    const [isDisabledCurrencyAmount, setIsDisabledCurrencyAmount] = useState(isCurrencyHidden());

    // Check if user is admin using role from UserContext
    const isAdmin = userRole === 'admin' || false;
    
    // Menu items for settings
    const menuItems = {
        primary: [
            { icon: <PersonOutlineOutlinedIcon />, text: t('dashboard.settings.userSettings.title') },
            { icon: <SecurityOutlinedIcon />, text: t('dashboard.settings.securityPrivacy.title') },
        ],
        secondary: [
            { icon: <HelpOutlineOutlinedIcon />, text: t('dashboard.settings.help.title') },
        ]
    };

    /**
     * Listen for changes in currency visibility
     * Updates the state when visibility is toggled
     */
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

    /**
     * Handles user logout process
     * Clears user session and redirects to authentication page
     */
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

    /**
     * Opens the settings drawer with the selected component
     * 
     * @param {string} component - The component key to display
     */
    const handleSettingsClick = (component: string) => {
        setDrawerOpen(false);
        setSettingsDrawer({
            open: true,
            component,
            source: 'settings'
        });
    };

    /**
     * Closes the settings drawer
     */
    const handleCloseSettingsDrawer = () => {
        setSettingsDrawer({ open: false, component: '' });
    };

    /**
     * Toggles currency visibility throughout the app
     */
    const handleToggleCurrency = () => {
        toggleCurrencyVisibility();
    };

    /**
     * Renders the appropriate settings component based on selection
     * Used inside the settings drawer
     * 
     * @returns {JSX.Element|null} The selected settings component or null
     */
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

    return (
        <>
            {/* Header Bar */}
            <HeaderBar
                user={user}
                isDarkMode={isDarkMode}
                toggleTheme={toggleTheme}
                isDisabledCurrencyAmount={isDisabledCurrencyAmount}
                onToggleCurrency={handleToggleCurrency}
                onOpenUserDrawer={() => setDrawerOpen(true)}
                isAdmin={isAdmin}
                // profileImage={user?.profile_image}
            />

            {/* User Settings Drawer */}
            <UserDrawer
                open={drawerOpen}
                user={user}
                menuItems={menuItems}
                onClose={() => setDrawerOpen(false)}
                onSettingsClick={handleSettingsClick}
                onLogout={handleLogout}
                // profileImage={user?.profile_image}
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

/**
 * Interface for HeaderBar component props
 * 
 * @interface HeaderBarProps
 */
interface HeaderBarProps {
    /** User object or null if not logged in */
    user: User | null;
    
    /** Whether dark mode is currently active */
    isDarkMode: boolean;
    
    /** Whether currency amounts are currently hidden */
    isDisabledCurrencyAmount: boolean;
    
    /** Function to toggle between dark and light themes */
    toggleTheme: () => void;
    
    /** Function to toggle currency visibility */
    onToggleCurrency: () => void;
    
    /** Function to open the user profile drawer */
    onOpenUserDrawer: () => void;
    
    /** Whether the current user has admin privileges */
    isAdmin: boolean;
    
    /** Optional user profile image URL */
    profileImage?: string;
}

/**
 * Header Bar Component
 * 
 * Top navigation bar with user profile and action buttons.
 * 
 * @param {HeaderBarProps} props - The component props
 * @returns {JSX.Element} The rendered HeaderBar component
 */
function HeaderBar({
    user,
    isDarkMode,
    isDisabledCurrencyAmount,
    toggleTheme,
    onToggleCurrency,
    onOpenUserDrawer,
    profileImage
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
                </Box>

                {/* User profile avatar */}
                <Avatar
                    variant="square"
                    onClick={onOpenUserDrawer}
                    src={profileImage}
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
 * Interface for UserDrawer component props
 * 
 * @interface UserDrawerProps
 */
interface UserDrawerProps {
    /** Whether the drawer is open */
    open: boolean;
    
    /** User object or null if not logged in */
    user: User | null;
    
    /** Menu items to display in the drawer */
    menuItems: {
        primary: Array<{ icon: React.ReactNode; text: string }>;
        secondary: Array<{ icon: React.ReactNode; text: string }>;
    };
    
    /** Function to close the drawer */
    onClose: () => void;
    
    /** Function to handle settings item clicks */
    onSettingsClick: (component: string) => void;
    
    /** Function to handle logout */
    onLogout: () => void;
    
    /** Optional user profile image URL */
    profileImage?: string;
}

/**
 * User Drawer Component
 * 
 * Slide-in panel with user profile information and settings options.
 * 
 * @param {UserDrawerProps} props - The component props
 * @returns {JSX.Element} The rendered UserDrawer component
 */
function UserDrawer({ open, user, menuItems, onClose, onSettingsClick, onLogout, profileImage }: UserDrawerProps) {
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
                        src={profileImage}
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
 * Interface for SettingsDrawer component props
 * 
 * @interface SettingsDrawerProps
 */
interface SettingsDrawerProps {
    /** Whether the drawer is open */
    open: boolean;
    
    /** The title of the current component being displayed */
    component: string;
    
    /** Function to close the drawer */
    onClose: () => void;
    
    /** Function to navigate back to the previous screen */
    onBack: () => void;
    
    /** The component to render inside the drawer */
    children: React.ReactNode;
}

/**
 * Settings Drawer Component
 * 
 * Slide-in panel displaying various settings components.
 * 
 * @param {SettingsDrawerProps} props - The component props
 * @returns {JSX.Element} The rendered SettingsDrawer component
 */
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