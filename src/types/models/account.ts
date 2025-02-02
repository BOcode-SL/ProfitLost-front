import type { ISODateString } from '../api/common';

export interface Account {
    _id: string;
    user_id: string;
    accountName: string;
    records: Record<string, YearRecord>;
    configuration: AccountConfiguration;
    createdAt: ISODateString;
    updatedAt: ISODateString;
}

export interface YearRecord {
    jan: number;
    feb: number;
    mar: number;
    apr: number;
    may: number;
    jun: number;
    jul: number;
    aug: number;
    sep: number;
    oct: number;
    nov: number;
    dec: number;
}

export interface AccountConfiguration {
    backgroundColor: string;
    color: string;
    isActive: boolean;
} 