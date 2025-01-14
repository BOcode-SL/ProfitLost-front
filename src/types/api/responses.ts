import type { HttpStatusCode } from '../api/common';
import type { AuthErrorType, TransactionErrorType, UserErrorType, CategoryErrorType } from '../api/errors';
import type { User } from '../models/user';
import type { Transaction } from '../models/transaction';
import type { Category } from '../models/category';
import type { Account, AccountRecord, AccountConfiguration } from '../models/account';
import type { Note } from '../models/note';

/**
 * Types for API responses.
 */
export interface ApiErrorResponse {
    success: false;
    message: string;
    error: AuthErrorType;
    status: HttpStatusCode;
    remainingTime?: number;
    remainingAttempts?: number;
}

export interface ApiSuccessResponse {
    success: true;
    message: string;
    token: string;
    data?: {
        _id: string;
        username: string;
        email: string;
    };
}

export type ApiResponse = ApiSuccessResponse | ApiErrorResponse;

export interface LoginCredentials {
    identifier: string;
    password: string;
}

export interface RegisterCredentials {
    username: string;
    email: string;
    password: string;
    name: string;
    surname: string;
}

/**
 * Types for user API responses.
 */
export interface UserApiErrorResponse {
    success: false;
    message: string;
    error: UserErrorType;
    status: HttpStatusCode;
}

export interface UserApiSuccessResponse {
    success: true;
    message: string;
    data?: User | User[];
}

export type UserApiResponse = UserApiSuccessResponse | UserApiErrorResponse;

/**
 * Types for transaction API responses.
 */
export interface TransactionApiErrorResponse {
    success: false;
    message: string;
    error: TransactionErrorType;
    status: HttpStatusCode;
}

export interface TransactionApiSuccessResponse {
    success: true;
    message: string;
    data?: Transaction | Transaction[];
}

export type TransactionApiResponse = TransactionApiSuccessResponse | TransactionApiErrorResponse;

/**
 * Types for category API responses.
 */
export interface CategoryApiErrorResponse {
    success: false;
    message: string;
    error: CategoryErrorType;
    status: HttpStatusCode;
}

export interface CategoryApiSuccessResponse {
    success: true;
    message: string;
    data?: Category | Category[];
}

export type CategoryApiResponse = CategoryApiSuccessResponse | CategoryApiErrorResponse;

/**
 * Types for account API responses.
 */
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

/**
 * Types for note API responses.
 */
export interface NoteResponse {
    success: boolean;
    data?: Note | Note[];
    message?: string;
    error?: string;
    statusCode: HttpStatusCode;
}

export interface CreateNoteRequest {
    title: string;
    content: string;
}

export interface UpdateNoteRequest {
    title?: string;
    content?: string;
}
