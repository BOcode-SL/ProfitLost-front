/**
 * Theme Context Module
 * 
 * Provides theme management functionality for the application.
 * Supports light and dark mode themes with user preference persistence.
 */
import { createContext, useState, useMemo, ReactNode, useEffect } from 'react';
import { ThemeProvider } from '@mui/material';
import { lightTheme } from '../theme/lightTheme';
import { darkTheme } from '../theme/darkTheme';
import { useUser } from './UserContext';
import { userService } from '../services/user.service';
import { User } from '../types/models/user';

/**
 * Interface defining the Theme Context API.
 * Provides methods and states for theme management.
 */
interface ThemeContextType {
    toggleTheme: () => void; // Function to toggle between light and dark themes
    isDarkMode: boolean;     // State indicating if dark mode is currently active
}

/**
 * Create the Theme Context with default values.
 * The default implementation does nothing when toggling theme.
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
 * 
 * @param children - Child components to be wrapped
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
 * 
 * @param children - Child components to be wrapped
 */
export const DashboardThemeProvider = ({ children }: { children: ReactNode }) => {
    const { user, setUser } = useUser(); // Access user context for theme preferences
    
    // Initialize dark mode state based on user preferences
    const [isDarkMode, setIsDarkMode] = useState(() => 
        user?.preferences?.theme === 'dark'
    );

    /**
     * Toggles between light and dark themes.
     * Updates user preferences through API and updates local state.
     */
    const toggleTheme = async () => {
        try {
            const newTheme = isDarkMode ? 'light' : 'dark'; // Determine the new theme value
            
            // Update theme preference through API
            const response = await userService.updateTheme(newTheme);
            
            if (response.success && response.data) {
                setUser(response.data as User); // Update user context with new data
                setIsDarkMode(!isDarkMode);     // Toggle dark mode state locally
            }
        } catch (error) {
            console.error('Error updating theme:', error);
        }
    };

    // Sync dark mode state with user preferences when they change
    useEffect(() => {
        setIsDarkMode(user?.preferences.theme === 'dark');
    }, [user?.preferences.theme]);

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