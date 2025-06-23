import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import Purchase from './Purchase';
import Product from './Product';
import Batch from './Batch';

interface PurchaseLineAttributes {
  id: string;
  purchaseId: string;
  productId: string;
  batchId: string;
  quantity: number;
  unitCostPrice: number;
  subtotal: number;
  createdAt?: Date;
  updatedAt?: Date;
}
  
interface PurchaseLineCreationAttributes extends Optional<PurchaseLineAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class PurchaseLine extends Model<PurchaseLineAttributes, PurchaseLineCreationAttributes> implements PurchaseLineAttributes {
  public id!: string;
  public purchaseId!: string;
  public productId!: string;
  public batchId!: string;
  public quantity!: number;
  public unitCostPrice!: number;
  public subtotal!: number;
  public createdAt?: Date;
  public updatedAt?: Date;
}

PurchaseLine.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4
  },
  purchaseId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'purchase_id',
    references: {
      model: Purchase,
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'product_id',
    references: {
      model: Product,
      key: 'id'
    },
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  },
  batchId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'batch_id',
    references: {
      model: Batch,
      key: 'id'
    },
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: { args: [1], msg: 'La cantidad debe ser mayor a 0' }
    }
  },
  unitCostPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'unit_cost_price',
    validate: {
      min: { args: [0], msg: 'El precio de costo unitario no puede ser negativo' }
    }
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  }
}, {
  sequelize,
  tableName: 'purchase_lines',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

export default PurchaseLine;
