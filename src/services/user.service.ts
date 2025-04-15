/**
 * User Service Module
 * 
 * Provides functionality for managing user profile, preferences, and account settings.
 * Handles operations such as retrieving user data, updating profiles, managing themes,
 * changing passwords, and controlling onboarding flow.
 * 
 * @module UserService
 */

// Types
import { HttpStatusCode } from '../types/api/common';
import { CommonErrorType } from '../types/api/errors';
import type { UserApiResponse } from '../types/api/responses';
import type { PreferenceContent } from '../types/supabase/preferences';

// Utils
import { getAuthHeaders } from '../utils/apiHeaders';
import { isIOS } from '../utils/deviceDetection';

// Defining the API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL;

/**
 * Handles errors that occur during user operations
 * 
 * @param {unknown} error - The error that occurred during an API request
 * @returns {UserApiResponse} A standardized UserApiResponse with error details
 */
const handleUserError = (error: unknown): UserApiResponse => {
    // Check if the error has a statusCode
    if ((error as UserApiResponse).statusCode) {
        return error as UserApiResponse;
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
 * Service object providing methods for user management
 */
export const userService = {
    /**
     * Retrieves the current user's profile data
     * 
     * @returns {Promise<UserApiResponse>} Promise with the user data or error response
     */
    async getUserData(): Promise<UserApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/users/me`, {
                method: 'GET',
                credentials: 'include',
                headers: getAuthHeaders()
            });

            const data = await response.json();

            // Check if the response is not ok
            if (!response.ok) {
                throw {
                    ...data,
                    statusCode: response.status as HttpStatusCode
                } as UserApiResponse;
            }

            return data as UserApiResponse;
        } catch (error) {
            throw handleUserError(error);
        }
    },

    /**
     * Updates the user's profile information
     * 
     * @param {Object} userData - Object containing user profile information to update
     * @param {string} [userData.name] - User's first name
     * @param {string} [userData.surname] - User's last name
     * @param {string} [userData.language] - Preferred language code
     * @param {string} [userData.currency] - Preferred currency code
     * @param {string} [userData.dateFormat] - Preferred date format
     * @param {string} [userData.timeFormat] - Preferred time format
     * @returns {Promise<UserApiResponse>} Promise with the updated user data or error response
     */
    async updateProfile(userData: {
        name?: string;
        surname?: string;
        language?: string;
        currency?: string;
        dateFormat?: string;
        timeFormat?: string;
    }): Promise<UserApiResponse> {
        try {
            const token = localStorage.getItem('auth_token');
            const headers: HeadersInit = {
                'Content-Type': 'application/json',
                ...getAuthHeaders()
            };
            
            // If the device is iOS and token exists, set authorization header
            if (isIOS() && token) {
                (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${API_URL}/api/users/profile`, {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify(userData),
                headers
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    ...data,
                    statusCode: response.status as HttpStatusCode
                } as UserApiResponse;
            }

            return data as UserApiResponse;
        } catch (error) {
            console.error('Error in updateProfile:', error);
            throw handleUserError(error);
        }
    },

    /**
     * Updates the user's theme preference
     * 
     * @param {('light'|'dark')} theme - The theme preference ('light' or 'dark')
     * @returns {Promise<UserApiResponse>} Promise with the updated user data or error response
     */
    async updateTheme(theme: 'light' | 'dark'): Promise<UserApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/users/theme`, {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify({ theme }),
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    ...data,
                    statusCode: response.status as HttpStatusCode
                } as UserApiResponse;
            }

            return data as UserApiResponse;
        } catch (error) {
            throw handleUserError(error);
        }
    },

    /**
     * Updates the user's view mode preference
     * 
     * @param {('yearToday'|'fullYear')} viewMode - The view mode preference ('yearToday' or 'fullYear')
     * @returns {Promise<UserApiResponse>} Promise with the updated user data or error response
     */
    async updateViewMode(viewMode: 'yearToday' | 'fullYear'): Promise<UserApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/users/view-mode`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ viewMode })
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                throw {
                    ...data,
                    statusCode: response.status as HttpStatusCode
                } as UserApiResponse;
            }
    
            return data as UserApiResponse;
        } catch (error) {
            throw handleUserError(error);
        }
    },

    /**
     * Changes the user's password
     * 
     * @param {string} currentPassword - The user's current password
     * @param {string} newPassword - The new password to set
     * @returns {Promise<UserApiResponse>} Promise with the response data or error response
     */
    async changePassword(currentPassword: string, newPassword: string): Promise<UserApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/users/password`, {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify({ currentPassword, newPassword }),
                headers: getAuthHeaders()
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    ...data,
                    statusCode: response.status as HttpStatusCode
                } as UserApiResponse;
            }

            return data as UserApiResponse;
        } catch (error) {
            throw handleUserError(error);
        }
    },

    /**
     * Permanently deletes the user's account
     * 
     * @returns {Promise<UserApiResponse>} Promise with the response data or error response
     */
    async deleteAccount(): Promise<UserApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/users/account`, {
                method: 'DELETE',
                credentials: 'include',
                headers: getAuthHeaders()
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    ...data,
                    statusCode: response.status as HttpStatusCode
                } as UserApiResponse;
            }

            return data as UserApiResponse;
        } catch (error) {
            throw handleUserError(error);
        }
    },

    /**
     * Sets the user's preferences during the onboarding process
     * 
     * @param {PreferenceContent} preferences - Partial preferences object with only the properties to update.
     *                      This will be merged with existing preferences on the server.
     * @returns {Promise<UserApiResponse>} Promise with the updated user data or error response
     */
    async onboardingPreferences(preferences: PreferenceContent): Promise<UserApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/users/preferences`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(preferences)
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    ...data,
                    statusCode: response.status as HttpStatusCode
                } as UserApiResponse;
            }

            return data as UserApiResponse;
        } catch (error) {
            throw handleUserError(error);
        }
    },

    /**
     * Marks the onboarding process as complete for the user
     * 
     * @returns {Promise<UserApiResponse>} Promise with the updated user data or error response
     */
    async completeOnboarding(): Promise<UserApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/users/complete-onboarding`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    ...data,
                    statusCode: response.status as HttpStatusCode
                } as UserApiResponse;
            }

            return data as UserApiResponse;
        } catch (error) {
            throw handleUserError(error);
        }
    },

    /**
     * Updates the completion status of a specific onboarding section
     * 
     * @param {string} section - The name of the onboarding section to mark as completed
     * @returns {Promise<UserApiResponse>} Promise with the updated user data or error response
     */
    async updateOnboardingSection(section: string): Promise<UserApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/users/onboarding-section`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    section,
                    shown: true 
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    ...data,
                    statusCode: response.status as HttpStatusCode
                } as UserApiResponse;
            }

            return data as UserApiResponse;
        } catch (error) {
            throw handleUserError(error);
        }
    }
}; 