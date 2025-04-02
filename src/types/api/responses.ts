/**
 * API Response Types Module
 * 
 * Contains type definitions for all API response structures.
 * Includes both request and response types for each entity.
 */

import type { ApiSuccessResponse, ApiErrorResponse, ISODateString } from '../api/common';
import type {
    AuthErrorType,
    TransactionErrorType,
    UserErrorType,
    CategoryErrorType,
    AccountErrorType,
    NoteErrorType,
    AnalyticsErrorType
} from '../api/errors';
import type { User } from '../models/user';
import type { RecurrenceType, Transaction } from '../models/transaction';
import type { Category } from '../models/category';
import type { Note } from '../models/note';
import type { Account, YearRecord, AccountConfiguration } from '../models/account';
import type { UserMetrics, TransactionMetrics, TransactionHistory } from '../models/analytics';
import { HttpStatusCode } from './common';

/**
 * Types for authentication API responses
 * Includes extended error information for auth-specific scenarios
 */
export interface AuthApiErrorResponse extends ApiErrorResponse<AuthErrorType> {
    remainingTime?: number;      // Time until account is unlocked (in seconds)
    remainingAttempts?: number;  // Number of login attempts remaining before lockout
    details?: {
        field?: string;          // Which field has the error (e.g., 'email', 'password')
        message?: string;        // Detailed message about the specific error
    };
}

/**
 * Successful authentication response with user token and basic data
 */
export interface AuthApiSuccessResponse extends ApiSuccessResponse {
    token: string;               // JWT token for authenticated sessions
    data?: {
        _id: string;
        username: string;
        email: string;
    };
}

/**
 * Combined type for authentication API responses
 */
export interface AuthApiResponse {
    success: boolean;
    message: string;
    error?: AuthErrorType;
    statusCode: HttpStatusCode;
    token?: string;
    data?: {
        _id: string;
        username: string;
        email: string;
    };
    isNewUser?: boolean;         // Flag indicating if this is a new user (for OAuth flows)
}

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
 * Includes extended error details and metadata for account information
 */
export interface AccountApiErrorResponse extends ApiErrorResponse<AccountErrorType> {
    details?: {
        field?: string;          // Which field has the error
        message?: string;        // Detailed message about the specific error
    };
}

/**
 * Successful account response with optional metadata about the account collection
 */
export interface AccountApiSuccessResponse extends ApiSuccessResponse<Account | Account[]> {
    metadata?: {
        total?: number;          // Total number of accounts
        active?: number;         // Number of active accounts
    };
}

export type AccountApiResponse = AccountApiSuccessResponse | AccountApiErrorResponse;

/**
 * Types for note API responses
 * Includes extended error details
 */
export interface NoteApiErrorResponse extends ApiErrorResponse<NoteErrorType> {
    details?: {
        field?: string;          // Which field has the error
        message?: string;        // Detailed message about the specific error
    };
}

/**
 * Successful note response with optional metadata
 */
export interface NoteApiSuccessResponse extends ApiSuccessResponse<Note | Note[]> {
    metadata?: {
        total?: number;          // Total number of notes
    };
}

export type NoteApiResponse = NoteApiSuccessResponse | NoteApiErrorResponse;

/**
 * Types for analytics API responses
 * Includes extended error details
 */
export interface AnalyticsApiErrorResponse extends ApiErrorResponse<AnalyticsErrorType> {
    details?: {
        field?: string;
        message?: string;
    };
}

export interface AnalyticsApiSuccessResponse extends ApiSuccessResponse<UserMetrics | TransactionMetrics | TransactionHistory[]> {
    metadata?: {
        lastUpdated?: ISODateString;
    };
}

export type AnalyticsApiResponse = AnalyticsApiSuccessResponse | AnalyticsApiErrorResponse;

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