import Product from '../../models/Product';
import { CreateProductDto } from '../../dto/ProductDto';
import { Transaction } from 'sequelize';

export interface IProductRepository {
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  create(product: CreateProductDto, options?: { transaction?: Transaction }): Promise<Product>;
  update(id: string, product: CreateProductDto, options?: { transaction?: Transaction }): Promise<Product>;
  delete(id: string): Promise<void>;
  search(query: string): Promise<Product[]>;
}