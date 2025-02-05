import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import type { User, UserContextType } from '../types/models/user';
import type { UserApiErrorResponse } from '../types/api/responses';
import { userService } from '../services/user.service';

const UserContext = createContext<UserContextType | undefined>(undefined);

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
            const token = localStorage.getItem('auth_token');
            const headers: HeadersInit = {
                'Content-Type': 'application/json'
            };
            
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await userService.getUserData(headers);
            if (response.success && response.data) {
                const userData = response.data as User;
                setUser(userData);
                
                const userLanguage = convertLanguageFormat(userData.language);
                await i18n.changeLanguage(userLanguage);
            }
        } catch (error) {
            console.error('Error loading user data:', error);
            if (location.pathname.startsWith('/dashboard') &&
                (error as UserApiErrorResponse).error !== 'UNAUTHORIZED') {
                toast.error('Error loading user data');
            }
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