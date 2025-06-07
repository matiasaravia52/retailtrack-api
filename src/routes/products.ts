import express, { Router } from 'express';
import { ProductController } from '../controllers/productController';
import { authMiddleware } from '../middleware';
import { ProductRepository } from '../repositories/ProductRepository';
import ProductService from '../services/ProductService';

const router: Router = express.Router();

// Crear instancias de las dependencias
const productRepository = new ProductRepository();
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

router.route('/products')
  .get(authMiddleware, (req, res, next) => productController.getAllProducts(req, res, next))
  .post(authMiddleware, (req, res, next) => productController.createProduct(req, res, next));

router.get('/products/search', authMiddleware, (req, res, next) => productController.searchProducts(req, res, next));

router.route('/products/:id')
  .get(authMiddleware, (req, res, next) => productController.getProductById(req, res, next))
  .put(authMiddleware, (req, res, next) => productController.updateProduct(req, res, next))
  .delete(authMiddleware, (req, res, next) => productController.deleteProduct(req, res, next));

export default router;