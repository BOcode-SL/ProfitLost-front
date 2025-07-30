/**
 * Utility functions for subscription management and validation
 */

import type { Subscription, PlanType } from "../types/supabase/subscriptions";

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
    if (subscription.current_period_end) {
      const trialEnd = new Date(subscription.current_period_end);
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

/**
 * Returns true if the user's trial period has ended.
 * @param subscription - The user's subscription object
 * @returns {boolean}
 */
export function isTrialEnded(subscription: Subscription | null): boolean {
  if (!subscription) return false;
  if (subscription.status === "trialing" && subscription.current_period_end) {
    const now = new Date();
    const trialEnd = new Date(subscription.current_period_end);
    return trialEnd <= now;
  }
  return false;
}