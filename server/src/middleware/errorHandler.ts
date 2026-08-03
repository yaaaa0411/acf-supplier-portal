import type { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const code = err.code || 'INTERNAL_ERROR';

  logger.error(`Error on request ${req.method} ${req.url}: ${message}`, {
    stack: err.stack,
    code,
    statusCode,
  });

  res.status(statusCode).json({
    error: code,
    message,
  });
}
