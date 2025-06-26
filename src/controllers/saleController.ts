import { Request, Response } from 'express';
import { SaleService } from '../services/saleService';
import { SaleStatus, SaleType } from '../models/Sale';

export const createSale = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user as { userId: string };
    const saleData = {
      ...req.body,
      userId
    };
    
    const result = await SaleService.createSale(saleData);
    
    return res.status(result.statusCode || 500).json(result);
  } catch (error) {
    console.error('Error en el controlador de creación de venta:', error);
    return res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

export const getSaleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const result = await SaleService.getSaleById(id);
    
    return res.status(result.statusCode || 500).json(result);
  } catch (error) {
    console.error('Error en el controlador de obtención de venta:', error);
    return res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

export const getSales = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user as { userId: string };
    const { 
      clientName, 
      status, 
      saleType, 
      startDate, 
      endDate, 
      limit, 
      offset 
    } = req.query;
    
    const filters = {
      userId,
      clientName: clientName as string | undefined,
      status: status as SaleStatus | undefined,
      saleType: saleType as SaleType | undefined,
      startDate: startDate as string | undefined,
      endDate: endDate as string | undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      offset: offset ? parseInt(offset as string) : undefined
    };
    
    const result = await SaleService.getSales(filters);
    
    return res.status(result.statusCode || 500).json(result);
  } catch (error) {
    console.error('Error en el controlador de obtención de ventas:', error);
    return res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

export const cancelSale = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req.user as { userId: string };
    
    const result = await SaleService.cancelSale(id, userId);
    
    return res.status(result.statusCode || 500).json(result);
  } catch (error) {
    console.error('Error en el controlador de cancelación de venta:', error);
    return res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};
