import Product from '../../models/Product';
import { CreateProductDto } from '../../dto/ProductDto';

export interface IProductRepository {
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  create(product: CreateProductDto): Promise<Product>;
  update(id: string, product: CreateProductDto): Promise<Product>;
  delete(id: string): Promise<void>;
  search(query: string): Promise<Product[]>;
}