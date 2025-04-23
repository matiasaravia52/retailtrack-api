import { Request, Response } from 'express';
import { PermissionService } from '../services/PermissionService';
import { ApiError } from '../middleware/errorHandler';

export class PermissionController {
  /**
   * Obtener todos los permisos
   */
  static async getAllPermissions(req: Request, res: Response): Promise<void> {
    try {
      const permissions = await PermissionService.getAllPermissions();
      res.json(permissions);
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        console.error('Error getting permissions:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  /**
   * Obtener un permiso por su ID
   */
  static async getPermissionById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const permission = await PermissionService.getPermissionById(id);
      res.json(permission);
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        console.error('Error getting permission:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  /**
   * Crear un nuevo permiso
   */
  static async createPermission(req: Request, res: Response): Promise<void> {
    try {
      const { name, description } = req.body;
      
      if (!name) {
        throw ApiError.badRequest('El nombre del permiso es requerido');
      }
      
      const permission = await PermissionService.createPermission({ name, description });
      res.status(201).json(permission);
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        console.error('Error creating permission:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  /**
   * Actualizar un permiso existente
   */
  static async updatePermission(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
      
      const permission = await PermissionService.updatePermission(id, { name, description });
      res.json(permission);
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        console.error('Error updating permission:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  /**
   * Eliminar un permiso
   */
  static async deletePermission(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await PermissionService.deletePermission(id);
      res.status(204).send();
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        console.error('Error deleting permission:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }
}
