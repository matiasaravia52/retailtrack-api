export interface CreateProductDto {
  name: string;
  description: string;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
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
  
  if (!data.name && !data.description) {
    errors.push('At least one field must be provided for update');
    return { isValid: false, errors };
  }
  
  return { isValid: errors.length === 0, errors };
};