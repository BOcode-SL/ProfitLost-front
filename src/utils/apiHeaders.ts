import { isIOS } from './deviceDetection';

export const getAuthHeaders = (): HeadersInit => {
    const headers: HeadersInit = {
        'Content-Type': 'application/json'
    };

    if (isIOS()) {
        const token = localStorage.getItem('auth_token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    return headers;
};
