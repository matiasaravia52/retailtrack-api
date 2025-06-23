import Customer from "../../models/Customer";
import { CreateCustomerDto, UpdateCustomerDto } from "../../dto/CustomerDto";

export interface ICustomerService {
    getAllCustomers(): Promise<Customer[]>;
    getCustomerById(id: string): Promise<Customer | null>;
    createCustomer(customerData: CreateCustomerDto): Promise<Customer>;
    updateCustomer(id: string, customerData: UpdateCustomerDto): Promise<Customer>;
    deleteCustomer(id: string): Promise<void>;
    searchCustomers(query: string): Promise<Customer[]>;
}
