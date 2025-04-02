/**
 * User Models Module
 * 
 * Contains type definitions for user data, preferences, and authentication.
 */

/**
 * Represents a user in the system
 * Core entity for authentication and personalization
 */
export interface User {
    _id: string;                 // Unique identifier
    username: string;            // Unique username
    email: string;               // Email address
    name: string;                // First name
    surname: string;             // Last name
    profileImage?: string;       // Profile image URL
    profileImagePublicId?: string; // Cloudinary public ID for image
    accountsOrder?: string[];    // Custom ordering of accounts
    preferences: UserPreferences; // User preferences
    onboarding: UserOnboarding;  // Onboarding progress
    role: UserRole;              // User role
}

/**
 * User preferences for application settings
 * Controls display and localization options
 */
export interface UserPreferences {
    language?: Language;         // Display language
    currency?: Currency;         // Preferred currency
    dateFormat?: DateFormat;     // Date display format
    timeFormat?: TimeFormat;     // Time display format
    theme?: Theme;               // UI theme
    viewMode?: ViewMode;         // View mode for reports
}

/**
 * Supported display languages
 */
export type Language = 'enUS' | 'esES';

/**
 * Supported currencies
 */
export type Currency = 'USD' | 'EUR' | 'GBP' | 'MXN' | 'ARS' | 'CLP' | 'COP' | 'PEN' | 'UYU' | 'PYG' | 'BOB' | 'VES';

/**
 * Supported date formats
 */
export type DateFormat = 'DD/MM/YYYY' | 'MM/DD/YYYY';

/**
 * Supported time formats
 */
export type TimeFormat = '12h' | '24h';

/**
 * UI theme options
 */
export type Theme = 'light' | 'dark';

/**
 * Report view mode options
 */
export type ViewMode = 'yearToday' | 'fullYear';

/**
 * Tracks the user's progress through onboarding
 */
export interface UserOnboarding {
    completed: boolean;          // Whether onboarding is complete
    sections: OnboardingSection[]; // Onboarding sections progress
}

/**
 * Tracks the status of an individual onboarding section
 */
export interface OnboardingSection {
    section: string;             // Section identifier
    shown: boolean;              // Whether section has been shown
}

/**
 * Tracks temporary onboarding progress in the UI
 */
export interface OnboardingProgress {
    activeStep: number;          // Current onboarding step
    preferences: UserPreferences; // Selected preferences
    selectedCategories: string[]; // Selected categories
}

/**
 * Context interface for user data in React
 */
export interface UserContextType {
    user: User | null;           // Current user data or null if not logged in
    setUser: (user: User | null) => void; // Function to update user
    isLoading: boolean;          // Whether user data is loading
    loadUserData: () => Promise<void>; // Function to refresh user data
}

/**
 * Available user roles in the system
 */
export type UserRole = 'user' | 'admin'; 
