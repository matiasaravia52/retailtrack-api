export interface CreatePurchaseLineDto {
    purchaseId?: string;
    productId: string;
    batchId?: string;
    quantity: number;
    unitCostPrice: number;
    subtotal?: number;
}

export interface UpdatePurchaseLineDto {
    purchaseId?: string;
    productId?: string;
    batchId?: string;
    quantity?: number;
    unitCostPrice?: number;
    subtotal?: number;
}
