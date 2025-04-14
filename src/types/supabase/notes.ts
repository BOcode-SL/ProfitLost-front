/**
 * Note Model
 * 
 * Contains type definitions for user notes.
 */

import { UUID, TrackingFields } from './common';

/**
 * Represents a user note in the frontend
 * Used for storing personal information or reminders
 * Values are already decrypted for frontend use
 */
export interface Note extends TrackingFields {
    id: UUID;                   // Unique identifier
    user_id: UUID;              // Owner of the note
    title: string;              // Note title (decrypted)
    content: string;            // Note content (decrypted)
}

/**
 * Type for a Supabase Database Note
 * Represents how the note record is stored in the database with encryption
 */
export type DbNote = Omit<Note, 'title' | 'content'> & {
    title: string;              // Note title (encrypted in database)
    content: string;            // Note content (encrypted in database)
};

/**
 * Type for creating a new note
 * Omits auto-generated fields
 */
export type NoteInsert = Omit<Note, 'id' | 'created_at' | 'updated_at'>;

/**
 * Type for updating an existing note
 * Makes all fields optional except id
 */
export type NoteUpdate = Partial<Omit<Note, 'id'>> & { id: UUID }; 