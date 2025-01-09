import type { ISODateString } from '../common.types';

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