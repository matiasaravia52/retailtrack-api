import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import Supplier from './Supplier';

// Estado de la compra
export enum PurchaseStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

interface PurchaseAttributes {
  id: string;
  supplierId: string;
  subtotal: number;
  taxes: number;
  total: number;
  status: PurchaseStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
  
interface PurchaseCreationAttributes extends Optional<PurchaseAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Purchase extends Model<PurchaseAttributes, PurchaseCreationAttributes> implements PurchaseAttributes {
  public id!: string;
  public supplierId!: string;
  public subtotal!: number;
  public taxes!: number;
  public total!: number;
  public status!: PurchaseStatus;
  public createdAt?: Date;
  public updatedAt?: Date;
}

Purchase.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4
  },
  supplierId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'supplier_id',
    references: {
      model: Supplier,
      key: 'id'
    },
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  taxes: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM(...Object.values(PurchaseStatus)),
    allowNull: false,
    defaultValue: PurchaseStatus.PENDING
  }
}, {
  sequelize,
  tableName: 'purchases',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

export default Purchase;
