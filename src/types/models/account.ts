import type { ISODateString } from '../api/common';

export interface Account {
    _id: string;
    user_id: string;
    accountName: string;
    records: AccountRecord[];
    configuration: AccountConfiguration;
    createdAt: ISODateString;
    updatedAt: ISODateString;
}

export interface AccountRecord {
    year: number;
    month: string;
    value: number;
}

export interface AccountConfiguration {
    backgroundColor: string;
    color: string;
    isActive: boolean;
} 