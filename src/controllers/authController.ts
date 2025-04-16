import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';
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

      // Find user by email
      const user = await User.findOne({ where: { email } });
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
          email: user.email,
          role: user.role
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Return user data and token
      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          lastLogin: user.lastLogin
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
        
        // Get user data
        const user = await User.findByPk(decoded.id, {
          attributes: { exclude: ['password'] }
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
}
