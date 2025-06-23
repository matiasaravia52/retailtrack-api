import PurchaseLine from "../../models/PurchaseLine";
import { CreatePurchaseLineDto, UpdatePurchaseLineDto } from "../../dto/PurchaseLineDto";

export interface IPurchaseLineRepository {
    findAll(): Promise<PurchaseLine[]>;
    findById(id: string): Promise<PurchaseLine | null>;
    create(purchaseLine: CreatePurchaseLineDto, options?: {}): Promise<PurchaseLine>;
    update(id: string, purchaseLine: UpdatePurchaseLineDto): Promise<PurchaseLine>;
    delete(id: string): Promise<void>;
    findByPurchase(purchaseId: string): Promise<PurchaseLine[]>;
    findByProduct(productId: string): Promise<PurchaseLine[]>;
    findByBatch(batchId: string): Promise<PurchaseLine[]>;
}
