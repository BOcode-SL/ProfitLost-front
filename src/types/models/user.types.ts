export interface User {
    _id: string;
    username: string;
    email: string;
    name: string;
    surname: string;
    profileImage?: string;
    profileImagePublicId?: string;
    accountsOrder?: string[];
    language?: Language;
    currency?: Currency;
    dateFormat?: DateFormat;
    timeFormat?: TimeFormat;
}

export type Language = 'enUS' | 'esES';
export type Currency = 'USD' | 'EUR' | 'GBP';
export type DateFormat = 'DD/MM/YYYY' | 'MM/DD/YYYY';
export type TimeFormat = '12h' | '24h';

export interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    isLoading: boolean;
    loadUserData: () => Promise<void>;
} 