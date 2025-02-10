import { User } from '../types/models/user';

// Event name for changes in currency visibility
export const CURRENCY_VISIBILITY_EVENT = 'currencyVisibilityChanged';

// Function to determine if currency amounts should be obscured
export const isCurrencyHidden = (): boolean => {
    const value = localStorage.getItem('hideCurrency');
    return value === 'true';
};

// Function to toggle the visibility of currency and dispatch an event
export const toggleCurrencyVisibility = (): void => {
    const currentValue = isCurrencyHidden();
    const newValue = !currentValue;
    localStorage.setItem('hideCurrency', newValue.toString());
    
    // Dispatch a custom event for components to respond to
    window.dispatchEvent(new CustomEvent(CURRENCY_VISIBILITY_EVENT, {
        detail: { isHidden: newValue }
    }));
};

// Function to format a monetary amount according to the user's preferences
export const formatCurrency = (amount: number, user: User | null): string => {
    // Retrieve the user's preferred currency or default to 'USD'
    const currency = user?.preferences.currency || 'USD';
    // Determine the locale based on the currency (EUR uses 'es-ES', otherwise 'en-US')
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