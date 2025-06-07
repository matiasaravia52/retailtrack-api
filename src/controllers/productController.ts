import { Request, Response, NextFunction } from 'express';
import { IProductService } from '../interfaces/service/IProductService';
import { ProductRepository } from '../repositories/ProductRepository';
import { validateCreateProductDto, validateUpdateProductDto } from '../dto/ProductDto';
import { ApiError } from '../middleware/errorHandler';


export class ProductController {

  constructor(private productService: IProductService) {}

  async getAllProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const products = await this.productService.getAllProducts();
      res.json(products);
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
      await this.productService.deleteProduct(id);
      res.status(204).send();
    } catch (error) {
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

      const products = await this.productService.searchProducts(query);
      res.json(products);
    } catch (error) {
      next(error);
    }
  }
}

export default ProductController;   
