// Types
import { HttpStatusCode } from '../types/api/common';
import { CommonErrorType } from '../types/api/errors';
import type { ApiResponse } from '../types/api/common';
import type { UserMetrics, TransactionMetrics, TransactionHistory } from '../types/models/analytics';

// Utils
import { getAuthHeaders } from '../utils/apiHeaders';

// Defining the API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL;

// Function to handle analytics errors
const handleAnalyticsError = (error: unknown): ApiResponse<never> => {
    // Check if the error has a statusCode and is an API response
    if ((error as ApiResponse<never>).statusCode) {
        return error as ApiResponse<never>;
    }
    // Handle network errors
    return {
        success: false,
        message: 'Connection error. Please check your internet connection.',
        error: 'CONNECTION_ERROR' as CommonErrorType,
        statusCode: 0 as HttpStatusCode
    };
};

export const analyticsService = {
    /**
     * Get user metrics
     */
    async getUserMetrics(): Promise<ApiResponse<UserMetrics>> {
        try {
            const headers = await getAuthHeaders();
            const response = await fetch(`${API_URL}/api/analytics/users`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    ...headers,
                    'Content-Type': 'application/json'
                }
            });

            const data: ApiResponse<UserMetrics> = await response.json();

            if (!response.ok) {
                console.error('Analytics error:', data);
                throw {
                    ...data,
                    statusCode: response.status as HttpStatusCode
                };
            }

            return data;
        } catch (error) {
            console.error('Analytics service error:', error);
            return handleAnalyticsError(error);
        }
    },

    /**
     * Save current user metrics to history
     */
    async saveUserMetrics(): Promise<ApiResponse<void>> {
        try {
            const headers = await getAuthHeaders();
            const response = await fetch(`${API_URL}/api/analytics/users/save-metrics`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    ...headers,
                    'Content-Type': 'application/json'
                }
            });

            const data: ApiResponse<void> = await response.json();

            if (!response.ok) {
                console.error('Analytics error:', data);
                throw {
                    ...data,
                    statusCode: response.status as HttpStatusCode
                };
            }

            return data;
        } catch (error) {
            console.error('Analytics service error:', error);
            return handleAnalyticsError(error);
        }
    },

    /**
     * Get transaction metrics
     */
    async getTransactionMetrics(): Promise<ApiResponse<TransactionMetrics>> {
        try {
            const headers = await getAuthHeaders();
            const response = await fetch(`${API_URL}/api/analytics/transactions`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    ...headers,
                    'Content-Type': 'application/json'
                }
            });

            const data: ApiResponse<TransactionMetrics> = await response.json();

            if (!response.ok) {
                console.error('Analytics error:', data);
                throw {
                    ...data,
                    statusCode: response.status as HttpStatusCode
                };
            }

            return data;
        } catch (error) {
            console.error('Analytics service error:', error);
            return handleAnalyticsError(error);
        }
    },

    /**
     * Get transaction history
     */
    async getTransactionHistory(type: 'daily' | 'monthly' = 'monthly'): Promise<ApiResponse<TransactionHistory[]>> {
        try {
            const headers = await getAuthHeaders();
            const response = await fetch(`${API_URL}/api/analytics/transactions/history?type=${type}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    ...headers,
                    'Content-Type': 'application/json'
                }
            });

            const data: ApiResponse<TransactionHistory[]> = await response.json();

            if (!response.ok) {
                console.error('Analytics error:', data);
                throw {
                    ...data,
                    statusCode: response.status as HttpStatusCode
                };
            }

            return data;
        } catch (error) {
            console.error('Analytics service error:', error);
            return handleAnalyticsError(error);
        }
    }
};
