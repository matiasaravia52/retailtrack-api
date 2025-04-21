import Product from '../../models/Product';
import { CreateProductDto } from '../../dto/ProductDto';

export interface IProductService {
  getAllProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product | null>;
  createProduct(productData: CreateProductDto): Promise<Product>;
  updateProduct(id: string, productData: CreateProductDto): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
  searchProducts(query: string): Promise<Product[]>;
}
