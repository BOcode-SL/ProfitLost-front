/**
 * Authentication Service Module
 * 
 * Provides functionality for user authentication including registration, login, logout,
 * password management, and third-party authentication via Google.
 */

// Types
import { HttpStatusCode } from '../types/api/common';
import { CommonErrorType } from '../types/api/errors';
import type { AuthApiResponse, LoginCredentials, RegisterCredentials } from '../types/api/responses';

// Utils
import { isIOS } from '../utils/deviceDetection';

// Defining the API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL;

/**
 * Handles errors that occur during authentication operations
 * @param error - The error that occurred during an API request
 * @returns A standardized AuthApiResponse with error details
 */
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

/**
 * Service object providing methods for user authentication
 */
export const authService = {
    /**
     * Registers a new user with the provided credentials
     * @param credentials - The registration information including username, email, and password
     * @returns Promise with the registration response or error
     */
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

    /**
     * Authenticates a user with the provided login credentials
     * @param credentials - The login information including username/email and password
     * @returns Promise with the login response or error
     */
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

    /**
     * Logs out the current user by clearing session data
     * @returns Promise with the logout response or error
     */
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

    /**
     * Initiates the password recovery process for a user
     * @param email - The email address of the account to recover
     * @returns Promise with the password recovery response or error
     */
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

    /**
     * Verifies the validity of a password reset token
     * @param token - The reset token to verify
     * @returns Promise with the token verification response or error
     */
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

    /**
     * Resets a user's password using a valid reset token
     * @param token - The valid reset token
     * @param newPassword - The new password to set
     * @returns Promise with the password reset response or error
     */
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

    /**
     * Authenticates a user using a Google OAuth token
     * @param token - The Google authentication token
     * @returns Promise with the login response or error, including isNewUser flag
     */
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

            return {
                ...data,
                isNewUser: data.isNewUser || false
            } as AuthApiResponse;
        } catch (error) {
            throw handleAuthError(error);
        }
    }
}; 