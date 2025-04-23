import express, { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authMiddleware } from '../middleware';

const router: Router = express.Router();

// Rutas públicas
router.post('/login', AuthController.login);
router.get('/validate', AuthController.validateToken);

// Rutas protegidas (requieren autenticación)
router.get('/permissions', authMiddleware, AuthController.getUserPermissions);

export default router;
