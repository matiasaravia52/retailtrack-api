import express from 'express';
import { PermissionController } from '../controllers/permissionController';
import { authMiddleware } from '../middleware';

const router = express.Router();

router.get('/', authMiddleware, PermissionController.getAllPermissions);
router.get('/:id', authMiddleware, PermissionController.getPermissionById);
router.post('/', authMiddleware, PermissionController.createPermission);
router.put('/:id', authMiddleware, PermissionController.updatePermission);
router.delete('/:id', authMiddleware, PermissionController.deletePermission);

export default router;
