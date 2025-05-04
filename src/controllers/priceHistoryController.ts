import { Request, Response } from 'express';
import { PriceHistoryService } from '../services/priceHistoryService';
import { PriceType } from '../models/PriceHistory';

export class PriceHistoryController {
  /**
   * Registra un cambio de precio
   */
  static async registerPriceChange(req: Request, res: Response): Promise<void> {
    const { productId, priceType, value, startDate } = req.body;
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({ message: 'Usuario no autenticado' });
      return;
    }
    
    const result = await PriceHistoryService.registerPriceChange({
      productId,
      priceType,
      value,
      userId,
      startDate: startDate ? new Date(startDate) : undefined
    });
    
    if (result.success) {
      res.status(result.statusCode || 201).json({
        message: 'Cambio de precio registrado correctamente',
        data: result.data
      });
    } else {
      res.status(result.statusCode || 500).json({ message: result.error });
    }
  }
  
  /**
   * Obtiene el historial de precios
   */
  static async getPriceHistory(req: Request, res: Response): Promise<void> {
    const { productId, priceType, startDate, endDate, limit = 50, offset = 0 } = req.query;
    
    const result = await PriceHistoryService.getPriceHistory({
      productId: productId as string,
      priceType: priceType as PriceType,
      startDate: startDate as string,
      endDate: endDate as string,
      limit: Number(limit),
      offset: Number(offset)
    });
    
    if (result.success) {
      res.status(result.statusCode || 200).json({
        message: 'Historial de precios obtenido correctamente',
        data: result.data,
        total: result.total,
        limit: result.limit,
        offset: result.offset
      });
    } else {
      res.status(result.statusCode || 500).json({ message: result.error });
    }
  }
  
  /**
   * Obtiene el historial de precios de un producto específico
   */
  static async getProductPriceHistory(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { limit = 50, offset = 0 } = req.query;
    
    const result = await PriceHistoryService.getProductPriceHistory(
      id,
      Number(limit),
      Number(offset)
    );
    
    if (result.success) {
      res.status(result.statusCode || 200).json({
        message: 'Historial de precios del producto obtenido correctamente',
        data: result.data,
        total: result.total,
        limit: result.limit,
        offset: result.offset,
        ...(result.currentPrices && { currentPrices: result.currentPrices })
      });
    } else {
      res.status(result.statusCode || 500).json({ message: result.error });
    }
  }
}
