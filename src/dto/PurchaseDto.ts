import { PurchaseStatus } from '../models/Purchase';
import { CreatePurchaseLineDto } from './PurchaseLineDto';

export interface CreatePurchaseDto {
    supplierId: string;
    subtotal?: number;
    taxes?: number;
    total?: number;
    status?: PurchaseStatus;
    purchaseLines?: CreatePurchaseLineDto[];
}

export interface UpdatePurchaseDto {
    supplierId?: string;
    subtotal?: number;
    taxes?: number;
    total?: number;
    status?: PurchaseStatus;
}
