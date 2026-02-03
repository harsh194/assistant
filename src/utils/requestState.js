/**
 * Request state constants and utilities for tracking AI request lifecycle
 */

export const RequestState = {
  IDLE: 'idle',
  SENDING: 'sending',
  THINKING: 'thinking',
  STREAMING: 'streaming',
  DONE: 'done',
  ERROR: 'error',
  CANCELLED: 'cancelled',
  VALIDATING_KEY: 'validating_key'
};

/**
 * Get human-readable status text for a given state
 * @param {string} state - The current request state
 * @param {number} elapsedTime - Elapsed time in milliseconds (optional)
 * @returns {string} Status text to display
 */
export function getStatusText(state, elapsedTime = 0) {
  const elapsedSeconds = Math.floor(elapsedTime / 1000);
  const timeStr = elapsedSeconds > 0 ? ` (${elapsedSeconds}s)` : '';

  switch (state) {
    case RequestState.IDLE:
      return '';
    case RequestState.VALIDATING_KEY:
      return 'Validating API key...';
    case RequestState.SENDING:
      return `Sending...${timeStr}`;
    case RequestState.THINKING:
      return `Thinking...${timeStr}`;
    case RequestState.STREAMING:
      return 'Receiving response...';
    case RequestState.DONE:
      return '';
    case RequestState.ERROR:
      return 'Error occurred';
    case RequestState.CANCELLED:
      return 'Cancelled';
    default:
      return '';
  }
}

/**
 * Check if a state is considered "in progress"
 * @param {string} state - The current request state
 * @returns {boolean}
 */
export function isRequestInProgress(state) {
  return [
    RequestState.SENDING,
    RequestState.THINKING,
    RequestState.STREAMING,
    RequestState.VALIDATING_KEY
  ].includes(state);
}
