import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/UserService';
import { UserRepository } from '../repositories/UserRepository';
import { validateCreateUserDto, validateUpdateUserDto } from '../dto/UserDto';
import { ApiError } from '../middleware/errorHandler';

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

export class UserController {
  static async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  static async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);

      if (!user) {
        next(ApiError.notFound('User not found'));
        return;
      }

      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  static async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validation = validateCreateUserDto(req.body);
      if (!validation.isValid) {
        next(ApiError.badRequest(validation.errors.join(', ')));
        return;
      }

      const user = await userService.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof Error && error.message === 'Email already registered') {
        next(ApiError.conflict(error.message));
      } else {
        next(error);
      }
    }
  }

  static async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      
      const validation = validateUpdateUserDto(req.body);
      if (!validation.isValid) {
        next(ApiError.badRequest(validation.errors.join(', ')));
        return;
      }

      const user = await userService.updateUser(id, req.body);
      
      if (!user) {
        next(ApiError.notFound('User not found'));
        return;
      }

      res.json(user);
    } catch (error) {
      if (error instanceof Error && error.message === 'Email already registered') {
        next(ApiError.conflict(error.message));
      } else {
        next(error);
      }
    }
  }

  static async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await userService.deleteUser(id);

      if (!deleted) {
        next(ApiError.notFound('User not found'));
        return;
      }

      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  static async searchUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = req.query.query as string;
      
      if (!query) {
        next(ApiError.badRequest('Search term is required'));
        return;
      }

      const users = await userService.searchUsers(query);
      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  static async updateLastLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updated = await userService.updateLastLogin(id);

      if (!updated) {
        next(ApiError.notFound('User not found'));
        return;
      }

      res.json({ message: 'Last login date updated successfully' });
    } catch (error) {
      next(error);
    }
  }
}

export const getUsers = UserController.getUsers;
export const getUserById = UserController.getUserById;
export const createUser = UserController.createUser;
export const updateUser = UserController.updateUser;
export const deleteUser = UserController.deleteUser;
export const searchUsers = UserController.searchUsers;
export const updateLastLogin = UserController.updateLastLogin;
