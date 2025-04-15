import express, { Router } from 'express';
import { UserController } from '../controllers/userController';

const router: Router = express.Router();

router.route('/users')
  .get(UserController.getUsers)
  .post(UserController.createUser);

router.get('/users/search', UserController.searchUsers);

router.route('/users/:id')
  .get(UserController.getUserById)
  .put(UserController.updateUser)
  .delete(UserController.deleteUser);

router.put('/users/:id/last-login', UserController.updateLastLogin);

export default router;
