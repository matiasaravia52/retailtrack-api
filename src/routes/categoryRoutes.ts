import express from 'express';
import { CategoryController } from '../controllers/CategoryController';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();
const categoryController = new CategoryController();

// Rutas para categorías
router.get('/', authMiddleware, categoryController.getAllCategories);
router.get('/search', authMiddleware, categoryController.searchCategories);
router.get('/:id', authMiddleware, categoryController.getCategoryById);
router.post('/', authMiddleware, categoryController.createCategory);
router.put('/:id', authMiddleware, categoryController.updateCategory);
router.delete('/:id', authMiddleware, categoryController.deleteCategory);

export default router;
