import { HttpStatusCode } from '../types/common.types';
import type { TransactionApiResponse, TransactionApiErrorResponse } from '../types/services/transaction.serviceTypes';
import { Transaction } from '../types/models/transaction.modelTypes';

const API_URL = import.meta.env.VITE_API_URL;

export const transactionService = {
    async getAllTransactions(): Promise<TransactionApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/transactions/all`, {
                method: 'GET',
                credentials: 'include',
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    ...data,
                    status: response.status
                } as TransactionApiErrorResponse;
            }

            return data as TransactionApiResponse;
        } catch (error) {
            if ((error as TransactionApiErrorResponse).status) {
                throw error as TransactionApiErrorResponse;
            }
            throw {
                success: false,
                message: 'Connection error. Please check your internet connection.',
                error: 'CONNECTION_ERROR',
                status: 0 as HttpStatusCode
            } as TransactionApiErrorResponse;
        }
    },

    async getTransactionsByYear(year: string): Promise<TransactionApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/transactions/${year}`, {
                method: 'GET',
                credentials: 'include',
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    ...data,
                    status: response.status
                } as TransactionApiErrorResponse;
            }

            return data as TransactionApiResponse;
        } catch (error) {
            if ((error as TransactionApiErrorResponse).status) {
                throw error as TransactionApiErrorResponse;
            }
            throw {
                success: false,
                message: 'Connection error. Please check your internet connection.',
                error: 'CONNECTION_ERROR',
                status: 0 as HttpStatusCode
            } as TransactionApiErrorResponse;
        }
    },

    async getTransactionsByYearAndMonth(year: string, month: string): Promise<TransactionApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/transactions/${year}/${month}`, {
                method: 'GET',
                credentials: 'include',
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    ...data,
                    status: response.status
                } as TransactionApiErrorResponse;
            }

            return data as TransactionApiResponse;
        } catch (error) {
            if ((error as TransactionApiErrorResponse).status) {
                throw error as TransactionApiErrorResponse;
            }
            throw {
                success: false,
                message: 'Connection error. Please check your internet connection.',
                error: 'CONNECTION_ERROR',
                status: 0 as HttpStatusCode
            } as TransactionApiErrorResponse;
        }
    },

    async createTransaction(transactionData: Partial<Transaction>): Promise<TransactionApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/transactions/create`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transactionData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    ...data,
                    status: response.status
                } as TransactionApiErrorResponse;
            }

            return data as TransactionApiResponse;
        } catch (error) {
            if ((error as TransactionApiErrorResponse).status) {
                throw error as TransactionApiErrorResponse;
            }
            throw {
                success: false,
                message: 'Connection error. Please check your internet connection.',
                error: 'CONNECTION_ERROR',
                status: 0 as HttpStatusCode
            } as TransactionApiErrorResponse;
        }
    },

    async updateTransaction(id: string, transactionData: Partial<Transaction>): Promise<TransactionApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/transactions/${id}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transactionData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    ...data,
                    status: response.status
                } as TransactionApiErrorResponse;
            }

            return data as TransactionApiResponse;
        } catch (error) {
            if ((error as TransactionApiErrorResponse).status) {
                throw error as TransactionApiErrorResponse;
            }
            throw {
                success: false,
                message: 'Connection error. Please check your internet connection.',
                error: 'CONNECTION_ERROR',
                status: 0 as HttpStatusCode
            } as TransactionApiErrorResponse;
        }
    },

    async deleteTransaction(id: string): Promise<TransactionApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/transactions/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    ...data,
                    status: response.status
                } as TransactionApiErrorResponse;
            }

            return data as TransactionApiResponse;
        } catch (error) {
            if ((error as TransactionApiErrorResponse).status) {
                throw error as TransactionApiErrorResponse;
            }
            throw {
                success: false,
                message: 'Connection error. Please check your internet connection.',
                error: 'CONNECTION_ERROR',
                status: 0 as HttpStatusCode
            } as TransactionApiErrorResponse;
        }
    },
};
