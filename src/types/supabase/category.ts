/**
 * Category Model
 * 
 * Contains type definitions for transaction categories.
 */

import { UUID, TrackingFields } from './common';

/**
 * Represents a transaction category in the frontend
 * Used for organizing and filtering financial transactions
 * Values are already decrypted for frontend use
 */
export interface Category extends TrackingFields {
    id: UUID;                   // Unique identifier
    user_id: UUID;              // Owner of the category
    name: string;               // Category name (decrypted)
    color: string;              // Color for visual identification (hex or name)
}

/**
 * Type for a Supabase Database Category
 * Represents how the category record is stored in the database with encryption
 */
export type DbCategory = Omit<Category, 'name'> & {
    name: string;               // Category name (encrypted in database)
};

/**
 * Type for creating a new category
 * Omits auto-generated fields
 */
export type CategoryInsert = Omit<Category, 'id' | 'created_at' | 'updated_at'>;

/**
 * Type for updating an existing category
 * Makes all fields optional except id
 */
export type CategoryUpdate = Partial<Omit<Category, 'id'>> & { id: UUID }; 