import { HttpStatusCode } from '../types/api/common';
import { CommonErrorType } from '../types/api/errors';
import type { UserApiResponse } from '../types/api/responses';
import { getAuthHeaders } from '../utils/apiHeaders';

const API_URL = import.meta.env.VITE_API_URL;

const handleUserError = (error: unknown): UserApiResponse => {
    if ((error as UserApiResponse).statusCode) {
        return error as UserApiResponse;
    }
    return {
        success: false,
        message: 'Connection error. Please check your internet connection.',
        error: 'CONNECTION_ERROR' as CommonErrorType,
        statusCode: 0 as HttpStatusCode
    };
};

export const userService = {
    async getUserData(): Promise<UserApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/users/me`, {
                method: 'GET',
                credentials: 'include',
                headers: getAuthHeaders()
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    ...data,
                    statusCode: response.status as HttpStatusCode
                } as UserApiResponse;
            }

            return data as UserApiResponse;
        } catch (error) {
            throw handleUserError(error);
        }
    },

    async updateProfile(formData: FormData): Promise<UserApiResponse> {
        try {
            const token = localStorage.getItem('auth_token');
            const headers: HeadersInit = {};
            
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${API_URL}/api/users/profile`, {
                method: 'POST',
                credentials: 'include',
                body: formData,
                headers
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    ...data,
                    statusCode: response.status as HttpStatusCode
                } as UserApiResponse;
            }

            return data as UserApiResponse;
        } catch (error) {
            throw handleUserError(error);
        }
    },

    async updateTheme(theme: 'light' | 'dark'): Promise<UserApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/users/theme`, {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify({ theme }),
                headers: getAuthHeaders()
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    ...data,
                    statusCode: response.status as HttpStatusCode
                } as UserApiResponse;
            }

            return data as UserApiResponse;
        } catch (error) {
            throw handleUserError(error);
        }
    },

    async changePassword(currentPassword: string, newPassword: string): Promise<UserApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/users/password`, {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify({ currentPassword, newPassword }),
                headers: getAuthHeaders()
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    ...data,
                    statusCode: response.status as HttpStatusCode
                } as UserApiResponse;
            }

            return data as UserApiResponse;
        } catch (error) {
            throw handleUserError(error);
        }
    },

    async deleteProfileImage(): Promise<UserApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/users/profile-image`, {
                method: 'DELETE',
                credentials: 'include',
                headers: getAuthHeaders()
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    ...data,
                    statusCode: response.status as HttpStatusCode
                } as UserApiResponse;
            }

            return data as UserApiResponse;
        } catch (error) {
            throw handleUserError(error);
        }
    },

    async deleteAccount(): Promise<UserApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/users/account`, {
                method: 'DELETE',
                credentials: 'include',
                headers: getAuthHeaders()
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    ...data,
                    statusCode: response.status as HttpStatusCode
                } as UserApiResponse;
            }

            return data as UserApiResponse;
        } catch (error) {
            throw handleUserError(error);
        }
    },

    async updateAccountsOrder(accountsOrder: string[]): Promise<UserApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/users/accounts-order`, {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify({ accountsOrder }),
                headers: getAuthHeaders()
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    ...data,
                    statusCode: response.status as HttpStatusCode
                } as UserApiResponse;
            }

            return data as UserApiResponse;
        } catch (error) {
            throw handleUserError(error);
        }
    }
}; 