import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface ProductAttributes {
  id: string;
  name: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}
  
interface ProductCreationAttributes extends Optional<ProductAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
  public id!: string;
  public name!: string;
  public description!: string;
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
  }
}, {
  sequelize,
  tableName: 'products',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

export default Product;
