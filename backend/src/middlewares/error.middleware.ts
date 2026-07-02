import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Default values
  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';
  const message = err.message || 'Internal Server Error';

  // Log error for debugging
  console.error('Error:', {
    statusCode,
    message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
  });

  // Send response
  res.status(statusCode).json({
    success: false,
    status,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

// 404 Not Found handler
export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const error = new Error(`Route ${req.originalUrl} not found`) as AppError;
  error.statusCode = 404;
  next(error);
};