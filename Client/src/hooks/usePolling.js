import { useEffect, useRef } from 'react';

/**
 * Custom hook for polling API data at regular intervals
 * @param {Function} apiCall - Async API function to call
 * @param {number} interval - Polling interval in milliseconds (default: 30000ms = 30s)
 * @param {boolean} enabled - Whether polling is enabled (default: true)
 * @param {Function} onSuccess - Callback on success
 * @param {Function} onError - Callback on error
 * @returns {Object} { isPolling, startPolling, stopPolling, lastUpdate }
 */
export const usePolling = (
  apiCall,
  interval = 30000,
  enabled = true,
  onSuccess = null,
  onError = null
) => {
  const intervalRef = useRef(null);
  const isPollingRef = useRef(enabled);

  useEffect(() => {
    if (!enabled || !apiCall) return;

    // Immediate first call
    const executePolling = async () => {
      try {
        const result = await apiCall();
        if (onSuccess) onSuccess(result);
      } catch (error) {
        if (onError) onError(error);
      }
    };

    executePolling();

    // Set up interval for subsequent calls
    intervalRef.current = setInterval(executePolling, interval);
    isPollingRef.current = true;

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      isPollingRef.current = false;
    };
  }, [apiCall, interval, enabled, onSuccess, onError]);

  const startPolling = () => {
    if (!isPollingRef.current) {
      isPollingRef.current = true;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      intervalRef.current = setInterval(apiCall, interval);
    }
  };

  const stopPolling = () => {
    isPollingRef.current = false;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  return {
    isPolling: isPollingRef.current,
    startPolling,
    stopPolling
  };
};

/**
 * Custom hook for debounced updates (prevents excessive API calls)
 * @param {Function} apiCall - Async API function
 * @param {number} debounceMs - Debounce delay in milliseconds
 * @returns {Function} Debounced function
 */
export const useDebouncedApiCall = (apiCall, debounceMs = 1000) => {
  const timeoutRef = useRef(null);

  const debounced = (...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      apiCall(...args);
    }, debounceMs);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debounced;
};
