import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

// Estado del proveedor
export enum SupplierStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

interface SupplierAttributes {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  status: SupplierStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
  
interface SupplierCreationAttributes extends Optional<SupplierAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Supplier extends Model<SupplierAttributes, SupplierCreationAttributes> implements SupplierAttributes {
  public id!: string;
  public name!: string;
  public phone!: string;
  public email!: string;
  public address!: string;
  public status!: SupplierStatus;
  public createdAt?: Date;
  public updatedAt?: Date;
}

Supplier.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM(...Object.values(SupplierStatus)),
    allowNull: false,
    defaultValue: SupplierStatus.ACTIVE
  }
}, {
  sequelize,
  tableName: 'suppliers',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

export default Supplier;
