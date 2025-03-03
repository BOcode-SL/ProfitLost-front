// Types
import { HttpStatusCode } from '../types/api/common';
import { AnalyticsErrorType } from '../types/api/errors';
import type { ApiResponse } from '../types/api/common';
import type { UserMetrics, TransactionMetrics, TransactionHistory } from '../types/models/analytics';

// Utils
import { getAuthHeaders } from '../utils/apiHeaders';

// Defining the API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL;

// Function to handle analytics errors
const handleAnalyticsError = (error: unknown): ApiResponse<never, AnalyticsErrorType> => {
    // Check if the error has a statusCode and is an API response
    if ((error as ApiResponse<never>).statusCode) {
        return error as ApiResponse<never, AnalyticsErrorType>;
    }
    // Handle network errors
    return {
        success: false,
        message: 'Connection error. Please check your internet connection.',
        error: 'CONNECTION_ERROR' as AnalyticsErrorType,
        statusCode: 0 as HttpStatusCode
    };
};

export const analyticsService = {
    /**
     * Get user metrics
     */
    async getUserMetrics(): Promise<ApiResponse<UserMetrics, AnalyticsErrorType>> {
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

            const data: ApiResponse<UserMetrics, AnalyticsErrorType> = await response.json();

            if (!response.ok) {
                console.error('An error occurred while fetching user metrics:', data);
                throw {
                    ...data,
                    statusCode: response.status as HttpStatusCode
                };
            }

            return data;
        } catch (error) {
            console.error('Error in analytics service while retrieving user metrics:', error);
            return handleAnalyticsError(error);
        }
    },

    /**
     * Get transaction metrics
     */
    async getTransactionMetrics(): Promise<ApiResponse<TransactionMetrics, AnalyticsErrorType>> {
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

            const data: ApiResponse<TransactionMetrics, AnalyticsErrorType> = await response.json();

            if (!response.ok) {
                console.error('An error occurred while fetching transaction metrics:', data);
                throw {
                    ...data,
                    statusCode: response.status as HttpStatusCode
                };
            }

            return data;
        } catch (error) {
            console.error('Error in analytics service while retrieving transaction metrics:', error);
            return handleAnalyticsError(error);
        }
    },

    /**
     * Get transaction history
     */
    async getTransactionHistory(type: 'daily' | 'monthly' = 'monthly'): Promise<ApiResponse<TransactionHistory[], AnalyticsErrorType>> {
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

            const data: ApiResponse<TransactionHistory[], AnalyticsErrorType> = await response.json();

            if (!response.ok) {
                console.error('An error occurred while fetching transaction history:', data);
                
                // If the error is due to an invalid date range, specify it
                if (response.status === 400 && data.message?.toLowerCase().includes('date')) {
                    throw {
                        ...data,
                        error: 'INVALID_DATE_RANGE',
                        statusCode: response.status as HttpStatusCode
                    };
                }
                
                throw {
                    ...data,
                    statusCode: response.status as HttpStatusCode
                };
            }

            return data;
        } catch (error) {
            console.error('Error in analytics service while retrieving transaction history:', error);
            return handleAnalyticsError(error);
        }
    }
};
