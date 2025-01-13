import { HttpStatusCode } from '../common.types';
import type { User } from '../models/user.modelTypes';

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
    status: HttpStatusCode;
}

export interface UserApiSuccessResponse {
    success: true;
    message: string;
    data?: User | User[];
}

export type UserApiResponse = UserApiSuccessResponse | UserApiErrorResponse; 