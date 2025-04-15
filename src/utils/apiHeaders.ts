/**
 * API Headers Utility
 * 
 * Provides functionality for generating HTTP headers for API requests.
 * Handles authorization tokens specifically for iOS devices due to cookie limitations.
 * 
 * @module ApiHeaders
 */
import { isIOS } from './deviceDetection';

/**
 * Generates authentication headers for API requests.
 * On iOS devices, retrieves the auth token from localStorage and adds it to the headers
 * because iOS has limitations with cookies in certain contexts (WebView, PWA).
 * On other platforms, cookies are used for authentication (handled automatically by fetch).
 * 
 * @returns {HeadersInit} Object with the appropriate headers for API requests, including:
 *   - Content-Type: Always set to 'application/json'
 *   - Authorization: Set to 'Bearer [token]' on iOS devices when a token exists
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
