import type { HttpStatusCode } from '../common.types';
import type { Account, AccountConfiguration } from '../models/account.modelTypes';

export interface AccountResponse {
    success: boolean;
    data?: Account | Account[];
    message?: string;
    error?: string;
    statusCode: HttpStatusCode;
}

export interface CreateAccountRequest {
    accountName: string;
    configuration: AccountConfiguration;
}

export interface UpdateAccountRequest {
    accountName?: string;
    records?: {
        year: number;
        month: string;
        value: number;
    }[];
    configuration?: {
        backgroundColor: string;
        color: string;
        isActive: boolean;
    };
}
