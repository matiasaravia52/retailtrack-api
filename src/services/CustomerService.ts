import Customer from '../models/Customer';
import { ICustomerService } from '../interfaces/service/ICustomerService';
import { ICustomerRepository } from '../interfaces/repository/ICustomerRepository';
import { CreateCustomerDto, UpdateCustomerDto } from '../dto/CustomerDto';

export class CustomerService implements ICustomerService {
    private customerRepository: ICustomerRepository;

    constructor(customerRepository: ICustomerRepository) {
        this.customerRepository = customerRepository;
    }

    async getAllCustomers(): Promise<Customer[]> {
        return await this.customerRepository.findAll();
    }

    async getCustomerById(id: string): Promise<Customer | null> {
        return await this.customerRepository.findById(id);
    }

    async createCustomer(customerData: CreateCustomerDto): Promise<Customer> {
        return await this.customerRepository.create(customerData);
    }

    async updateCustomer(id: string, customerData: UpdateCustomerDto): Promise<Customer> {
        return await this.customerRepository.update(id, customerData);
    }

    async deleteCustomer(id: string): Promise<void> {
        await this.customerRepository.delete(id);
    }

    async searchCustomers(query: string): Promise<Customer[]> {
        return await this.customerRepository.search(query);
    }
}
