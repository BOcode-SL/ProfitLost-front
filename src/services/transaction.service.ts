import { HttpStatusCode } from '../types/api/common';
import { CommonErrorType } from '../types/api/errors';
import type { TransactionApiResponse, CreateTransactionRequest, UpdateTransactionRequest } from '../types/api/responses';
import { getAuthHeaders } from '../utils/apiHeaders';

// Defining the API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL;

// Function to handle transaction errors
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

export const transactionService = {
    // Method to get all transactions
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

    // Method to get transactions by year
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

    // Method to get transactions by year and month
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

    // Method to create a new transaction
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

    // Method to update an existing transaction
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

    // Method to delete a transaction
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
