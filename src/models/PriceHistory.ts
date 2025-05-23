import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import Product from './Product';
import User from './User';

// Tipos de precios
export enum PriceType {
  COST = 'cost',
  RETAIL = 'retail',
  WHOLESALE = 'wholesale'
}

// Definir los atributos del historial de precios
interface PriceHistoryAttributes {
  id: string;
  productId: string;
  priceType: PriceType;
  value: number;
  startDate: Date;
  endDate: Date | null;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Definir los atributos opcionales para la creación
interface PriceHistoryCreationAttributes extends Optional<PriceHistoryAttributes, 'id' | 'endDate' | 'createdAt' | 'updatedAt'> {}

// Definir el modelo de Historial de Precios
class PriceHistory extends Model<PriceHistoryAttributes, PriceHistoryCreationAttributes> implements PriceHistoryAttributes {
  public id!: string;
  public productId!: string;
  public priceType!: PriceType;
  public value!: number;
  public startDate!: Date;
  public endDate!: Date | null;
  public userId!: string;
  
  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Inicializar el modelo
PriceHistory.init(
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
    priceType: {
      type: DataTypes.ENUM(...Object.values(PriceType)),
      allowNull: false,
      field: 'price_type'
    },
    value: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: { args: [0], msg: 'El precio no puede ser negativo' }
      }
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'start_date',
      defaultValue: DataTypes.NOW
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'end_date'
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'user_id',
      references: {
        model: User,
        key: 'id'
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    }
  },
  {
    sequelize,
    modelName: 'PriceHistory',
    tableName: 'price_history',
    timestamps: true
  }
);

export default PriceHistory;
