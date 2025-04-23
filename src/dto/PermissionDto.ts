export interface CreatePermissionDto {
  name: string;
  description?: string;
}

export interface UpdatePermissionDto {
  name?: string;
  description?: string;
}

export interface PermissionDto {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PermissionWithRolesDto extends PermissionDto {
  roles: {
    id: string;
    name: string;
    description: string;
  }[];
}
