import { Transaction } from 'sequelize';
import PurchaseLine from '../models/PurchaseLine';
import { IPurchaseLineRepository } from '../interfaces/repository/IPurchaseLineRepository';
import { CreatePurchaseLineDto, UpdatePurchaseLineDto } from '../dto/PurchaseLineDto';
import Product from '../models/Product';
import Batch from '../models/Batch';

export class PurchaseLineRepository implements IPurchaseLineRepository {
    async findAll(): Promise<PurchaseLine[]> {
        return await PurchaseLine.findAll({
            include: [
                { model: Product, as: 'product' },
                { model: Batch, as: 'batch' }
            ]
        });
    }

    async findById(id: string): Promise<PurchaseLine | null> {
        return await PurchaseLine.findByPk(id, {
            include: [
                { model: Product, as: 'product' },
                { model: Batch, as: 'batch' }
            ]
        });
    }

    async create(purchaseLine: CreatePurchaseLineDto, options?: { transaction?: Transaction }): Promise<PurchaseLine> {
        return await PurchaseLine.create(purchaseLine as any, options);
    }

    async update(id: string, purchaseLine: UpdatePurchaseLineDto): Promise<PurchaseLine> {
        const purchaseLineToUpdate = await PurchaseLine.findByPk(id);
        
        if (!purchaseLineToUpdate) {
            throw new Error('Línea de compra no encontrada');
        }
        
        await purchaseLineToUpdate.update(purchaseLine);
        return purchaseLineToUpdate;
    }

    async delete(id: string): Promise<void> {
        const purchaseLineToDelete = await PurchaseLine.findByPk(id);
        
        if (!purchaseLineToDelete) {
            throw new Error('Línea de compra no encontrada');
        }
        
        await purchaseLineToDelete.destroy();
    }

    async findByPurchase(purchaseId: string): Promise<PurchaseLine[]> {
        return await PurchaseLine.findAll({
            where: {
                purchaseId
            },
            include: [
                { model: Product, as: 'product' },
                { model: Batch, as: 'batch' }
            ]
        });
    }

    async findByProduct(productId: string): Promise<PurchaseLine[]> {
        return await PurchaseLine.findAll({
            where: {
                productId
            }
        });
    }

    async findByBatch(batchId: string): Promise<PurchaseLine[]> {
        return await PurchaseLine.findAll({
            where: {
                batchId
            }
        });
    }
}
