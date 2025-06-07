import { CreateBatchDto, UpdateBatchDto } from "../dto/BatchDto";
import { IBatchRepository } from "../interfaces/repository/IBatchRepository";
import { IBatchService } from "../interfaces/service/IBatchService";
import { sequelize } from '../config/database';
import { IStockMovementRepository } from '../interfaces/repository/IStockMovementRepository';

import Batch from "../models/Batch";
import { StockMovementType } from "../models/StockMovements";

export class BatchService implements IBatchService {    
    constructor(private batchRepository: IBatchRepository, private stockMovementRepository: IStockMovementRepository) { }
    
    async getAllBatches(): Promise<Batch[]> {
        return this.batchRepository.findAll();
    }

    async getBatchById(id: string): Promise<Batch | null> {
        return this.batchRepository.findById(id);
    }

    async createBatch(batchData: CreateBatchDto): Promise<Batch> {
        const transaction = await sequelize.transaction();
        try {
            const batch = await this.batchRepository.create(batchData, { transaction });
            await this.stockMovementRepository.create({
                productId: batchData.productId,
                batchId: batch.id,
                type: StockMovementType.IN,
                quantity: batchData.initialQuantity,
                unitCost: batchData.unitCost
            }, { transaction });
            await transaction.commit();
            return batch;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async updateBatch(id: string, batchData: UpdateBatchDto): Promise<Batch> {
        const transaction = await sequelize.transaction();
        try {
            const batch = await this.batchRepository.update(id, batchData);

            await transaction.commit();
            return batch;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async deleteBatch(id: string): Promise<void> {
        const transaction = await sequelize.transaction();
        try {
            await this.batchRepository.delete(id);
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async searchBatches(query: string): Promise<Batch[]> {
        return this.batchRepository.search(query);
    }
    
}