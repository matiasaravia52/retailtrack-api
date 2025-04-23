import { Permission } from '../models';
import { CreatePermissionDto, UpdatePermissionDto, PermissionDto } from '../dto/PermissionDto';
import { ApiError } from '../middleware/errorHandler';

export class PermissionService {
  /**
   * Obtener todos los permisos
   */
  static async getAllPermissions(): Promise<PermissionDto[]> {
    const permissions = await Permission.findAll();
    return permissions.map(permission => ({
      id: permission.id,
      name: permission.name,
      description: permission.description,
      createdAt: permission.createdAt,
      updatedAt: permission.updatedAt
    }));
  }

  /**
   * Obtener un permiso por su ID
   */
  static async getPermissionById(id: string): Promise<PermissionDto> {
    const permission = await Permission.findByPk(id);

    if (!permission) {
      throw ApiError.notFound(`Permiso con ID ${id} no encontrado`);
    }

    return {
      id: permission.id,
      name: permission.name,
      description: permission.description,
      createdAt: permission.createdAt,
      updatedAt: permission.updatedAt
    };
  }

  /**
   * Crear un nuevo permiso
   */
  static async createPermission(permissionData: CreatePermissionDto): Promise<PermissionDto> {
    // Verificar si ya existe un permiso con el mismo nombre
    const existingPermission = await Permission.findOne({ where: { name: permissionData.name } });
    if (existingPermission) {
      throw ApiError.badRequest(`Ya existe un permiso con el nombre ${permissionData.name}`);
    }

    const permission = await Permission.create(permissionData);
    
    return {
      id: permission.id,
      name: permission.name,
      description: permission.description,
      createdAt: permission.createdAt,
      updatedAt: permission.updatedAt
    };
  }

  /**
   * Actualizar un permiso existente
   */
  static async updatePermission(id: string, permissionData: UpdatePermissionDto): Promise<PermissionDto> {
    const permission = await Permission.findByPk(id);
    
    if (!permission) {
      throw ApiError.notFound(`Permiso con ID ${id} no encontrado`);
    }

    // Verificar si el nuevo nombre ya está en uso por otro permiso
    if (permissionData.name && permissionData.name !== permission.name) {
      const existingPermission = await Permission.findOne({ where: { name: permissionData.name } });
      if (existingPermission && existingPermission.id !== id) {
        throw ApiError.badRequest(`Ya existe un permiso con el nombre ${permissionData.name}`);
      }
    }

    await permission.update(permissionData);
    
    return {
      id: permission.id,
      name: permission.name,
      description: permission.description,
      createdAt: permission.createdAt,
      updatedAt: permission.updatedAt
    };
  }

  /**
   * Eliminar un permiso
   */
  static async deletePermission(id: string): Promise<void> {
    const permission = await Permission.findByPk(id);
    
    if (!permission) {
      throw ApiError.notFound(`Permiso con ID ${id} no encontrado`);
    }

    await permission.destroy();
  }
}
