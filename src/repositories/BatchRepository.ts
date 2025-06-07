import { IBatchRepository } from "../interfaces/repository/IBatchRepository";
import Batch from "../models/Batch";
import { CreateBatchDto, UpdateBatchDto } from "../dto/BatchDto";
import { CreateOptions, Op, UpdateOptions } from "sequelize";

export class BatchRepository implements IBatchRepository {
    async findAll(): Promise<Batch[]> {
        return Batch.findAll();
    }

    async findById(id: string): Promise<Batch | null> {
        return Batch.findByPk(id);
    }

    async create(batch: CreateBatchDto, options?: CreateOptions): Promise<Batch> {
        return Batch.create({
            productId: batch.productId,
            initialQuantity: batch.initialQuantity,
            availableQuantity: batch.availableQuantity,
            unitCost: batch.unitCost
        }, options);
    }

    async update(id: string, batch: UpdateBatchDto, options?: UpdateOptions): Promise<Batch> {
        const existingBatch = await this.findById(id);
        if (!existingBatch) {
            throw new Error('Batch not found');
        }
        return existingBatch.update({
            productId: batch.productId,
            initialQuantity: batch.initialQuantity,
            availableQuantity: batch.availableQuantity,
            unitCost: batch.unitCost
        });
    }

    async delete(id: string): Promise<void> {
        const existingBatch = await this.findById(id);
        if (!existingBatch) {
            throw new Error('Batch not found');
        }
        await existingBatch.destroy();
    }

    async search(query: string): Promise<Batch[]> {
        return Batch.findAll({
            where: {
                [Op.or]: [
                    {   productId: { [Op.eq]: query } },
                    {   initialQuantity: { [Op.eq]: query } },
                    {   availableQuantity: { [Op.eq]: query } },
                    {   unitCost: { [Op.eq]: query } }
                ]
            }
        });
    }
}
