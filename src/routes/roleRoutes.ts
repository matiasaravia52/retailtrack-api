import express from 'express';
import { RoleController } from '../controllers/roleController';
import { authMiddleware } from '../middleware';

const router = express.Router();

// Rutas protegidas (requieren autenticación)
router.use(authMiddleware);

// Rutas para roles
router.get('/', RoleController.getAllRoles);
router.get('/:id', RoleController.getRoleById);
router.post('/', RoleController.createRole);
router.put('/:id', RoleController.updateRole);
router.delete('/:id', RoleController.deleteRole);

// Rutas para permisos de roles
router.get('/:id/permissions', RoleController.getRolePermissions);
router.post('/:id/permissions', RoleController.assignPermissionsToRole);

export default router;
