/**
 * Analytics Models Module
 * 
 * Contains type definitions for analytics data structures used for reporting and metrics.
 */

/**
 * User-related metrics for analytics
 * Tracks user acquisition and engagement
 */
export interface UserMetrics {
    totalUsers: number;          // Total registered users
    activeUsers: {
        daily: number;           // Active users in the last day
        weekly: number;          // Active users in the last week
        monthly: number;         // Active users in the last month
    };
    newUsers: {
        daily: number;           // New user registrations in the last day
        weekly: number;          // New user registrations in the last week
        monthly: number;         // New user registrations in the last month
    };
}

/**
 * Device usage metrics
 * Tracks platform distribution among users
 */
export interface DeviceMetrics {
    desktop: number;             // Desktop users (percentage)
    mobile: number;              // Mobile users (percentage)
    tablet: number;              // Tablet users (percentage)
}

/**
 * Transaction-related metrics for analytics
 * Tracks transaction volume and comparative statistics
 */
export interface TransactionMetrics {
    total: number;               // Total number of transactions
    today: number;               // Transactions created today
    thisMonth: number;           // Transactions created this month
    averagePerUser: number;      // Average transactions per user
    comparison: {
        total: number;           // Percentage change in total transactions
        today: number;           // Percentage change in daily transactions
        thisMonth: number;       // Percentage change in monthly transactions
        averagePerUser: number;  // Percentage change in average per user
    };
}

/**
 * Historical transaction data point
 * Used for time-series visualizations
 */
export interface TransactionHistory {
    date: string;                // Date in YYYY-MM-DD format 
    count: number;               // Number of transactions on this date
}

/**
 * Complete analytics dashboard data
 * Combines all metrics into a single structure
 */
export interface AnalyticsData {
    users: UserMetrics;
    devices: DeviceMetrics;
    transactions: TransactionMetrics;
}
