import Product from '../../models/Product';
import { CreateProductDto } from '../../dto/ProductDto';
import { ProductFilters } from '../repository/IProductRepository';

export interface IProductService {
  getAllProducts(filters?: ProductFilters): Promise<Product[]>;
  getProductById(id: string): Promise<Product | null>;
  createProduct(productData: CreateProductDto): Promise<Product>;
  updateProduct(id: string, productData: CreateProductDto): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
  searchProducts(query: string, filters?: ProductFilters): Promise<Product[]>;
}
