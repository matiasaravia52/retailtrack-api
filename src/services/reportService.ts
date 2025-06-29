import { Op } from 'sequelize';
import { Sale, SaleItem } from '../models';
import { SaleStatus } from '../models/Sale';

interface ReportFilters {
  startDate?: string;
  endDate?: string;
  userId?: string;
}

export class ReportService {
  /**
   * Obtiene el reporte de ganancias netas en un rango de fechas
   */
  static async getNetProfitReport(filters: ReportFilters): Promise<{ success: boolean; data?: any; error?: string; statusCode?: number }> {
    try {
      const { startDate, endDate, userId } = filters;
      
      // Construir el filtro de fechas
      const dateFilter: any = {};
      
      if (startDate || endDate) {
        dateFilter.date = {};
        
        if (startDate) {
          // Crear la fecha con el formato YYYY-MM-DD para evitar problemas de zona horaria
          const parts = startDate.split('-');
          const year = parseInt(parts[0]);
          const month = parseInt(parts[1]) - 1; // Los meses en JavaScript son 0-indexed
          const day = parseInt(parts[2]);
          
          // Crear la fecha al inicio del día en la zona horaria local
          const startDateTime = new Date(year, month, day, 0, 0, 0, 0);
          dateFilter.date[Op.gte] = startDateTime;
        }
        
        if (endDate) {
          // Crear la fecha con el formato YYYY-MM-DD para evitar problemas de zona horaria
          const parts = endDate.split('-');
          const year = parseInt(parts[0]);
          const month = parseInt(parts[1]) - 1; // Los meses en JavaScript son 0-indexed
          const day = parseInt(parts[2]);
          
          // Crear la fecha al final del día en la zona horaria local
          const endDateTime = new Date(year, month, day, 23, 59, 59, 999);
          dateFilter.date[Op.lte] = endDateTime;
        }
      }

      // Filtro adicional por usuario si se proporciona
      if (userId) {
        dateFilter.userId = userId;
      }

      // Obtener todas las ventas completadas en el rango de fechas
      const sales = await Sale.findAll({
        where: {
          ...dateFilter,
          status: SaleStatus.COMPLETED
        },
        include: [
          { 
            model: SaleItem, 
            as: 'items',
            attributes: ['quantity', 'unitPrice', 'unitCost', 'discount', 'totalPrice']
          }
        ]
      });

      // Calcular totales
      let totalRevenue = 0;
      let totalCost = 0;
      let totalDiscount = 0;
      let totalTax = 0;

      // Procesar cada venta
      sales.forEach((sale: any) => {
        totalRevenue += sale.subtotal;
        totalDiscount += sale.discountAmount;
        totalTax += sale.taxAmount;
        
        // Calcular el costo total de los items vendidos
        if (sale.items && Array.isArray(sale.items)) {
          sale.items.forEach((item: any) => {
            totalCost += item.quantity * item.unitCost;
          });
        }
      });

      // Calcular ganancia neta
      const netProfit = totalRevenue - totalCost - totalDiscount;
      const grossProfit = totalRevenue - totalCost;
      const netProfitWithTax = netProfit + totalTax;

      // Calcular porcentaje de ganancia
      const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

      return {
        success: true,
        data: {
          totalSales: sales.length,
          totalRevenue,
          totalCost,
          totalDiscount,
          totalTax,
          grossProfit,
          netProfit,
          netProfitWithTax,
          profitMargin: parseFloat(profitMargin.toFixed(2))
        },
        statusCode: 200
      };
    } catch (error) {
      console.error('Error al generar reporte de ganancias:', error);
      return {
        success: false,
        error: 'Error al generar reporte de ganancias',
        statusCode: 500
      };
    }
  }
}
