import { HttpStatusCode } from '../types/api/common';
import { CommonErrorType } from '../types/api/errors';
import type { AuthApiResponse, LoginCredentials, RegisterCredentials } from '../types/api/responses';

const API_URL = import.meta.env.VITE_API_URL;

const handleAuthError = (error: unknown): AuthApiResponse => {
    if ((error as AuthApiResponse).statusCode) {
        return error as AuthApiResponse;
    }
    return {
        success: false,
        message: 'Connection error. Please check your internet connection.',
        error: 'CONNECTION_ERROR' as CommonErrorType,
        statusCode: 0 as HttpStatusCode
    };
};

export const authService = {
    async register(credentials: RegisterCredentials): Promise<AuthApiResponse> {
        try {
            const modifiedCredentials = {
                ...credentials,
                username: credentials.username.toLowerCase()
            };

            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(modifiedCredentials),
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    ...data,
                    statusCode: response.status as HttpStatusCode
                } as AuthApiResponse;
            }

            return data as AuthApiResponse;
        } catch (error) {
            throw handleAuthError(error);
        }
    },

    async login(credentials: LoginCredentials): Promise<AuthApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials),
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    ...data,
                    statusCode: response.status as HttpStatusCode
                } as AuthApiResponse;
            }

            return data as AuthApiResponse;
        } catch (error) {
            throw handleAuthError(error);
        }
    },

    async logout(): Promise<AuthApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/auth/logout`, {
                method: 'POST',
                credentials: 'include',
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    ...data,
                    statusCode: response.status as HttpStatusCode
                } as AuthApiResponse;
            }

            return data as AuthApiResponse;
        } catch (error) {
            throw handleAuthError(error);
        }
    },

    async forgotPassword(email: string): Promise<AuthApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    ...data,
                    statusCode: response.status as HttpStatusCode
                } as AuthApiResponse;
            }

            return data as AuthApiResponse;
        } catch (error) {
            throw handleAuthError(error);
        }
    },

    async verifyResetToken(token: string): Promise<AuthApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/auth/verify-reset-token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    ...data,
                    statusCode: response.status as HttpStatusCode
                } as AuthApiResponse;
            }

            return data as AuthApiResponse;
        } catch (error) {
            throw handleAuthError(error);
        }
    },

    async resetPassword(token: string, newPassword: string): Promise<AuthApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/auth/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, newPassword }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    ...data,
                    statusCode: response.status as HttpStatusCode
                } as AuthApiResponse;
            }

            return data as AuthApiResponse;
        } catch (error) {
            throw handleAuthError(error);
        }
    },

    async googleLogin(token: string): Promise<AuthApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/auth/google`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    ...data,
                    statusCode: response.status as HttpStatusCode
                } as AuthApiResponse;
            }

            if (data.token) {
                localStorage.setItem('auth_token', data.token);
            }

            return data as AuthApiResponse;
        } catch (error) {
            throw handleAuthError(error);
        }
    }
}; 