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
    }
}; 