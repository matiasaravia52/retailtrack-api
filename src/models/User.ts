import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';
// Importar bcrypt con require para evitar problemas de tipos
const bcrypt = require('bcrypt');

// Definir los atributos del usuario
interface UserAttributes {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'manager' | 'employee';
  lastLogin: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

// Definir los atributos opcionales para la creación (ID y timestamps generados automáticamente)
interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'lastLogin' | 'createdAt' | 'updatedAt'> {}

// Definir el modelo de Usuario
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public name!: string;
  public email!: string;
  public password!: string;
  public role!: 'admin' | 'manager' | 'employee';
  public lastLogin!: Date | null;
  
  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Método para validar la contraseña
  public async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}

// Inicializar el modelo
User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('admin', 'manager', 'employee'),
      allowNull: false,
      defaultValue: 'employee',
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    hooks: {
      // Hash de la contraseña antes de guardar
      beforeCreate: async (user: User) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      // Hash de la contraseña antes de actualizar si ha cambiado
      beforeUpdate: async (user: User) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  }
);

export default User;
