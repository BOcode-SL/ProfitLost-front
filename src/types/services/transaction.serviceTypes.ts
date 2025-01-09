import type { Transaction } from '../models/transaction.modelTypes';
import { HttpStatusCode } from '../common.types';

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

export interface TransactionApiErrorResponse {
    success: false;
    message: string;
    error: TransactionErrorType;
    status: HttpStatusCode;
}

export interface TransactionApiSuccessResponse {
    success: true;
    message: string;
    data?: Transaction | Transaction[];
}

export type TransactionApiResponse = TransactionApiSuccessResponse | TransactionApiErrorResponse; 