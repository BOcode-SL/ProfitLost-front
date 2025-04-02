/**
 * Account Models Module
 * 
 * Contains type definitions for financial accounts and their related structures.
 */

import type { ISODateString } from '../api/common';

/**
 * Represents a financial account in the system
 * Used to track financial information across multiple time periods
 */
export interface Account {
    _id: string;                 // Unique identifier
    user_id: string;             // Owner of the account
    accountName: string;         // Display name for the account
    records: Record<string, YearRecord>; // Financial data organized by year
    configuration: AccountConfiguration; // Visual and state settings
    createdAt: ISODateString;    // When the account was created
    updatedAt: ISODateString;    // When the account was last updated
}

/**
 * Represents monthly financial data for a specific year
 * Each property stores a numeric value (typically monetary amount)
 */
export interface YearRecord {
    jan: number;
    feb: number;
    mar: number;
    apr: number;
    may: number;
    jun: number;
    jul: number;
    aug: number;
    sep: number;
    oct: number;
    nov: number;
    dec: number;
}

/**
 * Configuration options for an account
 * Controls visual appearance and activation state
 */
export interface AccountConfiguration {
    backgroundColor: string;     // Background color (hex)
    color: string;               // Text color (hex)
    isActive: boolean;           // Whether the account is currently active
} 