import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

// Estado del cliente
export enum CustomerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

interface CustomerAttributes {
  id: string;
  name: string;
  type: string;
  phone: string;
  email: string;
  address: string;
  status: CustomerStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
  
interface CustomerCreationAttributes extends Optional<CustomerAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Customer extends Model<CustomerAttributes, CustomerCreationAttributes> implements CustomerAttributes {
  public id!: string;
  public name!: string;
  public type!: string;
  public phone!: string;
  public email!: string;
  public address!: string;
  public status!: CustomerStatus;
  public createdAt?: Date;
  public updatedAt?: Date;
}

Customer.init({
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
  type: {
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
    type: DataTypes.ENUM(...Object.values(CustomerStatus)),
    allowNull: false,
    defaultValue: CustomerStatus.ACTIVE
  }
}, {
  sequelize,
  tableName: 'customers',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

export default Customer;
