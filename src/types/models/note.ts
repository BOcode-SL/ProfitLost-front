import type { ISODateString } from '../api/common';

export interface Note {
    _id: string;
    user_id: string;
    title: string;
    content: string;
    createdAt: ISODateString;
    updatedAt: ISODateString;
} 