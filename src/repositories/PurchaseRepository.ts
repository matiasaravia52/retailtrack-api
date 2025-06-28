import { Op, Transaction } from 'sequelize';
import Purchase from '../models/Purchase';
import { IPurchaseRepository } from '../interfaces/repository/IPurchaseRepository';
import { CreatePurchaseDto, UpdatePurchaseDto } from '../dto/PurchaseDto';
import Supplier from '../models/Supplier';
import PurchaseLine from '../models/PurchaseLine';

export class PurchaseRepository implements IPurchaseRepository {
    async findAll(): Promise<Purchase[]> {
        return await Purchase.findAll({
            include: [
                { model: Supplier, as: 'supplier' },
                { model: PurchaseLine, as: 'purchaseLines' }
            ]
        });
    }

    async findById(id: string): Promise<Purchase | null> {
        return await Purchase.findByPk(id, {
            include: [
                { model: Supplier, as: 'supplier' },
                { model: PurchaseLine, as: 'purchaseLines' }
            ]
        });
    }

    async create(purchase: CreatePurchaseDto, options?: { transaction?: Transaction }): Promise<Purchase> {
        return await Purchase.create(purchase as any, options);
    }

    async update(id: string, purchase: UpdatePurchaseDto): Promise<Purchase> {
        const purchaseToUpdate = await Purchase.findByPk(id);
        
        if (!purchaseToUpdate) {
            throw new Error('Compra no encontrada');
        }
        
        await purchaseToUpdate.update(purchase);
        return purchaseToUpdate;
    }

    async delete(id: string): Promise<void> {
        const purchaseToDelete = await Purchase.findByPk(id);
        
        if (!purchaseToDelete) {
            throw new Error('Compra no encontrada');
        }
        
        await purchaseToDelete.destroy();
    }

    async search(query: string): Promise<Purchase[]> {
        return await Purchase.findAll({
            include: [
                { 
                    model: Supplier, 
                    as: 'supplier',
                    where: {
                        name: { [Op.iLike]: `%${query}%` }
                    }
                }
            ]
        });
    }

    async findBySupplier(supplierId: string): Promise<Purchase[]> {
        return await Purchase.findAll({
            where: {
                supplierId
            },
            include: [
                { model: PurchaseLine, as: 'purchaseLines' }
            ]
        });
    }
}
