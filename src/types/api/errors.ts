/**
 * Types for authentication errors.
 */
export type AuthErrorType =
    | 'MISSING_FIELDS'
    | 'INVALID_FORMAT'
    | 'EMAIL_EXISTS'
    | 'USERNAME_EXISTS'
    | 'PASSWORD_TOO_WEAK'
    | 'INVALID_CREDENTIALS'
    | 'ACCOUNT_INACTIVE'
    | 'ACCOUNT_LOCKED'
    | 'SERVER_ERROR'
    | 'CONNECTION_ERROR';

export type RegisterErrorType = Extract<
    AuthErrorType,
    'MISSING_FIELDS' | 'INVALID_FORMAT' | 'EMAIL_EXISTS' | 'USERNAME_EXISTS' | 'PASSWORD_TOO_WEAK' | 'SERVER_ERROR' | 'CONNECTION_ERROR'
>;

export type LoginErrorType = Extract<
    AuthErrorType,
    'MISSING_FIELDS' | 'INVALID_FORMAT' | 'INVALID_CREDENTIALS' | 'ACCOUNT_INACTIVE' | 'ACCOUNT_LOCKED' | 'SERVER_ERROR' | 'CONNECTION_ERROR'
>;

/**
 * Types for user errors.
 */
export type UserErrorType =
    | 'INVALID_ID_FORMAT'
    | 'USER_NOT_FOUND'
    | 'DATABASE_ERROR'
    | 'MISSING_FIELDS'
    | 'INVALID_DATE_FORMAT'
    | 'INVALID_TIME_FORMAT'
    | 'IMAGE_UPLOAD_ERROR'
    | 'NO_CHANGES'
    | 'INVALID_PASSWORD'
    | 'INVALID_FORMAT'
    | 'SERVER_ERROR'
    | 'CONNECTION_ERROR'
    | 'UNAUTHORIZED';

/**
 * Types for transaction errors.
 */
export type TransactionErrorType =
    | 'INVALID_ID_FORMAT'
    | 'INVALID_DATA'
    | 'INVALID_DATE_FORMAT'
    | 'INVALID_AMOUNT'
    | 'INVALID_DESCRIPTION'
    | 'NOT_FOUND'
    | 'DATABASE_ERROR'
    | 'SERVER_ERROR'
    | 'CONNECTION_ERROR'
    | 'UNAUTHORIZED';

/**
 * Types for category errors.
 */
export type CategoryErrorType =
    | 'INVALID_ID_FORMAT'
    | 'MISSING_FIELDS'
    | 'DUPLICATE_CATEGORY'
    | 'CATEGORY_IN_USE'
    | 'NOT_FOUND'
    | 'DATABASE_ERROR'
    | 'SERVER_ERROR'
    | 'CONNECTION_ERROR'
    | 'UNAUTHORIZED';

