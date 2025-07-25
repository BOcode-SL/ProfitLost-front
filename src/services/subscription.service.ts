/**
 * Subscription Service Module
 * 
 * Provides functionality for subscription management including checkout sessions,
 * customer portal sessions, and retrieving subscription plans.
 * Uses Stripe for payment processing and subscription management.
 * 
 * @module SubscriptionService
 */

// Types
import { HttpStatusCode } from '../types/api/common';
import { SubscriptionErrorType } from '../types/api/errors';
import { SubscriptionApiResponse, CreateCheckoutSessionRequest, CreatePortalSessionRequest } from '../types/api/responses';

// Utils
import { getAuthHeaders } from '../utils/apiHeaders';

// Defining the API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL;



/**
 * Handles errors that occur during subscription operations
 * 
 * @param {unknown} error - The error that occurred during an API request
 * @returns {SubscriptionApiResponse} A standardized SubscriptionApiResponse with error details
 */
const handleSubscriptionError = (error: unknown): SubscriptionApiResponse => {
    // Check if the error has a statusCode
    if ((error as SubscriptionApiResponse).statusCode) {
        return error as SubscriptionApiResponse;
    }

    // Handle network errors
    if (error instanceof TypeError) {
        return {
            success: false,
            message: 'Network error. Please check your connection.',
            error: 'NETWORK_ERROR' as SubscriptionErrorType,
            statusCode: 0 as HttpStatusCode
        };
    }

    // Return a default error response
    return {
        success: false,
        message: 'An unexpected error occurred. Please try again.',
        error: 'SERVER_ERROR' as SubscriptionErrorType,
        statusCode: 500 as HttpStatusCode
    };
};

/**
 * Service object providing methods for subscription management
 */
export const subscriptionService = {
    /**
     * Creates a checkout session for subscription purchase
     * 
     * @param {string} priceId - The ID of the price/plan the user is subscribing to
     * @param {string} successUrl - URL to redirect to after successful payment
     * @param {string} cancelUrl - URL to redirect to if user cancels
     * @returns {Promise<SubscriptionApiResponse>} Promise with the checkout session URL or error
     */
    async createCheckoutSession(
        priceId: string,
        successUrl: string,
        cancelUrl: string
    ): Promise<SubscriptionApiResponse> {
        try {
            const requestData: CreateCheckoutSessionRequest = {
                priceId,
                successUrl,
                cancelUrl
            };

            const response = await fetch(`${API_URL}/api/subscriptions/create-checkout-session`, {
                method: 'POST',
                credentials: 'include',
                headers: getAuthHeaders(),
                body: JSON.stringify(requestData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    ...data,
                    statusCode: response.status as HttpStatusCode
                } as SubscriptionApiResponse;
            }

            return data as SubscriptionApiResponse;
        } catch (error) {
            throw handleSubscriptionError(error);
        }
    },

    /**
     * Creates a customer portal session for subscription management
     * 
     * @param {string} returnUrl - URL to return to after portal session
     * @returns {Promise<SubscriptionApiResponse>} Promise with the portal session URL or error
     */
    async createPortalSession(returnUrl: string): Promise<SubscriptionApiResponse> {
        try {
            const requestData: CreatePortalSessionRequest = { returnUrl };

            const response = await fetch(`${API_URL}/api/subscriptions/create-portal-session`, {
                method: 'POST',
                credentials: 'include',
                headers: getAuthHeaders(),
                body: JSON.stringify(requestData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    ...data,
                    statusCode: response.status as HttpStatusCode
                } as SubscriptionApiResponse;
            }

            return data as SubscriptionApiResponse;
        } catch (error) {
            throw handleSubscriptionError(error);
        }
    },

    /**
     * Retrieves available subscription plans
     * 
     * @returns {Promise<SubscriptionApiResponse>} Promise with the subscription plans or error
     */
    async getSubscriptionPlans(): Promise<SubscriptionApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/subscriptions/plans`, {
                method: 'GET',
                credentials: 'include',
                headers: getAuthHeaders(),
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    ...data,
                    statusCode: response.status as HttpStatusCode
                } as SubscriptionApiResponse;
            }

            return data as SubscriptionApiResponse;
        } catch (error) {
            throw handleSubscriptionError(error);
        }
    }
};
