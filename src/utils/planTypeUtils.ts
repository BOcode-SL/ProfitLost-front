/**
 * Utility functions for plan type detection and validation
 */

export type PlanType = 'monthly' | 'annual' | 'trial';

/**
 * Determines plan type based on Stripe interval and trial status
 * 
 * @param interval - Stripe recurring interval (e.g., 'month', 'year', 'monthly', 'yearly')
 * @param hasTrial - Whether the subscription has an active trial
 * @returns {PlanType} The determined plan type
 */
export function determinePlanType(interval: string, hasTrial: boolean = false): PlanType {
    // If there's an active trial, it's always 'trial'
    if (hasTrial) {
        return 'trial';
    }

    const normalizedInterval = interval.toLowerCase().trim();

    // Exact matches
    if (normalizedInterval === 'month' || normalizedInterval === 'monthly') {
        return 'monthly';
    }
    if (normalizedInterval === 'year' || normalizedInterval === 'yearly' || normalizedInterval === 'annual') {
        return 'annual';
    }

    // Partial matches
    if (normalizedInterval.includes('month')) {
        return 'monthly';
    }
    if (normalizedInterval.includes('year') || normalizedInterval.includes('annual')) {
        return 'annual';
    }

    // Default fallback
    console.warn(`Unknown interval format: "${interval}". Defaulting to monthly.`);
    return 'monthly';
}

/**
 * Validates if a plan type is valid
 * 
 * @param planType - The plan type to validate
 * @returns {boolean} True if valid, false otherwise
 */
export function isValidPlanType(planType: string): planType is PlanType {
    return ['monthly', 'annual', 'trial'].includes(planType);
} 