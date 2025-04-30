import express, { Router } from 'express';
import { ProductController } from '../controllers/productController';
import { authMiddleware } from '../middleware';

const router: Router = express.Router();

router.route('/products')
  .get(authMiddleware, ProductController.getAllProducts)
  .post(authMiddleware, ProductController.createProduct);

router.get('/products/search', authMiddleware, ProductController.searchProducts);

router.route('/products/:id')
  .get(authMiddleware, ProductController.getProductById)
  .put(authMiddleware, ProductController.updateProduct)
  .delete(authMiddleware, ProductController.deleteProduct);

export default router;
