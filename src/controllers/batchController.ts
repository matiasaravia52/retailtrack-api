import { NextFunction, Request, Response } from "express";
import { IBatchService } from "../interfaces/service/IBatchService";

class BatchController {
    constructor(private batchService: IBatchService) {}
    
    async getAllBatches(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const batches = await this.batchService.getAllBatches();
            res.json(batches);
        } catch (error) {
            next(error);
        }
    }

    async getBatchById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const batch = await this.batchService.getBatchById(req.params.id);
            res.json(batch);
        } catch (error) {
            next(error);
        }
    }

    async createBatch(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const batch = await this.batchService.createBatch(req.body);
            res.json(batch);
        } catch (error) {
            next(error);
        }
    }

    async updateBatch(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const batch = await this.batchService.updateBatch(req.params.id, req.body);
            res.json(batch);
        } catch (error) {
            next(error);
        }
    }

    async deleteBatch(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await this.batchService.deleteBatch(req.params.id);
            res.json({ message: 'Batch deleted successfully' });
        } catch (error) {
            next(error);
        }
    }

    async searchBatches(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const batches = await this.batchService.searchBatches(req.query.query as string);
            res.json(batches);
        } catch (error) {
            next(error);
        }
    }
}

export default BatchController;
