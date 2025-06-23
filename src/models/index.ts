import User from './User';
import Role from './Role';
import Permission from './Permission';
import UserRole from './UserRole';
import RolePermission from './RolePermission';
import Product from './Product';
import PriceHistory from './SalePrice';
import Sale from './Sale';
import SaleItem from './SaleItem';
import StockMovements from './StockMovements';
import Batch from './Batch';
import Category from './Category';
import Customer from './Customer';
import Supplier from './Supplier';
import Purchase from './Purchase';
import PurchaseLine from './PurchaseLine';

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

// Asociaciones Product-Batch (uno a muchos)
Product.hasMany(Batch, {
  foreignKey: 'productId',
  as: 'batches'
});

Batch.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product'
});

// Asociaciones Product-StockMovements (uno a muchos)
Product.hasMany(StockMovements, {
  foreignKey: 'productId',
  as: 'stockMovements'
});

StockMovements.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product'
});

// Asociaciones Batch-StockMovements (uno a muchos)
Batch.hasMany(StockMovements, {
  foreignKey: 'batchId',
  as: 'stockMovements'
});

StockMovements.belongsTo(Batch, {
  foreignKey: 'batchId',
  as: 'batch'
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

// Asociaciones Category-Product (uno a muchos)
Category.hasMany(Product, {
  foreignKey: 'categoryId',
  as: 'products'
});

Product.belongsTo(Category, {
  foreignKey: 'categoryId',
  as: 'category'
});

// Asociaciones Customer-Sale (uno a muchos)
Customer.hasMany(Sale, {
  foreignKey: 'customerId',
  as: 'sales'
});

Sale.belongsTo(Customer, {
  foreignKey: 'customerId',
  as: 'customer'
});

// Asociaciones Supplier-Purchase (uno a muchos)
Supplier.hasMany(Purchase, {
  foreignKey: 'supplierId',
  as: 'purchases'
});

Purchase.belongsTo(Supplier, {
  foreignKey: 'supplierId',
  as: 'supplier'
});

// Asociaciones Purchase-PurchaseLine (uno a muchos)
Purchase.hasMany(PurchaseLine, {
  foreignKey: 'purchaseId',
  as: 'purchaseLines'
});

PurchaseLine.belongsTo(Purchase, {
  foreignKey: 'purchaseId',
  as: 'purchase'
});

// Asociaciones Product-PurchaseLine (uno a muchos)
Product.hasMany(PurchaseLine, {
  foreignKey: 'productId',
  as: 'purchaseLines'
});

PurchaseLine.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product'
});

// Asociaciones Batch-PurchaseLine (uno a muchos)
Batch.hasMany(PurchaseLine, {
  foreignKey: 'batchId',
  as: 'purchaseLines'
});

PurchaseLine.belongsTo(Batch, {
  foreignKey: 'batchId',
  as: 'batch'
});

export {
  User,
  Role,
  Permission,
  UserRole,
  RolePermission,
  Product,
  PriceHistory,
  Sale,
  SaleItem,
  StockMovements,
  Batch,
  Category,
  Customer,
  Supplier,
  Purchase,
  PurchaseLine
};
