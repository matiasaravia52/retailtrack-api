import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import User from './User';
import Role from './Role';

// Definir el modelo de relación Usuario-Rol
class UserRole extends Model {
  public userId!: string;
  public roleId!: string;
  
  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Inicializar el modelo
UserRole.init(
  {
    userId: {
      type: DataTypes.UUID,
      field: 'user_id',
      references: {
        model: User,
        key: 'id'
      },
      primaryKey: true,
      onDelete: 'CASCADE',
    },
    roleId: {
      type: DataTypes.UUID,
      field: 'role_id',
      references: {
        model: Role,
        key: 'id'
      },
      primaryKey: true,
      onDelete: 'CASCADE',
    }
  },
  {
    sequelize,
    modelName: 'UserRole',
    tableName: 'user_roles',
    timestamps: true,
  }
);

export default UserRole;
