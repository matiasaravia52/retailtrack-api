import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from '../config/database';
import Product from "./Product";

interface BatchAttributes {
    id: string;
    productId: string;
    initialQuantity: number;
    availableQuantity: number;
    unitCost: number;
    createdAt?: Date;
    updatedAt?: Date;
}

interface BatchCreationAttributes extends Optional<BatchAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Batch extends Model<BatchAttributes, BatchCreationAttributes> implements BatchAttributes {
    public id!: string;
    public productId!: string;
    public initialQuantity!: number;
    public availableQuantity!: number;
    public unitCost!: number;
    public createdAt?: Date;
    public updatedAt?: Date;
}

Batch.init({
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
    initialQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'initial_quantity'
    },
    availableQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'available_quantity'
    },
    unitCost: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        field: 'unit_cost'
    },
}, {
    sequelize,
    tableName: 'batches',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
});

export default Batch;