import { HttpStatusCode } from '../types/api/common';
import { CommonErrorType } from '../types/api/errors';
import type { CategoryApiResponse, CategoryApiErrorResponse } from '../types/api/responses';
import type { Category } from '../types/models/category';

const API_URL = import.meta.env.VITE_API_URL;

const handleCategoryError = (error: unknown): CategoryApiErrorResponse => {
    if ((error as CategoryApiErrorResponse).statusCode) {
        return error as CategoryApiErrorResponse;
    }
    return {
        success: false,
        message: 'Connection error. Please check your internet connection.',
        error: 'CONNECTION_ERROR' as CommonErrorType,
        statusCode: 0 as HttpStatusCode
    };
};

export const categoryService = {
    async getAllCategories(): Promise<CategoryApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/categories/all`, {
                method: 'GET',
                credentials: 'include'
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    ...data,
                    statusCode: response.status as HttpStatusCode
                } as CategoryApiErrorResponse;
            }

            return data as CategoryApiResponse;
        } catch (error) {
            throw handleCategoryError(error);
        }
    },

    async createCategory(categoryData: Partial<Category>): Promise<CategoryApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/categories/create`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(categoryData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    ...data,
                    statusCode: response.status as HttpStatusCode
                } as CategoryApiErrorResponse;
            }

            return data as CategoryApiResponse;
        } catch (error) {
            throw handleCategoryError(error);
        }
    },

    async updateCategory(id: string, categoryData: Partial<Category>): Promise<CategoryApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/categories/${id}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(categoryData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    ...data,
                    statusCode: response.status as HttpStatusCode
                } as CategoryApiErrorResponse;
            }

            return data as CategoryApiResponse;
        } catch (error) {
            throw handleCategoryError(error);
        }
    },

    async deleteCategory(id: string): Promise<CategoryApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/categories/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    ...data,
                    statusCode: response.status as HttpStatusCode
                } as CategoryApiErrorResponse;
            }

            return data as CategoryApiResponse;
        } catch (error) {
            throw handleCategoryError(error);
        }
    }
};
