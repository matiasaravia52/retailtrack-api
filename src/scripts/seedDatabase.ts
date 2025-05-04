import { sequelize } from '../config/database';
import { Product, Inventory, User, Role, Permission, UserRole, RolePermission } from '../models';
import { ProductStatus } from '../models/Product';
import { InventoryMovementType, InventoryReason } from '../models/Inventory';
import { v4 as uuidv4 } from 'uuid';

async function seedDatabase() {
  const transaction = await sequelize.transaction();
  
  try {
    console.log('Inicializando datos de ejemplo...');
    
    // Crear roles y permisos
    const adminRole = await Role.create({
      id: uuidv4(),
      name: 'Administrador',
      description: 'Acceso completo al sistema'
    }, { transaction });
    
    const vendorRole = await Role.create({
      id: uuidv4(),
      name: 'Vendedor',
      description: 'Acceso a ventas e inventario'
    }, { transaction });
    
    // Crear permisos
    const permissions = await Permission.bulkCreate([
      { id: uuidv4(), name: 'product_create', description: 'Crear productos' },
      { id: uuidv4(), name: 'product_read', description: 'Ver productos' },
      { id: uuidv4(), name: 'product_update', description: 'Actualizar productos' },
      { id: uuidv4(), name: 'product_delete', description: 'Eliminar productos' },
      { id: uuidv4(), name: 'inventory_create', description: 'Registrar movimientos de inventario' },
      { id: uuidv4(), name: 'inventory_read', description: 'Ver movimientos de inventario' },
      { id: uuidv4(), name: 'sale_create', description: 'Crear ventas' },
      { id: uuidv4(), name: 'sale_read', description: 'Ver ventas' },
      { id: uuidv4(), name: 'sale_cancel', description: 'Cancelar ventas' },
      { id: uuidv4(), name: 'price_history_create', description: 'Registrar cambios de precios' },
      { id: uuidv4(), name: 'price_history_read', description: 'Ver historial de precios' },
      { id: uuidv4(), name: 'user_manage', description: 'Gestionar usuarios' },
    ], { transaction });
    
    // Asignar todos los permisos al rol de administrador
    await Promise.all(permissions.map(permission => 
      RolePermission.create({
        roleId: adminRole.id,
        permissionId: permission.id
      }, { transaction })
    ));
    
    // Asignar permisos limitados al rol de vendedor
    const vendorPermissions = permissions.filter(p => 
      ['product_read', 'inventory_read', 'sale_create', 'sale_read', 'price_history_read'].includes(p.name)
    );
    
    await Promise.all(vendorPermissions.map(permission => 
      RolePermission.create({
        roleId: vendorRole.id,
        permissionId: permission.id
      }, { transaction })
    ));
    
    // Crear usuarios
    const adminUser = await User.create({
      id: uuidv4(),
      name: 'Admin',
      email: 'admin@example.com',
      password: '$2b$10$XOPbrlUPQdwdJUpSrIF6X.OmBpbRE/sA2c0QiVcXCuCu.g.n.h9tq', // "password"
      role: 'admin',
      lastLogin: null
    }, { transaction });
    
    const vendorUser = await User.create({
      id: uuidv4(),
      name: 'Vendedor',
      email: 'vendedor@example.com',
      password: '$2b$10$XOPbrlUPQdwdJUpSrIF6X.OmBpbRE/sA2c0QiVcXCuCu.g.n.h9tq', // "password"
      role: 'employee',
      lastLogin: null
    }, { transaction });
    
    // Asignar roles a usuarios
    await UserRole.create({
      userId: adminUser.id,
      roleId: adminRole.id
    }, { transaction });
    
    await UserRole.create({
      userId: vendorUser.id,
      roleId: vendorRole.id
    }, { transaction });
    
    // Crear productos de ejemplo
    const products = await Product.bulkCreate([
      {
        id: uuidv4(),
        name: 'Laptop HP 15"',
        description: 'Laptop HP 15" con procesador Intel i5, 8GB RAM, 256GB SSD',
        cost: 400,
        wholesale_price: 450,
        retail_price: 550,
        image: 'laptop.jpg',
        unit_measurement: 'unidad',
        sku: 'LP001',
        stock: 10,
        status: ProductStatus.ACTIVE,
        barcode: '7891234567890',
        minStock: 3
      },
      {
        id: uuidv4(),
        name: 'Mouse inalámbrico',
        description: 'Mouse inalámbrico ergonómico',
        cost: 10,
        wholesale_price: 15,
        retail_price: 25,
        image: 'mouse.jpg',
        unit_measurement: 'unidad',
        sku: 'MS001',
        stock: 20,
        status: ProductStatus.ACTIVE,
        barcode: '7891234567891',
        minStock: 5
      },
      {
        id: uuidv4(),
        name: 'Teclado mecánico',
        description: 'Teclado mecánico RGB',
        cost: 30,
        wholesale_price: 40,
        retail_price: 60,
        image: 'teclado.jpg',
        unit_measurement: 'unidad',
        sku: 'KB001',
        stock: 15,
        status: ProductStatus.ACTIVE,
        barcode: '7891234567892',
        minStock: 4
      }
    ], { transaction });
    
    // Registrar movimientos de inventario iniciales
    for (const product of products) {
      await Inventory.create({
        id: uuidv4(),
        productId: product.id,
        userId: adminUser.id,
        quantity: product.stock,
        movementType: InventoryMovementType.INPUT,
        reason: InventoryReason.INITIAL,
        unitCost: product.cost,
        totalCost: product.cost * product.stock,
        notes: 'Inventario inicial',
        previousStock: 0,
        currentStock: product.stock
      }, { transaction });
    }
    
    await transaction.commit();
    console.log('¡Datos de ejemplo inicializados correctamente!');
    process.exit(0);
  } catch (error) {
    await transaction.rollback();
    console.error('Error al inicializar datos de ejemplo:', error);
    process.exit(1);
  }
}

seedDatabase();
