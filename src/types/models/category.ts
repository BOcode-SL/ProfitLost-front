import type { ISODateString } from '../api/common';

export interface Category {
    _id: string;
    user_id: string;
    name: string;
    color: string;
    createdAt: ISODateString;
    updatedAt: ISODateString;
} 