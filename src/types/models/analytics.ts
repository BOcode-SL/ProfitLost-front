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
}

export interface DeviceMetrics {
    desktop: number;
    mobile: number;
    tablet: number;
}

export interface TransactionMetrics {
    total: number;
    today: number;
    averagePerUser: number;
}

export interface EngagementMetrics {
    userRetention: number;
    averageSessionDuration: number;
}

export interface AnalyticsData {
    users: UserMetrics;
    devices: DeviceMetrics;
    transactions: TransactionMetrics;
    engagement: EngagementMetrics;
}
