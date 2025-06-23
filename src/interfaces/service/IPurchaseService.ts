import Purchase from "../../models/Purchase";
import { CreatePurchaseDto, UpdatePurchaseDto } from "../../dto/PurchaseDto";

export interface IPurchaseService {
    getAllPurchases(): Promise<Purchase[]>;
    getPurchaseById(id: string): Promise<Purchase | null>;
    createPurchase(purchaseData: CreatePurchaseDto): Promise<Purchase>;
    updatePurchase(id: string, purchaseData: UpdatePurchaseDto): Promise<Purchase>;
    deletePurchase(id: string): Promise<void>;
    searchPurchases(query: string): Promise<Purchase[]>;
    getPurchasesBySupplier(supplierId: string): Promise<Purchase[]>;
}
