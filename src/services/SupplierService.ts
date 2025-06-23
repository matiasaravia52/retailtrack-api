import Supplier from '../models/Supplier';
import { ISupplierService } from '../interfaces/service/ISupplierService';
import { ISupplierRepository } from '../interfaces/repository/ISupplierRepository';
import { CreateSupplierDto, UpdateSupplierDto } from '../dto/SupplierDto';

export class SupplierService implements ISupplierService {
    private supplierRepository: ISupplierRepository;

    constructor(supplierRepository: ISupplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    async getAllSuppliers(): Promise<Supplier[]> {
        return await this.supplierRepository.findAll();
    }

    async getSupplierById(id: string): Promise<Supplier | null> {
        return await this.supplierRepository.findById(id);
    }

    async createSupplier(supplierData: CreateSupplierDto): Promise<Supplier> {
        return await this.supplierRepository.create(supplierData);
    }

    async updateSupplier(id: string, supplierData: UpdateSupplierDto): Promise<Supplier> {
        return await this.supplierRepository.update(id, supplierData);
    }

    async deleteSupplier(id: string): Promise<void> {
        await this.supplierRepository.delete(id);
    }

    async searchSuppliers(query: string): Promise<Supplier[]> {
        return await this.supplierRepository.search(query);
    }
}
