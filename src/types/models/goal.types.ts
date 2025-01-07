export interface Goal {
    id: string;
    name: string;
    type: string;
    targetAmount: number;
    currentAmount: number;
    deadline?: string;
    history: GoalHistory[];
}

export interface GoalHistory {
    date: string;
    amount: number;
} 