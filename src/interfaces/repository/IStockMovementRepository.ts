import StockMovements from "../../models/StockMovements";
import { CreateStockMovementsDto, UpdateStockMovementsDto } from "../../dto/StockMovementsDto";

export interface IStockMovementRepository {
    findAll(): Promise<StockMovements[]>;
    findById(id: string): Promise<StockMovements | null>;
    create(stockMovement: CreateStockMovementsDto, options?: {}): Promise<StockMovements>;
    update(id: string, stockMovement: UpdateStockMovementsDto): Promise<StockMovements>;
    delete(id: string): Promise<void>;
    search(query: string): Promise<StockMovements[]>;
}
