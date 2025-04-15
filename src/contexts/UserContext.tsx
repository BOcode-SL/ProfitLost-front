/**
 * User Context Module
 * 
 * Provides user authentication state management and preferences.
 * Handles user data loading, language preferences, and state synchronization.
 * Serves as the central source of truth for user-related data across the application.
 */

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

// Types
import type { User } from '../types/supabase/users';
import type { PreferenceContent } from '../types/supabase/preferences';

// Services
import { userService } from '../services/user.service';

/**
 * Extended User interface that includes preferences and role
 * for easier access in utility functions and components
 */
export interface UserWithPreferences extends User {
    preferences: PreferenceContent;
    role: string; // Role code like 'admin', 'user', etc.
}

/**
 * Interface for UserContext
 * Defines the shape and capabilities of the user context throughout the application
 */
interface UserContextType {
    user: UserWithPreferences | null;   // Current user data with preferences or null if not logged in
    setUser: (user: UserWithPreferences | null) => void; // Function to update user
    isLoading: boolean;          // Whether user data is loading
    loadUserData: () => Promise<void>; // Function to refresh user data
    userPreferences: PreferenceContent | null; // User preferences
    userRole: string | null;     // User role ('admin', 'user', etc.)
}

/**
 * Create the User Context with undefined default value.
 * This will be populated by the UserProvider.
 */
const UserContext = createContext<UserContextType | undefined>(undefined);

/**
 * Default user preferences.
 * Applied when user has no stored preferences or as fallback values.
 * Ensures consistent experience even when preferences are missing.
 */
const defaultPreferences: PreferenceContent = {
    language: 'enUS',
    currency: 'USD',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    theme: 'light',
    viewMode: 'fullYear',
    onboarding: {
        completed: false,
        sections: []
    }
};

/**
 * User Provider component.
 * Manages user authentication state and preferences.
 * Handles loading user data from API and syncing with i18n.
 * Provides user context to all child components in the tree.
 * 
 * @param children - Child components to be wrapped
 */
export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserWithPreferences | null>(null); // State for user data
    const [userPreferences, setUserPreferences] = useState<PreferenceContent | null>(null); // State for preferences
    const [userRole, setUserRole] = useState<string | null>(null); // State for user role
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
     * Updates application language based on user preferences.
     * Sets user state, preferences, and role in the context.
     */
    const loadUserData = useCallback(async () => {
        try {
            const response = await userService.getUserData(); // Fetch user profile data

            if (response.success && response.data) {
                // Los datos de usuario vienen directamente en el response.data, no en un subobjeto 'user'
                const apiData = response.data as unknown as {
                    id: string;
                    username: string;
                    email: string;
                    name: string;
                    surname: string;
                    google_id?: string | null;
                    last_login?: string;
                    reset_token?: number | null;
                    reset_token_expired?: string | null;
                    preferences: PreferenceContent;
                    role: string;
                };
                
                // Create a user preferences object with defaults merged with API data
                const preferences = {
                    ...defaultPreferences,
                    ...(apiData.preferences || {})
                } as PreferenceContent;
                
                // Create a User object with all required fields
                const userData: UserWithPreferences = {
                    id: apiData.id,
                    username: apiData.username,
                    email: apiData.email,
                    name: apiData.name,
                    surname: apiData.surname,
                    password: null,
                    google_id: apiData.google_id || null,
                    last_login: apiData.last_login || new Date().toISOString(),
                    reset_token: apiData.reset_token || null,
                    reset_token_expired: apiData.reset_token_expired || null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    deleted_at: null,
                    created_by: null,
                    updated_by: null,
                    deleted_by: null,
                    preferences: preferences,
                    role: apiData.role || 'user'
                };

                setUser(userData);
                setUserPreferences(preferences);
                setUserRole(apiData.role || null);

                // Update application language based on user preference
                const userLanguage = convertLanguageFormat(preferences.language);
                await i18n.changeLanguage(userLanguage);
            } else {
                setUser(null);
                setUserPreferences(null);
                setUserRole(null);
            }
        } catch (error) {
            console.error('Error loading user data:', error);
            setUser(null);
            setUserPreferences(null);
            setUserRole(null);
        } finally {
            setIsLoading(false);
        }
    }, [i18n]);

    // Load user data on component mount
    useEffect(() => {
        loadUserData();
    }, [loadUserData]);

    // Provide user context to children components
    return (
        <UserContext.Provider value={{ user, setUser, isLoading, loadUserData, userPreferences, userRole }}>
            {children}
        </UserContext.Provider>
    );
};

/**
 * Custom hook to access the User Context.
 * Provides type-safe access to user state and methods.
 * Throws error if used outside of UserProvider.
 * 
 * @returns The user context value with full typing support
 */
// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => {
    const context = useContext(UserContext);
    
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    
    return context;
}; 