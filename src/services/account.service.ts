// Types
import { HttpStatusCode } from '../types/api/common';
import { CommonErrorType } from '../types/api/errors';
import type { AccountApiResponse, CreateAccountRequest, UpdateAccountRequest } from '../types/api/responses';

// Utils
import { getAuthHeaders } from '../utils/apiHeaders';

// Defining the API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL;

// Function to handle account errors
const handleAccountError = (error: unknown): AccountApiResponse => {
    // Check if the error has a statusCode
    if ((error as AccountApiResponse).statusCode) {
        return error as AccountApiResponse;
    }
    // Return a default error response
    return {
        success: false,
        message: 'Connection error. Please check your internet connection.',
        error: 'CONNECTION_ERROR' as CommonErrorType,
        statusCode: 0 as HttpStatusCode
    };
};

export const accountService = {
    // Fetch all accounts
    async getAllAccounts(): Promise<AccountApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/accounts/all`, {
                method: 'GET',
                credentials: 'include',
                headers: getAuthHeaders()
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    ...data,
                    statusCode: response.status as HttpStatusCode
                } as AccountApiResponse;
            }

            return data as AccountApiResponse;
        } catch (error) {
            throw handleAccountError(error);
        }
    },

    // Fetch accounts by year
    async getAccountsByYear(year: number): Promise<AccountApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/accounts/${year}`, {
                method: 'GET',
                credentials: 'include',
                headers: getAuthHeaders()
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    ...data,
                    statusCode: response.status as HttpStatusCode
                } as AccountApiResponse;
            }

            return data as AccountApiResponse;
        } catch (error) {
            throw handleAccountError(error);
        }
    },

    // Create a new account
    async createAccount(accountData: CreateAccountRequest): Promise<AccountApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/accounts/create`, {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify(accountData),
                headers: getAuthHeaders()
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    ...data,
                    statusCode: response.status as HttpStatusCode
                } as AccountApiResponse;
            }

            return data as AccountApiResponse;
        } catch (error) {
            throw handleAccountError(error);
        }
    },

    // Update an existing account
    async updateAccount(id: string, updateData: UpdateAccountRequest): Promise<AccountApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/accounts/${id}`, {
                method: 'PUT',
                credentials: 'include',
                body: JSON.stringify(updateData),
                headers: getAuthHeaders()
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    ...data,
                    statusCode: response.status as HttpStatusCode
                } as AccountApiResponse;
            }

            return data as AccountApiResponse;
        } catch (error) {
            throw handleAccountError(error);
        }
    },

    // Delete an account
    async deleteAccount(id: string): Promise<AccountApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/accounts/${id}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: getAuthHeaders()
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    ...data,
                    statusCode: response.status as HttpStatusCode
                } as AccountApiResponse;
            }

            return data as AccountApiResponse;
        } catch (error) {
            throw handleAccountError(error);
        }
    }
};
