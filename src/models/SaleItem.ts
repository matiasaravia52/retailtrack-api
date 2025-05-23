import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import Product from './Product';
import Sale from './Sale';

// Definir los atributos del detalle de venta
interface SaleItemAttributes {
  id: string;
  saleId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  unitCost: number;
  discount: number;
  totalPrice: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Definir los atributos opcionales para la creación
interface SaleItemCreationAttributes extends Optional<SaleItemAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

// Definir el modelo de Detalle de Venta
class SaleItem extends Model<SaleItemAttributes, SaleItemCreationAttributes> implements SaleItemAttributes {
  public id!: string;
  public saleId!: string;
  public productId!: string;
  public quantity!: number;
  public unitPrice!: number;
  public unitCost!: number;
  public discount!: number;
  public totalPrice!: number;
  
  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Inicializar el modelo
SaleItem.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    saleId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'sale_id',
      references: {
        model: Sale,
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
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: { args: [1], msg: 'La cantidad debe ser mayor a 0' }
      }
    },
    unitPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
      field: 'unit_price',
      validate: {
        min: { args: [0], msg: 'El precio unitario no puede ser negativo' }
      }
    },
    unitCost: {
      type: DataTypes.FLOAT,
      allowNull: false,
      field: 'unit_cost',
      validate: {
        min: { args: [0], msg: 'El costo unitario no puede ser negativo' }
      }
    },
    discount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: { args: [0], msg: 'El descuento no puede ser negativo' }
      }
    },
    totalPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
      field: 'total_price',
      validate: {
        min: { args: [0], msg: 'El precio total no puede ser negativo' }
      }
    }
  },
  {
    sequelize,
    modelName: 'SaleItem',
    tableName: 'sale_items',
    timestamps: true,
    hooks: {
      // Calcular el precio total antes de crear o actualizar
      beforeValidate: (saleItem: SaleItem) => {
        if (saleItem.quantity && saleItem.unitPrice && saleItem.discount !== undefined) {
          const subtotal = saleItem.quantity * saleItem.unitPrice;
          saleItem.totalPrice = subtotal - (subtotal * saleItem.discount / 100);
        }
      }
    }
  }
);

export default SaleItem;
