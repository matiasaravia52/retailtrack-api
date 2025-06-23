import Purchase from "../../models/Purchase";
import { CreatePurchaseDto, UpdatePurchaseDto } from "../../dto/PurchaseDto";

export interface IPurchaseRepository {
    findAll(): Promise<Purchase[]>;
    findById(id: string): Promise<Purchase | null>;
    create(purchase: CreatePurchaseDto, options?: {}): Promise<Purchase>;
    update(id: string, purchase: UpdatePurchaseDto): Promise<Purchase>;
    delete(id: string): Promise<void>;
    search(query: string): Promise<Purchase[]>;
    findBySupplier(supplierId: string): Promise<Purchase[]>;
}
