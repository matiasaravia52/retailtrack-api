import { SupplierStatus } from '../models/Supplier';

export interface CreateSupplierDto {
    name: string;
    phone?: string;
    email?: string;
    address?: string;
    status?: SupplierStatus;
}

export interface UpdateSupplierDto {
    name?: string;
    phone?: string;
    email?: string;
    address?: string;
    status?: SupplierStatus;
}
