import express from 'express';
import { CustomerController } from '../controllers/CustomerController';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();
const customerController = new CustomerController();

// Rutas para clientes
router.get('/', authMiddleware, customerController.getAllCustomers);
router.get('/search', authMiddleware, customerController.searchCustomers);
router.get('/:id', authMiddleware, customerController.getCustomerById);
router.post('/', authMiddleware, customerController.createCustomer);
router.put('/:id', authMiddleware, customerController.updateCustomer);
router.delete('/:id', authMiddleware, customerController.deleteCustomer);

export default router;
