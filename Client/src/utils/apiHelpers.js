/**
 * API Call Helper with Error Handling
 * Centralized handling for API calls with loading, error, and success states
 */

export const API_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
};

/**
 * Execute async API call with proper state management
 * @param {Function} apiCall - Async API function to execute
 * @param {Function} onSuccess - Callback on success
 * @param {Function} onError - Callback on error
 * @param {Function} setLoading - State setter for loading
 * @returns {Promise}
 */
export const executeApiCall = async (
  apiCall,
  onSuccess,
  onError,
  setLoading = null
) => {
  try {
    if (setLoading) setLoading(true);
    
    const response = await apiCall();
    
    if (onSuccess) {
      onSuccess(response.data || response);
    }
    
    return { success: true, data: response.data || response };
  } catch (error) {
    const errorMessage = error?.message || error?.error || 'An error occurred. Please try again.';
    
    if (onError) {
      onError(errorMessage);
    }
    
    return { success: false, error: errorMessage };
  } finally {
    if (setLoading) setLoading(false);
  }
};

/**
 * Get user-friendly error message
 */
export const getErrorMessage = (error) => {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  if (error?.error) return error.error;
  if (error?.data?.message) return error.data.message;
  return 'An unexpected error occurred. Please try again later.';
};

/**
 * Format API error for UI display
 */
export const formatApiError = (error) => {
  if (!error) return 'Something went wrong';
  if (typeof error === 'string') return error;
  if (error.message) return error.message;
  if (error.error) return typeof error.error === 'string' ? error.error : error.error.message;
  return 'An unexpected error occurred';
};

/**
 * Handle network/connection errors
 */
export const isNetworkError = (error) => {
  return !error.response || error.code === 'ECONNABORTED';
};

/**
 * Retry async operation with exponential backoff
 */
export const retryAsync = async (asyncFn, maxRetries = 3, delayMs = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await asyncFn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delayMs * Math.pow(2, i)));
    }
  }
};
