/**
 * Transaction Service Module
 * 
 * Provides functionality for managing financial transactions including creating,
 * retrieving, updating, and deleting transactions. Supports filtering by year and month.
 */

// Types
import { HttpStatusCode } from '../types/api/common';
import { CommonErrorType } from '../types/api/errors';
import type {
    TransactionApiResponse,
    TransactionYearsApiResponse,
    CreateTransactionRequest,
    UpdateTransactionRequest
} from '../types/api/responses';

// Utils
import { getAuthHeaders } from '../utils/apiHeaders';

// Defining the API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL;

/**
 * Handles errors that occur during transaction operations
 * @param error - The error that occurred during an API request
 * @returns A standardized TransactionApiResponse with error details
 */
const handleTransactionError = (error: unknown): TransactionApiResponse => {
    // Check if the error has a statusCode
    if ((error as TransactionApiResponse).statusCode) {
        return error as TransactionApiResponse;
    }
    // Handle network errors
    return {
        success: false,
        message: 'Connection error. Please check your internet connection.',
        error: 'CONNECTION_ERROR' as CommonErrorType,
        statusCode: 0 as HttpStatusCode
    };
};

/**
 * Service object providing methods for transaction management
 */
export const transactionService = {
    /**
     * Retrieves all transactions belonging to the current user
     * @returns Promise with the transaction data or error response
     */
    async getAllTransactions(): Promise<TransactionApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/transactions/all`, {
                method: 'GET',
                credentials: 'include',
                headers: getAuthHeaders()
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    success: false,
                    message: data.error || 'Failed to retrieve transactions',
                    error: data.error || 'DATABASE_ERROR',
                    statusCode: response.status as HttpStatusCode
                } as TransactionApiResponse;
            }

            // The response structure from the DAO might not be standardized
            // Let's ensure it matches our expected API response format
            return {
                success: true,
                data: data,
                statusCode: response.status as HttpStatusCode
            } as TransactionApiResponse;
        } catch (error) {
            throw handleTransactionError(error);
        }
    },

    /**
     * Retrieves years that have transactions for the current user
     * @returns Promise with array of years sorted in descending order
     */
    async getTransactionYears(): Promise<TransactionYearsApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/transactions/years`, {
                method: 'GET',
                credentials: 'include',
                headers: getAuthHeaders()
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    success: false,
                    message: data.error || 'Failed to retrieve transaction years',
                    error: data.error || 'DATABASE_ERROR',
                    statusCode: response.status as HttpStatusCode
                } as TransactionYearsApiResponse;
            }

            return {
                success: true,
                data: data,
                statusCode: response.status as HttpStatusCode
            } as TransactionYearsApiResponse;
        } catch (error) {
            if ((error as TransactionYearsApiResponse).statusCode) {
                return error as TransactionYearsApiResponse;
            }
            return {
                success: false,
                message: 'Connection error. Please check your internet connection.',
                error: 'CONNECTION_ERROR' as CommonErrorType,
                statusCode: 0 as HttpStatusCode,
                data: []
            };
        }
    },

    /**
     * Retrieves transactions for a specific year
     * @param year - The year to filter transactions by
     * @returns Promise with the filtered transaction data or error response
     */
    async getTransactionsByYear(year: number): Promise<TransactionApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/transactions/${year}`, {
                method: 'GET',
                credentials: 'include',
                headers: getAuthHeaders()
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    success: false,
                    message: data.error || 'Failed to retrieve transactions by year',
                    error: data.error || 'DATABASE_ERROR',
                    statusCode: response.status as HttpStatusCode
                } as TransactionApiResponse;
            }

            // The response structure from the DAO might not be standardized
            // Let's ensure it matches our expected API response format
            return {
                success: true,
                data: data,
                statusCode: response.status as HttpStatusCode
            } as TransactionApiResponse;
        } catch (error) {
            throw handleTransactionError(error);
        }
    },

    /**
     * Retrieves transactions for a specific year and month
     * @param year - The year to filter transactions by
     * @param month - The month to filter transactions by
     * @returns Promise with the filtered transaction data or error response
     */
    async getTransactionsByYearAndMonth(year: string, month: string): Promise<TransactionApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/transactions/${year}/${month}`, {
                method: 'GET',
                credentials: 'include',
                headers: getAuthHeaders()
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    success: false,
                    message: data.error || 'Failed to retrieve transactions by year and month',
                    error: data.error || 'DATABASE_ERROR',
                    statusCode: response.status as HttpStatusCode
                } as TransactionApiResponse;
            }

            // The response structure from the DAO might not be standardized
            // Let's ensure it matches our expected API response format
            return {
                success: true,
                data: data,
                statusCode: response.status as HttpStatusCode
            } as TransactionApiResponse;
        } catch (error) {
            throw handleTransactionError(error);
        }
    },

    /**
     * Creates a new transaction with the provided data
     * @param transactionData - The data for the transaction to be created
     * @returns Promise with the created transaction data or error response
     */
    async createTransaction(transactionData: CreateTransactionRequest): Promise<TransactionApiResponse> {
        try {
            // Ensure amount is a string for backend encryption
            const requestData = {
                ...transactionData,
                amount: typeof transactionData.amount === 'number'
                    ? transactionData.amount.toString()
                    : transactionData.amount
            };

            const response = await fetch(`${API_URL}/api/transactions/create`, {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify(requestData),
                headers: getAuthHeaders()
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    success: false,
                    message: data.error || 'Failed to create transaction',
                    error: data.error || 'DATABASE_ERROR',
                    statusCode: response.status as HttpStatusCode
                } as TransactionApiResponse;
            }

            // The response structure from the DAO might not be standardized
            // Let's ensure it matches our expected API response format
            return {
                success: true,
                data: data,
                statusCode: response.status as HttpStatusCode
            } as TransactionApiResponse;
        } catch (error) {
            throw handleTransactionError(error);
        }
    },

    /**
     * Updates an existing transaction with the provided data
     * @param id - The ID of the transaction to be updated
     * @param updateData - The new data to update the transaction with
     * @returns Promise with the updated transaction data or error response
     */
    async updateTransaction(id: string, updateData: UpdateTransactionRequest): Promise<TransactionApiResponse> {
        try {
            // Ensure amount is a string for backend encryption if provided
            const requestData = { ...updateData };

            if (updateData.amount !== undefined) {
                requestData.amount = typeof updateData.amount === 'number'
                    ? updateData.amount.toString()
                    : updateData.amount;
            }

            const response = await fetch(`${API_URL}/api/transactions/${id}`, {
                method: 'PUT',
                credentials: 'include',
                body: JSON.stringify(requestData),
                headers: getAuthHeaders()
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    success: false,
                    message: data.error || 'Failed to update transaction',
                    error: data.error || 'DATABASE_ERROR',
                    statusCode: response.status as HttpStatusCode
                } as TransactionApiResponse;
            }

            // The response structure from the DAO might not be standardized
            // Let's ensure it matches our expected API response format
            return {
                success: true,
                data: data,
                statusCode: response.status as HttpStatusCode
            } as TransactionApiResponse;
        } catch (error) {
            throw handleTransactionError(error);
        }
    },

    /**
     * Deletes a transaction with the specified ID
     * @param id - The ID of the transaction to be deleted
     * @param deleteAll - Optional flag to delete all recurring instances of the transaction
     * @returns Promise with the response data or error response
     */
    async deleteTransaction(id: string, deleteAll?: boolean): Promise<TransactionApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/transactions/${id}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: getAuthHeaders(),
                body: JSON.stringify({ deleteAll })
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    success: false,
                    message: data.error || 'Failed to delete transaction',
                    error: data.error || 'DATABASE_ERROR',
                    statusCode: response.status as HttpStatusCode
                } as TransactionApiResponse;
            }

            // The response structure from the DAO might not be standardized
            // Let's ensure it matches our expected API response format
            return {
                success: true,
                data: data,
                statusCode: response.status as HttpStatusCode
            } as TransactionApiResponse;
        } catch (error) {
            throw handleTransactionError(error);
        }
    }
};
