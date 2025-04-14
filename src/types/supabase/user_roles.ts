/**
 * UserRole Model
 * 
 * Contains type definitions for mapping users to roles.
 */

import { UUID, RoleTrackingFields } from './common';

/**
 * Mapping between users and roles
 */
export interface UserRole extends RoleTrackingFields {
    id: UUID;                   // Unique identifier
    user_id: UUID;              // Reference to user
    role_id: UUID;              // Reference to role
}

/**
 * Type for a Supabase Database UserRole
 * Represents how the user role mapping is stored in the database
 */
export type DbUserRole = UserRole;

/**
 * Type for creating a new user role assignment
 * Omits auto-generated fields
 */
export type UserRoleInsert = Omit<UserRole, 'id' | 'created_at' | 'updated_at'>;

/**
 * Type for updating an existing user role assignment
 * Makes all fields optional except id
 */
export type UserRoleUpdate = Partial<Omit<UserRole, 'id'>> & { id: UUID }; 