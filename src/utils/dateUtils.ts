import type { ISODateString } from '../types/common.types';

export const DATE_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;

export const isValidISODate = (date: string): boolean => {
    return DATE_REGEX.test(date);
};

export const toISODate = (date: Date | string): ISODateString => {
    return new Date(date).toISOString();
};

export const getCurrentISODate = (): ISODateString => {
    return new Date().toISOString();
};

export const formatDate = (isoDate: ISODateString, format: 'DD/MM/YYYY' | 'MM/DD/YYYY'): string => {
    const date = new Date(isoDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return format === 'DD/MM/YYYY' 
        ? `${day}/${month}/${year}`
        : `${month}/${day}/${year}`;
};

export const formatTime = (isoDate: ISODateString, format: '12h' | '24h'): string => {
    const date = new Date(isoDate);
    if (format === '24h') {
        return date.toLocaleTimeString('en-US', { hour12: false });
    }
    return date.toLocaleTimeString('en-US', { hour12: true });
}; 