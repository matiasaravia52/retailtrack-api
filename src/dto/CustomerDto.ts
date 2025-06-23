import { CustomerStatus } from '../models/Customer';

export interface CreateCustomerDto {
    name: string;
    type: string;
    phone?: string;
    email?: string;
    address?: string;
    status?: CustomerStatus;
}

export interface UpdateCustomerDto {
    name?: string;
    type?: string;
    phone?: string;
    email?: string;
    address?: string;
    status?: CustomerStatus;
}
