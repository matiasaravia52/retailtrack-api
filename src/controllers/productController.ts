import { Request, Response, NextFunction } from 'express';
import { IProductService } from '../interfaces/service/IProductService';
import { ProductRepository } from '../repositories/ProductRepository';
import { validateCreateProductDto, validateUpdateProductDto } from '../dto/ProductDto';
import { ApiError } from '../middleware/errorHandler';
import { ProductStatus } from '../models/Product';
import { ProductFilters } from '../interfaces/repository/IProductRepository';


export class ProductController {

  constructor(private productService: IProductService) {}

  async getAllProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Extraer parámetros de filtrado y ordenamiento de la solicitud
      const filters: ProductFilters = {};
      
      // Filtrar por estado (activo/inactivo)
      if (req.query.status && (req.query.status === ProductStatus.ACTIVE || req.query.status === ProductStatus.INACTIVE)) {
        filters.status = req.query.status as string;
      }
      
      // Filtrar por categoría
      if (req.query.categoryId) {
        filters.categoryId = req.query.categoryId as string;
      }
      
      // Ordenar por campo
      if (req.query.sortBy) {
        filters.sortBy = req.query.sortBy as string;
      }
      
      // Orden ascendente o descendente
      if (req.query.sortOrder && (req.query.sortOrder === 'ASC' || req.query.sortOrder === 'DESC')) {
        filters.sortOrder = req.query.sortOrder as 'ASC' | 'DESC';
      }
      
      // Parámetros de paginación
      if (req.query.page) {
        const page = parseInt(req.query.page as string);
        if (!isNaN(page) && page > 0) {
          filters.page = page;
        }
      }
      
      if (req.query.limit) {
        const limit = parseInt(req.query.limit as string);
        if (!isNaN(limit) && limit > 0) {
          filters.limit = limit;
        }
      }
      
      const paginatedResult = await this.productService.getAllProducts(filters);
      res.json(paginatedResult);
    } catch (error) {
      next(error);
    }
  }

  async getProductById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const product = await this.productService.getProductById(id);
      if (!product) {
        throw new ApiError('Product not found', 404);
      }
      res.json(product);
    } catch (error) {
      next(error);
    }
  }
    
  async createProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validation = validateCreateProductDto(req.body);
      if (!validation.isValid) {
        next(ApiError.badRequest(validation.errors.join(', ')));
        return;
      }

      const product = await this.productService.createProduct(req.body);
      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  }
    
  async updateProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const validation = validateUpdateProductDto(req.body);
      if (!validation.isValid) {
        next(ApiError.badRequest(validation.errors.join(', ')));
        return;
      }
      const product = await this.productService.updateProduct(id, req.body);
      if (!product) {
        throw new ApiError('Product not found', 404);
      }
      res.json(product);
    } catch (error) {
      next(error);
    }
  }
    
  async deleteProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      
      // Verificar si el producto existe antes de intentar eliminarlo
      const product = await this.productService.getProductById(id);
      if (!product) {
        throw new ApiError('Producto no encontrado', 404);
      }
      
      await this.productService.deleteProduct(id);
      res.status(200).json({ message: 'Producto marcado como inactivo correctamente' });
    } catch (error) {
      console.error('Error en deleteProduct controller:', error);
      next(error);
    }
  }
    
  async searchProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = req.query.query as string;
      
      if (!query) {
        next(ApiError.badRequest('Search term is required'));
        return;
      }
      
      // Extraer parámetros de filtrado y ordenamiento de la solicitud
      const filters: ProductFilters = {};
      
      // Filtrar por estado (activo/inactivo)
      if (req.query.status && (req.query.status === ProductStatus.ACTIVE || req.query.status === ProductStatus.INACTIVE)) {
        filters.status = req.query.status as string;
      }
      
      // Filtrar por categoría
      if (req.query.categoryId) {
        filters.categoryId = req.query.categoryId as string;
      }
      
      // Ordenar por campo
      if (req.query.sortBy) {
        filters.sortBy = req.query.sortBy as string;
      }
      
      // Orden ascendente o descendente
      if (req.query.sortOrder && (req.query.sortOrder === 'ASC' || req.query.sortOrder === 'DESC')) {
        filters.sortOrder = req.query.sortOrder as 'ASC' | 'DESC';
      }
      
      // Parámetros de paginación
      if (req.query.page) {
        const page = parseInt(req.query.page as string);
        if (!isNaN(page) && page > 0) {
          filters.page = page;
        }
      }
      
      if (req.query.limit) {
        const limit = parseInt(req.query.limit as string);
        if (!isNaN(limit) && limit > 0) {
          filters.limit = limit;
        }
      }

      const paginatedResult = await this.productService.searchProducts(query, filters);
      res.json(paginatedResult);
    } catch (error) {
      next(error);
    }
  }
}

export default ProductController;   
