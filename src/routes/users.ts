import express, { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authMiddleware } from '../middleware';

const router: Router = express.Router();

router.route('/users')
  .get(authMiddleware, UserController.getUsers)
  .post(authMiddleware, UserController.createUser);

router.get('/users/search', authMiddleware, UserController.searchUsers);

router.route('/users/:id')
  .get(authMiddleware, UserController.getUserById)
  .put(authMiddleware, UserController.updateUser)
  .delete(authMiddleware, UserController.deleteUser);

router.put('/users/:id/last-login', authMiddleware, UserController.updateLastLogin);

export default router;
