import express from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// Public auth endpoints
router.post('/register', register);
router.post('/login', login);

// Protected current user endpoint
router.get('/me', protect, getMe);

export default router;
