import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import Product from './Product';
import User from './User';

// Tipos de movimientos de inventario
export enum InventoryMovementType {
  INPUT = 'input',           // Entrada de productos (compra)
  OUTPUT = 'output',         // Salida de productos (venta)
  ADJUSTMENT_ADD = 'adjustment_add',     // Ajuste positivo de inventario
  ADJUSTMENT_SUBTRACT = 'adjustment_subtract', // Ajuste negativo de inventario
  RETURN_IN = 'return_in',   // Devolución de cliente (entrada)
  RETURN_OUT = 'return_out', // Devolución a proveedor (salida)
  TRANSFER_IN = 'transfer_in',  // Transferencia entre sucursales (entrada)
  TRANSFER_OUT = 'transfer_out'  // Transferencia entre sucursales (salida)
}

// Razones para movimientos de inventario
export enum InventoryReason {
  PURCHASE = 'purchase',      // Compra a proveedor
  SALE = 'sale',              // Venta a cliente
  ADJUSTMENT = 'adjustment',  // Ajuste de inventario
  RETURN = 'return',          // Devolución
  TRANSFER = 'transfer',      // Transferencia
  INITIAL = 'initial',        // Inventario inicial
  DAMAGED = 'damaged',        // Producto dañado
  EXPIRED = 'expired',        // Producto vencido
  OTHER = 'other'             // Otra razón
}

// Definir los atributos del movimiento de inventario
interface InventoryAttributes {
  id: string;
  productId: string;
  userId: string;
  quantity: number;
  movementType: InventoryMovementType;
  reason: InventoryReason;
  notes: string | null;
  unitCost: number;
  totalCost: number;
  documentReference: string | null; // Referencia a factura, orden de compra, etc.
  referenceId: string | null;      // ID de referencia (venta, compra, etc.)
  previousStock: number | null;    // Stock antes del movimiento
  currentStock: number | null;     // Stock después del movimiento
  locationId: string | null;       // ID de ubicación/sucursal
  createdAt?: Date;
  updatedAt?: Date;
}

// Definir los atributos opcionales para la creación
interface InventoryCreationAttributes extends Optional<InventoryAttributes, 'id' | 'notes' | 'documentReference' | 'createdAt' | 'updatedAt'> {}

// Definir el modelo de Inventario
class Inventory extends Model<InventoryAttributes, InventoryCreationAttributes> implements InventoryAttributes {
  public id!: string;
  public productId!: string;
  public userId!: string;
  public quantity!: number;
  public movementType!: InventoryMovementType;
  public reason!: InventoryReason;
  public notes!: string | null;
  public unitCost!: number;
  public totalCost!: number;
  public documentReference!: string | null;
  public referenceId!: string | null;
  public previousStock!: number | null;
  public currentStock!: number | null;
  public locationId!: string | null;
  
  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  
  // Método para determinar si el movimiento incrementa o reduce el stock
  public isStockIncreasing(): boolean {
    return [
      InventoryMovementType.INPUT,
      InventoryMovementType.ADJUSTMENT_ADD,
      InventoryMovementType.RETURN_IN,
      InventoryMovementType.TRANSFER_IN
    ].includes(this.movementType);
  }
}

// Inicializar el modelo
Inventory.init(
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
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'La cantidad es requerida' },
        notEmpty: { msg: 'La cantidad no puede estar vacía' },
        min: { args: [1], msg: 'La cantidad debe ser mayor a 0' }
      }
    },
    movementType: {
      type: DataTypes.ENUM(...Object.values(InventoryMovementType)),
      allowNull: false,
      field: 'movement_type'
    },
    reason: {
      type: DataTypes.ENUM(...Object.values(InventoryReason)),
      allowNull: false,
      defaultValue: InventoryReason.OTHER
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    unitCost: {
      type: DataTypes.FLOAT,
      allowNull: false,
      field: 'unit_cost',
      validate: {
        min: { args: [0], msg: 'El costo unitario no puede ser negativo' }
      }
    },
    totalCost: {
      type: DataTypes.FLOAT,
      allowNull: false,
      field: 'total_cost',
      validate: {
        min: { args: [0], msg: 'El costo total no puede ser negativo' }
      }
    },
    documentReference: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'document_reference'
    },
    referenceId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'reference_id'
    },
    previousStock: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'previous_stock'
    },
    currentStock: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'current_stock'
    },
    locationId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'location_id'
    }
  },
  {
    sequelize,
    modelName: 'Inventory',
    tableName: 'inventories',
    timestamps: true,
    hooks: {
      // Calcular el costo total antes de crear o actualizar
      beforeValidate: (inventory: Inventory) => {
        if (inventory.quantity && inventory.unitCost) {
          inventory.totalCost = inventory.quantity * inventory.unitCost;
        }
      }
    }
  }
);

export default Inventory;
