import { Op } from 'sequelize';
import { Sale, SaleItem, Product, Batch, Purchase } from '../models';
import { SaleStatus } from '../models/Sale';
import { sequelize } from '../config/database';

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
          dateFilter.date[Op.gte] = new Date(startDate);
        }
        
        if (endDate) {
          dateFilter.date[Op.lte] = new Date(endDate);
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
