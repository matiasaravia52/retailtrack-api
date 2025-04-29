import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface ProductAttributes {
  id: string;
  name: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
  cost: number;
  wholesale_price: number;
  retail_price: number;
  image: string;
  unit_measurement: string;
  sku: string;
}
  
interface ProductCreationAttributes extends Optional<ProductAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
  public id!: string;
  public name!: string;
  public description!: string;
  public createdAt?: Date;
  public updatedAt?: Date;
  public cost!: number;
  public wholesale_price!: number;
  public retail_price!: number;
  public image!: string;
  public unit_measurement!: string;
  public sku!: string;
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
  cost: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  wholesale_price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  retail_price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  unit_measurement: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  sku: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  sequelize,
  tableName: 'products',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

export default Product;
