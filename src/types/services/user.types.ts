export type UserErrorType =
    | 'UNAUTHORIZED'
    | 'NOT_FOUND'
    | 'SERVER_ERROR'
    | 'CONNECTION_ERROR'
    | 'INVALID_TOKEN'
    | 'TOKEN_EXPIRED';

export interface UserApiErrorResponse {
    success: false;
    message: string;
    error: UserErrorType;
    status: number;
}

export interface UserApiSuccessResponse {
    success: true;
    message: string;
    user: {
        _id: string;
        username: string;
        email: string;
        name: string;
        surname: string;
        profileImage?: string;
        profileImagePublicId?: string;
        accountsOrder?: string[];
        language: string;
        currency: string;
        dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY';
        timeFormat: '12h' | '24h';
    };
}

export type UserApiResponse = UserApiSuccessResponse | UserApiErrorResponse; 