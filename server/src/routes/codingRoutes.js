import express from 'express';
import protect from '../middleware/authMiddleware.js';
import {
  getCodingStatus,
  startSessionController,
  getSessionController,
  saveCodeController,
  runCodeController,
  submitQuestionController,
  reviewQuestionController,
  getCodingHistoryController,
} from '../controllers/codingController.js';

const router = express.Router();

// Root route status probe
router.get('/', getCodingStatus);

// Protected Coding Round routes requiring valid JWT token
router.get('/start', protect, startSessionController);
router.get('/session/:sessionId', protect, getSessionController);
router.get('/history', protect, getCodingHistoryController);
router.post('/save', protect, saveCodeController);
router.post('/run', protect, runCodeController);
router.post('/submit', protect, submitQuestionController);
router.post('/review', protect, reviewQuestionController);

export default router;
