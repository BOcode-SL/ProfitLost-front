/**
 * Currency Utilities Module
 * 
 * Provides functionality for currency formatting and visibility management.
 * Handles user preferences for currency display across the application.
 */
import { User } from '../types/supabase/users';
import { Currency } from '../types/supabase/preferences';

/**
 * Custom event name for currency visibility changes
 * Used to notify components when currency display should be hidden/shown
 */
export const CURRENCY_VISIBILITY_EVENT = 'currencyVisibilityChanged';

/**
 * Checks if currency amounts should be hidden based on user preference
 * 
 * @returns Boolean indicating if currency should be hidden
 */
export const isCurrencyHidden = (): boolean => {
    const value = localStorage.getItem('hideCurrency');
    return value === 'true';
};

/**
 * Toggles the visibility of currency amounts throughout the application
 * Stores the preference in localStorage and dispatches an event to notify components
 */
export const toggleCurrencyVisibility = (): void => {
    const currentValue = isCurrencyHidden();
    const newValue = !currentValue;
    localStorage.setItem('hideCurrency', newValue.toString());

    // Dispatch a custom event to notify components of the visibility change
    window.dispatchEvent(new CustomEvent(CURRENCY_VISIBILITY_EVENT, {
        detail: { isHidden: newValue }
    }));
};

/**
 * Formats a monetary amount based on the user's preferred currency
 * Applies appropriate locale and currency symbol
 * 
 * @param amount - The numeric amount to format
 * @param user - The user object containing preferences (or null for defaults)
 * @returns Formatted currency string with appropriate symbol and decimal places
 */
export const formatCurrency = (amount: number, user: User & { preferences?: { currency?: string } } | null): string => {
    // Get the user's preferred currency from userPreferences or default to 'USD'
    const currency = user?.preferences?.currency || 'USD';

    // Map currencies to their appropriate locales for proper formatting
    const currencyLocaleMap: Record<Currency, string> = {
        'USD': 'en-US',
        'EUR': 'es-ES',
        'GBP': 'en-GB',
        'MXN': 'es-MX',
        'ARS': 'es-AR',
        'CLP': 'es-CL',
        'COP': 'es-CO',
        'PEN': 'es-PE',
        'UYU': 'es-UY',
        'PYG': 'es-PY',
        'BOB': 'es-BO',
        'VES': 'es-VE'
    };

    // Get the appropriate locale for the currency or default to 'en-US'
    const locale = currencyLocaleMap[currency as Currency] || 'en-US';

    try {
        // Format the amount using Intl.NumberFormat with currency style options
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    } catch {
        // If an error occurs, format the amount as USD by default
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    }
};

/**
 * Formats large numbers into a more readable format with abbreviations
 * Converts numbers to k (thousands), M (millions), or B (billions) notation
 * 
 * @param value - The numeric value to format
 * @returns Formatted string with appropriate abbreviation (e.g., 1.5k, 2.3M, 4B)
 */
export const formatLargeNumber = (value: number): string => {
    if (value >= 1000000000) {
        const billions = value / 1000000000;
        return `${billions % 1 === 0 ? billions.toFixed(0) : billions.toFixed(1)}B`;
    }
    if (value >= 1000000) {
        const millions = value / 1000000;
        return `${millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1)}M`;
    }
    if (value >= 1000) {
        const thousands = value / 1000;
        return `${thousands % 1 === 0 ? thousands.toFixed(0) : thousands.toFixed(1)}k`;
    }
    return value.toString();
};