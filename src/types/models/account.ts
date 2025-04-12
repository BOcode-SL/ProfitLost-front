/**
 * Account Model Module
 * 
 * Contains adapted type definitions for account data that map to Supabase models.
 */

import type { UUID } from '../supabase/common';

/**
 * Configuration options for an account
 */
export interface AccountConfiguration {
    isActive: boolean;           // Whether the account is active
    backgroundColor: string;     // Background color for UI
    textColor: string;           // Text color for UI
}

/**
 * Monthly record data structure for a specific year
 * Maps to the YearRecord in Supabase
 */
export interface YearRecord {
    [key: string]: number | null;  // Monthly values (jan, feb, etc.)
}

/**
 * Frontend Account interface that maps to Supabase Account and YearRecord models
 */
export interface Account {
    _id: UUID;                   // Maps to id from Supabase
    accountName: string;         // Maps to name from Supabase
    configuration: AccountConfiguration;  // Maps to is_active, background_color, text_color
    records: {                   // Maps to related YearRecord entries
        [year: string]: YearRecord;
    };
}

/**
 * Type for creating or updating an account
 */
export interface AccountInput {
    accountName: string;
    configuration: AccountConfiguration;
    records: {
        [year: string]: YearRecord;
    };
} 