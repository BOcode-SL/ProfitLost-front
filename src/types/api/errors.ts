/**
 * API Error Types Module
 * 
 * Contains type definitions for all error types returned by the API.
 * Organized by domain/entity for better error handling in the client.
 */

/**
 * Common error types shared across all entities
 * Used for general error handling throughout the application
 */
export type CommonErrorType =
    | 'SERVER_ERROR'
    | 'DATABASE_ERROR'
    | 'NETWORK_ERROR'
    | 'FETCH_ERROR'
    | 'CONNECTION_ERROR'
    | 'UNAUTHORIZED'
    | 'MISSING_FIELDS'
    | 'INVALID_FORMAT'
    | 'INVALID_ID_FORMAT';

/**
 * Types for authentication errors
 * Used for login, registration, and password management
 */
export type AuthErrorType =
    | CommonErrorType
    | 'EMAIL_EXISTS'
    | 'USERNAME_EXISTS'
    | 'PASSWORD_TOO_WEAK'
    | 'INVALID_CREDENTIALS'
    | 'ACCOUNT_INACTIVE'
    | 'ACCOUNT_LOCKED'
    | 'LOGOUT_ERROR'
    | 'EMAIL_NOT_FOUND'
    | 'INVALID_RESET_TOKEN'
    | 'EXPIRED_RESET_TOKEN'
    | 'GOOGLE_AUTH_ERROR';

/**
 * Subset of authentication errors specific to registration
 */
export type RegisterErrorType = Extract<
    AuthErrorType,
    CommonErrorType | 'EMAIL_EXISTS' | 'USERNAME_EXISTS' | 'PASSWORD_TOO_WEAK'
>;

/**
 * Subset of authentication errors specific to login
 */
export type LoginErrorType = Extract<
    AuthErrorType,
    CommonErrorType | 'INVALID_CREDENTIALS' | 'ACCOUNT_INACTIVE' | 'ACCOUNT_LOCKED'
>;

/**
 * Types for user errors
 * Used for user profile management and preferences
 */
export type UserErrorType =
    | CommonErrorType
    | 'USER_NOT_FOUND'
    | 'INVALID_DATE_FORMAT'
    | 'INVALID_TIME_FORMAT'
    | 'IMAGE_UPLOAD_ERROR'
    | 'NO_CHANGES'
    | 'PASSWORD_TOO_WEAK'
    | 'INVALID_PASSWORD';

/**
 * Types for account errors
 * Used for financial account management
 */
export type AccountErrorType =
    | CommonErrorType
    | 'ACCOUNT_NOT_FOUND'
    | 'DUPLICATE_ACCOUNT'
    | 'INVALID_ACCOUNT_DATA'
    | 'INVALID_CONFIGURATION'
    | 'INVALID_RECORDS';

/**
 * Types for transaction errors
 * Used for financial transaction management
 */
export type TransactionErrorType =
    | CommonErrorType
    | 'INVALID_DATA'
    | 'INVALID_DATE_FORMAT'
    | 'INVALID_AMOUNT'
    | 'INVALID_DESCRIPTION'
    | 'TRANSACTION_NOT_FOUND';

/**
 * Types for category errors
 * Used for transaction category management
 */
export type CategoryErrorType =
    | CommonErrorType
    | 'DUPLICATE_CATEGORY'
    | 'CATEGORY_IN_USE'
    | 'CATEGORY_NOT_FOUND';

/**
 * Types for note errors
 * Used for user notes management
 */
export type NoteErrorType =
    | CommonErrorType
    | 'NOTE_NOT_FOUND';