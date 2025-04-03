/**
 * Transaction Models Module
 * 
 * Contains type definitions for financial transactions.
 */

import type { ISODateString } from '../api/common';

/**
 * Represents a financial transaction
 * Core entity for tracking income and expenses
 */
export interface Transaction {
    _id: string;                 // Unique identifier
    user_id: string;             // Owner of the transaction
    date: ISODateString;         // Transaction date
    description: string;         // Transaction description
    amount: number;              // Transaction amount (positive number)
    category: string;            // Category ID
    createdAt: ISODateString;    // When the transaction was created
    updatedAt: ISODateString;    // When the transaction was last updated
    isRecurrent: boolean;        // Whether this is a recurring transaction
    recurrenceType?: RecurrenceType; // Type of recurrence if recurring
    recurrenceEndDate?: ISODateString; // When recurrence ends
    recurrenceId?: string;       // ID linking recurring transactions
    isOriginalRecurrence?: boolean; // Whether this is the first transaction in a series
}

/**
 * Types of transaction recurrence
 * Defines the frequency of recurring transactions
 */
export type RecurrenceType = 'weekly' | 'monthly' | 'yearly' | null;