/**
 * notFound - 404 handler for unmatched routes.
 * Creates an error and passes it to the error handler.
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found — ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * errorHandler - Centralized error response handler.
 * Returns structured JSON error responses.
 * Hides stack traces in production for security.
 */
const errorHandler = (err, req, res, next) => {
  // Default to 500 if status code is still 200 (unset)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};

module.exports = { notFound, errorHandler };
