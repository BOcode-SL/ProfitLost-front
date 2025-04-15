/**
 * Account Service Module
 * 
 * Provides functionality for managing user accounts including creating,
 * retrieving, updating, and deleting accounts.
 * 
 * @module AccountService
 */

// Types
import { HttpStatusCode } from '../types/api/common';
import { CommonErrorType } from '../types/api/errors';
import type { AccountApiResponse, CreateAccountRequest, UpdateAccountRequest } from '../types/api/responses';
import type { UUID } from '../types/supabase/common';

// Utils
import { getAuthHeaders } from '../utils/apiHeaders';

// Defining the API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL;

/**
 * Handles errors that occur during account operations
 * 
 * @param {unknown} error - The error that occurred during an API request
 * @returns {AccountApiResponse} A standardized AccountApiResponse with error details
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
     * 
     * @returns {Promise<AccountApiResponse>} Promise with the account data or error response
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
     * Retrieves all available years for the user's accounts
     * 
     * @returns {Promise<AccountApiResponse>} Promise with the years data or error response
     */
    async getAvailableYears(): Promise<AccountApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/accounts/years`, {
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
     * Retrieves detailed information for a specific account
     * 
     * @param {UUID} id - The ID of the account to retrieve
     * @param {number} [year] - Optional year to retrieve data for (defaults to current year)
     * @returns {Promise<AccountApiResponse>} Promise with the account detail data or error response
     */
    async getAccountDetailById(id: UUID, year?: number): Promise<AccountApiResponse> {
        try {
            const url = year 
                ? `${API_URL}/api/accounts/${id}/detail/${year}`
                : `${API_URL}/api/accounts/${id}/detail`;
                
            const response = await fetch(url, {
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
     * 
     * @param {number} year - The year to filter accounts by
     * @returns {Promise<AccountApiResponse>} Promise with the filtered account data or error response
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
     * 
     * @param {CreateAccountRequest} accountData - The data for the account to be created
     * @returns {Promise<AccountApiResponse>} Promise with the created account data or error response
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
     * 
     * @param {UUID} id - The ID of the account to be updated
     * @param {UpdateAccountRequest} updateData - The new data to update the account with
     * @returns {Promise<AccountApiResponse>} Promise with the updated account data or error response
     */
    async updateAccount(id: UUID, updateData: UpdateAccountRequest): Promise<AccountApiResponse> {
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
     * 
     * @param {UUID} id - The ID of the account to be deleted
     * @returns {Promise<AccountApiResponse>} Promise with the response data or error response
     */
    async deleteAccount(id: UUID): Promise<AccountApiResponse> {
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
    },
    
    /**
     * Updates the display order of accounts
     * 
     * @param {UUID[]} accountsOrder - Array of account IDs in the desired display order
     * @returns {Promise<AccountApiResponse>} Promise with the response data or error response
     */
    async updateAccountsOrder(accountsOrder: UUID[]): Promise<AccountApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/accounts/order`, {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify({ accountsOrder }),
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
