import Product from '../../models/Product';
import { CreateProductDto } from '../../dto/ProductDto';
import { Transaction } from 'sequelize';

export interface ProductFilters {
  status?: string;
  categoryId?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface IProductRepository {
  findAll(filters?: ProductFilters): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  create(product: CreateProductDto, options?: { transaction?: Transaction }): Promise<Product>;
  update(id: string, product: CreateProductDto, options?: { transaction?: Transaction }): Promise<Product>;
  delete(id: string): Promise<void>;
  search(query: string, filters?: ProductFilters): Promise<Product[]>;
}