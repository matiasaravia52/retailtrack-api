import { ProductStatus } from '../models/Product';

export interface CreateProductDto {
  name: string;
  description: string;
  status?: ProductStatus;
  categoryId?: string;
  stock?: number;
  cost?: number;
  retail_price?: number;
  wholesale_price?: number;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  status?: ProductStatus;
  categoryId?: string;
  stock?: number;
  cost?: number;
  retail_price?: number;
  wholesale_price?: number;
}

export const validateCreateProductDto = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!data.name) {
    errors.push('Name is required');
  }
  
  if (!data.description) {
    errors.push('Description is required');
  }
  
  return { isValid: errors.length === 0, errors };
};

export const validateUpdateProductDto = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (data.name === undefined &&
    data.description === undefined &&
    data.status === undefined &&
    data.categoryId === undefined &&
    data.stock === undefined &&
    data.cost === undefined &&
    data.retail_price === undefined &&
    data.wholesale_price === undefined) {
    errors.push('At least one field must be provided for update');
    return { isValid: false, errors };
  }

  return { isValid: errors.length === 0, errors };
};