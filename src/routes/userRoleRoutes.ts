import express from 'express';
import { UserRoleController } from '../controllers/userRoleController';
import { authMiddleware } from '../middleware';

const router = express.Router();

// Rutas protegidas (requieren autenticación)
router.use(authMiddleware);

// Rutas para roles de usuarios
router.get('/:userId/roles', UserRoleController.getUserRoles);
router.post('/:userId/roles', UserRoleController.assignRolesToUser);

export default router;
