import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

// Estado del producto
export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

interface ProductAttributes {
  id: string;
  name: string;
  description: string;
  categoryId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  cost: number;
  wholesale_price: number;
  retail_price: number;
  image: string;
  unit_measurement: string;
  sku: string;
  barcode?: string | null;
  stock: number;
  minStock?: number;
  status: ProductStatus;
}
  
interface ProductCreationAttributes extends Optional<ProductAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
  public id!: string;
  public name!: string;
  public description!: string;
  public categoryId!: string | null;
  public createdAt?: Date;
  public updatedAt?: Date;
  public cost!: number;
  public wholesale_price!: number;
  public retail_price!: number;
  public image!: string;
  public unit_measurement!: string;
  public sku!: string;
  public barcode!: string | null;
  public stock!: number;
  public minStock!: number;
  public status!: ProductStatus;
  
  // Métodos para cálculos de negocio
  public getRetailMargin(): number {
    if (this.cost === 0) return 0;
    return ((this.retail_price - this.cost) / this.cost) * 100;
  }
  
  public getWholesaleMargin(): number {
    if (this.cost === 0) return 0;
    return ((this.wholesale_price - this.cost) / this.cost) * 100;
  }
  
  public isLowStock(): boolean {
    return this.stock <= this.minStock;
  }
}

Product.init({
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
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  categoryId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'category_id',
    defaultValue: null
  },
  cost: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  wholesale_price: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  retail_price: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: ''
  },
  unit_measurement: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: 'unidad'
  },
  sku: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'SKU-DEFAULT'
  },
  barcode: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  minStock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 5,
    field: 'min_stock'
  },
  status: {
    type: DataTypes.ENUM(...Object.values(ProductStatus)),
    allowNull: false,
    defaultValue: ProductStatus.ACTIVE
  }
}, {
  sequelize,
  tableName: 'products',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

export default Product;
