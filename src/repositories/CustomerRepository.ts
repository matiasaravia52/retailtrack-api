import { Op } from 'sequelize';
import Customer from '../models/Customer';
import { ICustomerRepository } from '../interfaces/repository/ICustomerRepository';
import { CreateCustomerDto, UpdateCustomerDto } from '../dto/CustomerDto';

export class CustomerRepository implements ICustomerRepository {
    async findAll(): Promise<Customer[]> {
        return await Customer.findAll();
    }

    async findById(id: string): Promise<Customer | null> {
        return await Customer.findByPk(id);
    }

    async create(customer: CreateCustomerDto): Promise<Customer> {
        return await Customer.create(customer as any);
    }

    async update(id: string, customer: UpdateCustomerDto): Promise<Customer> {
        const customerToUpdate = await Customer.findByPk(id);
        
        if (!customerToUpdate) {
            throw new Error('Cliente no encontrado');
        }
        
        await customerToUpdate.update(customer);
        return customerToUpdate;
    }

    async delete(id: string): Promise<void> {
        const customerToDelete = await Customer.findByPk(id);
        
        if (!customerToDelete) {
            throw new Error('Cliente no encontrado');
        }
        
        await customerToDelete.destroy();
    }

    async search(query: string): Promise<Customer[]> {
        return await Customer.findAll({
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
