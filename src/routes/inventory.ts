import express, { Router } from 'express';
import { InventoryController } from '../controllers/inventoryController';
import { authMiddleware } from '../middleware';

const router: Router = express.Router();

// Rutas para movimientos de inventario
router.post('/inventory/input', authMiddleware, InventoryController.registerInput);
router.post('/inventory/output', authMiddleware, InventoryController.registerOutput);
router.get('/inventory/movements', authMiddleware, InventoryController.getInventoryMovements);
router.get('/inventory/products/:id/movements', authMiddleware, InventoryController.getProductInventoryMovements);

export default router;
