import { HttpStatusCode } from '../types/api/common';
import { CommonErrorType, NoteErrorType } from '../types/api/errors';
import type { NoteApiResponse, NoteApiErrorResponse, CreateNoteRequest, UpdateNoteRequest } from '../types/api/responses';

const API_URL = import.meta.env.VITE_API_URL;

const handleNoteError = (error: unknown): NoteApiErrorResponse => {
    if ((error as NoteApiErrorResponse).statusCode) {
        return error as NoteApiErrorResponse;
    }
    return {
        success: false,
        message: 'Connection error. Please check your internet connection.',
        error: 'CONNECTION_ERROR' as CommonErrorType,
        statusCode: 0 as HttpStatusCode
    };
};

export const noteService = {
    async getAllNotes(): Promise<NoteApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/notes`, {
                method: 'GET',
                credentials: 'include'
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    ...data,
                    statusCode: response.status as HttpStatusCode
                } as NoteApiErrorResponse;
            }

            return data as NoteApiResponse;
        } catch (error) {
            throw handleNoteError(error);
        }
    },

    async createNote(noteData: CreateNoteRequest): Promise<NoteApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/notes`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(noteData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    ...data,
                    statusCode: response.status as HttpStatusCode
                };
            }

            return data as NoteApiResponse;
        } catch (error) {
            console.error('❌ Error creating note:', error);
            throw {
                success: false,
                message: 'Connection error. Please check your internet connection.',
                error: 'CONNECTION_ERROR' as NoteErrorType,
                statusCode: 0 as HttpStatusCode
            };
        }
    },

    async updateNote(id: string, updateData: UpdateNoteRequest): Promise<NoteApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/notes/${id}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    ...data,
                    statusCode: response.status as HttpStatusCode
                };
            }

            return data as NoteApiResponse;
        } catch (error) {
            console.error('❌ Error updating note:', error);
            throw {
                success: false,
                message: 'Connection error. Please check your internet connection.',
                error: 'CONNECTION_ERROR' as NoteErrorType,
                statusCode: 0 as HttpStatusCode
            };
        }
    },

    async deleteNote(id: string): Promise<NoteApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/notes/${id}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    ...data,
                    statusCode: response.status as HttpStatusCode
                };
            }

            return data as NoteApiResponse;
        } catch (error) {
            console.error('❌ Error deleting note:', error);
            throw {
                success: false,
                message: 'Connection error. Please check your internet connection.',
                error: 'CONNECTION_ERROR' as NoteErrorType,
                statusCode: 0 as HttpStatusCode
            };
        }
    }
};
