import Supplier from "../../models/Supplier";
import { CreateSupplierDto, UpdateSupplierDto } from "../../dto/SupplierDto";

export interface ISupplierService {
    getAllSuppliers(): Promise<Supplier[]>;
    getSupplierById(id: string): Promise<Supplier | null>;
    createSupplier(supplierData: CreateSupplierDto): Promise<Supplier>;
    updateSupplier(id: string, supplierData: UpdateSupplierDto): Promise<Supplier>;
    deleteSupplier(id: string): Promise<void>;
    searchSuppliers(query: string): Promise<Supplier[]>;
}
