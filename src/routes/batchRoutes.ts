import express, { Router } from 'express';
import BatchController from '../controllers/batchController';
import { authMiddleware } from '../middleware';
import { BatchRepository } from '../repositories/BatchRepository';
import { StockMovementsRepository } from '../repositories/StockMovementsRepository';
import { BatchService } from '../services/BatchService';

const router: Router = express.Router();

const batchRepository = new BatchRepository();
const stockMovementRepository = new StockMovementsRepository();
const batchService = new BatchService(batchRepository, stockMovementRepository);
const batchController = new BatchController(batchService);

router.route('/batches')
  .get(authMiddleware, (req, res, next) => batchController.getAllBatches(req, res, next))
  .post(authMiddleware, (req, res, next) => batchController.createBatch(req, res, next));

router.get('/batches/search', authMiddleware, (req, res, next) => batchController.searchBatches(req, res, next));

router.route('/batches/:id')
  .get(authMiddleware, (req, res, next) => batchController.getBatchById(req, res, next))
  .put(authMiddleware, (req, res, next) => batchController.updateBatch(req, res, next))
  .delete(authMiddleware, (req, res, next) => batchController.deleteBatch(req, res, next));

export default router;