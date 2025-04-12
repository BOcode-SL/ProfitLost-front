/**
 * Transaction Model Module
 * 
 * Contains adapted type definitions for transaction data that map to Supabase models.
 */

import type { UUID, ISODateString } from '../supabase/common';

/**
 * Types of transaction recurrence
 * Defines the frequency of recurring transactions
 */
export type RecurrenceType = 'weekly' | 'monthly' | 'yearly' | null;

/**
 * Frontend Transaction interface that maps to Supabase Transaction model
 */
export interface Transaction {
    _id: UUID;                     // Maps to id from Supabase
    date: ISODateString;           // Maps to transaction_date from Supabase
    description: string | null;    // Description of the transaction
    amount: number;                // Amount as a number (converted from encrypted string in backend)
    category: UUID;                // Maps to category_id from Supabase
    isIncome: boolean;             // Derived from amount sign (positive = income)
    isRecurrent: boolean;          // Derived from recurrence_type being non-null
    recurrenceType: RecurrenceType; // Maps to recurrence_type from Supabase
    recurrenceEndDate: ISODateString | null; // Maps to recurrence_end_date from Supabase
    recurrenceId: UUID | null;     // Maps to recurrence_id from Supabase
    createdAt: ISODateString;      // Maps to created_at from Supabase
    updatedAt: ISODateString;      // Maps to updated_at from Supabase
}

/**
 * Type for creating or updating a transaction
 */
export interface TransactionInput {
    date: ISODateString;
    description: string | null;
    amount: number;
    category: UUID;
    isIncome?: boolean;
    isRecurrent?: boolean;
    recurrenceType?: RecurrenceType;
    recurrenceEndDate?: ISODateString | null;
    recurrenceId?: UUID | null;
}