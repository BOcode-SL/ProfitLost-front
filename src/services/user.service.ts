// Types
import { HttpStatusCode } from '../types/api/common';
import { CommonErrorType } from '../types/api/errors';
import type { UserApiResponse } from '../types/api/responses';
import type { UserPreferences } from '../types/models/user';

// Utils
import { getAuthHeaders } from '../utils/apiHeaders';
import { isIOS } from '../utils/deviceDetection';

// Defining the API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL;

// Function to handle user errors
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

// User service object
export const userService = {
    // Method to get user data
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

    // Method to update user profile
    async updateProfile(formData: FormData): Promise<UserApiResponse> {
        try {
            const token = localStorage.getItem('auth_token');
            const headers: HeadersInit = {};
            
            // If the device is iOS and token exists, set authorization header
            if (isIOS() && token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${API_URL}/api/users/profile`, {
                method: 'POST',
                credentials: 'include',
                body: formData,
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

    // Method to update user theme
    async updateTheme(theme: 'light' | 'dark'): Promise<UserApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/users/theme`, {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify({ theme }),
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

    // Method to update user view mode
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

    // Method to change user password
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

    // Method to delete user profile image
    async deleteProfileImage(): Promise<UserApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/users/profile-image`, {
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

    // Method to delete user account
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

    // Method to update the order of user accounts
    async updateAccountsOrder(accountsOrder: string[]): Promise<UserApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/users/accounts-order`, {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify({ accountsOrder }),
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
    // Method to update user preferences
    async onboardingPreferences(preferences: UserPreferences): Promise<UserApiResponse> {
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

    // Method to complete the onboarding process
    async completeOnboarding(): Promise<UserApiResponse> {
        try {
            const response = await fetch(`${API_URL}/api/users/complete-onboarding`, {
                method: 'POST',
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
    }
}; 