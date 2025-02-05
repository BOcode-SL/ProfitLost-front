import { HttpStatusCode } from '../types/api/common';
import { CommonErrorType } from '../types/api/errors';
import type { CategoryApiResponse, CreateCategoryRequest, UpdateCategoryRequest } from '../types/api/responses';
import { getAuthHeaders } from '../utils/apiHeaders';

const API_URL = import.meta.env.VITE_API_URL;

const handleCategoryError = (error: unknown): CategoryApiResponse => {
    if ((error as CategoryApiResponse).statusCode) {
        return error as CategoryApiResponse;
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
                credentials: 'include',
                headers: getAuthHeaders()
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    ...data,
                    statusCode: response.status as HttpStatusCode
                } as CategoryApiResponse;
            }

            return data as CategoryApiResponse;
        } catch (error) {
            throw handleCategoryError(error);
        }
    },

    async createCategory(categoryData: CreateCategoryRequest): Promise<CategoryApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/categories/create`, {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify(categoryData),
                headers: getAuthHeaders()
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    ...data,
                    statusCode: response.status as HttpStatusCode
                } as CategoryApiResponse;
            }

            return data as CategoryApiResponse;
        } catch (error) {
            throw handleCategoryError(error);
        }
    },

    async updateCategory(id: string, categoryData: UpdateCategoryRequest): Promise<CategoryApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/categories/${id}`, {
                method: 'PUT',
                credentials: 'include',
                body: JSON.stringify(categoryData),
                headers: getAuthHeaders()
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    ...data,
                    statusCode: response.status as HttpStatusCode
                } as CategoryApiResponse;
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
                credentials: 'include',
                headers: getAuthHeaders()
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    ...data,
                    statusCode: response.status as HttpStatusCode
                } as CategoryApiResponse;
            }

            return data as CategoryApiResponse;
        } catch (error) {
            throw handleCategoryError(error);
        }
    }
};
