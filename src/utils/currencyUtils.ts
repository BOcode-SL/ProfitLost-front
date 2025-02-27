import { User } from '../types/models/user';

// Event name for changes in currency visibility
export const CURRENCY_VISIBILITY_EVENT = 'currencyVisibilityChanged';

// Function to check if currency amounts should be hidden
export const isCurrencyHidden = (): boolean => {
    const value = localStorage.getItem('hideCurrency');
    return value === 'true';
};

// Function to toggle the visibility of currency and trigger an event
export const toggleCurrencyVisibility = (): void => {
    const currentValue = isCurrencyHidden();
    const newValue = !currentValue;
    localStorage.setItem('hideCurrency', newValue.toString());
    
    // Dispatch a custom event to notify components of the visibility change
    window.dispatchEvent(new CustomEvent(CURRENCY_VISIBILITY_EVENT, {
        detail: { isHidden: newValue }
    }));
};

// Function to format a monetary amount based on the user's preferences
export const formatCurrency = (amount: number, user: User | null): string => {
    // Get the user's preferred currency or default to 'USD'
    const currency = user?.preferences.currency || 'USD';
    // Set the locale based on the currency (EUR uses 'es-ES', otherwise 'en-US')
    const locale = currency === 'EUR' ? 'es-ES' : 'en-US';

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

// Function to format large numbers into a more readable format
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