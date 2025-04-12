/**
 * Role Model
 * 
 * Contains type definitions for user roles and permissions.
 */

import { UUID, RoleTrackingFields } from './common';

/**
 * Role definition for user access control
 */
export interface Role extends RoleTrackingFields {
    id: UUID;                   // Unique identifier
    code: string;               // Role code (e.g., 'admin', 'user')
    name: string;               // Display name for the role
}

/**
 * Type for a Supabase Database Role
 * Represents how the role record is stored in the database
 */
export type DbRole = Role;

/**
 * Type for creating a new role
 * Omits auto-generated fields
 */
export type RoleInsert = Omit<Role, 'id' | 'created_at' | 'updated_at'>;

/**
 * Type for updating an existing role
 * Makes all fields optional except id
 */
export type RoleUpdate = Partial<Omit<Role, 'id'>> & { id: UUID }; 