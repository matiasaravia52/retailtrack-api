import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import Product from './Product';

// Tipos de precios
export enum PriceType {
  RETAIL = 'retail',
  WHOLESALE = 'wholesale'
}

export enum PriceStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

// Definir los atributos del historial de precios
interface SalePriceAttributes {
  id: string;
  productId: string;
  type: PriceType;
  amount: number;
  status: PriceStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

// Definir los atributos opcionales para la creación
interface SalePriceCreationAttributes extends Optional<SalePriceAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

// Definir el modelo de Historial de Precios
class SalePrice extends Model<SalePriceAttributes, SalePriceCreationAttributes> implements SalePriceAttributes {
  public id!: string;
  public productId!: string;
  public type!: PriceType;
  public amount!: number;
  public status!: PriceStatus;
  
  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Inicializar el modelo
SalePrice.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'product_id',
      references: {
        model: Product,
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    type: {
      type: DataTypes.ENUM(...Object.values(PriceType)),
      allowNull: false,
      field: 'price_type'
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: { args: [0], msg: 'El precio no puede ser negativo' }
      }
    },
    status: {
      type: DataTypes.ENUM(...Object.values(PriceStatus)),
      allowNull: false,
      field: 'price_status'
    },
  },
  {
    sequelize,
    modelName: 'SalePrice',
    tableName: 'sale_prices',
    timestamps: true
  }
);

export default SalePrice;
