/**
 * Preference Model
 * 
 * Contains type definitions for user preferences.
 * 
 * @module SupabasePreferences
 */

import { UUID, TrackingFields } from './common';

/**
 * Type for supported language options
 * 
 * @typedef Language
 */
export type Language = 'enUS' | 'esES';

/**
 * Type for supported currency options
 * 
 * @typedef Currency
 */
export type Currency = 'USD' | 'EUR' | 'GBP' | 'MXN' | 'ARS' | 'CLP' | 'COP' | 'PEN' | 'UYU' | 'PYG' | 'BOB' | 'VES';

/**
 * Type for date format options
 * 
 * @typedef DateFormat
 */
export type DateFormat = 'DD/MM/YYYY' | 'MM/DD/YYYY';

/**
 * Type for time format options
 * 
 * @typedef TimeFormat
 */
export type TimeFormat = '12h' | '24h';

/**
 * Type for theme options
 * 
 * @typedef Theme
 */
export type Theme = 'light' | 'dark';

/**
 * Type for view mode options
 * 
 * @typedef ViewMode
 */
export type ViewMode = 'yearToday' | 'fullYear';

/**
 * Interface for user preferences JSON content
 * 
 * @interface PreferenceContent
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
 * 
 * @interface Preference
 */
export interface Preference extends TrackingFields {
    id: UUID;                   // Unique identifier
    user_id: UUID;              // Reference to user
    preferences: PreferenceContent; // JSON object containing preferences
}

/**
 * Type for a Supabase Database Preference
 * Represents how the preference record is stored in the database
 * 
 * @typedef DbPreference
 */
export type DbPreference = Preference;

/**
 * Type for creating a new preference
 * Omits auto-generated fields
 * 
 * @typedef PreferenceInsert
 */
export type PreferenceInsert = Omit<Preference, 'id' | 'created_at' | 'updated_at'>;

/**
 * Type for updating an existing preference
 * Makes all fields optional except id
 * 
 * @typedef PreferenceUpdate
 */
export type PreferenceUpdate = Partial<Omit<Preference, 'id'>> & { id: UUID }; 