import type { ISODateString } from '../api/common';

export interface Transaction {
    _id: string;
    user_id: string;
    date: ISODateString;
    description: string;
    amount: number;
    category: string;
    createdAt: ISODateString;
    updatedAt: ISODateString;
} 