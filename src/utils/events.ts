/**
 * Custom events for application-wide communication
 * 
 * This file defines custom events that components can listen to
 * in order to react to global state changes without prop drilling
 * or complex state management.
 */

// Event fired when a transaction is created, updated, or deleted
export const TRANSACTION_UPDATED_EVENT = 'transaction-updated';

// Function to dispatch the transaction updated event
export const dispatchTransactionUpdated = () => {
  const event = new CustomEvent(TRANSACTION_UPDATED_EVENT);
  window.dispatchEvent(event);
}; 