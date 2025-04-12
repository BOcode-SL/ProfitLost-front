/**
 * Common Types Module
 * 
 * Contains shared type definitions used across Supabase models.
 */

/**
 * Type for ISO date strings returned by Supabase
 */
export type ISODateString = string;

/**
 * Represents a UUID string
 */
export type UUID = string;

/**
 * Common tracking fields for all Supabase models
 * Includes creation, modification, and deletion information
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
 */
export interface RoleTrackingFields {
    created_at: ISODateString;  // Creation timestamp
    updated_at: ISODateString;  // Last update timestamp
    deleted_at: ISODateString | null;  // Deletion timestamp (null if not deleted)
    created_by: UUID | null;    // User who created the record (can be null)
    updated_by: UUID | null;    // User who last updated the record (can be null)
    deleted_by: UUID | null;    // User who deleted the record (null if not deleted)
} 