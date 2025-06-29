import Product from '../../models/Product';
import { CreateProductDto } from '../../dto/ProductDto';
import { Transaction } from 'sequelize';

export interface ProductFilters {
  status?: string;
  categoryId?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IProductRepository {
  findAll(filters?: ProductFilters): Promise<PaginatedResult<Product>>;
  findById(id: string): Promise<Product | null>;
  create(product: CreateProductDto, options?: { transaction?: Transaction }): Promise<Product>;
  update(id: string, product: CreateProductDto, options?: { transaction?: Transaction }): Promise<Product>;
  delete(id: string): Promise<void>;
  search(query: string, filters?: ProductFilters): Promise<PaginatedResult<Product>>;
}