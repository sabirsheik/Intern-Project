const { sendError } = require('../utils/responseHandler');

/**
 * 404 Not Found Middleware
 */
const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Global Error Handler Middleware
 * This middleware MUST be the last middleware in the app
 */
const errorHandler = (err, req, res, next) => {
  // Determine HTTP status code
  let statusCode = res.statusCode || 500;
  
  // Ensure status code is not 200 for errors
  if (statusCode === 200) {
    statusCode = 500;
  }

  // Map common error types to proper status codes
  if (err.name === 'ValidationError') {
    statusCode = 400;
  } else if (err.name === 'SequelizeValidationError') {
    statusCode = 400;
  } else if (err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 409;
  } else if (err.name === 'UnauthorizedError' || err.message === 'Unauthorized') {
    statusCode = 401;
  } else if (err.name === 'ForbiddenError' || err.message === 'Forbidden') {
    statusCode = 403;
  } else if (err.name === 'CastError') {
    statusCode = 400;
  }

  // Log error for debugging (in production, use a proper logger)
  if (process.env.NODE_ENV !== 'production') {
    console.error('Error:', {
      statusCode,
      message: err.message,
      name: err.name,
      stack: err.stack
    });
  }

  // User-friendly messages for client
  let userMessage = err.message || 'Something went wrong';
  
  if (statusCode >= 500) {
    userMessage = 'Internal server error. Please try again later.';
  }

  // Send standardized error response
  sendError(res, userMessage, statusCode, err);
};

module.exports = { notFound, errorHandler };
