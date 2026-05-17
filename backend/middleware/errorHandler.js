// ── Global error handler ──────────────────────────────────────────────────────
const errorHandler = (err, req, res, next) => {
      let statusCode = err.statusCode || 500;
      let message = err.message || 'Internal Server Error';

      if (process.env.NODE_ENV === 'development') {
            console.error(`\n❌ [${req.method}] ${req.originalUrl}`);
            console.error(`   ${err.name}: ${err.message}`);
            if (err.stack) console.error(err.stack.split('\n').slice(1, 4).join('\n'));
      }

      // Mongoose: bad ObjectId
      if (err.name === 'CastError') {
            statusCode = 404;
            message = `Resource not found (invalid ID: ${err.value})`;
      }

      // Mongoose: duplicate key
      if (err.code === 11000) {
            statusCode = 400;
            const field = Object.keys(err.keyValue || {})[0] || 'field';
            const value = err.keyValue?.[field];
            message = `${field.charAt(0).toUpperCase() + field.slice(1)} "${value}" already exists`;
      }

      // Mongoose: validation errors
      if (err.name === 'ValidationError') {
            statusCode = 400;
            message = Object.values(err.errors).map(e => e.message).join('. ');
      }

      // JWT errors
      if (err.name === 'JsonWebTokenError') { statusCode = 401; message = 'Invalid token. Please log in again.'; }
      if (err.name === 'TokenExpiredError') { statusCode = 401; message = 'Token expired. Please log in again.'; }

      // Multer errors
      if (err.code === 'LIMIT_FILE_SIZE') { statusCode = 400; message = 'File too large. Maximum size allowed is 5MB.'; }
      if (err.code === 'LIMIT_FILE_COUNT') { statusCode = 400; message = 'Too many files uploaded.'; }
      if (err.code === 'LIMIT_UNEXPECTED_FILE') { statusCode = 400; message = `Unexpected field: ${err.field}`; }

      res.status(statusCode).json({
            success: false,
            message,
            ...(process.env.NODE_ENV === 'development' && {
                  error: err.name,
                  stack: err.stack?.split('\n').slice(0, 5),
            }),
      });
};

export default errorHandler;
