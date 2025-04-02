/**
 * User Context Module
 * 
 * Provides user authentication state management and preferences.
 * Handles user data loading, language preferences, and state synchronization.
 */
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

// Import types for User and User Preferences
import type { User, UserContextType, UserPreferences } from '../types/models/user';
import { userService } from '../services/user.service';

/**
 * Create the User Context with undefined default value.
 * This will be populated by the UserProvider.
 */
const UserContext = createContext<UserContextType | undefined>(undefined);

/**
 * Default user preferences.
 * Applied when user has no stored preferences or as fallback values.
 */
const defaultPreferences: UserPreferences = {
    language: 'enUS',
    currency: 'USD',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    theme: 'light',
    viewMode: 'fullYear'
};

/**
 * User Provider component.
 * Manages user authentication state and preferences.
 * Handles loading user data from API and syncing with i18n.
 * 
 * @param children - Child components to be wrapped
 */
export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null); // State for user data
    const [isLoading, setIsLoading] = useState(true);    // Loading state tracker
    const { i18n } = useTranslation();                   // i18n instance for language management

    /**
     * Converts user language preference format to i18n format.
     * Maps from application-specific format to i18n's expected format.
     * 
     * @param userLanguage - User's language preference from profile
     * @returns The corresponding i18n language code
     */
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

    /**
     * Loads user data from the API.
     * Merges returned user data with default preferences.
     * Updates application language based on user preferences.
     */
    const loadUserData = useCallback(async () => {
        try {
            const response = await userService.getUserData(); // Fetch user profile data

            if (response.success && response.data) {
                const userData = response.data as User; // Cast response data to User type
                
                // Create user object with merged preferences
                const userWithPreferences: User = {
                    ...userData,
                    preferences: {
                        ...defaultPreferences,
                        ...userData.preferences // Override defaults with user preferences
                    }
                };
                setUser(userWithPreferences); // Update user state

                // Update application language based on user preference
                const userLanguage = convertLanguageFormat(userWithPreferences.preferences.language);
                await i18n.changeLanguage(userLanguage);
            } else {
                setUser(null); // Clear user state if request unsuccessful
            }
        } catch (error) {
            console.error('Error loading user data:', error);
            setUser(null); // Clear user state on error
        } finally {
            setIsLoading(false); // Mark loading as complete
        }
    }, [i18n]);

    // Load user data on component mount
    useEffect(() => {
        loadUserData();
    }, [loadUserData]);

    // Provide user context to children components
    return (
        <UserContext.Provider value={{ user, setUser, isLoading, loadUserData }}>
            {children}
        </UserContext.Provider>
    );
};

/**
 * Custom hook to access the User Context.
 * Provides type-safe access to user state and methods.
 * Throws error if used outside of UserProvider.
 * 
 * @returns The user context value
 */
// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => {
    const context = useContext(UserContext);
    
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    
    return context;
}; 