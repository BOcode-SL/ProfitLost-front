import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import toast from 'react-hot-toast';

import type { User, UserContextType } from '../types/models/user.types';
import type { UserApiErrorResponse } from '../types/services/user.types';
import { userService } from '../services/user.service';

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

   const loadUserData = useCallback(async () => {
        
        if (!localStorage.getItem('token')) {
            setUser(null);
            setIsLoading(false);
            return;
        }

        try {
            const response = await userService.getUserData();
            if (response.success && response.data) {
                setUser(response.data);
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
    }, []);

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