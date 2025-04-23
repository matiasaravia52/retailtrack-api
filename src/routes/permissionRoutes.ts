import express from 'express';
import { PermissionController } from '../controllers/permissionController';
import { authMiddleware } from '../middleware';

const router = express.Router();

// Rutas protegidas (requieren autenticación)
router.use(authMiddleware);

// Rutas para permisos
router.get('/', PermissionController.getAllPermissions);
router.get('/:id', PermissionController.getPermissionById);
router.post('/', PermissionController.createPermission);
router.put('/:id', PermissionController.updatePermission);
router.delete('/:id', PermissionController.deletePermission);

export default router;
