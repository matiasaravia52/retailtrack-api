import { Request, Response } from 'express';
import { ISupplierService } from '../interfaces/service/ISupplierService';
import { SupplierService } from '../services/SupplierService';
import { SupplierRepository } from '../repositories/SupplierRepository';

export class SupplierController {
    private supplierService: ISupplierService;

    constructor() {
        const supplierRepository = new SupplierRepository();
        this.supplierService = new SupplierService(supplierRepository);
    }

    getAllSuppliers = async (req: Request, res: Response): Promise<void> => {
        try {
            const suppliers = await this.supplierService.getAllSuppliers();
            res.status(200).json(suppliers);
        } catch (error) {
            console.error('Error al obtener proveedores:', error);
            res.status(500).json({ message: 'Error al obtener proveedores' });
        }
    };

    getSupplierById = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const supplier = await this.supplierService.getSupplierById(id);
            
            if (!supplier) {
                res.status(404).json({ message: 'Proveedor no encontrado' });
                return;
            }
            
            res.status(200).json(supplier);
        } catch (error) {
            console.error('Error al obtener proveedor:', error);
            res.status(500).json({ message: 'Error al obtener proveedor' });
        }
    };

    createSupplier = async (req: Request, res: Response): Promise<void> => {
        try {
            const supplierData = req.body;
            const newSupplier = await this.supplierService.createSupplier(supplierData);
            res.status(201).json(newSupplier);
        } catch (error) {
            console.error('Error al crear proveedor:', error);
            res.status(500).json({ message: 'Error al crear proveedor' });
        }
    };

    updateSupplier = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const supplierData = req.body;
            const updatedSupplier = await this.supplierService.updateSupplier(id, supplierData);
            res.status(200).json(updatedSupplier);
        } catch (error) {
            console.error('Error al actualizar proveedor:', error);
            res.status(500).json({ message: 'Error al actualizar proveedor' });
        }
    };

    deleteSupplier = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            await this.supplierService.deleteSupplier(id);
            res.status(204).send();
        } catch (error) {
            console.error('Error al eliminar proveedor:', error);
            res.status(500).json({ message: 'Error al eliminar proveedor' });
        }
    };

    searchSuppliers = async (req: Request, res: Response): Promise<void> => {
        try {
            const { query } = req.query;
            
            if (!query || typeof query !== 'string') {
                res.status(400).json({ message: 'Se requiere un parámetro de búsqueda' });
                return;
            }
            
            const suppliers = await this.supplierService.searchSuppliers(query);
            res.status(200).json(suppliers);
        } catch (error) {
            console.error('Error al buscar proveedores:', error);
            res.status(500).json({ message: 'Error al buscar proveedores' });
        }
    };
}
