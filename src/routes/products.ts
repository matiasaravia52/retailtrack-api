import express, { Router } from 'express';
import { ProductController } from '../controllers/productController';

const router: Router = express.Router();

router.route('/products')
  .get(ProductController.getAllProducts)
  .post(ProductController.createProduct);

router.get('/products/search', ProductController.searchProducts);

router.route('/products/:id')
  .get(ProductController.getProductById)
  .put(ProductController.updateProduct)
  .delete(ProductController.deleteProduct);

export default router;
