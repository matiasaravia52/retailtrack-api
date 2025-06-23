import express from 'express';
import { SupplierController } from '../controllers/SupplierController';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();
const supplierController = new SupplierController();

// Rutas para proveedores
router.get('/', authMiddleware, supplierController.getAllSuppliers);
router.get('/search', authMiddleware, supplierController.searchSuppliers);
router.get('/:id', authMiddleware, supplierController.getSupplierById);
router.post('/', authMiddleware, supplierController.createSupplier);
router.put('/:id', authMiddleware, supplierController.updateSupplier);
router.delete('/:id', authMiddleware, supplierController.deleteSupplier);

export default router;
