import type { AuthErrorType, TransactionErrorType, UserErrorType, CategoryErrorType, AccountErrorType, NoteErrorType } from '../api/errors';
import type { User } from '../models/user';
import type { Transaction } from '../models/transaction';
import type { Category } from '../models/category';
import type { Account, AccountRecord, AccountConfiguration } from '../models/account';
import type { Note } from '../models/note';
import type { ApiSuccessResponse, ApiErrorResponse } from '../api/common';

/**
 * Types for authentication API responses
 */
export interface AuthApiErrorResponse extends ApiErrorResponse<AuthErrorType> {
    remainingTime?: number;
    remainingAttempts?: number;
    details?: {
        field?: string;
        message?: string;
    };
}

export interface AuthApiSuccessResponse extends ApiSuccessResponse {
    token: string;
    data?: {
        _id: string;
        username: string;
        email: string;
    };
}

export type AuthApiResponse = AuthApiSuccessResponse | AuthApiErrorResponse;

/**
 * Types for user API responses
 */
export type UserApiErrorResponse = ApiErrorResponse<UserErrorType>;
export type UserApiSuccessResponse = ApiSuccessResponse<User | User[]>;
export type UserApiResponse = UserApiSuccessResponse | UserApiErrorResponse;

/**
 * Types for transaction API responses
 */
export type TransactionApiErrorResponse = ApiErrorResponse<TransactionErrorType>;
export type TransactionApiSuccessResponse = ApiSuccessResponse<Transaction | Transaction[]>;
export type TransactionApiResponse = TransactionApiSuccessResponse | TransactionApiErrorResponse;

/**
 * Types for category API responses
 */
export type CategoryApiErrorResponse = ApiErrorResponse<CategoryErrorType>;
export type CategoryApiSuccessResponse = ApiSuccessResponse<Category | Category[]>;
export type CategoryApiResponse = CategoryApiSuccessResponse | CategoryApiErrorResponse;

/**
 * Types for account API responses
 */
export interface AccountApiErrorResponse extends ApiErrorResponse<AccountErrorType> {
    details?: {
        field?: string;
        message?: string;
    };
}

export interface AccountApiSuccessResponse extends ApiSuccessResponse<Account | Account[]> {
    metadata?: {
        total?: number;
        active?: number;
    };
}

export type AccountApiResponse = AccountApiSuccessResponse | AccountApiErrorResponse;

/**
 * Types for note API responses
 */
export interface NoteApiErrorResponse extends ApiErrorResponse<NoteErrorType> {
    details?: {
        field?: string;
        message?: string;
    };
}

export interface NoteApiSuccessResponse extends ApiSuccessResponse<Note | Note[]> {
    metadata?: {
        total?: number;
    };
}

export type NoteApiResponse = NoteApiSuccessResponse | NoteApiErrorResponse;

/**
 * Request Types
 */
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

export interface CreateNoteRequest {
    title: string;
    content: string;
}

export interface UpdateNoteRequest {
    title?: string;
    content?: string;
}
