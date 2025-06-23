import { Op } from 'sequelize';
import Supplier from '../models/Supplier';
import { ISupplierRepository } from '../interfaces/repository/ISupplierRepository';
import { CreateSupplierDto, UpdateSupplierDto } from '../dto/SupplierDto';

export class SupplierRepository implements ISupplierRepository {
    async findAll(): Promise<Supplier[]> {
        return await Supplier.findAll();
    }

    async findById(id: string): Promise<Supplier | null> {
        return await Supplier.findByPk(id);
    }

    async create(supplier: CreateSupplierDto): Promise<Supplier> {
        return await Supplier.create(supplier as any);
    }

    async update(id: string, supplier: UpdateSupplierDto): Promise<Supplier> {
        const supplierToUpdate = await Supplier.findByPk(id);
        
        if (!supplierToUpdate) {
            throw new Error('Proveedor no encontrado');
        }
        
        await supplierToUpdate.update(supplier);
        return supplierToUpdate;
    }

    async delete(id: string): Promise<void> {
        const supplierToDelete = await Supplier.findByPk(id);
        
        if (!supplierToDelete) {
            throw new Error('Proveedor no encontrado');
        }
        
        await supplierToDelete.destroy();
    }

    async search(query: string): Promise<Supplier[]> {
        return await Supplier.findAll({
            where: {
                [Op.or]: [
                    { name: { [Op.iLike]: `%${query}%` } },
                    { email: { [Op.iLike]: `%${query}%` } },
                    { phone: { [Op.iLike]: `%${query}%` } }
                ]
            }
        });
    }
}
