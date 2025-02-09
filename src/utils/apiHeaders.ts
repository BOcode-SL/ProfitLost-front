import { isIOS } from './deviceDetection';

// Function to get authentication headers
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
