import { Request, Response } from 'express';
import { User, Role, UserRole } from '../models';
import { ApiError } from '../middleware/errorHandler';

export class UserRoleController {
  /**
   * Asignar roles a un usuario
   */
  static async assignRolesToUser(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const { roleIds } = req.body;
      
      if (!Array.isArray(roleIds)) {
        throw ApiError.badRequest('roleIds debe ser un array');
      }
      
      // Verificar que el usuario exista
      const user = await User.findByPk(userId);
      if (!user) {
        throw ApiError.notFound(`Usuario con ID ${userId} no encontrado`);
      }
      
      // Verificar que todos los roles existan
      const roles = await Role.findAll({
        where: {
          id: roleIds
        }
      });
      
      if (roles.length !== roleIds.length) {
        throw ApiError.badRequest('Uno o más roles no existen');
      }
      
      // Eliminar asignaciones existentes
      await UserRole.destroy({
        where: {
          userId
        }
      });
      
      // Crear nuevas asignaciones
      const userRoles = roleIds.map(roleId => ({
        userId,
        roleId
      }));
      
      await UserRole.bulkCreate(userRoles);
      
      res.status(204).send();
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        console.error('Error assigning roles:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }
  
  /**
   * Obtener roles de un usuario
   */
  static async getUserRoles(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      
      // Verificar que el usuario exista
      const user = await User.findByPk(userId, {
        include: [{
          model: Role,
          as: 'roles',
          through: { attributes: [] } // No incluir atributos de la tabla de unión
        }]
      });
      
      if (!user) {
        throw ApiError.notFound(`Usuario con ID ${userId} no encontrado`);
      }
      
      res.json(user.get('roles'));
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        console.error('Error getting user roles:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }
}
