import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  console.error('Error:', err);
  
  const statusCode = err.statusCode || 500;
  
  const errorResponse: {
    message: string;
    status: number;
    timestamp: string;
    path: string;
    stack?: string;
  } = {
    message: err.message || 'Internal Server Error',
    status: statusCode,
    timestamp: new Date().toISOString(),
    path: req.path
  };
  
  if (process.env.NODE_ENV !== 'production') {
    errorResponse.stack = err.stack;
  }
  
  res.status(statusCode).json(errorResponse);
};

export class ApiError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
  
  static badRequest(message: string = 'Bad Request'): ApiError {
    return new ApiError(message, 400);
  }
  
  static unauthorized(message: string = 'Unauthorized'): ApiError {
    return new ApiError(message, 401);
  }
  
  static forbidden(message: string = 'Forbidden'): ApiError {
    return new ApiError(message, 403);
  }
  
  static notFound(message: string = 'Not Found'): ApiError {
    return new ApiError(message, 404);
  }
  
  static conflict(message: string = 'Conflict'): ApiError {
    return new ApiError(message, 409);
  }
  
  static internalServer(message: string = 'Internal Server Error'): ApiError {
    return new ApiError(message, 500);
  }
}
