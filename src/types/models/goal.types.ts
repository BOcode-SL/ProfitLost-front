import type { ISODateString } from '../common.types';

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