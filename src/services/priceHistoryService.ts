import { Transaction } from 'sequelize';
import { PriceHistory, Product } from '../models';
import { PriceType } from '../models/PriceHistory';
import { sequelize } from '../config/database';

interface PriceHistoryData {
  productId: string;
  priceType: PriceType;
  value: number;
  userId: string;
  startDate?: Date;
}

interface PriceHistoryFilters {
  productId?: string;
  priceType?: PriceType;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

interface PriceHistoryResponse {
  success: boolean;
  data?: any;
  error?: string;
  statusCode?: number;
  total?: number;
  limit?: number;
  offset?: number;
  currentPrices?: {
    cost: number;
    retail_price: number;
    wholesale_price: number;
  };
}

export class PriceHistoryService {
  /**
   * Registra un nuevo precio y cierra el precio anterior si existe
   */
  static async registerPriceChange(data: PriceHistoryData): Promise<{ success: boolean; data?: any; error?: string; statusCode?: number }> {
    const transaction: Transaction = await sequelize.transaction();
    
    try {
      const { productId, priceType, value, userId, startDate = new Date() } = data;
      
      // Validar datos
      if (!productId || !priceType || value === undefined || value < 0 || !userId) {
        await transaction.rollback();
        return {
          success: false,
          error: 'Datos incompletos o inválidos',
          statusCode: 400
        };
      }
      
      // Verificar si el producto existe
      const product = await Product.findByPk(productId);
      if (!product) {
        await transaction.rollback();
        return {
          success: false,
          error: 'Producto no encontrado',
          statusCode: 404
        };
      }
      
      // Buscar el precio actual (activo) para cerrar su vigencia
      const currentPrice = await PriceHistory.findOne({
        where: {
          productId,
          priceType,
          endDate: null
        },
        order: [['startDate', 'DESC']]
      });
      
      // Si existe un precio activo, cerrar su vigencia
      if (currentPrice) {
        currentPrice.endDate = startDate;
        await currentPrice.save({ transaction });
      }
      
      // Crear el nuevo registro de precio
      const newPrice = await PriceHistory.create({
        productId,
        priceType,
        value,
        userId,
        startDate,
        endDate: null
      }, { transaction });
      
      // Actualizar el precio en el producto
      if (priceType === PriceType.COST) {
        await product.update({ cost: value }, { transaction });
      } else if (priceType === PriceType.RETAIL) {
        await product.update({ retail_price: value }, { transaction });
      } else if (priceType === PriceType.WHOLESALE) {
        await product.update({ wholesale_price: value }, { transaction });
      }
      
      await transaction.commit();
      
      return {
        success: true,
        data: newPrice,
        statusCode: 201
      };
    } catch (error) {
      await transaction.rollback();
      console.error('Error al registrar cambio de precio:', error);
      return {
        success: false,
        error: 'Error al registrar cambio de precio',
        statusCode: 500
      };
    }
  }
  
  /**
   * Obtiene el historial de precios según los filtros
   */
  static async getPriceHistory(filters: PriceHistoryFilters): Promise<{ success: boolean; data?: any; error?: string; statusCode?: number; total?: number; limit?: number; offset?: number }> {
    try {
      const { productId, priceType, startDate, endDate, limit = 50, offset = 0 } = filters;
      
      // Construir el filtro
      const filter: any = {};
      
      if (productId) {
        filter.productId = productId;
      }
      
      if (priceType && Object.values(PriceType).includes(priceType)) {
        filter.priceType = priceType;
      }
      
      // Filtro por fechas
      if (startDate || endDate) {
        filter.startDate = {};
        
        if (startDate) {
          filter.startDate.$gte = new Date(startDate);
        }
        
        if (endDate) {
          filter.startDate.$lte = new Date(endDate);
        }
      }
      
      // Obtener el historial de precios
      const priceHistory = await PriceHistory.findAndCountAll({
        where: filter,
        limit: Number(limit),
        offset: Number(offset),
        order: [['startDate', 'DESC']],
        include: [
          { association: 'product', attributes: ['id', 'name', 'sku'] },
          { association: 'user', attributes: ['id', 'name', 'email'] }
        ]
      });
      
      return {
        success: true,
        data: priceHistory.rows,
        total: priceHistory.count,
        limit: Number(limit),
        offset: Number(offset),
        statusCode: 200
      };
    } catch (error) {
      console.error('Error al obtener historial de precios:', error);
      return {
        success: false,
        error: 'Error al obtener historial de precios',
        statusCode: 500
      };
    }
  }
  
  /**
   * Obtiene el historial de precios de un producto específico
   */
  static async getProductPriceHistory(productId: string, limit: number = 50, offset: number = 0): Promise<PriceHistoryResponse> {
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
      
      // Obtener el historial de precios
      const priceHistory = await PriceHistory.findAndCountAll({
        where: { productId },
        limit: Number(limit),
        offset: Number(offset),
        order: [['startDate', 'DESC'], ['priceType', 'ASC']],
        include: [
          { association: 'user', attributes: ['id', 'name', 'email'] }
        ]
      });
      
      // Obtener los precios actuales
      const currentPrices = {
        cost: product.cost,
        retail_price: product.retail_price,
        wholesale_price: product.wholesale_price
      };
      
      return {
        success: true,
        data: priceHistory.rows,
        total: priceHistory.count,
        limit: Number(limit),
        offset: Number(offset),
        currentPrices,
        statusCode: 200
      };
    } catch (error) {
      console.error('Error al obtener historial de precios del producto:', error);
      return {
        success: false,
        error: 'Error al obtener historial de precios del producto',
        statusCode: 500
      };
    }
  }
}
