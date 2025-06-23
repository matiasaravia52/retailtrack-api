import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

// Estado de la categoría
export enum CategoryStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

interface CategoryAttributes {
  id: string;
  name: string;
  status: CategoryStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
  
interface CategoryCreationAttributes extends Optional<CategoryAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Category extends Model<CategoryAttributes, CategoryCreationAttributes> implements CategoryAttributes {
  public id!: string;
  public name!: string;
  public status!: CategoryStatus;
  public createdAt?: Date;
  public updatedAt?: Date;
}

Category.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  status: {
    type: DataTypes.ENUM(...Object.values(CategoryStatus)),
    allowNull: false,
    defaultValue: CategoryStatus.ACTIVE
  }
}, {
  sequelize,
  tableName: 'categories',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

export default Category;
