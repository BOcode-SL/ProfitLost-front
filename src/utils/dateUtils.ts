// Importing types for ISO date strings and user preferences
import type { ISODateString } from '../types/api/common';
import type { User } from '../types/models/user';

// Regular expression to validate ISO UTC date format
// Format: YYYY-MM-DDTHH:mm:ss.sssZ
export const DATE_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

/**
 * Converts a given date to an ISO UTC string.
 * If the input is a string, it validates the format before converting.
 * 
 * @param date - The input date, either a string in ISO format or a Date object.
 * @returns The date as an ISO UTC string.
 * @throws Error if the input string is not in a valid ISO UTC format.
 */
export const toUTCDate = (date: string | Date): ISODateString => {
    // Validate the date string if it is a string and not in the correct format
    if (typeof date === 'string' && !DATE_REGEX.test(date)) {
        throw new Error('Invalid date format. Must be ISO UTC format (YYYY-MM-DDTHH:mm:ss.sssZ)');
    }
    // Convert the date to an ISO string
    return new Date(date).toISOString();
};

// Alias for backward compatibility
export const toUTCString = (date: Date): ISODateString => {
    return toUTCDate(date);
};

// Converts an ISO date string to a Date object
export const fromUTCString = (isoString: ISODateString): Date => {
    return new Date(isoString);
};

/**
 * Returns the current date and time in ISO UTC format.
 * 
 * @returns The current date as an ISO UTC string.
 */
export const getCurrentUTCDate = (): ISODateString => {
    return new Date().toISOString();
};

// Validates if a string is a valid ISO date string
export const isValidISOString = (dateString: string): boolean => {
    return DATE_REGEX.test(dateString);
};

// Formats a date string and user preferences into a readable date and time format
export const formatDateTime = (date: string, user: User | null) => {
    const dateObj = new Date(date);
    
    // Get user's date and time format preferences
    const dateFormat = user?.preferences.dateFormat || 'MM/DD/YYYY';
    const timeFormat = user?.preferences.timeFormat || '12h';
    
    let formattedDate = '';
    // Format date based on user's preference
    if (dateFormat === 'DD/MM/YYYY') {
        formattedDate = `${dateObj.getUTCDate().toString().padStart(2, '0')}/${(dateObj.getUTCMonth() + 1).toString().padStart(2, '0')}/${dateObj.getUTCFullYear()}`;
    } else {
        formattedDate = `${(dateObj.getUTCMonth() + 1).toString().padStart(2, '0')}/${dateObj.getUTCDate().toString().padStart(2, '0')}/${dateObj.getUTCFullYear()}`;
    }

    let hours = dateObj.getUTCHours();
    const minutes = dateObj.getUTCMinutes().toString().padStart(2, '0');
    const seconds = dateObj.getUTCSeconds().toString().padStart(2, '0');
    let timeStr = '';

    // Format time based on user's preference
    if (timeFormat === '12h') {
        const period = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        timeStr = `${hours}:${minutes}:${seconds} ${period}`;
    } else {
        timeStr = `${hours.toString().padStart(2, '0')}:${minutes}:${seconds}`;
    }

    return `${formattedDate} ${timeStr}`;
};

// Formats a date string based on user preferences
export const formatDate = (date: string, user: User | null) => {
    const dateObj = new Date(date);
    
    // Get user's date format preference
    const dateFormat = user?.preferences.dateFormat || 'MM/DD/YYYY';
    
    // Format date based on user's preference
    if (dateFormat === 'DD/MM/YYYY') {
        return `${dateObj.getUTCDate().toString().padStart(2, '0')}/${(dateObj.getUTCMonth() + 1).toString().padStart(2, '0')}/${dateObj.getUTCFullYear()}`;
    }
    
    return `${(dateObj.getUTCMonth() + 1).toString().padStart(2, '0')}/${dateObj.getUTCDate().toString().padStart(2, '0')}/${dateObj.getUTCFullYear()}`;
};