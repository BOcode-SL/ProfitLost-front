/**
 * Note Model
 * 
 * Contains type definitions for user notes.
 * 
 * @module SupabaseNotes
 */

import { UUID, TrackingFields } from './common';

/**
 * Represents a user note in the frontend
 * Used for storing personal information or reminders
 * Values are already decrypted for frontend use
 * 
 * @interface Note
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
 * 
 * @typedef DbNote
 */
export type DbNote = Omit<Note, 'title' | 'content'> & {
    title: string;              // Note title (encrypted in database)
    content: string;            // Note content (encrypted in database)
};

/**
 * Type for creating a new note
 * Omits auto-generated fields
 * 
 * @typedef NoteInsert
 */
export type NoteInsert = Omit<Note, 'id' | 'created_at' | 'updated_at'>;

/**
 * Type for updating an existing note
 * Makes all fields optional except id
 * 
 * @typedef NoteUpdate
 */
export type NoteUpdate = Partial<Omit<Note, 'id'>> & { id: UUID }; 