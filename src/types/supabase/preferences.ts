/**
 * Preference Model
 * 
 * Contains type definitions for user preferences.
 */

import { UUID, TrackingFields } from './common';

/**
 * Type for supported language options
 */
export type Language = 'enUS' | 'esES';

/**
 * Type for supported currency options
 */
export type Currency = 'USD' | 'EUR' | 'GBP' | 'MXN' | 'ARS' | 'CLP' | 'COP' | 'PEN' | 'UYU' | 'PYG' | 'BOB' | 'VES';

/**
 * Type for date format options
 */
export type DateFormat = 'DD/MM/YYYY' | 'MM/DD/YYYY';

/**
 * Type for time format options
 */
export type TimeFormat = '12h' | '24h';

/**
 * Type for theme options
 */
export type Theme = 'light' | 'dark';

/**
 * Type for view mode options
 */
export type ViewMode = 'yearToday' | 'fullYear';

/**
 * Interface for user preferences JSON content
 */
export interface PreferenceContent {
    language: Language;
    currency: Currency;
    dateFormat: DateFormat;
    timeFormat: TimeFormat;
    theme: Theme;
    viewMode: ViewMode;
    onboarding: {
        completed: boolean;
        sections: {
            section: string;
            shown: boolean;
        }[];
    };
}

/**
 * User preferences stored as JSON
 */
export interface Preference extends TrackingFields {
    id: UUID;                   // Unique identifier
    user_id: UUID;              // Reference to user
    preferences: PreferenceContent; // JSON object containing preferences
}

/**
 * Type for a Supabase Database Preference
 * Represents how the preference record is stored in the database
 */
export type DbPreference = Preference;

/**
 * Type for creating a new preference
 * Omits auto-generated fields
 */
export type PreferenceInsert = Omit<Preference, 'id' | 'created_at' | 'updated_at'>;

/**
 * Type for updating an existing preference
 * Makes all fields optional except id
 */
export type PreferenceUpdate = Partial<Omit<Preference, 'id'>> & { id: UUID }; 