import Product from '../../models/Product';
import { CreateProductDto } from '../../dto/ProductDto';
import { ProductFilters, PaginatedResult } from '../repository/IProductRepository';

export interface IProductService {
  getAllProducts(filters?: ProductFilters): Promise<PaginatedResult<Product>>;
  getProductById(id: string): Promise<Product | null>;
  createProduct(productData: CreateProductDto): Promise<Product>;
  updateProduct(id: string, productData: CreateProductDto): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
  searchProducts(query: string, filters?: ProductFilters): Promise<PaginatedResult<Product>>;
}
