import { Request, Response } from 'express';
import { RoleService } from '../services/RoleService';
import { ApiError } from '../middleware/errorHandler';

export class RoleController {
  /**
   * Obtener todos los roles
   */
  static async getAllRoles(req: Request, res: Response): Promise<void> {
    try {
      const roles = await RoleService.getAllRoles();
      res.json(roles);
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        console.error('Error getting roles:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  /**
   * Obtener un rol por su ID
   */
  static async getRoleById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const role = await RoleService.getRoleById(id);
      res.json(role);
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        console.error('Error getting role:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  /**
   * Crear un nuevo rol
   */
  static async createRole(req: Request, res: Response): Promise<void> {
    try {
      const { name, description } = req.body;
      
      if (!name) {
        throw ApiError.badRequest('El nombre del rol es requerido');
      }
      
      const role = await RoleService.createRole({ name, description });
      res.status(201).json(role);
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        console.error('Error creating role:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  /**
   * Actualizar un rol existente
   */
  static async updateRole(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
      
      const role = await RoleService.updateRole(id, { name, description });
      res.json(role);
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        console.error('Error updating role:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  /**
   * Eliminar un rol
   */
  static async deleteRole(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await RoleService.deleteRole(id);
      res.status(204).send();
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        console.error('Error deleting role:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  /**
   * Asignar permisos a un rol
   */
  static async assignPermissionsToRole(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { permissionIds } = req.body;
      
      if (!Array.isArray(permissionIds)) {
        throw ApiError.badRequest('permissionIds debe ser un array');
      }
      
      await RoleService.assignPermissionsToRole(id, permissionIds);
      res.status(204).send();
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        console.error('Error assigning permissions:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  /**
   * Obtener permisos de un rol
   */
  static async getRolePermissions(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const permissions = await RoleService.getRolePermissions(id);
      res.json(permissions);
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        console.error('Error getting role permissions:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }
}
