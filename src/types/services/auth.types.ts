// Tipo base común para errores de autenticación
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

// Tipos específicos que extienden del tipo base
export type RegisterErrorType = Extract<
    AuthErrorType,
    'MISSING_FIELDS' | 'INVALID_FORMAT' | 'EMAIL_EXISTS' | 'USERNAME_EXISTS' | 'PASSWORD_TOO_WEAK' | 'SERVER_ERROR' | 'CONNECTION_ERROR'
>;

export type LoginErrorType = Extract<
    AuthErrorType,
    'MISSING_FIELDS' | 'INVALID_FORMAT' | 'INVALID_CREDENTIALS' | 'ACCOUNT_INACTIVE' | 'ACCOUNT_LOCKED' | 'SERVER_ERROR' | 'CONNECTION_ERROR'
>;

export interface ApiErrorResponse {
    success: false;
    message: string;
    error: AuthErrorType;
    remainingTime?: number;
}

export interface ApiSuccessResponse {
    success: true;
    message: string;
    token: string;
    data?: {
        _id: string;
        username: string;
        email: string;
    };
}

export type ApiResponse = ApiSuccessResponse | ApiErrorResponse;

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