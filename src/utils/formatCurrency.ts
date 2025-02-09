import { User } from '../types/models/user';

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
        // In case of an error, format the amount as USD by default
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    }
}; 