import { createContext, useState, useMemo, ReactNode, useEffect } from 'react';
import { ThemeProvider } from '@mui/material';
import { lightTheme } from '../theme/lightTheme';
import { darkTheme } from '../theme/darkTheme';
import { useUser } from './UserContext';
import { userService } from '../services/user.service';
import { User } from '../types/models/user';

interface ThemeContextType {
    toggleTheme: () => void;
    isDarkMode: boolean;
}

export const ThemeContext = createContext<ThemeContextType>({
    toggleTheme: () => { },
    isDarkMode: false,
});

export const GlobalThemeProvider = ({ children }: { children: ReactNode }) => {
    return (
        <ThemeProvider theme={lightTheme}>
            {children}
        </ThemeProvider>
    );
};

export const DashboardThemeProvider = ({ children }: { children: ReactNode }) => {
    const { user, setUser } = useUser();
    const [isDarkMode, setIsDarkMode] = useState(() => 
        user?.preferences?.theme === 'dark'
    );

    const toggleTheme = async () => {
        try {
            const newTheme = isDarkMode ? 'light' : 'dark';
            
            const response = await userService.updateTheme(newTheme);
            
            if (response.success && response.data) {
                setUser(response.data as User);
                setIsDarkMode(!isDarkMode);
            }
        } catch (error) {
            console.error('Error updating theme:', error);
        }
    };

    useEffect(() => {
        setIsDarkMode(user?.preferences.theme === 'dark');
    }, [user?.preferences.theme]);

    const theme = useMemo(() => (isDarkMode ? darkTheme : lightTheme), [isDarkMode]);

    return (
        <ThemeContext.Provider value={{ toggleTheme, isDarkMode }}>
            <ThemeProvider theme={theme}>
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
}; 