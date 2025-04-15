/**
 * Theme Context Module
 * 
 * Provides theme management functionality for the application.
 * Supports light and dark mode themes with user preference persistence.
 * Handles theme switching and synchronization with user preferences.
 * 
 * @module ThemeContext
 */
import { createContext, useState, useMemo, ReactNode, useEffect, useCallback } from 'react';
import { ThemeProvider } from '@mui/material';

// Types
import { Theme } from '../types/supabase/preferences';

// Services
import { userService } from '../services/user.service';

// Theme
import { lightTheme } from '../theme/lightTheme';
import { darkTheme } from '../theme/darkTheme';

// Contexts
import { useUser } from './UserContext';

/**
 * Interface defining the Theme Context API.
 * Provides methods and states for theme management.
 * Used throughout the application to access and modify theme settings.
 */
interface ThemeContextType {
    toggleTheme: () => void; // Function to toggle between light and dark themes
    isDarkMode: boolean;     // State indicating if dark mode is currently active
}

/**
 * Create the Theme Context with default values.
 * The default implementation does nothing when toggling theme.
 * Will be replaced by actual implementation in providers.
 */
// eslint-disable-next-line react-refresh/only-export-components
export const ThemeContext = createContext<ThemeContextType>({
    toggleTheme: () => { },
    isDarkMode: false,
});

/**
 * Global Theme Provider component.
 * Used for application-wide theming outside the dashboard.
 * Always provides light theme regardless of user preferences.
 * Typically used for authentication pages and public-facing components.
 * 
 * @param {ReactNode} children - Child components to be wrapped
 * @returns {JSX.Element} Provider component with light theme applied
 */
export const GlobalThemeProvider = ({ children }: { children: ReactNode }) => {
    return (
        <ThemeProvider theme={lightTheme}>
            {children}
        </ThemeProvider>
    );
};

/**
 * Dashboard Theme Provider component.
 * Manages theme state based on user preferences.
 * Provides functionality to toggle between light and dark themes.
 * Persists theme preference to user profile through API.
 * Used within authenticated dashboard areas of the application.
 * 
 * @param {ReactNode} children - Child components to be wrapped
 * @returns {JSX.Element} Provider component with theme toggling capability
 */
export const DashboardThemeProvider = ({ children }: { children: ReactNode }) => {
    const { userPreferences } = useUser(); // Access user context for theme preferences
    
    // Initialize dark mode state based on user preferences
    const [isDarkMode, setIsDarkMode] = useState(() => 
        userPreferences?.theme === 'dark'
    );

    /**
     * Toggles between light and dark themes.
     * Updates user preferences through API and updates local state.
     * Ensures theme preference persists across sessions.
     * 
     * @returns {Promise<void>} Promise that resolves when theme is updated
     */
    const toggleTheme = useCallback(async () => {
        try {
            const newTheme = isDarkMode ? 'light' : 'dark' as Theme; // Determine the new theme value
            
            // Update theme preference through API
            const response = await userService.updateTheme(newTheme);
            
            if (response.success) {
                // Toggle local state immediately for UI responsiveness
                setIsDarkMode(!isDarkMode);
                
                // Update user preferences locally without full reload
                if (userPreferences) {
                    // Avoid full reload by just updating the theme in context
                    userPreferences.theme = newTheme;
                }
            }
        } catch (error) {
            console.error('Error updating theme:', error);
        }
    }, [isDarkMode, userPreferences]);

    // Sync dark mode state with user preferences when they change
    useEffect(() => {
        setIsDarkMode(userPreferences?.theme === 'dark');
    }, [userPreferences?.theme]);

    // Memoize the theme object to prevent unnecessary re-renders
    const theme = useMemo(() => (isDarkMode ? darkTheme : lightTheme), [isDarkMode]);

    return (
        <ThemeContext.Provider value={{ toggleTheme, isDarkMode }}>
            <ThemeProvider theme={theme}>
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
}; 