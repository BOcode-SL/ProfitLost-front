// Types
import { HttpStatusCode } from '../types/api/common';
import { CommonErrorType } from '../types/api/errors';
import type { CategoryApiResponse, CreateCategoryRequest, UpdateCategoryRequest } from '../types/api/responses';

// Utils
import { getAuthHeaders } from '../utils/apiHeaders';

// Defining the API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL;

// Function to handle category errors
const handleCategoryError = (error: unknown): CategoryApiResponse => {
    // Check if the error has a statusCode
    if ((error as CategoryApiResponse).statusCode) {
        return error as CategoryApiResponse;
    }
    // Handle network errors
    return {
        success: false,
        message: 'Connection error. Please check your internet connection.',
        error: 'CONNECTION_ERROR' as CommonErrorType,
        statusCode: 0 as HttpStatusCode
    };
};

export const categoryService = {
    // Method to get all categories
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

    // Method to create a new category
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

    // Method to update an existing category
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

    // Method to delete a category
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
