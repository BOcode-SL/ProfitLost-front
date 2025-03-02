export interface UserMetrics {
    totalUsers: number;
    activeUsers: {
        daily: number;
        weekly: number;
        monthly: number;
    };
    newUsers: {
        daily: number;
        weekly: number;
        monthly: number;
    };
    retention: {
        sevenDays: number;
        thirtyDays: number;
        ninetyDays: number;
    };
    comparison: {
        totalUsers: number;
        activeUsers: {
            daily: number;
            weekly: number;
            monthly: number;
        };
        newUsers: {
            daily: number;
            weekly: number;
            monthly: number;
        };
    };
}

export interface DeviceMetrics {
    desktop: number;
    mobile: number;
    tablet: number;
}

export interface TransactionMetrics {
    total: number;
    today: number;
    thisMonth: number;
    averagePerUser: number;
    comparison: {
        total: number;
        today: number;
        thisMonth: number;
        averagePerUser: number;
    };
}

export interface TransactionHistory {
    date: string;
    count: number;
}

export interface UserMetricsHistory {
    date: string;
    dailyActive: number;
    monthlyActive: number;
    isManualSave?: boolean;
}

export interface AnalyticsData {
    users: UserMetrics;
    devices: DeviceMetrics;
    transactions: TransactionMetrics;
}
