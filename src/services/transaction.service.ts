/**
 * Transaction Service Module
 * 
 * Provides functionality for managing financial transactions including creating,
 * retrieving, updating, and deleting transactions. Supports filtering by year and month.
 */

// Types
import { HttpStatusCode } from '../types/api/common';
import { CommonErrorType } from '../types/api/errors';
import type { TransactionApiResponse, CreateTransactionRequest, UpdateTransactionRequest } from '../types/api/responses';

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
                    ...data,
                    statusCode: response.status as HttpStatusCode
                } as TransactionApiResponse;
            }

            return data as TransactionApiResponse;
        } catch (error) {
            throw handleTransactionError(error);
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
                    ...data,
                    statusCode: response.status as HttpStatusCode
                } as TransactionApiResponse;
            }

            return data as TransactionApiResponse;
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
                    ...data,
                    statusCode: response.status as HttpStatusCode
                } as TransactionApiResponse;
            }

            return data as TransactionApiResponse;
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
            const response = await fetch(`${API_URL}/api/transactions/create`, {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify(transactionData),
                headers: getAuthHeaders()
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    ...data,
                    statusCode: response.status as HttpStatusCode
                } as TransactionApiResponse;
            }

            return data as TransactionApiResponse;
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
            const response = await fetch(`${API_URL}/api/transactions/${id}`, {
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
                } as TransactionApiResponse;
            }

            return data as TransactionApiResponse;
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
                    ...data,
                    statusCode: response.status as HttpStatusCode
                } as TransactionApiResponse;
            }

            return data as TransactionApiResponse;
        } catch (error) {
            throw handleTransactionError(error);
        }
    }
};
