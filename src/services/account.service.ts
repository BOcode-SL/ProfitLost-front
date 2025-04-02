/**
 * Account Service Module
 * 
 * Provides functionality for managing user accounts including creating,
 * retrieving, updating, and deleting accounts.
 */

// Types
import { HttpStatusCode } from '../types/api/common';
import { CommonErrorType } from '../types/api/errors';
import type { AccountApiResponse, CreateAccountRequest, UpdateAccountRequest } from '../types/api/responses';

// Utils
import { getAuthHeaders } from '../utils/apiHeaders';

// Defining the API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL;

/**
 * Handles errors that occur during account operations
 * @param error - The error that occurred during an API request
 * @returns A standardized AccountApiResponse with error details
 */
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

/**
 * Service object providing methods for account management
 */
export const accountService = {
    /**
     * Retrieves all accounts belonging to the current user
     * @returns Promise with the account data or error response
     */
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

    /**
     * Retrieves accounts for a specific year
     * @param year - The year to filter accounts by
     * @returns Promise with the filtered account data or error response
     */
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

    /**
     * Creates a new account with the provided data
     * @param accountData - The data for the account to be created
     * @returns Promise with the created account data or error response
     */
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

    /**
     * Updates an existing account with the provided data
     * @param id - The ID of the account to be updated
     * @param updateData - The new data to update the account with
     * @returns Promise with the updated account data or error response
     */
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

    /**
     * Deletes an account with the specified ID
     * @param id - The ID of the account to be deleted
     * @returns Promise with the response data or error response
     */
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
