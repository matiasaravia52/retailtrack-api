import { StockMovementType } from "../models/StockMovements";

export interface CreateStockMovementsDto {
    productId: string;
    batchId: string;
    type: StockMovementType;
    quantity: number;
    unitCost: number;
}

export interface UpdateStockMovementsDto {
    productId?: string;
    batchId?: string;
    type?: StockMovementType;
    quantity?: number;
    unitCost?: number;
}
