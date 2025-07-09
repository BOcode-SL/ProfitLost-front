/**
 * API Response Types Module
 * 
 * Contains type definitions for all API response structures.
 * Includes both request and response types for each entity.
 * 
 * @module ApiResponses
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
import type { RecurrenceType, Transaction } from '../supabase/transactions';
import type { Category } from '../supabase/categories';
import type { Note } from '../supabase/notes';
import type { Account } from '../supabase/accounts';
import type { PreferenceContent } from '../supabase/preferences';
import type { Subscription } from '../supabase/subscriptions';

/**
 * Types for authentication API responses
 * Includes extended error information for auth-specific scenarios
 * 
 * @interface AuthApiErrorResponse
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
 * 
 * @interface AuthApiSuccessResponse
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
 * 
 * @interface AuthApiResponse
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
 * 
 * @typedef UserApiErrorResponse
 * @typedef UserApiSuccessResponse
 * @typedef UserApiResponse
 */
export type UserApiErrorResponse = ApiErrorResponse<UserErrorType>;
export interface UserApiSuccessResponse extends ApiSuccessResponse {
    data?: {
        id: UUID;
        username: string;
        email: string;
        name: string;
        surname: string;
        preferences: PreferenceContent;
        role: string;
        subscription: Subscription | null;
    };
}
export type UserApiResponse = UserApiSuccessResponse | UserApiErrorResponse;

/**
 * Types for transaction API responses
 * 
 * @typedef TransactionApiErrorResponse
 * @typedef TransactionApiSuccessResponse
 * @typedef TransactionApiResponse
 */
export type TransactionApiErrorResponse = ApiErrorResponse<TransactionErrorType>;
export type TransactionApiSuccessResponse = ApiSuccessResponse<Transaction | Transaction[]>;
export type TransactionApiResponse = TransactionApiSuccessResponse | TransactionApiErrorResponse;

/**
 * Specialized type for transaction years response
 * Used specifically for the getTransactionYears endpoint which returns an array of year strings
 * 
 * @interface TransactionYearsApiResponse
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
 * 
 * @typedef CategoryApiErrorResponse
 * @typedef CategoryApiSuccessResponse
 * @typedef CategoryApiResponse
 */
export type CategoryApiErrorResponse = ApiErrorResponse<CategoryErrorType>;
export type CategoryApiSuccessResponse = ApiSuccessResponse<Category | Category[]>;
export type CategoryApiResponse = CategoryApiSuccessResponse | CategoryApiErrorResponse;

/**
 * Types for account API responses
 * Includes extended error details and metadata for account information
 * 
 * @interface AccountApiErrorResponse
 */
export interface AccountApiErrorResponse extends ApiErrorResponse<AccountErrorType> {
    details?: {
        field?: string;          // Which field has the error
        message?: string;        // Detailed message about the specific error
    };
}

/**
 * Successful account response with optional metadata about the account collection
 * 
 * @interface AccountApiSuccessResponse
 */
export interface AccountApiSuccessResponse extends ApiSuccessResponse<Account | Account[]> {
    metadata?: {
        total?: number;          // Total number of accounts
        active?: number;         // Number of active accounts
    };
}

/**
 * Combined type for account API responses
 * 
 * @typedef AccountApiResponse
 */
export type AccountApiResponse = AccountApiSuccessResponse | AccountApiErrorResponse;

/**
 * Types for note API responses
 * Includes extended error details
 * 
 * @interface NoteApiErrorResponse
 */
export interface NoteApiErrorResponse extends ApiErrorResponse<NoteErrorType> {
    details?: {
        field?: string;          // Which field has the error
        message?: string;        // Detailed message about the specific error
    };
}

/**
 * Successful note response with optional metadata
 * 
 * @interface NoteApiSuccessResponse
 */
export interface NoteApiSuccessResponse extends ApiSuccessResponse<Note | Note[]> {
    metadata?: {
        total?: number;          // Total number of notes
    };
}

/**
 * Combined type for note API responses
 * 
 * @typedef NoteApiResponse
 */
export type NoteApiResponse = NoteApiSuccessResponse | NoteApiErrorResponse;

/**
 * Request Types for authentication
 * 
 * @interface LoginCredentials
 */
export interface LoginCredentials {
    identifier: string;
    password: string;
}

/**
 * Registration credentials request object
 * 
 * @interface RegisterCredentials
 */
export interface RegisterCredentials {
    username: string;
    email: string;
    password: string;
    name: string;
    surname: string;
}

/**
 * Request Types for category
 * 
 * @interface CreateCategoryRequest
 */
export interface CreateCategoryRequest {
    name: string;
    color: string;
}

/**
 * Request to update an existing category
 * 
 * @interface UpdateCategoryRequest
 */
export interface UpdateCategoryRequest {
    name?: string;
    color?: string;
}

/**
 * Request Types for transaction
 * 
 * @interface CreateTransactionRequest
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

/**
 * Request to update an existing transaction
 * 
 * @interface UpdateTransactionRequest
 */
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
 * 
 * @interface CreateAccountRequest
 */
export interface CreateAccountRequest {
    name: string;
    background_color: string;
    text_color: string;
    is_active: boolean;
    account_order?: number;
}

/**
 * Request to update an existing account
 * 
 * @interface UpdateAccountRequest
 */
export interface UpdateAccountRequest {
    name?: string;
    background_color?: string;
    text_color?: string;
    is_active?: boolean;
    account_order?: number;
}

/**
 * Request Types for year record
 * 
 * @interface CreateYearRecordRequest
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

/**
 * Request to update an existing year record
 * 
 * @interface UpdateYearRecordRequest
 */
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
 * 
 * @interface UpdatePreferencesRequest
 */
export interface UpdatePreferencesRequest {
    preferences: Partial<PreferenceContent>;
}

/**
 * Request Types for note
 * 
 * @interface CreateNoteRequest
 */
export interface CreateNoteRequest {
    title: string;
    content: string;
}

/**
 * Request to update an existing note
 * 
 * @interface UpdateNoteRequest
 */
export interface UpdateNoteRequest {
    title?: string;
    content?: string;
}

/**
 * Request to reset a user's password
 * 
 * @interface ResetPasswordRequest
 */
export interface ResetPasswordRequest {
    email: string;
}

/**
 * Request to verify a password reset token
 * 
 * @interface VerifyResetTokenRequest
 */
export interface VerifyResetTokenRequest {
    token: string;
}

/**
 * Request to update a forgotten password with a valid token
 * 
 * @interface UpdateForgottenPasswordRequest
 */
export interface UpdateForgottenPasswordRequest {
    token: string;
    newPassword: string;
}