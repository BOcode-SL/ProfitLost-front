/**
 * Custom Events Utility
 * 
 * Provides a lightweight event system for application-wide communication.
 * This module defines custom events that components can listen to
 * in order to react to global state changes without prop drilling
 * or complex state management.
 * 
 * @module Events
 */

/**
 * Event name for transaction update notifications
 * 
 * This event is fired whenever a transaction is created, updated, or deleted
 * to inform components that they should refresh their transaction-related data.
 * 
 * @constant {string}
 */
export const TRANSACTION_UPDATED_EVENT = 'transaction-updated';

/**
 * Dispatches the transaction updated event to notify components of changes
 * 
 * This function creates and dispatches a CustomEvent using the window
 * as the event bus. Components can listen for this event using:
 * window.addEventListener(TRANSACTION_UPDATED_EVENT, callback)
 * 
 * @example
 * // In a component that modifies transactions:
 * saveTransaction(data).then(() => {
 *   dispatchTransactionUpdated();
 * });
 * 
 * // In a component that needs to react to transaction changes:
 * useEffect(() => {
 *   const handleTransactionUpdate = () => {
 *     // Refresh data or update UI
 *   };
 *   window.addEventListener(TRANSACTION_UPDATED_EVENT, handleTransactionUpdate);
 *   return () => {
 *     window.removeEventListener(TRANSACTION_UPDATED_EVENT, handleTransactionUpdate);
 *   };
 * }, []);
 */
export const dispatchTransactionUpdated = () => {
  const event = new CustomEvent(TRANSACTION_UPDATED_EVENT);
  window.dispatchEvent(event);
}; 