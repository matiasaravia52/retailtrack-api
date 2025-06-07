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
  status: ProductStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
  
interface ProductCreationAttributes extends Optional<ProductAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
  public id!: string;
  public name!: string;
  public description!: string;
  public categoryId!: string | null;
  public status!: ProductStatus;
  public createdAt?: Date;
  public updatedAt?: Date;
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
