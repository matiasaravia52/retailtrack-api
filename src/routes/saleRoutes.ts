import express from 'express';
import { createSale, getSaleById, getSales, cancelSale, exportSalesToCSV } from '../controllers/saleController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(authMiddleware);

// Rutas para ventas
router.post('/', createSale as any);
router.get('/export/csv', exportSalesToCSV as any);
router.get('/:id', getSaleById as any);
router.get('/', getSales as any);
router.put('/:id/cancel', cancelSale as any);

export default router;
