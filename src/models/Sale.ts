import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import User from './User';

// Estados de la venta
export enum SaleStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

// Tipos de venta
export enum SaleType {
  RETAIL = 'retail',
  WHOLESALE = 'wholesale'
}

// Definir los atributos de la venta
interface SaleAttributes {
  id: string;
  date: Date;
  userId: string;
  clientName: string;
  clientDocument: string | null;
  clientPhone: string | null;
  clientEmail: string | null;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  notes: string | null;
  status: SaleStatus;
  saleType: SaleType;
  documentNumber: string | null;
  paymentMethod: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Definir los atributos opcionales para la creación
interface SaleCreationAttributes extends Optional<SaleAttributes, 'id' | 'clientDocument' | 'clientPhone' | 'clientEmail' | 'notes' | 'documentNumber' | 'createdAt' | 'updatedAt'> {}

// Definir el modelo de Venta
class Sale extends Model<SaleAttributes, SaleCreationAttributes> implements SaleAttributes {
  public id!: string;
  public date!: Date;
  public userId!: string;
  public clientName!: string;
  public clientDocument!: string | null;
  public clientPhone!: string | null;
  public clientEmail!: string | null;
  public subtotal!: number;
  public taxAmount!: number;
  public discountAmount!: number;
  public totalAmount!: number;
  public notes!: string | null;
  public status!: SaleStatus;
  public saleType!: SaleType;
  public documentNumber!: string | null;
  public paymentMethod!: string;
  
  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Inicializar el modelo
Sale.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
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
    },
    clientName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'client_name'
    },
    clientDocument: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'client_document'
    },
    clientPhone: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'client_phone'
    },
    clientEmail: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'client_email',
      validate: {
        isEmail: true
      }
    },
    subtotal: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: { args: [0], msg: 'El subtotal no puede ser negativo' }
      }
    },
    taxAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      field: 'tax_amount',
      defaultValue: 0,
      validate: {
        min: { args: [0], msg: 'El monto de impuestos no puede ser negativo' }
      }
    },
    discountAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      field: 'discount_amount',
      defaultValue: 0,
      validate: {
        min: { args: [0], msg: 'El monto de descuento no puede ser negativo' }
      }
    },
    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      field: 'total_amount',
      validate: {
        min: { args: [0], msg: 'El monto total no puede ser negativo' }
      }
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM(...Object.values(SaleStatus)),
      allowNull: false,
      defaultValue: SaleStatus.PENDING
    },
    saleType: {
      type: DataTypes.ENUM(...Object.values(SaleType)),
      allowNull: false,
      field: 'sale_type',
      defaultValue: SaleType.RETAIL
    },
    documentNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'document_number'
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'payment_method',
      defaultValue: 'efectivo'
    }
  },
  {
    sequelize,
    modelName: 'Sale',
    tableName: 'sales',
    timestamps: true
  }
);

export default Sale;
