import type { ISODateString } from '../types/api/common';
import type { User } from '../types/models/user';

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

export const formatDateTime = (date: string, user: User | null) => {
    const dateObj = new Date(date);
    
    // Default formats if user preferences not set
    const dateFormat = user?.dateFormat || 'MM/DD/YYYY';
    const timeFormat = user?.timeFormat || '12h';

    // Format date based on user preference
    let formattedDate = '';
    if (dateFormat === 'DD/MM/YYYY') {
        formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getFullYear()}`;
    } else {
        formattedDate = `${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getDate().toString().padStart(2, '0')}/${dateObj.getFullYear()}`;
    }

    // Format time based on user preference
    let hours = dateObj.getHours();
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    let timeStr = '';

    if (timeFormat === '12h') {
        const period = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // Convert 0 to 12
        timeStr = `${hours}:${minutes} ${period}`;
    } else {
        timeStr = `${hours.toString().padStart(2, '0')}:${minutes}`;
    }

    return `${formattedDate} ${timeStr}`;
};