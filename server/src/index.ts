import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { requestLogger } from './middleware/requestLogger.js';
import { errorHandler } from './middleware/errorHandler.js';
import ggrcRoutes from './routes/ggrc.routes.js';
import { logger } from './utils/logger.js';

const app = express();

// Configure CORS
app.use(cors({
  origin: env.CORS_ORIGIN,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Request body parser
app.use(express.json());

// Request logger middleware
app.use(requestLogger);

// Mount routes
app.use('/api', ggrcRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'NOT_FOUND', message: 'Resource not found' });
});

// Global error handler
app.use(errorHandler);

// Start server
app.listen(env.PORT, () => {
  logger.info(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
  logger.info(`Allowing CORS origins: ${env.CORS_ORIGIN}`);
});
