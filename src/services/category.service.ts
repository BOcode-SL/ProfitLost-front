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
        return error as CategoryApiResponse; // Return the error if it has a statusCode
    }
    // Handle network errors
    return {
        success: false,
        message: 'Connection error. Please check your internet connection.', // Message for connection errors
        error: 'CONNECTION_ERROR' as CommonErrorType, // Error type for connection issues
        statusCode: 0 as HttpStatusCode // Default status code for network errors
    };
};

export const categoryService = {
    // Method to get all categories
    async getAllCategories(): Promise<CategoryApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/categories/all`, {
                method: 'GET', // HTTP method for fetching categories
                credentials: 'include', // Include credentials for the request
                headers: getAuthHeaders() // Set authentication headers
            });

            const data = await response.json(); // Parse the JSON response

            if (!response.ok) {
                throw {
                    ...data,
                    statusCode: response.status as HttpStatusCode // Throw an error if the response is not OK
                } as CategoryApiResponse;
            }

            return data as CategoryApiResponse; // Return the category data
        } catch (error) {
            throw handleCategoryError(error); // Handle any errors that occur
        }
    },

    // Method to create a new category
    async createCategory(categoryData: CreateCategoryRequest): Promise<CategoryApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/categories/create`, {
                method: 'POST', // HTTP method for creating a new category
                credentials: 'include', // Include credentials for the request
                body: JSON.stringify(categoryData), // Convert category data to JSON
                headers: getAuthHeaders() // Set authentication headers
            });

            const data = await response.json(); // Parse the JSON response

            if (!response.ok) {
                throw {
                    ...data,
                    statusCode: response.status as HttpStatusCode // Throw an error if the response is not OK
                } as CategoryApiResponse;
            }

            return data as CategoryApiResponse; // Return the created category data
        } catch (error) {
            throw handleCategoryError(error); // Handle any errors that occur
        }
    },

    // Method to update an existing category
    async updateCategory(id: string, categoryData: UpdateCategoryRequest): Promise<CategoryApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/categories/${id}`, {
                method: 'PUT', // HTTP method for updating a category
                credentials: 'include', // Include credentials for the request
                body: JSON.stringify(categoryData), // Convert updated category data to JSON
                headers: getAuthHeaders() // Set authentication headers
            });

            const data = await response.json(); // Parse the JSON response

            if (!response.ok) {
                throw {
                    ...data,
                    statusCode: response.status as HttpStatusCode // Throw an error if the response is not OK
                } as CategoryApiResponse;
            }

            return data as CategoryApiResponse; // Return the updated category data
        } catch (error) {
            throw handleCategoryError(error); // Handle any errors that occur
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
    },
    // Method to create default categories
    async createDefaultCategories(categories: { name: string, color: string }[]): Promise<CategoryApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/categories/default`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ categories })
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
