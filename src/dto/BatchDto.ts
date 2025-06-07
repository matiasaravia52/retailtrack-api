export interface CreateBatchDto {
    productId: string;
    initialQuantity: number;
    availableQuantity: number;
    unitCost: number;
}

export interface UpdateBatchDto {
    productId?: string;
    initialQuantity?: number;
    availableQuantity?: number;
    unitCost?: number;
}
