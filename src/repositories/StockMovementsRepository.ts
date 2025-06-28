import { Op } from "sequelize";
import { CreateStockMovementsDto, UpdateStockMovementsDto } from "../dto/StockMovementsDto";
import { IStockMovementRepository } from "../interfaces/repository/IStockMovementRepository";
import StockMovements from "../models/StockMovements";
import { StockMovementType } from "../models/StockMovements";

export class StockMovementsRepository implements IStockMovementRepository {
    async findAll(): Promise<StockMovements[]> {
        return StockMovements.findAll();
    }

    async findById(id: string): Promise<StockMovements | null> {
        return StockMovements.findByPk(id);
    }

    async create(stockMovement: CreateStockMovementsDto, options?: {}): Promise<StockMovements> {
        return StockMovements.create({
            productId: stockMovement.productId,
            batchId: stockMovement.batchId,
            type: stockMovement.type,
            quantity: stockMovement.quantity,
            unitCost: stockMovement.unitCost
        }, options);
    }

    async update(id: string, stockMovement: UpdateStockMovementsDto): Promise<StockMovements> {
        const existingStockMovement = await this.findById(id);
        if (!existingStockMovement) {
            throw new Error('Stock movement not found');
        }
        return existingStockMovement.update(stockMovement);
    }

    async delete(id: string): Promise<void> {
        const existingStockMovement = await this.findById(id);
        if (!existingStockMovement) {
            throw new Error('Stock movement not found');
        }
        await existingStockMovement.destroy();
    }

    async search(query: string): Promise<StockMovements[]> {
        return StockMovements.findAll({
            where: {
                [Op.or]: [  
                    {   productId: { [Op.eq]: query } },
                    {   batchId: { [Op.eq]: query } },
                    {   type: { [Op.eq]: query } },
                    {   quantity: { [Op.eq]: query } },
                    {   unitCost: { [Op.eq]: query } }
                ]
            }
        });
    }
}
