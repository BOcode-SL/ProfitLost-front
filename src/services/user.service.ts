import type { UserApiResponse, UserApiErrorResponse } from '../types/services/user.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const userService = {
    async getUserData(): Promise<UserApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/users/me`, {
                method: 'GET',
                credentials: 'include',
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    ...data,
                    status: response.status
                } as UserApiErrorResponse;
            }

            return data as UserApiResponse;
        } catch (error) {
            if ((error as UserApiErrorResponse).status) {
                throw error as UserApiErrorResponse;
            }
            throw {
                success: false,
                message: 'Connection error. Please check your internet connection.',
                error: 'CONNECTION_ERROR',
                status: 0
            } as UserApiErrorResponse;
        }
    },

    async updateProfile(formData: FormData): Promise<UserApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/users/profile`, {
                method: 'POST',
                credentials: 'include',
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    ...data,
                    status: response.status
                } as UserApiErrorResponse;
            }

            return data as UserApiResponse;
        } catch (error) {
            if ((error as UserApiErrorResponse).status) {
                throw error as UserApiErrorResponse;
            }
            throw {
                success: false,
                message: 'Connection error. Please check your internet connection.',
                error: 'CONNECTION_ERROR',
                status: 0
            } as UserApiErrorResponse;
        }
    },

    async changePassword(currentPassword: string, newPassword: string): Promise<UserApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/users/password`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ currentPassword, newPassword })
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    ...data,
                    status: response.status
                } as UserApiErrorResponse;
            }

            return data as UserApiResponse;
        } catch (error) {
            if ((error as UserApiErrorResponse).status) {
                throw error as UserApiErrorResponse;
            }
            throw {
                success: false,
                message: 'Connection error. Please check your internet connection.',
                error: 'CONNECTION_ERROR',
                status: 0
            } as UserApiErrorResponse;
        }
    },

    async deleteProfileImage(): Promise<UserApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/users/profile-image`, {
                method: 'DELETE',
                credentials: 'include',
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    ...data,
                    status: response.status
                } as UserApiErrorResponse;
            }

            return data as UserApiResponse;
        } catch (error) {
            if ((error as UserApiErrorResponse).status) {
                throw error as UserApiErrorResponse;
            }
            throw {
                success: false,
                message: 'Connection error. Please check your internet connection.',
                error: 'CONNECTION_ERROR',
                status: 0
            } as UserApiErrorResponse;
        }
    },

    async deleteAccount(): Promise<UserApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/users/account`, {
                method: 'DELETE',
                credentials: 'include',
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    ...data,
                    status: response.status
                } as UserApiErrorResponse;
            }

            return data as UserApiResponse;
        } catch (error) {
            if ((error as UserApiErrorResponse).status) {
                throw error as UserApiErrorResponse;
            }
            throw {
                success: false,
                message: 'Connection error. Please check your internet connection.',
                error: 'CONNECTION_ERROR',
                status: 0
            } as UserApiErrorResponse;
        }
    },

    async updateAccountsOrder(accountsOrder: string[]): Promise<UserApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/users/accounts-order`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ accountsOrder })
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    ...data,
                    status: response.status
                } as UserApiErrorResponse;
            }

            return data as UserApiResponse;
        } catch (error) {
            if ((error as UserApiErrorResponse).status) {
                throw error as UserApiErrorResponse;
            }
            throw {
                success: false,
                message: 'Connection error. Please check your internet connection.',
                error: 'CONNECTION_ERROR',
                status: 0
            } as UserApiErrorResponse;
        }
    }
}; 