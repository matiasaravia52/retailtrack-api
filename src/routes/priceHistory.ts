import express, { Router } from 'express';
import { PriceHistoryController } from '../controllers/priceHistoryController';
import { authMiddleware } from '../middleware';

const router: Router = express.Router();

// Rutas para historial de precios
router.post('/price-history', authMiddleware, PriceHistoryController.registerPriceChange);
router.get('/price-history', authMiddleware, PriceHistoryController.getPriceHistory);
router.get('/products/:id/price-history', authMiddleware, PriceHistoryController.getProductPriceHistory);

export default router;
