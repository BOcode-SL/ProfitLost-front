/**
 * API Response Types Module
 * 
 * Contains type definitions for all API response structures.
 * Includes both request and response types for each entity.
 */

import type { ApiSuccessResponse, ApiErrorResponse, ISODateString } from './common';
import type {
    AuthErrorType,
    TransactionErrorType,
    UserErrorType,
    CategoryErrorType,
    AccountErrorType,
    NoteErrorType
} from './errors';
import type { HttpStatusCode } from './common';

// Supabase models
import type { UUID } from '../supabase/common';
import type { User } from '../supabase/user';
import type { RecurrenceType, Transaction } from '../supabase/transaction';
import type { Category } from '../supabase/category';
import type { Note } from '../supabase/note';
import type { Account } from '../supabase/account';
import type { PreferenceContent } from '../supabase/preference';

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
        id: UUID;
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
        id: UUID;
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
 * Specialized type for transaction years response
 * Used specifically for the getTransactionYears endpoint which returns an array of year strings
 */
export interface TransactionYearsApiResponse {
    success: boolean;
    data: string[];
    message?: string;
    error?: TransactionErrorType;
    statusCode: HttpStatusCode;
}

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
    transaction_date: ISODateString;
    description: string | null;
    amount: string | number;
    category_id: UUID;
    recurrence_type: RecurrenceType | null;
    recurrence_end_date: ISODateString | null;
    recurrence_id?: UUID | null;
}

export interface UpdateTransactionRequest {
    transaction_date?: ISODateString;
    description?: string | null;
    amount?: string | number;
    category_id?: UUID;
    recurrence_type?: RecurrenceType | null;
    recurrence_end_date?: ISODateString | null;
    updateAll?: boolean;
}

/**
 * Request Types for account
 */
export interface CreateAccountRequest {
    name: string;
    background_color: string;
    text_color: string;
    is_active: boolean;
    account_order?: number;
}

export interface UpdateAccountRequest {
    name?: string;
    background_color?: string;
    text_color?: string;
    is_active?: boolean;
    account_order?: number;
}

/**
 * Request Types for year record
 */
export interface CreateYearRecordRequest {
    account_id: UUID;
    year: number;
    jan?: string;
    feb?: string;
    mar?: string;
    apr?: string;
    may?: string;
    jun?: string;
    jul?: string;
    aug?: string;
    sep?: string;
    oct?: string;
    nov?: string;
    dec?: string;
}

export interface UpdateYearRecordRequest {
    jan?: string;
    feb?: string;
    mar?: string;
    apr?: string;
    may?: string;
    jun?: string;
    jul?: string;
    aug?: string;
    sep?: string;
    oct?: string;
    nov?: string;
    dec?: string;
}

/**
 * Request Types for user preferences
 */
export interface UpdatePreferencesRequest {
    preferences: Partial<PreferenceContent>;
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