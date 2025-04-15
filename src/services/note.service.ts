/**
 * Note Service Module
 * 
 * Provides functionality for managing notes including creating,
 * retrieving, updating, and deleting user notes.
 * 
 * @module NoteService
 */

// Types
import { HttpStatusCode } from '../types/api/common';
import { CommonErrorType } from '../types/api/errors';
import type { NoteApiResponse, CreateNoteRequest, UpdateNoteRequest } from '../types/api/responses';

// Utils
import { getAuthHeaders } from '../utils/apiHeaders';

// Defining the API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL;

/**
 * Handles errors that occur during note operations
 * 
 * @param {unknown} error - The error that occurred during an API request
 * @returns {NoteApiResponse} A standardized NoteApiResponse with error details
 */
const handleNoteError = (error: unknown): NoteApiResponse => {
    // Check if the error has a statusCode
    if ((error as NoteApiResponse).statusCode) {
        return error as NoteApiResponse;
    }
    // Handle network errors
    return {
        success: false,
        message: 'Connection error. Please check your internet connection.',
        error: 'CONNECTION_ERROR' as CommonErrorType,
        statusCode: 0 as HttpStatusCode
    };
};

/**
 * Service object providing methods for note management
 */
export const noteService = {
    /**
     * Retrieves all notes belonging to the current user
     * Notes are automatically decrypted by the backend
     * 
     * @returns {Promise<NoteApiResponse>} Promise with the notes data or error response
     */
    async getAllNotes(): Promise<NoteApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/notes`, {
                method: 'GET',
                credentials: 'include',
                headers: getAuthHeaders()
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    ...data,
                    statusCode: response.status as HttpStatusCode
                } as NoteApiResponse;
            }

            return data as NoteApiResponse;
        } catch (error) {
            throw handleNoteError(error);
        }
    },

    /**
     * Creates a new note with the provided data
     * Note content will be encrypted by the backend
     * 
     * @param {CreateNoteRequest} noteData - The data for the note to be created
     * @returns {Promise<NoteApiResponse>} Promise with the created note data or error response
     */
    async createNote(noteData: CreateNoteRequest): Promise<NoteApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/notes`, {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify(noteData),
                headers: getAuthHeaders()
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    ...data,
                    statusCode: response.status as HttpStatusCode
                } as NoteApiResponse;
            }

            return data as NoteApiResponse;
        } catch (error) {
            throw handleNoteError(error);
        }
    },

    /**
     * Updates an existing note with the provided data
     * Note content will be encrypted by the backend
     * 
     * @param {string} id - The ID of the note to be updated
     * @param {UpdateNoteRequest} updateData - The new data to update the note with
     * @returns {Promise<NoteApiResponse>} Promise with the updated note data or error response
     */
    async updateNote(id: string, updateData: UpdateNoteRequest): Promise<NoteApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/notes/${id}`, {
                method: 'PUT',
                credentials: 'include',
                body: JSON.stringify(updateData),
                headers: getAuthHeaders()
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    ...data,
                    success: false,
                    statusCode: response.status as HttpStatusCode
                };
            }

            return data;
        } catch (error) {
            console.error('Error updating note:', error);
            return handleNoteError(error);
        }
    },

    /**
     * Deletes a note with the specified ID
     * Implements soft delete by setting deleted_at timestamp in the backend
     * 
     * @param {string} id - The ID of the note to be deleted
     * @returns {Promise<NoteApiResponse>} Promise with the response data or error response
     */
    async deleteNote(id: string): Promise<NoteApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/notes/${id}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: getAuthHeaders()
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    ...data,
                    statusCode: response.status as HttpStatusCode
                } as NoteApiResponse;
            }

            return data as NoteApiResponse;
        } catch (error) {
            throw handleNoteError(error);
        }
    }
};
