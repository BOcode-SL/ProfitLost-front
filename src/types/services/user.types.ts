import type { Currency, DateFormat, TimeFormat } from '../models/user.types';

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

export interface UserApiErrorResponse {
    success: false;
    message: string;
    error: UserErrorType;
    status: number;
}

export interface UserApiSuccessResponse {
    success: true;
    message: string;
    data?: {
        _id: string;
        username: string;
        email: string;
        name: string;
        surname: string;
        profileImage?: string;
        accountsOrder: string[];
        language: string;
        currency: Currency;
        dateFormat: DateFormat;
        timeFormat: TimeFormat;
    };
}

export type UserApiResponse = UserApiSuccessResponse | UserApiErrorResponse; 