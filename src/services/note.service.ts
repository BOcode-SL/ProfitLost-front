// Types
import { HttpStatusCode } from '../types/api/common';
import { CommonErrorType } from '../types/api/errors';
import type { NoteApiResponse, CreateNoteRequest, UpdateNoteRequest } from '../types/api/responses';

// Utils
import { getAuthHeaders } from '../utils/apiHeaders';

// Defining the API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL;

// Function to handle note errors
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

export const noteService = {
    // Method to get all notes
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

    // Method to create a new note
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

    // Method to update an existing note
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
            console.error('Error en updateNote:', error);
            return handleNoteError(error);
        }
    },

    // Method to delete a note
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
