import { Transaction } from 'sequelize';
import Purchase, { PurchaseStatus } from '../models/Purchase';
import { IPurchaseService } from '../interfaces/service/IPurchaseService';
import { IPurchaseRepository } from '../interfaces/repository/IPurchaseRepository';
import { IPurchaseLineRepository } from '../interfaces/repository/IPurchaseLineRepository';
import { CreatePurchaseDto, UpdatePurchaseDto } from '../dto/PurchaseDto';
import { sequelize } from '../config/database';

export class PurchaseService implements IPurchaseService {
    private purchaseRepository: IPurchaseRepository;
    private purchaseLineRepository: IPurchaseLineRepository;

    constructor(
        purchaseRepository: IPurchaseRepository,
        purchaseLineRepository: IPurchaseLineRepository
    ) {
        this.purchaseRepository = purchaseRepository;
        this.purchaseLineRepository = purchaseLineRepository;
    }

    async getAllPurchases(): Promise<Purchase[]> {
        return await this.purchaseRepository.findAll();
    }

    async getPurchaseById(id: string): Promise<Purchase | null> {
        return await this.purchaseRepository.findById(id);
    }

    async createPurchase(purchaseData: CreatePurchaseDto): Promise<Purchase> {
        let transaction: Transaction | undefined;
        try {
            transaction = await sequelize.transaction();
            
            // Crear la compra
            const purchase = await this.purchaseRepository.create(
                {
                    supplierId: purchaseData.supplierId,
                    status: purchaseData.status || PurchaseStatus.PENDING,
                    total: purchaseData.total || 0,
                    subtotal: purchaseData.subtotal || 0,
                    taxes: purchaseData.taxes || 0
                },
                { transaction }
            );

            // Crear las líneas de compra
            if (purchaseData.purchaseLines && purchaseData.purchaseLines.length > 0) {
                for (const line of purchaseData.purchaseLines) {
                    await this.purchaseLineRepository.create(
                        {
                            ...line,
                            purchaseId: purchase.id
                        },
                        { transaction }
                    );
                }
            }

            await transaction.commit();
            const result = await this.purchaseRepository.findById(purchase.id);
            if (!result) {
                throw new Error('No se pudo encontrar la compra recién creada');
            }
            return result;
        } catch (error) {
            if (transaction) await transaction.rollback();
            throw error;
        }
    }

    async updatePurchase(id: string, purchaseData: UpdatePurchaseDto): Promise<Purchase> {
        return await this.purchaseRepository.update(id, purchaseData);
    }

    async deletePurchase(id: string): Promise<void> {
        await this.purchaseRepository.delete(id);
    }

    async searchPurchases(query: string): Promise<Purchase[]> {
        return await this.purchaseRepository.search(query);
    }

    async getPurchasesBySupplier(supplierId: string): Promise<Purchase[]> {
        return await this.purchaseRepository.findBySupplier(supplierId);
    }
}
