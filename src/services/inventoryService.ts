import { Transaction } from 'sequelize';
import { Inventory, Product } from '../models';
import { InventoryMovementType, InventoryReason } from '../models/Inventory';
import { sequelize } from '../config/database';

interface InventoryInputData {
  productId: string;
  userId: string;
  quantity: number;
  unitCost: number;
  reason?: InventoryReason;
  notes?: string;
  documentReference?: string;
  referenceId?: string;
  locationId?: string;
}

interface InventoryOutputData {
  productId: string;
  userId: string;
  quantity: number;
  unitCost: number;
  reason?: InventoryReason;
  notes?: string;
  documentReference?: string;
  referenceId?: string;
  locationId?: string;
}

interface InventoryMovementFilters {
  productId?: string;
  movementType?: InventoryMovementType;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

export class InventoryService {
  /**
   * Registra una entrada de productos al inventario
   */
  static async registerInput(data: InventoryInputData): Promise<{ success: boolean; data?: any; error?: string; statusCode?: number }> {
    const transaction: Transaction = await sequelize.transaction();
    
    try {
      const { productId, userId, quantity, unitCost, reason = InventoryReason.PURCHASE, notes, documentReference, referenceId, locationId } = data;
      
      // Validar datos
      if (!productId || !quantity || quantity <= 0 || unitCost === undefined) {
        await transaction.rollback();
        return {
          success: false,
          error: 'Datos incompletos o inválidos',
          statusCode: 400
        };
      }
      
      // Buscar el producto
      const product = await Product.findByPk(productId);
      if (!product) {
        await transaction.rollback();
        return {
          success: false,
          error: 'Producto no encontrado',
          statusCode: 404
        };
      }
      
      // Obtener el stock actual antes del movimiento
      const previousStock = product.stock;
      
      // Crear el registro de movimiento de inventario
      const inventoryMovement = await Inventory.create({
        productId,
        userId,
        quantity,
        movementType: InventoryMovementType.INPUT,
        reason,
        unitCost,
        totalCost: quantity * unitCost,
        notes: notes || null,
        documentReference: documentReference || null,
        referenceId: referenceId || null,
        previousStock,
        currentStock: previousStock + quantity,
        locationId: locationId || null
      }, { transaction });
      
      // Actualizar el stock del producto
      await product.increment('stock', { by: quantity, transaction });
      
      await transaction.commit();
      
      return {
        success: true,
        data: inventoryMovement,
        statusCode: 201
      };
    } catch (error) {
      await transaction.rollback();
      console.error('Error al registrar entrada de inventario:', error);
      return {
        success: false,
        error: 'Error al registrar entrada de inventario',
        statusCode: 500
      };
    }
  }
  
  /**
   * Registra una salida de productos del inventario
   */
  static async registerOutput(data: InventoryOutputData): Promise<{ success: boolean; data?: any; error?: string; statusCode?: number; currentStock?: number }> {
    const transaction: Transaction = await sequelize.transaction();
    
    try {
      const { productId, userId, quantity, unitCost, reason = InventoryReason.SALE, notes, documentReference, referenceId, locationId } = data;
      
      // Validar datos
      if (!productId || !quantity || quantity <= 0 || unitCost === undefined) {
        await transaction.rollback();
        return {
          success: false,
          error: 'Datos incompletos o inválidos',
          statusCode: 400
        };
      }
      
      // Buscar el producto
      const product = await Product.findByPk(productId);
      if (!product) {
        await transaction.rollback();
        return {
          success: false,
          error: 'Producto no encontrado',
          statusCode: 404
        };
      }
      
      // Verificar si hay suficiente stock
      if (product.stock < quantity) {
        await transaction.rollback();
        return {
          success: false,
          error: 'Stock insuficiente',
          statusCode: 400,
          currentStock: product.stock
        };
      }
      
      // Obtener el stock actual antes del movimiento
      const previousStock = product.stock;
      
      // Crear el registro de movimiento de inventario
      const inventoryMovement = await Inventory.create({
        productId,
        userId,
        quantity,
        movementType: InventoryMovementType.OUTPUT,
        reason,
        unitCost,
        totalCost: quantity * unitCost,
        notes: notes || null,
        documentReference: documentReference || null,
        referenceId: referenceId || null,
        previousStock,
        currentStock: previousStock - quantity,
        locationId: locationId || null
      }, { transaction });
      
      // Actualizar el stock del producto
      await product.decrement('stock', { by: quantity, transaction });
      
      await transaction.commit();
      
      return {
        success: true,
        data: inventoryMovement,
        statusCode: 201
      };
    } catch (error) {
      await transaction.rollback();
      console.error('Error al registrar salida de inventario:', error);
      return {
        success: false,
        error: 'Error al registrar salida de inventario',
        statusCode: 500
      };
    }
  }
  
  /**
   * Obtiene el historial de movimientos de inventario
   */
  static async getInventoryMovements(filters: InventoryMovementFilters): Promise<{ success: boolean; data?: any; error?: string; statusCode?: number; total?: number; limit?: number; offset?: number }> {
    try {
      const { productId, movementType, startDate, endDate, limit = 50, offset = 0 } = filters;
      
      // Construir el filtro
      const filter: any = {};
      
      if (productId) {
        filter.productId = productId;
      }
      
      if (movementType && Object.values(InventoryMovementType).includes(movementType)) {
        filter.movementType = movementType;
      }
      
      // Filtro por fechas
      if (startDate || endDate) {
        filter.createdAt = {};
        
        if (startDate) {
          filter.createdAt.$gte = new Date(startDate);
        }
        
        if (endDate) {
          filter.createdAt.$lte = new Date(endDate);
        }
      }
      
      // Obtener los movimientos
      const movements = await Inventory.findAndCountAll({
        where: filter,
        limit: Number(limit),
        offset: Number(offset),
        order: [['createdAt', 'DESC']],
        include: [
          { association: 'product', attributes: ['id', 'name', 'sku'] },
          { association: 'user', attributes: ['id', 'name', 'email'] }
        ]
      });
      
      return {
        success: true,
        data: movements.rows,
        total: movements.count,
        limit: Number(limit),
        offset: Number(offset),
        statusCode: 200
      };
    } catch (error) {
      console.error('Error al obtener movimientos de inventario:', error);
      return {
        success: false,
        error: 'Error al obtener movimientos de inventario',
        statusCode: 500
      };
    }
  }
  
  /**
   * Obtiene los movimientos de inventario de un producto específico
   */
  static async getProductInventoryMovements(productId: string, limit: number = 50, offset: number = 0): Promise<{ success: boolean; data?: any; error?: string; statusCode?: number; total?: number; limit?: number; offset?: number; currentStock?: number }> {
    try {
      // Verificar si el producto existe
      const product = await Product.findByPk(productId);
      if (!product) {
        return {
          success: false,
          error: 'Producto no encontrado',
          statusCode: 404
        };
      }
      
      // Obtener los movimientos
      const movements = await Inventory.findAndCountAll({
        where: { productId },
        limit: Number(limit),
        offset: Number(offset),
        order: [['createdAt', 'DESC']],
        include: [
          { association: 'user', attributes: ['id', 'name', 'email'] }
        ]
      });
      
      return {
        success: true,
        data: movements.rows,
        total: movements.count,
        limit: Number(limit),
        offset: Number(offset),
        currentStock: product.stock,
        statusCode: 200
      };
    } catch (error) {
      console.error('Error al obtener movimientos de inventario del producto:', error);
      return {
        success: false,
        error: 'Error al obtener movimientos de inventario del producto',
        statusCode: 500
      };
    }
  }
}
