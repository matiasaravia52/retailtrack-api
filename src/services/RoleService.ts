import { Role, Permission, RolePermission } from '../models';
import { CreateRoleDto, UpdateRoleDto, RoleDto, RoleWithPermissionsDto } from '../dto/RoleDto';
import { ApiError } from '../middleware/errorHandler';

export class RoleService {
  /**
   * Obtener todos los roles
   */
  static async getAllRoles(): Promise<RoleDto[]> {
    const roles = await Role.findAll();
    return roles.map(role => ({
      id: role.id,
      name: role.name,
      description: role.description,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt
    }));
  }

  /**
   * Obtener un rol por su ID
   */
  static async getRoleById(id: string): Promise<RoleWithPermissionsDto> {
    const role = await Role.findByPk(id, {
      include: [{
        model: Permission,
        as: 'permissions',
        through: { attributes: [] } // No incluir atributos de la tabla de unión
      }]
    });

    if (!role) {
      throw ApiError.notFound(`Rol con ID ${id} no encontrado`);
    }

    return {
      id: role.id,
      name: role.name,
      description: role.description,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
      permissions: role.get('permissions') as any[]
    };
  }

  /**
   * Crear un nuevo rol
   */
  static async createRole(roleData: CreateRoleDto): Promise<RoleDto> {
    // Verificar si ya existe un rol con el mismo nombre
    const existingRole = await Role.findOne({ where: { name: roleData.name } });
    if (existingRole) {
      throw ApiError.badRequest(`Ya existe un rol con el nombre ${roleData.name}`);
    }

    const role = await Role.create(roleData);
    
    return {
      id: role.id,
      name: role.name,
      description: role.description,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt
    };
  }

  /**
   * Actualizar un rol existente
   */
  static async updateRole(id: string, roleData: UpdateRoleDto): Promise<RoleDto> {
    const role = await Role.findByPk(id);
    
    if (!role) {
      throw ApiError.notFound(`Rol con ID ${id} no encontrado`);
    }

    // Verificar si el nuevo nombre ya está en uso por otro rol
    if (roleData.name && roleData.name !== role.name) {
      const existingRole = await Role.findOne({ where: { name: roleData.name } });
      if (existingRole && existingRole.id !== id) {
        throw ApiError.badRequest(`Ya existe un rol con el nombre ${roleData.name}`);
      }
    }

    await role.update(roleData);
    
    return {
      id: role.id,
      name: role.name,
      description: role.description,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt
    };
  }

  /**
   * Eliminar un rol
   */
  static async deleteRole(id: string): Promise<void> {
    const role = await Role.findByPk(id);
    
    if (!role) {
      throw ApiError.notFound(`Rol con ID ${id} no encontrado`);
    }

    await role.destroy();
  }

  /**
   * Asignar permisos a un rol
   */
  static async assignPermissionsToRole(roleId: string, permissionIds: string[]): Promise<void> {
    const role = await Role.findByPk(roleId);
    
    if (!role) {
      throw ApiError.notFound(`Rol con ID ${roleId} no encontrado`);
    }

    // Verificar que todos los permisos existan
    const permissions = await Permission.findAll({
      where: {
        id: permissionIds
      }
    });

    if (permissions.length !== permissionIds.length) {
      throw ApiError.badRequest('Uno o más permisos no existen');
    }

    // Eliminar asignaciones existentes
    await RolePermission.destroy({
      where: {
        roleId
      }
    });

    // Crear nuevas asignaciones
    const rolePermissions = permissionIds.map(permissionId => ({
      roleId,
      permissionId
    }));

    await RolePermission.bulkCreate(rolePermissions);
  }

  /**
   * Obtener permisos de un rol
   */
  static async getRolePermissions(roleId: string): Promise<any[]> {
    const role = await Role.findByPk(roleId, {
      include: [{
        model: Permission,
        as: 'permissions',
        through: { attributes: [] }
      }]
    });

    if (!role) {
      throw ApiError.notFound(`Rol con ID ${roleId} no encontrado`);
    }

    return role.get('permissions') as any[];
  }
}
