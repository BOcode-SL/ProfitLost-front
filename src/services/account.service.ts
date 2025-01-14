import { HttpStatusCode } from '../types/api/common';
import { AccountErrorType, CommonErrorType } from '../types/api/errors';
import type { AccountApiErrorResponse, AccountApiResponse, CreateAccountRequest, UpdateAccountRequest } from '../types/api/responses';
import type { Account } from '../types/models/account';

const API_URL = import.meta.env.VITE_API_URL;

const handleAccountError = (error: unknown): AccountApiErrorResponse => {
    if ((error as AccountApiErrorResponse).statusCode) {
        return error as AccountApiErrorResponse;
    }
    return {
        success: false,
        message: 'Connection error. Please check your internet connection.',
        error: 'CONNECTION_ERROR' as CommonErrorType,
        statusCode: 0 as HttpStatusCode
    };
};

export const accountService = {
    async getAllAccounts(): Promise<AccountApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/accounts/all`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    ...data,
                    statusCode: response.status as HttpStatusCode
                } as AccountApiErrorResponse;
            }

            return data as AccountApiResponse;
        } catch (error) {
            throw handleAccountError(error);
        }
    },

    async getAccountsByYear(year: number): Promise<AccountApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/accounts/${year}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                return {
                    success: false,
                    message: 'Failed to fetch accounts by year',
                    error: 'FETCH_ERROR' as AccountErrorType,
                    statusCode: response.status as HttpStatusCode
                };
            }

            const data = await response.json();
            return {
                success: true,
                message: data.message,
                data: data.data,
                statusCode: 200 as HttpStatusCode
            };
        } catch (error) {
            console.error('❌ Error fetching accounts by year:', error);
            return {
                success: false,
                message: 'Network error',
                error: 'NETWORK_ERROR' as AccountErrorType,
                statusCode: 0 as HttpStatusCode
            };
        }
    },

    async createAccount(accountData: CreateAccountRequest): Promise<AccountApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/accounts/create`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(accountData)
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message: data.message || 'Failed to create account',
                    error: data.error || 'CREATE_ERROR' as AccountErrorType,
                    statusCode: response.status as HttpStatusCode
                };
            }

            return {
                success: true,
                message: data.message,
                data: data.data as Account,
                statusCode: 201 as HttpStatusCode
            };
        } catch (error) {
            console.error('❌ Error creating account:', error);
            return {
                success: false,
                message: 'Network error',
                error: 'NETWORK_ERROR' as AccountErrorType,
                statusCode: 0 as HttpStatusCode
            };
        }
    },

    async updateAccount(id: string, updateData: UpdateAccountRequest): Promise<AccountApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/accounts/${id}`, {
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
                } as AccountApiErrorResponse;
            }

            return data as AccountApiResponse;
        } catch (error) {
            throw handleAccountError(error);
        }
    },

    async deleteAccount(id: string): Promise<AccountApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/accounts/${id}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message: data.message || 'Failed to delete account',
                    error: data.error || 'DELETE_ERROR',
                    statusCode: response.status as HttpStatusCode
                };
            }

            return {
                success: true,
                message: data.message,
                statusCode: 200 as HttpStatusCode
            };
        } catch (error) {
            console.error('❌ Error deleting account:', error);
            return {
                success: false,
                message: 'Network error',
                error: 'NETWORK_ERROR' as AccountErrorType,
                statusCode: 0 as HttpStatusCode
            };
        }
    }
};
