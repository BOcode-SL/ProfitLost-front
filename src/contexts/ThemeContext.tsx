import { createContext, useState, useMemo, ReactNode, useEffect } from 'react';
import { ThemeProvider } from '@mui/material';
import { lightTheme } from '../theme/lightTheme';
import { darkTheme } from '../theme/darkTheme';
import { useUser } from './UserContext';
import { userService } from '../services/user.service';
import { User } from '../types/models/user';

// Define the context type for theme management
interface ThemeContextType {
    toggleTheme: () => void; // Function to toggle the theme
    isDarkMode: boolean; // State to check if dark mode is enabled
}

// Create the ThemeContext with default values
export const ThemeContext = createContext<ThemeContextType>({
    toggleTheme: () => { },
    isDarkMode: false,
});

// Global provider for light theme
export const GlobalThemeProvider = ({ children }: { children: ReactNode }) => {
    return (
        <ThemeProvider theme={lightTheme}>
            {children}
        </ThemeProvider>
    );
};

// Dashboard provider that manages theme state
export const DashboardThemeProvider = ({ children }: { children: ReactNode }) => {
    const { user, setUser } = useUser(); // Get user context
    const [isDarkMode, setIsDarkMode] = useState(() => 
        user?.preferences?.theme === 'dark' // Initialize dark mode state
    );

    // Function to toggle between light and dark themes
    const toggleTheme = async () => {
        try {
            const newTheme = isDarkMode ? 'light' : 'dark'; // Determine new theme
            
            const response = await userService.updateTheme(newTheme); // Update theme in user service
            
            if (response.success && response.data) {
                setUser(response.data as User); // Update user context with new data
                setIsDarkMode(!isDarkMode); // Toggle dark mode state
            }
        } catch (error) {
            console.error('Error updating theme:', error); // Log any errors
        }
    };

    // Effect to update dark mode state when user preferences change
    useEffect(() => {
        setIsDarkMode(user?.preferences.theme === 'dark');
    }, [user?.preferences.theme]);

    // Memoize the theme to avoid unnecessary re-renders
    const theme = useMemo(() => (isDarkMode ? darkTheme : lightTheme), [isDarkMode]);

    return (
        <ThemeContext.Provider value={{ toggleTheme, isDarkMode }}>
            <ThemeProvider theme={theme}>
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
}; 