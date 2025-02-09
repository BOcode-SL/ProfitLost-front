import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

// Import types for User and User Preferences
import type { User, UserContextType, UserPreferences } from '../types/models/user';
import { userService } from '../services/user.service';

// Create UserContext
const UserContext = createContext<UserContextType | undefined>(undefined);

// Default preferences for the user
const defaultPreferences: UserPreferences = {
    language: 'enUS',
    currency: 'USD',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    theme: 'light',
    viewMode: 'fullYear'
};

// UserProvider component to manage user state
export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null); // State for user data
    const [isLoading, setIsLoading] = useState(true); // State for loading status
    const { i18n } = useTranslation(); // Translation hook

    // Function to convert user language format
    const convertLanguageFormat = (userLanguage: string | undefined) => {
        switch (userLanguage) {
            case 'enUS':
                return 'en';
            case 'esES':
                return 'es';
            default:
                return 'en';
        }
    };

    // Function to load user data
    const loadUserData = useCallback(async () => {
        try {
            const response = await userService.getUserData(); // Fetch user data

            if (response.success && response.data) {
                const userData = response.data as User; // Cast response data to User type
                const userWithPreferences: User = {
                    ...userData,
                    preferences: {
                        ...defaultPreferences,
                        ...userData.preferences // Merge default preferences with user preferences
                    }
                };
                setUser(userWithPreferences); // Update user state

                const userLanguage = convertLanguageFormat(userWithPreferences.preferences.language); // Convert language
                await i18n.changeLanguage(userLanguage); // Change language in i18n
            } else {
                setUser(null); // Set user to null if response is not successful
            }
        } catch (error) {
            console.error('Error loading user data:', error); // Log error
            setUser(null); // Set user to null on error
        } finally {
            setIsLoading(false); // Set loading to false
        }
    }, [i18n]);

    // Effect to load user data on component mount
    useEffect(() => {
        loadUserData();
    }, [loadUserData]);

    // Provide user context to children
    return (
        <UserContext.Provider value={{ user, setUser, isLoading, loadUserData }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to use UserContext
export const useUser = () => {
    const context = useContext(UserContext); // Get context
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider'); // Error if used outside provider
    }
    return context; // Return context
}; 