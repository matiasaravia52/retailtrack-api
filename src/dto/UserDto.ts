export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'manager' | 'employee';
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  password?: string;
  role?: 'admin' | 'manager' | 'employee';
}

export const validateCreateUserDto = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!data.name) {
    errors.push('Name is required');
  }
  
  if (!data.email) {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Email is invalid');
  }
  
  if (!data.password) {
    errors.push('Password is required');
  } else if (data.password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }
  
  if (data.role && !['admin', 'manager', 'employee'].includes(data.role)) {
    errors.push('Role must be admin, manager or employee');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateUpdateUserDto = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!data.name && !data.email && !data.password && !data.role) {
    errors.push('At least one field must be provided for update');
    return {
      isValid: false,
      errors
    };
  }
  
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Email is invalid');
  }
  
  if (data.password && data.password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }
  
  if (data.role && !['admin', 'manager', 'employee'].includes(data.role)) {
    errors.push('Role must be admin, manager or employee');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
