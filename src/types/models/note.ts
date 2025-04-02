/**
 * Note Models Module
 * 
 * Contains type definitions for user notes.
 */

import type { ISODateString } from '../api/common';

/**
 * Represents a user note
 * Used for storing personal information or reminders
 */
export interface Note {
    _id: string;                 // Unique identifier
    user_id: string;             // Owner of the note
    title: string;               // Note title
    content: string;             // Note content (text)
    createdAt: ISODateString;    // When the note was created
    updatedAt: ISODateString;    // When the note was last updated
} 