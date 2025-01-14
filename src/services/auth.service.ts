import { HttpStatusCode } from '../types/api/common';
import type { LoginCredentials, RegisterCredentials, AuthApiErrorResponse, AuthApiResponse } from '../types/api/responses';

const API_URL = import.meta.env.VITE_API_URL;

export const authService = {
    async register(credentials: RegisterCredentials): Promise<AuthApiResponse> {
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
                    status: response.status as HttpStatusCode
                } as AuthApiErrorResponse;
            }

            return data as AuthApiResponse;
        } catch (error) {
            if ((error as AuthApiErrorResponse).status) {
                throw error as AuthApiErrorResponse;
            }
            throw {
                success: false,
                message: 'Connection error. Please check your internet connection.',
                error: 'CONNECTION_ERROR',
                status: 0 as HttpStatusCode
            } as AuthApiErrorResponse;
        }
    },

    async login(credentials: LoginCredentials): Promise<AuthApiResponse> {
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
                } as AuthApiErrorResponse;
            }

            return data as AuthApiResponse;
        } catch (error) {
            if ((error as AuthApiErrorResponse).status) {
                throw error as AuthApiErrorResponse;
            }
            throw {
                success: false,
                message: 'Connection error. Please check your internet connection.',
                error: 'CONNECTION_ERROR',
                status: 0 as HttpStatusCode
            } as AuthApiErrorResponse;
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