/**
 * Subscription Model
 * 
 * Contains type definitions for user subscriptions and billing.
 * 
 * @module SupabaseSubscriptions
 */

import { UUID, TrackingFields, ISODateString } from './common';

/**
 * Status of a subscription
 * Defines the possible states a subscription can be in
 * 
 * @typedef {string} SubscriptionStatus
 */
export type SubscriptionStatus = 'active' | 'canceled' | 'trialing' | 'past_due' | 'unpaid';

/**
 * Type for the type of plan a subscription is
 * 
 * @typedef {string} PlanType
 */
export type PlanType = 'monthly' | 'annual' | 'trial';

/**
 * Interface representing a user subscription.
 * Contains subscription data from Stripe and relates to a user.
 * 
 * @interface Subscription
 */
export interface Subscription extends TrackingFields {
  id: UUID;
  user_id: UUID;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  status: SubscriptionStatus;
  plan_type: PlanType;
  current_period_start: ISODateString | null;
  current_period_end: ISODateString | null;
  canceled_at: ISODateString | null;
}

/**
 * Type for a Supabase Database Subscription
 * Represents how the subscription record is stored in the database
 * 
 * @typedef {Subscription} DbSubscription
 */
export type DbSubscription = Subscription;

/**
 * Type for creating a new subscription
 * Omits auto-generated fields like ID and timestamps
 * 
 * @typedef {Omit<Subscription, 'id' | 'created_at' | 'updated_at'>} SubscriptionInsert
 */
export type SubscriptionInsert = Omit<Subscription, 'id' | 'created_at' | 'updated_at'>;

/**
 * Type for updating an existing subscription
 * Makes all fields optional except ID for identification
 * 
 * @typedef {Partial<Omit<Subscription, 'id'>> & { id: UUID }} SubscriptionUpdate
 */
export type SubscriptionUpdate = Partial<Omit<Subscription, 'id'>> & { id: UUID };
