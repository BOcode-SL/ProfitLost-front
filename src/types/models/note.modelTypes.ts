import type { ISODateString } from '../common.types';

export interface Note {
    _id: string;
    title: string;
    content: string;
    user_id: string;
    created_at: ISODateString;
    updated_at: ISODateString;
} 