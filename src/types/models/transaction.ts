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
    isRecurrent: boolean;
    recurrenceType?: RecurrenceType;
    recurrenceEndDate?: ISODateString;
    recurrenceId?: string;
    isOriginalRecurrence?: boolean;
} 

export type RecurrenceType = 'weekly' | 'monthly' | 'yearly' | null;