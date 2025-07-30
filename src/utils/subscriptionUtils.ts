/**
 * Utility functions for subscription management and validation
 */

import type {
  Subscription,
  SubscriptionStatus,
} from "../types/supabase/subscriptions";

export type PlanType = "monthly" | "annual" | "trial";

/**
 * Determines plan type based on Stripe interval and trial status
 *
 * @param interval - Stripe recurring interval (e.g., 'month', 'year', 'monthly', 'yearly')
 * @param hasTrial - Whether the subscription has an active trial
 * @returns {PlanType} The determined plan type
 */
export function determinePlanType(
  interval: string,
  hasTrial: boolean = false
): PlanType {
  // If there's an active trial, it's always 'trial'
  if (hasTrial) {
    return "trial";
  }

  const normalizedInterval = interval.toLowerCase().trim();

  // Exact matches
  if (normalizedInterval === "month" || normalizedInterval === "monthly") {
    return "monthly";
  }
  if (
    normalizedInterval === "year" ||
    normalizedInterval === "yearly" ||
    normalizedInterval === "annual"
  ) {
    return "annual";
  }

  // Partial matches
  if (normalizedInterval.includes("month")) {
    return "monthly";
  }
  if (
    normalizedInterval.includes("year") ||
    normalizedInterval.includes("annual")
  ) {
    return "annual";
  }

  // Default fallback
  console.warn(
    `Unknown interval format: "${interval}". Defaulting to monthly.`
  );
  return "monthly";
}

/**
 * Validates if a plan type is valid
 *
 * @param planType - The plan type to validate
 * @returns {boolean} True if valid, false otherwise
 */
export function isValidPlanType(planType: string): planType is PlanType {
  return ["monthly", "annual", "trial"].includes(planType);
}

/**
 * Checks if the user has an active subscription or trial
 *
 * @param subscription - The user's subscription object
 * @returns {boolean} True if user has active subscription or trial, false otherwise
 */
export function hasActiveSubscription(
  subscription: Subscription | null
): boolean {
  if (!subscription) {
    return false;
  }

  // Check if subscription is in trial period
  if (subscription.status === "trialing") {
    if (subscription.trial_end) {
      const trialEnd = new Date(subscription.trial_end);
      const now = new Date();
      return trialEnd > now; // Trial is still active
    }
    return false; // No trial end date, consider inactive
  }

  // Check if subscription is active
  if (subscription.status === "active") {
    if (subscription.current_period_end) {
      const periodEnd = new Date(subscription.current_period_end);
      const now = new Date();
      return periodEnd > now; // Subscription period is still active
    }
    return false; // No period end date, consider inactive
  }

  // All other statuses (canceled, past_due, unpaid) are considered inactive
  return false;
}
