// Frontend:
// 1. Works in local time (LocalTime)
// 2. Sends dates to the backend in LocalTime formatted as ISO
// 3. Receives dates from the backend in UTC ISO and converts them to LocalTime

// Backend:
// 1. Works in UTC
// 1. Receives LocalTime from the frontend formatted as ISO
// 2. Converts to UTC ISO for storage
// 3. Returns UTC ISO to the frontend


// Importing types for ISO date strings and user preferences
import type { ISODateString } from '../types/api/common';
import type { User } from '../types/models/user';

// Regular expression to validate ISO UTC date format
// Format: YYYY-MM-DDTHH:mm:ss.sssZ
export const DATE_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

/**
 * Converts a date to local time string format.
 * This is used when sending dates to the backend.
 * 
 * @param date - The input date, either a string or a Date object.
 * @returns The date as a local time string.
 */
export const toLocalString = (date: string | Date): string => {
    const dateObj = new Date(date);
    return dateObj.toLocaleString('en-US', { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone });
};

/**
 * Converts a UTC ISO string from the backend to a local Date object.
 * 
 * @param isoString - The UTC ISO string from the backend.
 * @returns Date object in local time.
 */
export const fromUTCtoLocal = (isoString: ISODateString): Date => {
    return new Date(isoString);
};

/**
 * Prepares a local date for sending to the backend.
 * The date remains in local time; the backend will handle UTC conversion.
 * 
 * @param localDate - The local date to prepare.
 * @returns The date string in ISO format.
 */
export const prepareForBackend = (localDate: Date): string => {
    // Example: 2023-10-03T16:01:05.000Z
    return localDate.toISOString();
};

/**
 * Converts a UTC date string to a local date for display in forms.
 * This is useful when showing UTC dates from the backend in local time for editing.
 * 
 * @param utcString - The UTC date string to convert.
 * @returns A string in the format YYYY-MM-DDTHH:mm:ss for use in datetime-local inputs.
 */
export const utcToLocalString = (utcString: ISODateString): string => {
    const localDate = fromUTCtoLocal(utcString);
    
    // Get year, month, day, hour, minute, second in local timezone
    const year = localDate.getFullYear();
    const month = (localDate.getMonth() + 1).toString().padStart(2, '0');
    const day = localDate.getDate().toString().padStart(2, '0');
    const hours = localDate.getHours().toString().padStart(2, '0');
    const minutes = localDate.getMinutes().toString().padStart(2, '0');
    const seconds = localDate.getSeconds().toString().padStart(2, '0');
    
    // Format as YYYY-MM-DDTHH:mm:ss
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

/**
 * Returns the current date and time in local format.
 * 
 * @returns The current date as a local string.
 */
export const getCurrentDate = (): string => {
    return toLocalString(new Date());
};

// Validates if a string is a valid ISO string.
export const isValidISOString = (dateString: string): boolean => {
    return DATE_REGEX.test(dateString);
};

// Formats a date string and user preferences into a readable date and time format.
export const formatDateTime = (date: string | Date, user: User | null) => {
    // If the date comes in ISO UTC format from the backend, convert it to local
    const dateObj = typeof date === 'string' && DATE_REGEX.test(date) 
        ? fromUTCtoLocal(date as ISODateString)
        : new Date(date);
    
    // Get user's date and time format preferences.
    const dateFormat = user?.preferences.dateFormat || 'MM/DD/YYYY';
    const timeFormat = user?.preferences.timeFormat || '12h';
    
    let formattedDate = '';
    // Format date based on user's preference.
    if (dateFormat === 'DD/MM/YYYY') {
        formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getFullYear()}`;
    } else {
        formattedDate = `${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getDate().toString().padStart(2, '0')}/${dateObj.getFullYear()}`;
    }

    let hours = dateObj.getHours();
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    const seconds = dateObj.getSeconds().toString().padStart(2, '0');
    let timeStr = '';

    // Format time based on user's preference.
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

// Formats a date string based on user preferences.
export const formatDate = (date: string | Date, user: User | null) => {
    // If the date comes in ISO UTC format from the backend, convert it to local
    const dateObj = typeof date === 'string' && DATE_REGEX.test(date)
        ? fromUTCtoLocal(date as ISODateString)
        : new Date(date);
    
    // Get user's date format preference.
    const dateFormat = user?.preferences.dateFormat || 'MM/DD/YYYY';
    
    let formattedDate = '';
    // Format date based on user's preference.
    if (dateFormat === 'DD/MM/YYYY') {
        formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getFullYear()}`;
    } else {
        formattedDate = `${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getDate().toString().padStart(2, '0')}/${dateObj.getFullYear()}`;
    }
    
    return formattedDate;
};