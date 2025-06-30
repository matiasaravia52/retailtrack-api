import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { CsvImportController } from '../controllers/csvImportController';
import { ProductService } from '../services/ProductService';
import { ProductRepository } from '../repositories/ProductRepository';
import { CategoryService } from '../services/CategoryService';
import { CategoryRepository } from '../repositories/CategoryRepository';

const router = express.Router();

// Crear instancias de los servicios y controladores
const productRepository = new ProductRepository();
const productService = new ProductService(productRepository);
const categoryRepository = new CategoryRepository();
const categoryService = new CategoryService(categoryRepository);
const csvImportController = new CsvImportController(productService, categoryService);

// Aplicar middleware de autenticación a todas las rutas
router.use(authMiddleware);

// Ruta para importar productos desde CSV
router.post(
  '/products',
  csvImportController.uploadMiddleware(),
  (req, res, next) => csvImportController.importProducts(req, res, next)
);

// Ruta para descargar plantilla CSV
router.get(
  '/products/template',
  (req, res, next) => csvImportController.downloadTemplate(req, res)
);

export default router;
