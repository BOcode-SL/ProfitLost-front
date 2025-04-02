/**
 * Date Utilities
 * 
 * Handles date conversions between local time and UTC formats.
 * The application follows these date handling principles:
 * 
 * Frontend:
 * - Works with dates in local time
 * - Sends dates to the backend in local time ISO format
 * - Converts UTC ISO dates received from backend to local time for display
 * 
 * Backend:
 * - Works exclusively with UTC
 * - Converts received local time to UTC ISO for storage
 * - Returns UTC ISO dates to the frontend
 */

// Importing types for ISO date strings and user preferences
import type { ISODateString } from '../types/api/common';
import type { User } from '../types/models/user';

// Constants
export const DATE_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
const DEFAULT_DATE_FORMAT = 'MM/DD/YYYY';
const DEFAULT_TIME_FORMAT = '12h';

// Helper functions
const padZero = (num: number): string => num.toString().padStart(2, '0');
const getLocalTimeZone = (): string => Intl.DateTimeFormat().resolvedOptions().timeZone;

/**
 * Converts a date to local time string format
 * Used when displaying dates in a readable format
 * 
 * @param date - The input date, either a string or a Date object
 * @returns The date as a formatted local time string
 */
export const toLocalString = (date: string | Date): string => {
    const dateObj = new Date(date);
    return dateObj.toLocaleString('en-US', { timeZone: getLocalTimeZone() });
};

/**
 * Converts a UTC ISO string from the backend to a local Date object
 * JavaScript's Date constructor automatically handles this conversion
 * 
 * @param isoString - The UTC ISO string from the backend
 * @returns Date object in local time
 */
export const fromUTCtoLocal = (isoString: ISODateString): Date => {
    return new Date(isoString);
};

/**
 * Prepares a local date for sending to the backend
 * Converts to ISO string format while keeping the date in local time
 * The backend will handle UTC conversion for storage
 * 
 * @param localDate - The local date to prepare
 * @returns ISO format date string
 */
export const prepareForBackend = (localDate: Date): string => {
    // Example: 2023-10-03T16:01:05.000Z
    return localDate.toISOString();
};

/**
 * Converts a UTC date string to a local date format for display in forms
 * Creates a string suitable for datetime-local input fields
 * 
 * @param utcString - The UTC date string to convert
 * @returns A string in the format YYYY-MM-DDTHH:mm:ss for use in datetime-local inputs
 */
export const utcToLocalString = (utcString: ISODateString): string => {
    const localDate = fromUTCtoLocal(utcString);
    
    const year = localDate.getFullYear();
    const month = padZero(localDate.getMonth() + 1);
    const day = padZero(localDate.getDate());
    const hours = padZero(localDate.getHours());
    const minutes = padZero(localDate.getMinutes());
    const seconds = padZero(localDate.getSeconds());
    
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

/**
 * Returns the current date and time in local format
 * 
 * @returns The current date as a formatted local string
 */
export const getCurrentDate = (): string => {
    return toLocalString(new Date());
};

/**
 * Validates if a string is a valid ISO UTC date string
 * Uses regex to check proper format
 * 
 * @param dateString - The string to validate
 * @returns Boolean indicating if the string is a valid ISO date
 */
export const isValidISOString = (dateString: string): boolean => {
    return DATE_REGEX.test(dateString);
};

/**
 * Gets a Date object from various input formats
 */
const getDateObject = (date: string | Date): Date => {
    return typeof date === 'string' && DATE_REGEX.test(date)
        ? fromUTCtoLocal(date as ISODateString)
        : new Date(date);
};

/**
 * Format date part based on user preference
 */
const formatDatePart = (dateObj: Date, format: string): string => {
    const day = padZero(dateObj.getDate());
    const month = padZero(dateObj.getMonth() + 1);
    const year = dateObj.getFullYear();
    
    return format === 'DD/MM/YYYY'
        ? `${day}/${month}/${year}`
        : `${month}/${day}/${year}`;
};

/**
 * Format time part based on user preference
 */
const formatTimePart = (dateObj: Date, format: string): string => {
    let hours = dateObj.getHours();
    const minutes = padZero(dateObj.getMinutes());
    const seconds = padZero(dateObj.getSeconds());
    
    if (format === '12h') {
        const period = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
        return `${hours}:${minutes}:${seconds} ${period}`;
    } else {
        return `${padZero(hours)}:${minutes}:${seconds}`;
    }
};

/**
 * Get user preferences with defaults
 */
const getUserPreferences = (user: User | null) => {
    return {
        dateFormat: user?.preferences.dateFormat || DEFAULT_DATE_FORMAT,
        timeFormat: user?.preferences.timeFormat || DEFAULT_TIME_FORMAT
    };
};

/**
 * Formats a date string according to user preferences for both date and time
 * 
 * @param date - The date to format (string or Date object)
 * @param user - User object containing format preferences (or null for defaults)
 * @returns Formatted date and time string according to user preferences
 */
export const formatDateTime = (date: string | Date, user: User | null) => {
    const dateObj = getDateObject(date);
    const { dateFormat, timeFormat } = getUserPreferences(user);
    
    const formattedDate = formatDatePart(dateObj, dateFormat);
    const formattedTime = formatTimePart(dateObj, timeFormat);
    
    return `${formattedDate} ${formattedTime}`;
};

/**
 * Formats a date string according to user date format preference (without time)
 * 
 * @param date - The date to format (string or Date object)
 * @param user - User object containing format preferences (or null for defaults)
 * @returns Formatted date string according to user preference
 */
export const formatDate = (date: string | Date, user: User | null) => {
    const dateObj = getDateObject(date);
    const { dateFormat } = getUserPreferences(user);
    
    return formatDatePart(dateObj, dateFormat);
};