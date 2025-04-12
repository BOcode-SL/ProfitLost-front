/**
 * YearRecord Model
 * 
 * Contains type definitions for yearly financial records.
 */

import { UUID, TrackingFields } from './common';

/**
 * Monthly financial data for a specific year and account in the frontend
 * Each month stores a numerical amount, which is decrypted from the database
 * 
 * Note: Database enforces a unique constraint on (account_id, year) pair
 */
export interface YearRecord extends TrackingFields {
    id: UUID;                   // Unique identifier
    account_id: UUID;           // Reference to the account
    year: number;               // Year of the record
    jan: number | null;         // January value
    feb: number | null;         // February value
    mar: number | null;         // March value
    apr: number | null;         // April value
    may: number | null;         // May value
    jun: number | null;         // June value
    jul: number | null;         // July value
    aug: number | null;         // August value
    sep: number | null;         // September value
    oct: number | null;         // October value
    nov: number | null;         // November value
    dec: number | null;         // December value
}

/**
 * Type for a Supabase Database YearRecord
 * Represents how the year record is stored in the database (encrypted)
 */
export type DbYearRecord = Omit<YearRecord, 'jan' | 'feb' | 'mar' | 'apr' | 'may' | 'jun' | 
    'jul' | 'aug' | 'sep' | 'oct' | 'nov' | 'dec'> & {
    jan: string | null;         // January value (encrypted)
    feb: string | null;         // February value (encrypted)
    mar: string | null;         // March value (encrypted)
    apr: string | null;         // April value (encrypted)
    may: string | null;         // May value (encrypted)
    jun: string | null;         // June value (encrypted)
    jul: string | null;         // July value (encrypted)
    aug: string | null;         // August value (encrypted)
    sep: string | null;         // September value (encrypted)
    oct: string | null;         // October value (encrypted)
    nov: string | null;         // November value (encrypted)
    dec: string | null;         // December value (encrypted)
};

/**
 * Type for creating a new year record
 * Omits auto-generated fields
 */
export type YearRecordInsert = Omit<YearRecord, 'id' | 'created_at' | 'updated_at'>;

/**
 * Type for updating an existing year record
 * Makes all fields optional except id
 */
export type YearRecordUpdate = Partial<Omit<YearRecord, 'id'>> & { id: UUID };

/**
 * Interface for decrypted year record with numeric values.
 * Used for calculations and display after decryption.
 */
export interface DecryptedYearRecord {
    id: UUID;
    account_id: UUID;
    year: number;
    jan?: number;
    feb?: number;
    mar?: number;
    apr?: number;
    may?: number;
    jun?: number;
    jul?: number;
    aug?: number;
    sep?: number;
    oct?: number;
    nov?: number;
    dec?: number;
} 