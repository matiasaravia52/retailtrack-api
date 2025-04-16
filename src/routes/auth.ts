import express, { Router } from 'express';
import { AuthController } from '../controllers/authController';

const router: Router = express.Router();

router.post('/auth/login', AuthController.login);
router.get('/auth/validate', AuthController.validateToken);

export default router;
