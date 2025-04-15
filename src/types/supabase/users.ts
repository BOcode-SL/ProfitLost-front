/**
 * User Model
 * 
 * Contains type definitions for user data and authentication.
 * 
 * @module SupabaseUsers
 */

import { UUID, RoleTrackingFields, ISODateString } from './common';

/**
 * Represents a user in the Supabase system
 * Core entity for authentication and personalization
 * 
 * @interface User
 */
export interface User extends RoleTrackingFields {
    id: UUID;                       // Unique identifier
    username: string;               // Unique username
    email: string;                  // Email address
    password: string | null;        // Hashed password (null for OAuth users)
    name: string;                   // First name
    surname: string;                // Last name
    google_id: string | null;       // Google OAuth ID
    last_login: ISODateString;      // Last login timestamp
    reset_token: number | null;     // Password reset token
    reset_token_expired: ISODateString | null; // Reset token expiration
}

/**
 * Type for a Supabase Database User
 * Represents how the user record is stored in the database
 * 
 * @typedef DbUser
 */
export type DbUser = User;

/**
 * Type for creating a new user
 * Omits auto-generated fields
 * 
 * @typedef UserInsert
 */
export type UserInsert = Omit<User, 'id' | 'created_at' | 'updated_at'>;

/**
 * Type for updating an existing user
 * Makes all fields optional except id
 * 
 * @typedef UserUpdate
 */
export type UserUpdate = Partial<Omit<User, 'id'>> & { id: UUID }; 