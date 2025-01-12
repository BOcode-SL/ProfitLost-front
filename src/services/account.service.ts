import { HttpStatusCode } from '../types/common.types';
import type { AccountResponse, CreateAccountRequest, UpdateAccountRequest } from '../types/services/account.serviceTypes';

const API_URL = import.meta.env.VITE_API_URL;

export const accountService = {
    async getAllAccounts(): Promise<AccountResponse> {
        try {
            const response = await fetch(`${API_URL}/api/accounts/all`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                return {
                    success: false,
                    message: 'Failed to fetch accounts',
                    error: 'FETCH_ERROR',
                    statusCode: response.status as HttpStatusCode
                };
            }

            const data = await response.json();
            return {
                success: true,
                data: data.data,
                statusCode: 200
            };
        } catch (error) {
            console.error('❌ Error fetching accounts:', error);
            return {
                success: false,
                message: 'Network error',
                error: 'NETWORK_ERROR',
                statusCode: 0
            };
        }
    },

    async getAccountsByYear(year: number): Promise<AccountResponse> {
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
                    error: 'FETCH_ERROR',
                    statusCode: response.status as HttpStatusCode
                };
            }

            const data = await response.json();
            return {
                success: true,
                data: data.data,
                statusCode: 200
            };
        } catch (error) {
            console.error('❌ Error fetching accounts by year:', error);
            return {
                success: false,
                message: 'Network error',
                error: 'NETWORK_ERROR',
                statusCode: 0
            };
        }
    },

    async createAccount(accountData: CreateAccountRequest): Promise<AccountResponse> {
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
                    error: data.error || 'CREATE_ERROR',
                    statusCode: response.status as HttpStatusCode
                };
            }

            return {
                success: true,
                message: data.message,
                data: data.data,
                statusCode: 201
            };
        } catch (error) {
            console.error('Error creating account:', error);
            return {
                success: false,
                message: 'Network error',
                error: 'NETWORK_ERROR',
                statusCode: 0
            };
        }
    },

    async updateAccount(id: string, updateData: UpdateAccountRequest): Promise<AccountResponse> {
        try {
            console.log('Updating account with data:', updateData);

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
                console.error('Error response:', data);
                return {
                    success: false,
                    message: data.message || 'Failed to update account',
                    error: data.error || 'UPDATE_ERROR',
                    statusCode: response.status as HttpStatusCode
                };
            }

            return {
                success: true,
                message: data.message,
                data: data.data,
                statusCode: 200
            };
        } catch (error) {
            console.error('❌ Error updating account:', error);
            return {
                success: false,
                message: 'Network error',
                error: 'NETWORK_ERROR',
                statusCode: 0
            };
        }
    },

    async deleteAccount(id: string): Promise<AccountResponse> {
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
                statusCode: 200
            };
        } catch (error) {
            console.error('❌ Error deleting account:', error);
            return {
                success: false,
                message: 'Network error',
                error: 'NETWORK_ERROR',
                statusCode: 0
            };
        }
    }
};
