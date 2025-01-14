import type { ISODateString } from '../api/common';

export interface Goal {
    id: string;
    name: string;
    type: string;
    targetAmount: number;
    currentAmount: number;
    deadline?: ISODateString;
    history: GoalHistory[];
    createdAt: ISODateString;
    updatedAt: ISODateString;
}

export interface GoalHistory {
    date: ISODateString;
    amount: number;
} 