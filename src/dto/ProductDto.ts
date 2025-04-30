export interface CreateProductDto {
  name: string;
  description: string;
  cost: number;
  wholesale_price: number;
  retail_price: number;
  image: string;
  unit_measurement: string;
  sku: string;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  cost?: number;
  wholesale_price?: number;
  retail_price?: number;
  image?: string;
  unit_measurement?: string;
  sku?: string;
}

export const validateCreateProductDto = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!data.name) {
    errors.push('Name is required');
  }
  
  if (!data.description) {
    errors.push('Description is required');
  }
  
  if (data.cost == undefined) {
    errors.push('Cost is required');
  }

  if (data.wholesale_price == undefined) {
    errors.push('Wholesale price is required');
  }

  if (data.retail_price == undefined) {
    errors.push('Retail price is required');
  }

  if (data.image == undefined) {
    errors.push('Image is required');
  }

  if (data.unit_measurement == undefined) {
    errors.push('Unit measurement is required');
  }

  if (data.sku == undefined) {
    errors.push('Sku is required');
  }

  return { isValid: errors.length === 0, errors };
};

export const validateUpdateProductDto = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (data.name === undefined &&
    data.description === undefined &&
    data.cost === undefined &&
    data.wholesale_price === undefined &&
    data.retail_price === undefined &&
    data.image === undefined &&
    data.unit_measurement === undefined &&
    data.sku === undefined) {
    errors.push('At least one field must be provided for update');
    return { isValid: false, errors };
  }
  
  return { isValid: errors.length === 0, errors };
};