/**
 * Standard API Response Handler
 * Provides consistent response structure across all endpoints
 */

const sendSuccess = (res, data, message = 'Request successful', statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    error: null
  });
};

const sendError = (res, message, statusCode = 500, error = null) => {
  res.status(statusCode).json({
    success: false,
    message,
    data: null,
    error: process.env.NODE_ENV === 'production' ? null : error
  });
};

module.exports = { sendSuccess, sendError };
