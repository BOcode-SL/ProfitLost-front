import { HttpStatusCode } from '../types/api/common';
import { CommonErrorType } from '../types/api/errors';
import type { AccountApiResponse, CreateAccountRequest, UpdateAccountRequest } from '../types/api/responses';
import { getAuthHeaders } from '../utils/apiHeaders';
const API_URL = import.meta.env.VITE_API_URL;

const handleAccountError = (error: unknown): AccountApiResponse => {
    if ((error as AccountApiResponse).statusCode) {
        return error as AccountApiResponse;
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
