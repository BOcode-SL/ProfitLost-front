import { LoginCredentials, RegisterCredentials, ApiResponse, ApiErrorResponse } from '../types/services/auth.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const authService = {
    async register(credentials: RegisterCredentials): Promise<ApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
                credentials: 'include',
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    ...data,
                    status: response.status
                } as ApiErrorResponse;
            }

            return data as ApiResponse;
        } catch (error) {
            if ((error as ApiErrorResponse).status) {
                throw error as ApiErrorResponse;
            }
            throw {
                success: false,
                message: 'Connection error. Please check your internet connection.',
                error: 'CONNECTION_ERROR',
                status: 0
            } as ApiErrorResponse;
        }
    },

    async login(credentials: LoginCredentials): Promise<ApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
                credentials: 'include',
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    ...data,
                    status: response.status
                } as ApiErrorResponse;
            }

            return data as ApiResponse;
        } catch (error) {
            if ((error as ApiErrorResponse).status) {
                throw error as ApiErrorResponse;
            }
            throw {
                success: false,
                message: 'Connection error. Please check your internet connection.',
                error: 'CONNECTION_ERROR',
                status: 0
            } as ApiErrorResponse;
        }
    },

    async logout(): Promise<void> {
        try {
            const response = await fetch(`${API_URL}/api/auth/logout`, {
                method: 'POST',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Logout error');
            }
        } catch (error) {
            console.error('logout Error :', error);
            throw new Error('Logout error');
        }
    },
}; 