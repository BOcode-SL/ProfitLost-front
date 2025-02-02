/**
 * Common error types shared across all entities
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
 */
export type AuthErrorType =
    | CommonErrorType
    | 'EMAIL_EXISTS'
    | 'USERNAME_EXISTS'
    | 'PASSWORD_TOO_WEAK'
    | 'INVALID_CREDENTIALS'
    | 'ACCOUNT_INACTIVE'
    | 'ACCOUNT_LOCKED'
    | 'LOGOUT_ERROR';

export type RegisterErrorType = Extract<
    AuthErrorType,
    CommonErrorType | 'EMAIL_EXISTS' | 'USERNAME_EXISTS' | 'PASSWORD_TOO_WEAK'
>;

export type LoginErrorType = Extract<
    AuthErrorType,
    CommonErrorType | 'INVALID_CREDENTIALS' | 'ACCOUNT_INACTIVE' | 'ACCOUNT_LOCKED'
>;

/**
 * Types for user errors
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
 */
export type CategoryErrorType =
    | CommonErrorType
    | 'DUPLICATE_CATEGORY'
    | 'CATEGORY_IN_USE'
    | 'CATEGORY_NOT_FOUND';

/**
 * Types for note errors
 */
export type NoteErrorType =
    | CommonErrorType
    | 'NOTE_NOT_FOUND';