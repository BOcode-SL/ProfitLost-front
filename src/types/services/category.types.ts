import { HttpStatusCode } from '../common.types';
import type { Category } from '../models/category.types';

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

export interface CategoryApiErrorResponse {
    success: false;
    message: string;
    error: CategoryErrorType;
    status: HttpStatusCode;
}

export interface CategoryApiSuccessResponse {
    success: true;
    message: string;
    data?: Category | Category[];
}

export type CategoryApiResponse = CategoryApiSuccessResponse | CategoryApiErrorResponse; 