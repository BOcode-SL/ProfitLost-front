import { User } from '../types/models/user';

export const formatCurrency = (amount: number, user: User | null): string => {
    const currency = user?.preferences.currency || 'USD';
    const locale = currency === 'EUR' ? 'es-ES' : 'en-US';

    try {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    } catch {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    }
}; 