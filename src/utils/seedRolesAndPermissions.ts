import { Role, Permission, RolePermission } from '../models';

/**
 * Script para inicializar los roles y permisos predeterminados
 */
export async function seedRolesAndPermissions() {
  try {
    console.log('Iniciando la carga de roles y permisos predeterminados...');

    // Crear roles predeterminados
    const roles = [
      { name: 'admin', description: 'Administrador con acceso completo al sistema' },
      { name: 'manager', description: 'Gerente con acceso a la mayoría de las funciones' },
      { name: 'employee', description: 'Empleado con acceso limitado' }
    ];

    // Crear permisos predeterminados
    const permissions = [
      // Permisos de usuarios
      { name: 'users:view', description: 'Ver usuarios' },
      { name: 'users:create', description: 'Crear usuarios' },
      { name: 'users:edit', description: 'Editar usuarios' },
      { name: 'users:delete', description: 'Eliminar usuarios' },
      
      // Permisos de productos
      { name: 'products:view', description: 'Ver productos' },
      { name: 'products:create', description: 'Crear productos' },
      { name: 'products:edit', description: 'Editar productos' },
      { name: 'products:delete', description: 'Eliminar productos' },
      
      // Permisos de categorías
      { name: 'categories:view', description: 'Ver categorías' },
      { name: 'categories:create', description: 'Crear categorías' },
      { name: 'categories:edit', description: 'Editar categorías' },
      { name: 'categories:delete', description: 'Eliminar categorías' },
      
      // Permisos de inventario
      { name: 'inventory:view', description: 'Ver inventario' },
      { name: 'inventory:manage', description: 'Gestionar inventario' },
      
      // Permisos de ventas
      { name: 'sales:view', description: 'Ver ventas' },
      { name: 'sales:create', description: 'Crear ventas' },
      { name: 'sales:reports', description: 'Ver reportes de ventas' },
      
      // Permisos de roles y permisos
      { name: 'roles:view', description: 'Ver roles' },
      { name: 'roles:manage', description: 'Gestionar roles' },
      { name: 'permissions:view', description: 'Ver permisos' },
      { name: 'permissions:manage', description: 'Gestionar permisos' }
    ];

    // Insertar roles
    const createdRoles: Record<string, Role> = {};
    for (const roleData of roles) {
      const [role] = await Role.findOrCreate({
        where: { name: roleData.name },
        defaults: roleData
      });
      createdRoles[roleData.name] = role;
      console.log(`Rol '${roleData.name}' creado o encontrado`);
    }

    // Insertar permisos
    const createdPermissions: Record<string, Permission> = {};
    for (const permissionData of permissions) {
      const [permission] = await Permission.findOrCreate({
        where: { name: permissionData.name },
        defaults: permissionData
      });
      createdPermissions[permissionData.name] = permission;
      console.log(`Permiso '${permissionData.name}' creado o encontrado`);
    }

    // Asignar permisos a roles
    const rolePermissions = {
      // Administrador tiene todos los permisos
      admin: Object.keys(createdPermissions),
      
      // Gerente tiene la mayoría de los permisos, excepto gestión de roles/permisos y eliminación de usuarios
      manager: [
        'users:view', 'users:create', 'users:edit',
        'products:view', 'products:create', 'products:edit', 'products:delete',
        'categories:view', 'categories:create', 'categories:edit', 'categories:delete',
        'inventory:view', 'inventory:manage',
        'sales:view', 'sales:create', 'sales:reports',
        'roles:view', 'permissions:view'
      ],
      
      // Empleado tiene permisos básicos
      employee: [
        'products:view',
        'categories:view',
        'inventory:view',
        'sales:view', 'sales:create'
      ]
    };

    // Asignar permisos a roles
    for (const [roleName, permissionNames] of Object.entries(rolePermissions)) {
      const role = createdRoles[roleName];
      
      if (!role) {
        console.warn(`Rol '${roleName}' no encontrado, saltando asignación de permisos`);
        continue;
      }
      
      // Eliminar asignaciones existentes
      await RolePermission.destroy({
        where: { roleId: role.id }
      });
      
      // Crear nuevas asignaciones
      for (const permissionName of permissionNames) {
        const permission = createdPermissions[permissionName];
        
        if (!permission) {
          console.warn(`Permiso '${permissionName}' no encontrado, saltando asignación`);
          continue;
        }
        
        await RolePermission.create({
          roleId: role.id,
          permissionId: permission.id
        });
        
        console.log(`Permiso '${permissionName}' asignado al rol '${roleName}'`);
      }
    }

    console.log('Carga de roles y permisos predeterminados completada con éxito');
  } catch (error) {
    console.error('Error al cargar roles y permisos predeterminados:', error);
    throw error;
  }
}
