/**
 * Date Utilities
 * 
 * Handles date conversions between local time and Supabase UTC formats.
 * The application follows these date handling principles:
 * 
 * Frontend:
 * - Works with dates in local time
 * - Sends dates to the backend in Supabase timestamp format
 * - Converts Supabase UTC timestamp received from backend to local time for display
 * 
 * Backend:
 * - Works exclusively with UTC in Supabase format
 * - Converts received local time to Supabase timestamp format for storage
 * - Returns Supabase UTC timestamp to the frontend
 * 
 * Note: Supabase stores dates in the format '2025-05-19 12:00:00+00' or '2025-04-10 14:24:25.809426+00'
 * 
 * @module DateUtils
 */

// Types
import type { User } from '../types/supabase/users';
import type { DateFormat, TimeFormat } from '../types/supabase/preferences';

// Constants
// Regex to validate Supabase timestamp format
export const SUPABASE_DATE_REGEX = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}(?:\.\d+)?\+00$/;
const DEFAULT_DATE_FORMAT: DateFormat = 'MM/DD/YYYY';
const DEFAULT_TIME_FORMAT: TimeFormat = '12h';

/**
 * Type definition for users with preference data included
 * 
 * @typedef {Object} UserWithPreferences - User object with optional preferences
 */
type UserWithPreferences = User & { 
    preferences?: { 
        dateFormat?: DateFormat; 
        timeFormat?: TimeFormat 
    } 
};

/**
 * Pads a number with leading zeros to ensure it has at least 2 digits
 * 
 * @param {number} num - The number to pad
 * @returns {string} Padded number as string (e.g., 1 -> "01")
 */
const padZero = (num: number): string => num.toString().padStart(2, '0');

/**
 * Gets the user's local timezone from browser settings
 * 
 * @returns {string} The local timezone identifier (e.g., "America/New_York")
 */
const getLocalTimeZone = (): string => Intl.DateTimeFormat().resolvedOptions().timeZone;

/**
 * Converts a date to Supabase timestamp format (UTC)
 * Used when sending dates to the backend
 * 
 * @param {Date} date - Date object to convert
 * @returns {string} String in Supabase timestamp format (YYYY-MM-DD HH:MM:SS+00)
 */
export const toSupabaseFormat = (date: Date): string => {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}+00`;
};

/**
 * Creates a Date object from a Supabase timestamp
 * 
 * @param {string} timestamp - Supabase timestamp string
 * @returns {Date} JavaScript Date object
 * @throws {Error} Implicitly throws if the timestamp cannot be parsed
 */
export const fromSupabaseTimestamp = (timestamp: string): Date => {
    return new Date(timestamp);
};

/**
 * Converts a date to local time string format
 * Used when displaying dates in a readable format
 * 
 * @param {string|Date} date - The input date, either a Supabase timestamp string or a Date object
 * @returns {string} The date as a formatted local time string
 */
export const toLocalString = (date: string | Date): string => {
    const dateObj = typeof date === 'string' ? fromSupabaseTimestamp(date) : date;
    return dateObj.toLocaleString('en-US', { timeZone: getLocalTimeZone() });
};

/**
 * Prepares a local date for sending to the backend
 * Converts to Supabase timestamp format
 * 
 * @param {Date} localDate - The local date to prepare
 * @returns {string} Supabase timestamp format string
 */
export const prepareForBackend = (localDate: Date): string => {
    return toSupabaseFormat(localDate);
};

/**
 * Converts a Supabase timestamp to a local date format for display in forms
 * Creates a string suitable for datetime-local input fields
 * 
 * @param {string} timestamp - The Supabase timestamp to convert
 * @returns {string} A string in the format YYYY-MM-DDTHH:mm:ss for use in datetime-local inputs
 */
export const supabaseToLocalString = (timestamp: string): string => {
    const localDate = fromSupabaseTimestamp(timestamp);
    
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
 * @returns {string} The current date as a formatted local string
 */
export const getCurrentDate = (): string => {
    return toLocalString(new Date());
};

/**
 * Returns the current date and time in Supabase timestamp format
 * 
 * @returns {string} The current date as a Supabase timestamp
 */
export const getCurrentSupabaseDate = (): string => {
    return toSupabaseFormat(new Date());
};

/**
 * Validates if a string is a valid Supabase timestamp format
 * 
 * @param {string} dateString - The string to validate
 * @returns {boolean} Boolean indicating if the string is a valid Supabase timestamp
 */
export const isValidSupabaseString = (dateString: string): boolean => {
    if (!dateString) return false;
    try {
        const date = new Date(dateString);
        return !isNaN(date.getTime()) && SUPABASE_DATE_REGEX.test(dateString);
    } catch {
        return false;
    }
};

/**
 * Gets a Date object from various input formats
 * 
 * @param {string|Date} date - Date input (either string or Date object)
 * @returns {Date} JavaScript Date object
 */
const getDateObject = (date: string | Date): Date => {
    if (typeof date === 'string') {
        return fromSupabaseTimestamp(date);
    }
    return date;
};

/**
 * Format date part based on user preference
 * 
 * @param {Date} dateObj - Date object to format
 * @param {DateFormat} format - User's preferred date format
 * @returns {string} Formatted date string (DD/MM/YYYY or MM/DD/YYYY)
 */
const formatDatePart = (dateObj: Date, format: DateFormat): string => {
    const day = padZero(dateObj.getDate());
    const month = padZero(dateObj.getMonth() + 1);
    const year = dateObj.getFullYear();
    
    return format === 'DD/MM/YYYY'
        ? `${day}/${month}/${year}`
        : `${month}/${day}/${year}`;
};

/**
 * Format time part based on user preference
 * 
 * @param {Date} dateObj - Date object to format
 * @param {TimeFormat} format - User's preferred time format (12h or 24h)
 * @returns {string} Formatted time string with appropriate hour notation
 */
const formatTimePart = (dateObj: Date, format: TimeFormat): string => {
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
 * 
 * @param {UserWithPreferences|null} user - User object with potential preferences
 * @returns {Object} Object containing resolved date and time format preferences
 */
const getUserPreferences = (user: UserWithPreferences | null) => {
    return {
        dateFormat: user?.preferences?.dateFormat || DEFAULT_DATE_FORMAT,
        timeFormat: user?.preferences?.timeFormat || DEFAULT_TIME_FORMAT
    };
};

/**
 * Formats a date string according to user preferences for both date and time
 * 
 * @param {string|Date} date - The date to format (string or Date object)
 * @param {UserWithPreferences|null} user - User object containing format preferences (or null for defaults)
 * @returns {string} Formatted date and time string according to user preferences
 */
export const formatDateTime = (date: string | Date, user: UserWithPreferences | null) => {
    const dateObj = getDateObject(date);
    const { dateFormat, timeFormat } = getUserPreferences(user);
    
    const formattedDate = formatDatePart(dateObj, dateFormat);
    const formattedTime = formatTimePart(dateObj, timeFormat);
    
    return `${formattedDate} ${formattedTime}`;
};

/**
 * Formats a date string according to user date format preference (without time)
 * 
 * @param {string|Date} date - The date to format (string or Date object)
 * @param {UserWithPreferences|null} user - User object containing format preferences (or null for defaults)
 * @returns {string} Formatted date string according to user preference
 */
export const formatDate = (date: string | Date, user: UserWithPreferences | null) => {
    const dateObj = getDateObject(date);
    const { dateFormat } = getUserPreferences(user);
    
    return formatDatePart(dateObj, dateFormat);
};