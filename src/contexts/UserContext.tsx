import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import type { User, UserContextType, UserPreferences } from '../types/models/user';
import { userService } from '../services/user.service';

const UserContext = createContext<UserContextType | undefined>(undefined);

// Preferencias por defecto
const defaultPreferences: UserPreferences = {
    language: 'enUS',
    currency: 'USD',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    theme: 'light',
    viewMode: 'fullYear'
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { i18n } = useTranslation();

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

    const loadUserData = useCallback(async () => {
        try {
            const response = await userService.getUserData();

            if (response.success && response.data) {
                const userData = response.data as User;
                const userWithPreferences: User = {
                    ...userData,
                    preferences: {
                        ...defaultPreferences,
                        ...userData.preferences
                    }
                };
                setUser(userWithPreferences);

                const userLanguage = convertLanguageFormat(userWithPreferences.preferences.language);
                await i18n.changeLanguage(userLanguage);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error('Error loading user data:', error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, [i18n]);

    useEffect(() => {
        loadUserData();
    }, [loadUserData]);

    return (
        <UserContext.Provider value={{ user, setUser, isLoading, loadUserData }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}; 