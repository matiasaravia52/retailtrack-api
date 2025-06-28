import Supplier from "../../models/Supplier";
import { CreateSupplierDto, UpdateSupplierDto } from "../../dto/SupplierDto";

export interface ISupplierRepository {
    findAll(): Promise<Supplier[]>;
    findById(id: string): Promise<Supplier | null>;
    create(supplier: CreateSupplierDto): Promise<Supplier>;
    update(id: string, supplier: UpdateSupplierDto): Promise<Supplier>;
    delete(id: string): Promise<void>;
    search(query: string): Promise<Supplier[]>;
}
