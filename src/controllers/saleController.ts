import { Request, Response } from 'express';
import { SaleService } from '../services/saleService';
import { SaleStatus, SaleType } from '../models/Sale';

export class SaleController {
  /**
   * Registra una nueva venta
   */
  static async createSale(req: Request, res: Response): Promise<void> {
    const { 
      clientName, 
      clientDocument, 
      clientPhone, 
      clientEmail, 
      items, 
      taxAmount, 
      discountAmount, 
      notes, 
      saleType, 
      documentNumber, 
      paymentMethod 
    } = req.body;
    
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({ message: 'Usuario no autenticado' });
      return;
    }
    
    const result = await SaleService.createSale({
      userId,
      clientName,
      clientDocument,
      clientPhone,
      clientEmail,
      items,
      taxAmount,
      discountAmount,
      notes,
      saleType,
      documentNumber,
      paymentMethod
    });
    
    if (result.success) {
      res.status(result.statusCode || 201).json({
        message: 'Venta registrada correctamente',
        data: result.data
      });
    } else {
      const response: any = { message: result.error };
      
      // Agregar información adicional si hay stock insuficiente
      if (result.insufficientStock) {
        response.insufficientStock = result.insufficientStock;
      }
      
      res.status(result.statusCode || 500).json(response);
    }
  }
  
  /**
   * Obtiene una venta por su ID
   */
  static async getSaleById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    
    const result = await SaleService.getSaleById(id);
    
    if (result.success) {
      res.status(result.statusCode || 200).json({
        message: 'Venta obtenida correctamente',
        data: result.data
      });
    } else {
      res.status(result.statusCode || 500).json({ message: result.error });
    }
  }
  
  /**
   * Obtiene todas las ventas según los filtros
   */
  static async getSales(req: Request, res: Response): Promise<void> {
    const { userId, clientName, status, saleType, startDate, endDate, limit = 50, offset = 0 } = req.query;
    
    const result = await SaleService.getSales({
      userId: userId as string,
      clientName: clientName as string,
      status: status as SaleStatus,
      saleType: saleType as SaleType,
      startDate: startDate as string,
      endDate: endDate as string,
      limit: Number(limit),
      offset: Number(offset)
    });
    
    if (result.success) {
      res.status(result.statusCode || 200).json({
        message: 'Ventas obtenidas correctamente',
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
   * Cancela una venta y restaura el stock
   */
  static async cancelSale(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({ message: 'Usuario no autenticado' });
      return;
    }
    
    const result = await SaleService.cancelSale(id, userId);
    
    if (result.success) {
      res.status(result.statusCode || 200).json({
        message: 'Venta cancelada correctamente',
        data: result.data
      });
    } else {
      res.status(result.statusCode || 500).json({ message: result.error });
    }
  }
}
