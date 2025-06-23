import { Request, Response } from 'express';
import { ICustomerService } from '../interfaces/service/ICustomerService';
import { CustomerService } from '../services/CustomerService';
import { CustomerRepository } from '../repositories/CustomerRepository';

export class CustomerController {
    private customerService: ICustomerService;

    constructor() {
        const customerRepository = new CustomerRepository();
        this.customerService = new CustomerService(customerRepository);
    }

    getAllCustomers = async (req: Request, res: Response): Promise<void> => {
        try {
            const customers = await this.customerService.getAllCustomers();
            res.status(200).json(customers);
        } catch (error) {
            console.error('Error al obtener clientes:', error);
            res.status(500).json({ message: 'Error al obtener clientes' });
        }
    };

    getCustomerById = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const customer = await this.customerService.getCustomerById(id);
            
            if (!customer) {
                res.status(404).json({ message: 'Cliente no encontrado' });
                return;
            }
            
            res.status(200).json(customer);
        } catch (error) {
            console.error('Error al obtener cliente:', error);
            res.status(500).json({ message: 'Error al obtener cliente' });
        }
    };

    createCustomer = async (req: Request, res: Response): Promise<void> => {
        try {
            const customerData = req.body;
            const newCustomer = await this.customerService.createCustomer(customerData);
            res.status(201).json(newCustomer);
        } catch (error) {
            console.error('Error al crear cliente:', error);
            res.status(500).json({ message: 'Error al crear cliente' });
        }
    };

    updateCustomer = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const customerData = req.body;
            const updatedCustomer = await this.customerService.updateCustomer(id, customerData);
            res.status(200).json(updatedCustomer);
        } catch (error) {
            console.error('Error al actualizar cliente:', error);
            res.status(500).json({ message: 'Error al actualizar cliente' });
        }
    };

    deleteCustomer = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            await this.customerService.deleteCustomer(id);
            res.status(204).send();
        } catch (error) {
            console.error('Error al eliminar cliente:', error);
            res.status(500).json({ message: 'Error al eliminar cliente' });
        }
    };

    searchCustomers = async (req: Request, res: Response): Promise<void> => {
        try {
            const { query } = req.query;
            
            if (!query || typeof query !== 'string') {
                res.status(400).json({ message: 'Se requiere un parámetro de búsqueda' });
                return;
            }
            
            const customers = await this.customerService.searchCustomers(query);
            res.status(200).json(customers);
        } catch (error) {
            console.error('Error al buscar clientes:', error);
            res.status(500).json({ message: 'Error al buscar clientes' });
        }
    };
}
