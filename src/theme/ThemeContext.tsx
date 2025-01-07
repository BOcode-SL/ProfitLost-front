import { createContext, useState, useMemo, ReactNode } from 'react';
import { ThemeProvider } from '@mui/material';
import { lightTheme } from './lightTheme';
import { darkTheme } from './darkTheme';

interface ThemeContextType {
    toggleTheme: () => void;
    isDarkMode: boolean;
}

export const ThemeContext = createContext<ThemeContextType>({
    toggleTheme: () => { },
    isDarkMode: false,
});

interface ThemeProviderWrapperProps {
    children: ReactNode;
}

export const ThemeProviderWrapper = ({ children }: ThemeProviderWrapperProps) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    const theme = useMemo(() => (isDarkMode ? darkTheme : lightTheme), [isDarkMode]);

    return (
        <ThemeContext.Provider value={{ toggleTheme, isDarkMode }}>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </ThemeContext.Provider>
    );
}; 