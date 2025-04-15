/**
 * Account Model
 * 
 * Contains type definitions for financial accounts.
 * 
 * @module SupabaseAccounts
 */

import { UUID, TrackingFields } from './common';

/**
 * Represents a financial account in the frontend
 * Used to track financial information across multiple time periods
 * Values are already decrypted for frontend use
 * 
 * @interface Account
 */
export interface Account extends TrackingFields {
    id: UUID;                   // Unique identifier
    user_id: UUID;              // Owner of the account
    name: string;               // Account name (decrypted)
    background_color: string;   // Background color (hex or name)
    text_color: string;         // Text color (hex or name)
    is_active: boolean;         // Whether the account is active
    account_order: number;      // Order in which account is displayed
}

/**
 * Type for a Supabase Database Account
 * Represents how the account record is stored in the database with encryption
 * 
 * @typedef {Object} DbAccount
 */
export type DbAccount = Omit<Account, 'name'> & {
    name: string;               // Account name (encrypted in database)
};

/**
 * Type for creating a new account
 * Omits auto-generated fields
 * 
 * @typedef {Object} AccountInsert
 */
export type AccountInsert = Omit<Account, 'id' | 'created_at' | 'updated_at'>;

/**
 * Type for updating an existing account
 * Makes all fields optional except id
 * 
 * @typedef {Object} AccountUpdate
 */
export type AccountUpdate = Partial<Omit<Account, 'id'>> & { id: UUID }; 