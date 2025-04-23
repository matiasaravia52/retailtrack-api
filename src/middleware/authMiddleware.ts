import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from './errorHandler';

const JWT_SECRET = process.env.JWT_SECRET || 'retailtrack-secret-key';

// Extender la interfaz Request para incluir el usuario
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

/**
 * Middleware de autenticación
 * Verifica que el token JWT sea válido y añade el usuario a la request
 */
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Obtener el token del header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw ApiError.unauthorized('No token provided');
    }

    // Verificar que el token tenga el formato correcto
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw ApiError.unauthorized('Token error');
    }

    const token = parts[1];

    // Verificar y decodificar el token
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      throw ApiError.unauthorized('Invalid token');
    }
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      console.error('Auth middleware error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

export { authMiddleware };
export default authMiddleware;
