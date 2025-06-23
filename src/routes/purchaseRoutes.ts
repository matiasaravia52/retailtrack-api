import express from 'express';
import { PurchaseController } from '../controllers/PurchaseController';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();
const purchaseController = new PurchaseController();

// Rutas para compras
router.get('/', authMiddleware, purchaseController.getAllPurchases);
router.get('/search', authMiddleware, purchaseController.searchPurchases);
router.get('/supplier/:supplierId', authMiddleware, purchaseController.getPurchasesBySupplier);
router.get('/:id', authMiddleware, purchaseController.getPurchaseById);
router.post('/', authMiddleware, purchaseController.createPurchase);
router.put('/:id', authMiddleware, purchaseController.updatePurchase);
router.delete('/:id', authMiddleware, purchaseController.deletePurchase);

export default router;
