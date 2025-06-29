import { Request, Response } from 'express';
import { ReportService } from '../services/reportService';

export const getNetProfitReport = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    const { userId } = req.user as { userId: string };
    
    const filters = {
      startDate: startDate as string | undefined,
      endDate: endDate as string | undefined,
      // Solo filtrar por userId si el usuario no tiene permiso para ver todos los reportes
      userId: userId
    };
    
    const result = await ReportService.getNetProfitReport(filters);
    
    res.status(result.statusCode || 200).json(result);
  } catch (error) {
    console.error('Error en el controlador de reporte de ganancias:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};
