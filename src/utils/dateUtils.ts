import type { ISODateString } from '../types/api/common';

export const toUTCString = (date: Date): ISODateString => {
    return date.toISOString();
};

export const fromUTCString = (isoString: ISODateString): Date => {
    return new Date(isoString);
};

export const getCurrentUTCDate = (): ISODateString => {
    return new Date().toISOString();
};

export const isValidISOString = (dateString: string): boolean => {
    const ISO_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
    return ISO_REGEX.test(dateString);
}; 