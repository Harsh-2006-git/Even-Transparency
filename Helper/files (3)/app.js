const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');

const { apiLimiter } = require('./middleware/rateLimiter');
const { sendError } = require('./utils/response');
const logger = require('./utils/logger');

const app = express();

// ─── Security headers ──────────────────────────────────────
app.use(helmet());

// ─── CORS ─────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-request-id'],
}));

// ─── Body parsing ─────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ─── Sanitize MongoDB query injection ─────────────────────
app.use(mongoSanitize());

// ─── HTTP parameter pollution protection ──────────────────
app.use(hpp());

// ─── Compression ──────────────────────────────────────────
app.use(compression());

// ─── HTTP request logging ─────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined', {
    stream: { write: (msg) => logger.http(msg.trim()) },
    skip: (req) => req.url === '/api/health',
  }));
}

// ─── Global rate limit ────────────────────────────────────
app.use('/api/', apiLimiter);

// ─── Health check ─────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Even Cargo Apprenticeship Portal API',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ─── Routes ───────────────────────────────────────────────
app.use('/api/auth', require('./routes/authRoutes'));
// Additional routes will be mounted here as modules are built:
// app.use('/api/candidates', require('./routes/candidateRoutes'));
// app.use('/api/employers', require('./routes/employerRoutes'));
// app.use('/api/jobs', require('./routes/jobRoutes'));
// app.use('/api/contracts', require('./routes/contractRoutes'));
// app.use('/api/admin', require('./routes/adminRoutes'));

// ─── 404 handler ──────────────────────────────────────────
app.use((req, res) => {
  return sendError(res, {
    statusCode: 404,
    message: `Route ${req.method} ${req.originalUrl} not found.`,
  });
});

// ─── Global error handler ─────────────────────────────────
app.use((err, req, res, next) => {
  logger.error(`Unhandled error: ${err.message}\n${err.stack}`);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return sendError(res, { statusCode: 400, message: 'Validation failed', errors });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return sendError(res, {
      statusCode: 409,
      message: `${field} already exists.`,
    });
  }

  // JWT errors (should be caught in middleware but belt-and-braces)
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, { statusCode: 401, message: 'Invalid token.' });
  }

  if (err.name === 'TokenExpiredError') {
    return sendError(res, { statusCode: 401, message: 'Session expired.' });
  }

  return sendError(res, {
    statusCode: err.statusCode || 500,
    message: process.env.NODE_ENV === 'production' ? 'Internal server error.' : err.message,
  });
});

module.exports = app;
