import { Request, Response } from 'express';
import { IPurchaseService } from '../interfaces/service/IPurchaseService';
import { PurchaseService } from '../services/PurchaseService';
import { PurchaseRepository } from '../repositories/PurchaseRepository';
import { PurchaseLineRepository } from '../repositories/PurchaseLineRepository';

export class PurchaseController {
    private purchaseService: IPurchaseService;

    constructor() {
        const purchaseRepository = new PurchaseRepository();
        const purchaseLineRepository = new PurchaseLineRepository();
        this.purchaseService = new PurchaseService(purchaseRepository, purchaseLineRepository);
    }

    getAllPurchases = async (req: Request, res: Response): Promise<void> => {
        try {
            const purchases = await this.purchaseService.getAllPurchases();
            res.status(200).json(purchases);
        } catch (error) {
            console.error('Error al obtener compras:', error);
            res.status(500).json({ message: 'Error al obtener compras' });
        }
    };

    getPurchaseById = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const purchase = await this.purchaseService.getPurchaseById(id);
            
            if (!purchase) {
                res.status(404).json({ message: 'Compra no encontrada' });
                return;
            }
            
            res.status(200).json(purchase);
        } catch (error) {
            console.error('Error al obtener compra:', error);
            res.status(500).json({ message: 'Error al obtener compra' });
        }
    };

    createPurchase = async (req: Request, res: Response): Promise<void> => {
        try {
            const purchaseData = req.body;
            const newPurchase = await this.purchaseService.createPurchase(purchaseData);
            res.status(201).json(newPurchase);
        } catch (error) {
            console.error('Error al crear compra:', error);
            res.status(500).json({ message: 'Error al crear compra' });
        }
    };

    updatePurchase = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const purchaseData = req.body;
            const updatedPurchase = await this.purchaseService.updatePurchase(id, purchaseData);
            res.status(200).json(updatedPurchase);
        } catch (error) {
            console.error('Error al actualizar compra:', error);
            res.status(500).json({ message: 'Error al actualizar compra' });
        }
    };

    deletePurchase = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            await this.purchaseService.deletePurchase(id);
            res.status(204).send();
        } catch (error) {
            console.error('Error al eliminar compra:', error);
            res.status(500).json({ message: 'Error al eliminar compra' });
        }
    };

    searchPurchases = async (req: Request, res: Response): Promise<void> => {
        try {
            const { query } = req.query;
            
            if (!query || typeof query !== 'string') {
                res.status(400).json({ message: 'Se requiere un parámetro de búsqueda' });
                return;
            }
            
            const purchases = await this.purchaseService.searchPurchases(query);
            res.status(200).json(purchases);
        } catch (error) {
            console.error('Error al buscar compras:', error);
            res.status(500).json({ message: 'Error al buscar compras' });
        }
    };

    getPurchasesBySupplier = async (req: Request, res: Response): Promise<void> => {
        try {
            const { supplierId } = req.params;
            const purchases = await this.purchaseService.getPurchasesBySupplier(supplierId);
            res.status(200).json(purchases);
        } catch (error) {
            console.error('Error al obtener compras por proveedor:', error);
            res.status(500).json({ message: 'Error al obtener compras por proveedor' });
        }
    };
}
