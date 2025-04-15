import express, { Router } from 'express';
import * as userController from '../controllers/userController';

const router: Router = express.Router();

// Rutas para usuarios
router.get('/users', userController.getUsers);
router.get('/users/:id', userController.getUserById);
router.post('/users', userController.createUser);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);
router.get('/users/search', userController.searchUsers);
router.put('/users/:id/last-login', userController.updateLastLogin);

export default router;
