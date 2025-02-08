import type { ApiSuccessResponse, ApiErrorResponse, ISODateString } from '../api/common';
import type { AuthErrorType, TransactionErrorType, UserErrorType, CategoryErrorType, AccountErrorType, NoteErrorType } from '../api/errors';
import type { User } from '../models/user';
import type { RecurrenceType, Transaction } from '../models/transaction';
import type { Category } from '../models/category';
import type { Note } from '../models/note';
import type { Account, YearRecord, AccountConfiguration } from '../models/account';

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
 * Request Types for authentication
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

/**
 * Request Types for category
 */
export interface CreateCategoryRequest {
    name: string;
    color: string;
}

export interface UpdateCategoryRequest {
    name?: string;
    color?: string;
}

/**
 * Request Types for transaction
 */
export interface CreateTransactionRequest {
    date: ISODateString;
    description: string;
    amount: number;
    category: string;
    isIncome?: boolean;
    isRecurrent?: boolean;
    recurrenceType?: RecurrenceType;
    recurrenceEndDate?: ISODateString;
}

export interface UpdateTransactionRequest {
    date?: ISODateString;
    description?: string;
    amount?: number;
    category?: string;
    isIncome?: boolean;
    updateAll?: boolean;
    isRecurrent?: boolean;
    recurrenceType?: RecurrenceType;
    recurrenceEndDate?: ISODateString;
}

/**
 * Request Types for account
 */
export interface CreateAccountRequest {
    accountName: string;
    configuration: AccountConfiguration;
    records: Record<string, YearRecord>;
}

export interface UpdateAccountRequest {
    accountName?: string;
    configuration?: AccountConfiguration;
    records?: Record<string, YearRecord>;
}

/**
 * Request Types for note
 */
export interface CreateNoteRequest {
    title: string;
    content: string;
}

export interface UpdateNoteRequest {
    title?: string;
    content?: string;
}

export interface ResetPasswordRequest {
    email: string;
}

export interface VerifyResetTokenRequest {
    token: string;
}

export interface UpdateForgottenPasswordRequest {
    token: string;
    newPassword: string;
}