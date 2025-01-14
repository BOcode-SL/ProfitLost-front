import { HttpStatusCode } from '../types/api/common';
import type { NoteResponse, CreateNoteRequest, UpdateNoteRequest } from '../types/services/note.serviceTypes';

const API_URL = import.meta.env.VITE_API_URL;

export const noteService = {
    async getAllNotes(): Promise<NoteResponse> {
        try {
            const response = await fetch(`${API_URL}/api/notes`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    ...data,
                    status: response.status
                };
            }

            return data as NoteResponse;
        } catch (error) {
            console.error('❌ Error fetching notes:', error);
            throw {
                success: false,
                message: 'Connection error. Please check your internet connection.',
                error: 'CONNECTION_ERROR',
                status: 0 as HttpStatusCode
            };
        }
    },

    async createNote(noteData: CreateNoteRequest): Promise<NoteResponse> {
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
                    status: response.status
                };
            }

            return data as NoteResponse;
        } catch (error) {
            console.error('❌ Error creating note:', error);
            throw {
                success: false,
                message: 'Connection error. Please check your internet connection.',
                error: 'CONNECTION_ERROR',
                status: 0 as HttpStatusCode
            };
        }
    },

    async updateNote(id: string, updateData: UpdateNoteRequest): Promise<NoteResponse> {
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
                    status: response.status
                };
            }

            return data as NoteResponse;
        } catch (error) {
            console.error('❌ Error updating note:', error);
            throw {
                success: false,
                message: 'Connection error. Please check your internet connection.',
                error: 'CONNECTION_ERROR',
                status: 0 as HttpStatusCode
            };
        }
    },

    async deleteNote(id: string): Promise<NoteResponse> {
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
                    status: response.status
                };
            }

            return data as NoteResponse;
        } catch (error) {
            console.error('❌ Error deleting note:', error);
            throw {
                success: false,
                message: 'Connection error. Please check your internet connection.',
                error: 'CONNECTION_ERROR',
                status: 0 as HttpStatusCode
            };
        }
    }
};
