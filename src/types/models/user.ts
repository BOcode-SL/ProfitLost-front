/**
 * User Model Module
 * 
 * Contains adapted type definitions for user data that map to Supabase models.
 */

import type { UUID, ISODateString } from '../supabase/common';
import type { PreferenceContent } from '../supabase/preference';

/**
 * Interface for user onboarding state
 */
export interface UserOnboarding {
    completed: boolean;
    sections: {
        section: string;
        shown: boolean;
    }[];
}

/**
 * Type for user preferences
 */
export type UserPreferences = PreferenceContent;

/**
 * Frontend User interface that maps to Supabase User model
 * Combines data from User, UserRole, and Preference tables
 */
export interface User {
    _id: UUID;                     // Maps to id from Supabase
    username: string;              // Username from Supabase
    email: string;                 // Email address
    name: string;                  // First name
    surname: string;               // Last name
    lastLogin: ISODateString;      // Maps to last_login
    preferences: UserPreferences;  // Mapped from preference table
    accountsOrder: UUID[];         // Order of accounts for display
    onboarding: UserOnboarding;    // Onboarding state
    role: string;                  // User role
    profileImageUrl?: string;      // Profile image URL if exists
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
