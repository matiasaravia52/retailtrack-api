export interface CreateRoleDto {
  name: string;
  description?: string;
}

export interface UpdateRoleDto {
  name?: string;
  description?: string;
}

export interface RoleDto {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RoleWithPermissionsDto extends RoleDto {
  permissions: {
    id: string;
    name: string;
    description: string;
  }[];
}
