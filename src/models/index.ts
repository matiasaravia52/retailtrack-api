import User from './User';
import Role from './Role';
import Permission from './Permission';
import UserRole from './UserRole';
import RolePermission from './RolePermission';
import Product from './Product';
import Inventory from './Inventory';
import PriceHistory from './PriceHistory';
import Sale from './Sale';
import SaleItem from './SaleItem';

// Definir las asociaciones entre modelos

// Asociaciones User-Role (muchos a muchos)
User.belongsToMany(Role, { 
  through: UserRole,
  foreignKey: 'userId',
  otherKey: 'roleId',
  as: 'roles'
});

Role.belongsToMany(User, { 
  through: UserRole,
  foreignKey: 'roleId',
  otherKey: 'userId',
  as: 'users'
});

// Asociaciones Role-Permission (muchos a muchos)
Role.belongsToMany(Permission, { 
  through: RolePermission,
  foreignKey: 'roleId',
  otherKey: 'permissionId',
  as: 'permissions'
});

Permission.belongsToMany(Role, { 
  through: RolePermission,
  foreignKey: 'permissionId',
  otherKey: 'roleId',
  as: 'roles'
});

// Asociaciones Product-Inventory (uno a muchos)
Product.hasMany(Inventory, {
  foreignKey: 'productId',
  as: 'inventoryMovements'
});

Inventory.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product'
});

// Asociaciones User-Inventory (uno a muchos)
User.hasMany(Inventory, {
  foreignKey: 'userId',
  as: 'inventoryMovements'
});

Inventory.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// Asociaciones Product-PriceHistory (uno a muchos)
Product.hasMany(PriceHistory, {
  foreignKey: 'productId',
  as: 'priceHistory'
});

PriceHistory.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product'
});

// Asociaciones User-PriceHistory (uno a muchos)
User.hasMany(PriceHistory, {
  foreignKey: 'userId',
  as: 'priceChanges'
});

PriceHistory.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// Asociaciones User-Sale (uno a muchos)
User.hasMany(Sale, {
  foreignKey: 'userId',
  as: 'sales'
});

Sale.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// Asociaciones Sale-SaleItem (uno a muchos)
Sale.hasMany(SaleItem, {
  foreignKey: 'saleId',
  as: 'items'
});

SaleItem.belongsTo(Sale, {
  foreignKey: 'saleId',
  as: 'sale'
});

// Asociaciones Product-SaleItem (uno a muchos)
Product.hasMany(SaleItem, {
  foreignKey: 'productId',
  as: 'saleItems'
});

SaleItem.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product'
});

export {
  User,
  Role,
  Permission,
  UserRole,
  RolePermission,
  Product,
  Inventory,
  PriceHistory,
  Sale,
  SaleItem
};
