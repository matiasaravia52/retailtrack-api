import express, { Router } from 'express';
import { SaleController } from '../controllers/saleController';
import { authMiddleware } from '../middleware';

const router: Router = express.Router();

// Rutas para ventas
router.post('/sales', authMiddleware, SaleController.createSale);
router.get('/sales', authMiddleware, SaleController.getSales);
router.get('/sales/:id', authMiddleware, SaleController.getSaleById);
router.post('/sales/:id/cancel', authMiddleware, SaleController.cancelSale);

export default router;
