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
    configuration: AccountConfiguration;
    records: AccountRecord[];
}

export interface UpdateAccountRequest {
    accountName?: string;
    records?: AccountRecord[];
    configuration?: AccountConfiguration;
}
