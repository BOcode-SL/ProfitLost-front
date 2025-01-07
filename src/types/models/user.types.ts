export interface User {
    _id: string;
    username: string;
    email: string;
    password: string;
    name: string;
    surname: string;
    resetToken?: string;
    resetTokenExpiry?: string;
    profileImage?: string;
    profileImagePublicId?: string;
    accountsOrder?: string[];
    language?: string;
    currency?: string;
    dateFormat?: 'DD/MM/YYYY' | 'MM/DD/YYYY';
    timeFormat?: '12h' | '24h';
}

export interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    isLoading: boolean;
    loadUserData: () => Promise<void>;
} 