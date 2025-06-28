import { Transaction } from 'sequelize';
import { Sale, SaleItem, Product, Batch } from '../models';
import { SaleStatus, SaleType } from '../models/Sale';
import { sequelize } from '../config/database';
import { Op } from 'sequelize';
import { StockMovementType } from '../models/StockMovements';

interface SaleItemData {
  productId: string;
  quantity: number;
  unitPrice?: number;
  discount?: number;
}

interface SaleData {
  userId?: string;
  clientName: string;
  clientDocument?: string;
  clientPhone?: string;
  clientEmail?: string;
  items: SaleItemData[];
  taxAmount?: number;
  discountAmount?: number;
  notes?: string;
  saleType?: SaleType;
  documentNumber?: string;
  paymentMethod?: string;
}

interface SaleFilters {
  userId?: string;
  clientName?: string;
  status?: SaleStatus;
  saleType?: SaleType;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

// Extender el tipo Sale para incluir la propiedad items
interface SaleWithItems extends Sale {
  items: SaleItem[];
}

export class SaleService {
  /**
   * Registra una nueva venta
   */
  static async createSale(data: SaleData): Promise<{ success: boolean; data?: any; error?: string; statusCode?: number; insufficientStock?: any }> {
    const transaction: Transaction = await sequelize.transaction();
    
    try {
      const { 
        userId, 
        clientName, 
        clientDocument, 
        clientPhone, 
        clientEmail, 
        items, 
        taxAmount = 0, 
        discountAmount = 0, 
        notes, 
        saleType = SaleType.RETAIL, 
        documentNumber, 
        paymentMethod = 'efectivo' 
      } = data;
      
      // Validar datos básicos
      if (!clientName || !items || items.length === 0) {
        await transaction.rollback();
        return {
          success: false,
          error: 'Datos incompletos o inválidos',
          statusCode: 400
        };
      }
      
      // Verificar stock suficiente y calcular subtotal
      let subtotal = 0;
      const insufficientStock = [];
      const itemsWithDetails = [];
      
      for (const item of items) {
        // Buscar el producto
        const product = await Product.findByPk(item.productId);
        if (!product) {
          await transaction.rollback();
          return {
            success: false,
            error: `Producto con ID ${item.productId} no encontrado`,
            statusCode: 404
          };
        }
        
        // Obtener los lotes disponibles del producto ordenados por fecha de creación (FIFO)
        const availableBatches = await Batch.findAll({
          where: {
            productId: item.productId,
            availableQuantity: { [Op.gt]: 0 }
          },
          order: [['createdAt', 'ASC']]
        });
        
        // Calcular el stock total disponible
        const totalAvailable = availableBatches.reduce((sum, batch) => sum + batch.availableQuantity, 0);
        
        // Verificar stock suficiente
        if (totalAvailable < item.quantity) {
          insufficientStock.push({
            productId: item.productId,
            productName: product.name,
            requested: item.quantity,
            available: totalAvailable
          });
          continue;
        }
        
        // Calcular precio unitario si no se proporciona
        const unitPrice = item.unitPrice || (saleType === SaleType.WHOLESALE ? product.wholesale_price : product.retail_price);
        const discount = item.discount || 0;
        const itemSubtotal = item.quantity * unitPrice * (1 - discount / 100);
        
        subtotal += itemSubtotal;
        
        // Obtener el costo unitario del lote más antiguo (FIFO)
        const oldestBatch = await Batch.findOne({
          where: { productId: product.id, availableQuantity: { [Op.gt]: 0 } },
          order: [['expirationDate', 'ASC']],
          transaction
        });
        
        const unitCost = oldestBatch ? oldestBatch.unitCost : 0;
        
        // Agregar a la lista de items con detalles completos
        itemsWithDetails.push({
          ...item,
          unitPrice,
          unitCost,
          discount,
          totalPrice: itemSubtotal
        });
      }
      
      // Si hay productos con stock insuficiente, abortar la venta
      if (insufficientStock.length > 0) {
        await transaction.rollback();
        return {
          success: false,
          error: 'Stock insuficiente para algunos productos',
          statusCode: 400,
          insufficientStock
        };
      }
      
      // Calcular el total
      const totalAmount = subtotal + taxAmount - discountAmount;
      
      // Validar que exista un userId
      if (!userId) {
        await transaction.rollback();
        return {
          success: false,
          error: 'Se requiere un usuario para crear la venta',
          statusCode: 400
        };
      }
      
      // Crear la venta
      const sale = await Sale.create({
        date: new Date(),
        userId,
        clientName,
        clientDocument: clientDocument || null,
        clientPhone: clientPhone || null,
        clientEmail: clientEmail || null,
        subtotal,
        taxAmount,
        discountAmount,
        totalAmount,
        notes: notes || null,
        status: SaleStatus.COMPLETED,
        saleType,
        documentNumber: documentNumber || null,
        paymentMethod
      }, { transaction });
      
      // Crear los items de la venta y actualizar el stock
      const saleItems = [];
      
      for (const item of itemsWithDetails) {
        // Obtener los lotes disponibles del producto ordenados por fecha de creación (FIFO)
        const availableBatches = await Batch.findAll({
          where: {
            productId: item.productId,
            availableQuantity: { [Op.gt]: 0 }
          },
          order: [['createdAt', 'ASC']],
          transaction
        });
        
        let remainingQuantity = item.quantity;
        let quantityFromBatch = 0;
        
        // Distribuir la cantidad entre los lotes disponibles (FIFO)
        for (const batch of availableBatches) {
          if (remainingQuantity <= 0) break;
          
          // Determinar cuánto tomar de este lote
          quantityFromBatch = Math.min(remainingQuantity, batch.availableQuantity);
          
          // Crear el item de venta asociado a este lote
          const saleItem = await SaleItem.create({
            saleId: sale.id,
            productId: item.productId,
            batchId: batch.id,
            quantity: quantityFromBatch,
            unitPrice: item.unitPrice,
            unitCost: batch.unitCost, // Usar el costo del lote específico
            discount: item.discount,
            totalPrice: quantityFromBatch * item.unitPrice * (1 - (item.discount || 0) / 100)
          }, { transaction });
          
          saleItems.push(saleItem);
          
          // Actualizar la cantidad disponible en el lote
          await batch.decrement('availableQuantity', { by: quantityFromBatch, transaction });
          
          // Registrar el movimiento de stock
          await sequelize.models.StockMovements.create({
            productId: item.productId,
            batchId: batch.id,
            type: StockMovementType.OUT,
            quantity: quantityFromBatch,
            unitCost: batch.unitCost,
            notes: `Venta #${sale.id} - ${sale.clientName || 'Cliente no registrado'}`
          }, { transaction });
          
          remainingQuantity -= quantityFromBatch;
        }
        
        // Actualizar el stock total del producto
        const product = await Product.findByPk(item.productId, { transaction });
        if (product) {
          await product.decrement('stock', { by: item.quantity, transaction });
        }
      }
      
      await transaction.commit();
      
      // Obtener la venta completa con sus items
      const completeSale = await Sale.findByPk(sale.id, {
        include: [
          { association: 'items', include: [{ association: 'product' }] },
          { association: 'user' }
        ]
      });
      
      return {
        success: true,
        data: completeSale,
        statusCode: 201
      };
    } catch (error) {
      await transaction.rollback();
      console.error('Error al registrar venta:', error);
      return {
        success: false,
        error: 'Error al registrar venta',
        statusCode: 500
      };
    }
  }
  
  /**
   * Obtiene una venta por su ID
   */
  static async getSaleById(id: string): Promise<{ success: boolean; data?: any; error?: string; statusCode?: number }> {
    try {
      const sale = await Sale.findByPk(id, {
        include: [
          { association: 'items', include: [{ association: 'product' }] },
          { association: 'user' }
        ]
      });
      
      if (!sale) {
        return {
          success: false,
          error: 'Venta no encontrada',
          statusCode: 404
        };
      }
      
      return {
        success: true,
        data: sale,
        statusCode: 200
      };
    } catch (error) {
      console.error('Error al obtener venta:', error);
      return {
        success: false,
        error: 'Error al obtener venta',
        statusCode: 500
      };
    }
  }
  
  /**
   * Obtiene todas las ventas según los filtros
   */
  static async getSales(filters: SaleFilters): Promise<{ success: boolean; data?: any; error?: string; statusCode?: number; total?: number; limit?: number; offset?: number }> {
    try {
      const { userId, clientName, status, saleType, startDate, endDate, limit = 50, offset = 0 } = filters;
      
      // Construir el filtro
      const filter: any = {};
      
      if (userId) {
        filter.userId = userId;
      }
      
      if (clientName) {
        filter.clientName = { [Op.like]: `%${clientName}%` };
      }
      
      if (status && Object.values(SaleStatus).includes(status)) {
        filter.status = status;
      }
      
      if (saleType && Object.values(SaleType).includes(saleType)) {
        filter.saleType = saleType;
      }
      
      // Filtro por fechas
      if (startDate || endDate) {
        filter.date = {};
        
        if (startDate) {
          filter.date[Op.gte] = new Date(startDate);
        }
        
        if (endDate) {
          filter.date[Op.lte] = new Date(endDate);
        }
      }
      
      // Obtener las ventas
      const sales = await Sale.findAndCountAll({
        where: filter,
        limit: Number(limit),
        offset: Number(offset),
        order: [['date', 'DESC']],
        include: [
          { association: 'user', attributes: ['id', 'name', 'email'] }
        ]
      });
      
      return {
        success: true,
        data: sales.rows,
        total: sales.count,
        limit: Number(limit),
        offset: Number(offset),
        statusCode: 200
      };
    } catch (error) {
      console.error('Error al obtener ventas:', error);
      return {
        success: false,
        error: 'Error al obtener ventas',
        statusCode: 500
      };
    }
  }
  
  /**
   * Cancela una venta y restaura el stock
   */
  static async cancelSale(id: string, userId: string): Promise<{ success: boolean; data?: any; error?: string; statusCode?: number }> {
    const transaction: Transaction = await sequelize.transaction();
    
    try {
      // Buscar la venta
      const sale = await Sale.findByPk(id, {
        include: [{ association: 'items' }]
      });
      
      if (!sale) {
        await transaction.rollback();
        return {
          success: false,
          error: 'Venta no encontrada',
          statusCode: 404
        };
      }
      
      // Convertir a SaleWithItems
      const saleWithItems = sale as unknown as SaleWithItems;
      
      // Verificar si la venta ya está cancelada
      if (sale.status === SaleStatus.CANCELLED) {
        await transaction.rollback();
        return {
          success: false,
          error: 'La venta ya está cancelada',
          statusCode: 400
        };
      }
      
      // Actualizar el estado de la venta
      await sale.update({ status: SaleStatus.CANCELLED }, { transaction });
      
      // Restaurar el stock de los productos y lotes
      for (const item of saleWithItems.items) {
        // Obtener el lote asociado a este ítem de venta
        const batch = await Batch.findByPk(item.batchId, { transaction });
        if (batch) {
          // Restaurar la cantidad al lote
          await batch.increment('availableQuantity', { by: item.quantity, transaction });
          
          // Registrar el movimiento de stock (entrada por cancelación)
          await sequelize.models.StockMovements.create({
            productId: item.productId,
            batchId: item.batchId,
            type: StockMovementType.IN,
            quantity: item.quantity,
            unitCost: item.unitCost,
            notes: `Cancelación de venta #${sale.id} - ${sale.clientName || 'Cliente no registrado'}`
          }, { transaction });
        }
        
        // Actualizar el stock total del producto
        const product = await Product.findByPk(item.productId, { transaction });
        if (product) {
          await product.increment('stock', { by: item.quantity, transaction });
        }
      }
      
      await transaction.commit();
      
      // Obtener la venta actualizada
      const updatedSale = await Sale.findByPk(id, {
        include: [
          { association: 'items', include: [{ association: 'product' }] },
          { association: 'user' }
        ]
      });
      
      return {
        success: true,
        data: updatedSale,
        statusCode: 200
      };
    } catch (error) {
      await transaction.rollback();
      console.error('Error al cancelar venta:', error);
      return {
        success: false,
        error: 'Error al cancelar venta',
        statusCode: 500
      };
    }
  }
}
