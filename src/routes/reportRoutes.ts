import express from 'express';
import { getNetProfitReport } from '../controllers/reportController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(authMiddleware);

// Rutas para reportes
// Aplicar middleware de permisos para verificar que el usuario tenga los permisos necesarios
router.get('/net-profit', getNetProfitReport);

export default router;
