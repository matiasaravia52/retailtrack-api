import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, Role, Permission } from '../models';
import { ApiError } from '../middleware/errorHandler';

const JWT_SECRET = process.env.JWT_SECRET || 'retailtrack-secret-key';

export class AuthController {
  /**
   * Login user and return JWT token
   */
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        throw ApiError.badRequest('Email and password are required');
      }

      // Find user by email with roles
      const user = await User.findOne({ 
        where: { email },
        include: [{
          model: Role,
          as: 'roles',
          through: { attributes: [] }
        }]
      });
      if (!user) {
        throw ApiError.unauthorized('Invalid credentials');
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw ApiError.unauthorized('Invalid credentials');
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate JWT token
      const token = jwt.sign(
        { 
          id: user.id,
          email: user.email
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Obtener los roles del usuario
      const roles = user.get('roles') || [];
      
      // Return user data and token
      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          lastLogin: user.lastLogin,
          roles: roles
        }
      });
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  /**
   * Validate token and return user data
   */
  static async validateToken(req: Request, res: Response): Promise<void> {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        throw ApiError.unauthorized('No token provided');
      }

      try {
        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
        
        // Get user data with roles
        const user = await User.findByPk(decoded.id, {
          attributes: { exclude: ['password'] },
          include: [{
            model: Role,
            as: 'roles',
            through: { attributes: [] }
          }]
        });
        
        if (!user) {
          throw ApiError.unauthorized('Invalid token');
        }

        res.json({ user });
      } catch (err) {
        throw ApiError.unauthorized('Invalid token');
      }
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        console.error('Token validation error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  /**
   * Obtener los permisos del usuario autenticado
   */
  static async getUserPermissions(req: Request, res: Response): Promise<void> {
    try {
      // Obtener el ID del usuario del token
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        throw ApiError.unauthorized('No token provided');
      }
      
      try {
        // Verificar token
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
        
        // Obtener usuario con sus roles
        const user = await User.findByPk(decoded.id, {
          include: [{
            model: Role,
            as: 'roles',
            include: [{
              model: Permission,
              as: 'permissions',
              through: { attributes: [] }
            }]
          }]
        });
        
        if (!user) {
          throw ApiError.unauthorized('Invalid token');
        }
        
        // Extraer permisos únicos de todos los roles
        const roles = user.get('roles') as any[];
        const allPermissions: Set<any> = new Set();
        
        roles.forEach(role => {
          const permissions = role.permissions || [];
          permissions.forEach((permission: any) => {
            allPermissions.add(JSON.stringify({
              id: permission.id,
              name: permission.name,
              description: permission.description
            }));
          });
        });
        
        // Convertir Set a Array
        const uniquePermissions = Array.from(allPermissions).map(p => JSON.parse(p));
        
        res.json(uniquePermissions);
      } catch (err) {
        throw ApiError.unauthorized('Invalid token');
      }
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        console.error('Error getting user permissions:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }
}
