import type { AnalyticsData } from '../../../../../types/models/analytics';

export const mockAnalyticsData: AnalyticsData = {
    users: {
        totalUsers: 15234,
        activeUsers: {
            daily: 1250,
            weekly: 5430,
            monthly: 12350
        },
        newUsers: {
            daily: 45,
            weekly: 320,
            monthly: 1250
        },
        retention: {
            sevenDays: 85,
            thirtyDays: 72,
            ninetyDays: 65
        }
    },
    devices: {
        desktop: 45,
        mobile: 48,
        tablet: 7
    },
    transactions: {
        total: 4678,
        today: 234,
        averagePerUser: 12.5
    },
    engagement: {
        userRetention: 76,
        averageSessionDuration: 8.5
    }
};
