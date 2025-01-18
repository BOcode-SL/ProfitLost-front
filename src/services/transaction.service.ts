import { HttpStatusCode } from '../types/api/common';
import { CommonErrorType } from '../types/api/errors';
import type { TransactionApiResponse, CreateTransactionRequest, UpdateTransactionRequest } from '../types/api/responses';

const API_URL = import.meta.env.VITE_API_URL;

const handleTransactionError = (error: unknown): TransactionApiResponse => {
    if ((error as TransactionApiResponse).statusCode) {
        return error as TransactionApiResponse;
    }
    return {
        success: false,
        message: 'Connection error. Please check your internet connection.',
        error: 'CONNECTION_ERROR' as CommonErrorType,
        statusCode: 0 as HttpStatusCode
    };
};

export const transactionService = {
    async getAllTransactions(): Promise<TransactionApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/transactions/all`, {
                method: 'GET',
                credentials: 'include'
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

    async getTransactionsByYear(year: number): Promise<TransactionApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/transactions/${year}`, {
                method: 'GET',
                credentials: 'include'
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

    async getTransactionsByYearAndMonth(year: string, month: string): Promise<TransactionApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/transactions/${year}/${month}`, {
                method: 'GET',
                credentials: 'include'
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

    async createTransaction(transactionData: CreateTransactionRequest): Promise<TransactionApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/transactions/create`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(transactionData)
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

    async updateTransaction(id: string, updateData: UpdateTransactionRequest): Promise<TransactionApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/transactions/${id}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
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

    async deleteTransaction(id: string): Promise<TransactionApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/transactions/${id}`, {
                method: 'DELETE',
                credentials: 'include'
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
