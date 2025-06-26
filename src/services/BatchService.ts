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
            // Asegurarse de que availableQuantity sea igual a initialQuantity al crear
            if (batchData.availableQuantity === undefined) {
                batchData.availableQuantity = batchData.initialQuantity;
            }
            
            // Si no se proporciona fecha de expiración, establecer una por defecto (1 año desde hoy)
            if (!batchData.expirationDate) {
                const oneYearFromNow = new Date();
                oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
                batchData.expirationDate = oneYearFromNow;
            }
            
            // Crear el lote
            const batch = await this.batchRepository.create(batchData, { transaction });
            
            // Registrar el movimiento de stock
            await this.stockMovementRepository.create({
                productId: batchData.productId,
                batchId: batch.id,
                type: StockMovementType.IN,
                quantity: batchData.initialQuantity,
                unitCost: batchData.unitCost,
                notes: `Ingreso de lote #${batch.id}`
            }, { transaction });
            
            // Actualizar el stock total del producto
            const product = await sequelize.models.Product.findByPk(batchData.productId, { transaction });
            if (product) {
                await product.increment('stock', { by: batchData.initialQuantity, transaction });
            } else {
                // Si el producto no existe, hacer rollback
                await transaction.rollback();
                throw new Error(`Producto con ID ${batchData.productId} no encontrado`);
            }
            
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