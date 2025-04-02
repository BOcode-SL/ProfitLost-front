/**
 * Category Models Module
 * 
 * Contains type definitions for transaction categories.
 */

import type { ISODateString } from '../api/common';

/**
 * Represents a transaction category
 * Used for organizing and filtering financial transactions
 */
export interface Category {
    _id: string;                 // Unique identifier
    user_id: string;             // Owner of the category
    name: string;                // Display name
    color: string;               // Color for visual identification (hex)
    createdAt: ISODateString;    // When the category was created
    updatedAt: ISODateString;    // When the category was last updated
} 