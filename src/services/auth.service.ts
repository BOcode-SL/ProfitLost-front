import { HttpStatusCode } from '../types/api/common';
import { CommonErrorType } from '../types/api/errors';
import type { AuthApiResponse, LoginCredentials, RegisterCredentials } from '../types/api/responses';
import { isIOS } from '../utils/deviceDetection';

// Defining the API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL;

// Function to handle authentication errors
const handleAuthError = (error: unknown): AuthApiResponse => {
    // Check if the error has a statusCode
    if ((error as AuthApiResponse).statusCode) {
        return error as AuthApiResponse;
    }
    // Handle network errors
    if (error instanceof TypeError) {
        return {
            success: false,
            message: 'Network error. Please check your connection.',
            error: 'NETWORK_ERROR' as CommonErrorType,
            statusCode: 0 as HttpStatusCode
        };
    }
    // Return a default error response
    return {
        success: false,
        message: 'An unexpected error occurred. Please try again.',
        error: 'SERVER_ERROR' as CommonErrorType,
        statusCode: 500 as HttpStatusCode
    };
};

export const authService = {
    // Method to register a new user
    async register(credentials: RegisterCredentials): Promise<AuthApiResponse> {
        try {
            // Modifying credentials to ensure username is lowercase
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

    // Method to log in a user
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

            // Store the token in local storage if on iOS
            if (isIOS() && data.token) {
                localStorage.setItem('auth_token', data.token);
            }

            return data as AuthApiResponse;
        } catch (error) {
            throw handleAuthError(error);
        }
    },

    // Method to log out a user
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

            // Remove the token from local storage if on iOS
            if (isIOS()) {
                localStorage.removeItem('auth_token');
            }

            return data as AuthApiResponse;
        } catch (error) {
            throw handleAuthError(error);
        }
    },

    // Method to initiate password recovery
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

    // Method to verify the reset token
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

    // Method to reset the password
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

    // Method to log in using Google
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

            // Store the token in local storage if on iOS
            if (isIOS() && data.token) {
                localStorage.setItem('auth_token', data.token);
            }

            return data as AuthApiResponse;
        } catch (error) {
            throw handleAuthError(error);
        }
    }
}; 