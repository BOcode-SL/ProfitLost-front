/**
 * Transaction Model
 * 
 * Contains type definitions for financial transactions.
 */

import { UUID, TrackingFields, ISODateString } from './common';

/**
 * Types of transaction recurrence
 * Defines the frequency of recurring transactions
 */
export type RecurrenceType = 'weekly' | 'monthly' | 'yearly' | null;

/**
 * Represents a financial transaction in the frontend
 * Core entity for tracking income and expenses
 * Values are already decrypted for frontend use
 */
export interface Transaction extends TrackingFields {
    id: UUID;                   // Unique identifier
    user_id: UUID;              // Owner of the transaction
    transaction_date: ISODateString;   // Transaction date
    description: string | null; // Transaction description
    amount: number;             // Transaction amount (as number in frontend)
    category_id: UUID;          // Reference to category
    recurrence_type: RecurrenceType; // Type of recurrence if recurring
    recurrence_end_date: ISODateString | null; // When recurrence ends
    recurrence_id: UUID | null; // ID linking recurring transactions
}

/**
 * Type for a Supabase Database Transaction
 * Represents how the transaction record is stored in the database (encrypted)
 */
export type DbTransaction = Omit<Transaction, 'amount' | 'description'> & {
    amount: string;             // Amount stored as encrypted string in database
    description: string | null; // Description stored as encrypted string in database
};

/**
 * Type for creating a new transaction
 * Omits auto-generated fields
 */
export type TransactionInsert = Omit<Transaction, 'id' | 'created_at' | 'updated_at'>;

/**
 * Type for updating an existing transaction
 * Makes all fields optional except id
 */
export type TransactionUpdate = Partial<Omit<Transaction, 'id'>> & { id: UUID }; 