import type { HttpStatusCode } from '../common.types';
import type { Note } from '../models/note.modelTypes';

export interface NoteResponse {
    success: boolean;
    data?: Note | Note[];
    message?: string;
    error?: string;
    statusCode: HttpStatusCode;
}

export interface CreateNoteRequest {
    title: string;
    content: string;
}

export interface UpdateNoteRequest {
    title?: string;
    content?: string;
}
