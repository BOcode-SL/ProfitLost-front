/**
 * API Headers Utility
 * 
 * Provides functionality for generating HTTP headers for API requests.
 * Handles authorization tokens specifically for iOS devices due to cookie limitations.
 */
import { isIOS } from './deviceDetection';

/**
 * Generates authentication headers for API requests
 * On iOS devices, retrieves the auth token from localStorage and adds it to the headers
 * On other platforms, cookies are used for authentication (handled automatically by fetch)
 * 
 * @returns HeadersInit object with the appropriate headers for API requests
 */
export const getAuthHeaders = (): HeadersInit => {
    // Initialize headers with content type
    const headers: HeadersInit = {
        'Content-Type': 'application/json'
    };

    // Check if the device is iOS
    if (isIOS()) {
        // Retrieve the authentication token from local storage
        const token = localStorage.getItem('auth_token');
        // If a token exists, add it to the headers
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    // Return the constructed headers
    return headers;
};
