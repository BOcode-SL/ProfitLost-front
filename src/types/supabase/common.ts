/**
 * Common Types Module
 * 
 * Contains shared type definitions used across Supabase models.
 * These types provide the foundation for all database entity types.
 * 
 * @module SupabaseCommon
 */

/**
 * Type for ISO date strings returned by Supabase
 * Represents dates in ISO 8601 format (e.g., "2024-05-20T15:30:00.000Z")
 * 
 * @typedef {string} ISODateString
 */
export type ISODateString = string;

/**
 * Represents a UUID string
 * Used as unique identifiers for database entities
 * 
 * @typedef {string} UUID
 */
export type UUID = string;

/**
 * Common tracking fields for all Supabase models
 * Includes creation, modification, and deletion information
 * These fields are automatically managed by database triggers
 * 
 * @interface TrackingFields
 */
export interface TrackingFields {
    created_at: ISODateString;  // Creation timestamp
    updated_at: ISODateString;  // Last update timestamp
    deleted_at: ISODateString | null;  // Deletion timestamp (null if not deleted)
    created_by: UUID;           // User who created the record
    updated_by: UUID;           // User who last updated the record
    deleted_by: UUID | null;    // User who deleted the record (null if not deleted)
}

/**
 * Tracking fields specifically for roles and users tables
 * Where creator fields can be null (for initial system setup)
 * Used during initial system setup where user IDs might not be available
 * 
 * @interface RoleTrackingFields
 */
export interface RoleTrackingFields {
    created_at: ISODateString;  // Creation timestamp
    updated_at: ISODateString;  // Last update timestamp
    deleted_at: ISODateString | null;  // Deletion timestamp (null if not deleted)
    created_by: UUID | null;    // User who created the record (can be null)
    updated_by: UUID | null;    // User who last updated the record (can be null)
    deleted_by: UUID | null;    // User who deleted the record (null if not deleted)
} 