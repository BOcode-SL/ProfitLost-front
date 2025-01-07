import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

import type { User, UserContextType } from '../types/models/user.types';
import type { UserApiErrorResponse } from '../types/services/user.types';
import { userService } from '../services/user.service';

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();

    const loadUserData = async () => {

        try {
            const response = await userService.getUserData();
            if (response.success) {
                setUser(response.user as User);
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
    };

    useEffect(() => {
        if (location.pathname.startsWith('/dashboard')) {
            loadUserData();
        } else {
            setIsLoading(false);
        }
    }, [location.pathname]);

    const value = {
        user,
        setUser,
        isLoading,
        loadUserData
    };

    return (
        <UserContext.Provider value={value}>
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