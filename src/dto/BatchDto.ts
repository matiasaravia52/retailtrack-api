export interface CreateBatchDto {
    productId: string;
    initialQuantity: number;
    availableQuantity: number;
    unitCost: number;
    expirationDate?: Date;
}

export interface UpdateBatchDto {
    productId?: string;
    initialQuantity?: number;
    availableQuantity?: number;
    unitCost?: number;
    expirationDate?: Date;
}
