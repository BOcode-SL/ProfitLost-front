import type { HttpStatusCode } from '../common.types';
import type { Account, AccountRecord, AccountConfiguration } from '../models/account.modelTypes';

export interface AccountResponse {
    success: boolean;
    data?: Account | Account[];
    message?: string;
    error?: string;
    statusCode: HttpStatusCode;
}

export interface CreateAccountRequest {
    accountName: string;
    configuration: {
        backgroundColor: string;
        color: string;
        isActive: boolean;
    };
    records: {
        year: number;
        month: string;
        value: number;
    }[];
}

export interface UpdateAccountRequest {
    accountName?: string;
    records?: AccountRecord[];
    configuration?: AccountConfiguration;
}
