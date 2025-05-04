import { Request, Response } from 'express';
import { InventoryService } from '../services/inventoryService';
import { InventoryMovementType } from '../models/Inventory';

export class InventoryController {
  /**
   * Registra una entrada de productos al inventario
   */
  static async registerInput(req: Request, res: Response): Promise<void> {
    const { productId, quantity, unitCost, notes, documentReference } = req.body;
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({ message: 'Usuario no autenticado' });
      return;
    }
    
    const result = await InventoryService.registerInput({
      productId,
      userId,
      quantity,
      unitCost,
      notes,
      documentReference
    });
    
    if (result.success) {
      res.status(result.statusCode || 201).json({
        message: 'Entrada de inventario registrada correctamente',
        data: result.data
      });
    } else {
      res.status(result.statusCode || 500).json({ message: result.error });
    }
  }
  
  /**
   * Registra una salida de productos del inventario
   */
  static async registerOutput(req: Request, res: Response): Promise<void> {
    const { productId, quantity, unitCost, notes, documentReference } = req.body;
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({ message: 'Usuario no autenticado' });
      return;
    }
    
    const result = await InventoryService.registerOutput({
      productId,
      userId,
      quantity,
      unitCost,
      notes,
      documentReference
    });
    
    if (result.success) {
      res.status(result.statusCode || 201).json({
        message: 'Salida de inventario registrada correctamente',
        data: result.data
      });
    } else {
      const response: any = { message: result.error };
      
      // Agregar información adicional si hay stock insuficiente
      if (result.currentStock !== undefined) {
        response.currentStock = result.currentStock;
        response.requestedQuantity = quantity;
      }
      
      res.status(result.statusCode || 500).json(response);
    }
  }
  
  /**
   * Obtiene el historial de movimientos de inventario
   */
  static async getInventoryMovements(req: Request, res: Response): Promise<void> {
    const { productId, movementType, startDate, endDate, limit = 50, offset = 0 } = req.query;
    
    const result = await InventoryService.getInventoryMovements({
      productId: productId as string,
      movementType: movementType as InventoryMovementType,
      startDate: startDate as string,
      endDate: endDate as string,
      limit: Number(limit),
      offset: Number(offset)
    });
    
    if (result.success) {
      res.status(result.statusCode || 200).json({
        message: 'Movimientos de inventario obtenidos correctamente',
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
   * Obtiene los movimientos de inventario de un producto específico
   */
  static async getProductInventoryMovements(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { limit = 50, offset = 0 } = req.query;
    
    const result = await InventoryService.getProductInventoryMovements(
      id,
      Number(limit),
      Number(offset)
    );
    
    if (result.success) {
      res.status(result.statusCode || 200).json({
        message: 'Movimientos de inventario obtenidos correctamente',
        data: result.data,
        total: result.total,
        limit: result.limit,
        offset: result.offset,
        currentStock: result.currentStock
      });
    } else {
      res.status(result.statusCode || 500).json({ message: result.error });
    }
  }
}

// Extender la interfaz Request para incluir el usuario autenticado
// Nota: Esto debe estar en un archivo de declaración de tipos global
// o asegurarse de que no haya conflictos con otras definiciones
declare global {
  namespace Express {
    interface Request {
      user?: any; // Usamos 'any' para evitar conflictos con otras definiciones
    }
  }
}
