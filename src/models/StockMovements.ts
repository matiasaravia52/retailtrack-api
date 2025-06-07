import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from '../config/database';

import Product from "./Product";
import Batch from "./Batch";

export enum StockMovementType {
    IN = 'in',
    OUT = 'out'
}

interface StockMovementsAttributes {
    id: string;
    productId: string;
    batchId: string;
    type: StockMovementType;
    quantity: number;
    unitCost: number;
    createdAt?: Date;
    updatedAt?: Date;
}

class StockMovements extends Model<StockMovementsAttributes, StockMovementsCreationAttributes> implements StockMovementsAttributes {
    public id!: string;
    public productId!: string;
    public batchId!: string;
    public type!: StockMovementType;
    public quantity!: number;
    public unitCost!: number;
    public createdAt?: Date;
    public updatedAt?: Date;
}

interface StockMovementsCreationAttributes extends Optional<StockMovementsAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

StockMovements.init({
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4
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
    batchId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'batch_id',
        references: {
            model: Batch,
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    type: {
        type: DataTypes.ENUM(...Object.values(StockMovementType)),
        allowNull: false,
        field: 'movement_type'
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: { args: [0], msg: 'La cantidad debe ser mayor a 0' }
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
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    sequelize,
    modelName: 'StockMovements',
    tableName: 'stock_movements',
    timestamps: true
});

export default StockMovements;
