import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import Role from './Role';
import Permission from './Permission';

// Definir el modelo de relación Rol-Permiso
class RolePermission extends Model {
  public roleId!: string;
  public permissionId!: string;
  
  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Inicializar el modelo
RolePermission.init(
  {
    roleId: {
      type: DataTypes.UUID,
      field: 'role_id',
      references: {
        model: Role,
        key: 'id'
      },
      primaryKey: true,
      onDelete: 'CASCADE',
    },
    permissionId: {
      type: DataTypes.UUID,
      field: 'permission_id',
      references: {
        model: Permission,
        key: 'id'
      },
      primaryKey: true,
      onDelete: 'CASCADE',
    }
  },
  {
    sequelize,
    modelName: 'RolePermission',
    tableName: 'role_permissions',
    timestamps: true,
  }
);

export default RolePermission;
