import type { HttpStatusCode } from '../types/common.types';
import type { CategoryApiResponse, CategoryApiErrorResponse } from '../types/services/category.serviceTypes';
import type { Category } from '../types/models/category.modelTypes';

const API_URL = import.meta.env.VITE_API_URL;

export const categoryService = {
    async getAllCategories(): Promise<CategoryApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/categories/all`, {
                method: 'GET',
                credentials: 'include',
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    ...data,
                    status: response.status
                } as CategoryApiErrorResponse;
            }

            return data as CategoryApiResponse;
        } catch (error) {
            if ((error as CategoryApiErrorResponse).status) {
                throw error as CategoryApiErrorResponse;
            }
            throw {
                success: false,
                message: 'Connection error. Please check your internet connection.',
                error: 'CONNECTION_ERROR',
                status: 0 as HttpStatusCode
            } as CategoryApiErrorResponse;
        }
    },

    async createCategory(categoryData: Partial<Category>): Promise<CategoryApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/categories/create`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(categoryData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    ...data,
                    status: response.status
                } as CategoryApiErrorResponse;
            }

            return data as CategoryApiResponse;
        } catch (error) {
            if ((error as CategoryApiErrorResponse).status) {
                throw error as CategoryApiErrorResponse;
            }
            throw {
                success: false,
                message: 'Connection error. Please check your internet connection.',
                error: 'CONNECTION_ERROR',
                status: 0 as HttpStatusCode
            } as CategoryApiErrorResponse;
        }
    },

    async updateCategory(id: string, categoryData: Partial<Category>): Promise<CategoryApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/categories/${id}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(categoryData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    ...data,
                    status: response.status
                } as CategoryApiErrorResponse;
            }

            return data as CategoryApiResponse;
        } catch (error) {
            if ((error as CategoryApiErrorResponse).status) {
                throw error as CategoryApiErrorResponse;
            }
            throw {
                success: false,
                message: 'Connection error. Please check your internet connection.',
                error: 'CONNECTION_ERROR',
                status: 0 as HttpStatusCode
            } as CategoryApiErrorResponse;
        }
    },

    async deleteCategory(id: string): Promise<CategoryApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/categories/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    ...data,
                    status: response.status
                } as CategoryApiErrorResponse;
            }

            return data as CategoryApiResponse;
        } catch (error) {
            if ((error as CategoryApiErrorResponse).status) {
                throw error as CategoryApiErrorResponse;
            }
            throw {
                success: false,
                message: 'Connection error. Please check your internet connection.',
                error: 'CONNECTION_ERROR',
                status: 0 as HttpStatusCode
            } as CategoryApiErrorResponse;
        }
    }
};
