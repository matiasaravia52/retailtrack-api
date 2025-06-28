import Customer from "../../models/Customer";
import { CreateCustomerDto, UpdateCustomerDto } from "../../dto/CustomerDto";

export interface ICustomerRepository {
    findAll(): Promise<Customer[]>;
    findById(id: string): Promise<Customer | null>;
    create(customer: CreateCustomerDto): Promise<Customer>;
    update(id: string, customer: UpdateCustomerDto): Promise<Customer>;
    delete(id: string): Promise<void>;
    search(query: string): Promise<Customer[]>;
}
