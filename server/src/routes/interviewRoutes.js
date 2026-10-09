import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  startInterview,
  submitAnswer,
  getNextQuestion,
  finishInterview,
  getInterview,
  getInterviewHistory,
} from '../controllers/interviewController.js';

const router = express.Router();

// All interview endpoints are JWT-protected
router.post('/start', protect, startInterview);
router.post('/answer', protect, submitAnswer);
router.post('/next', protect, getNextQuestion);
router.post('/finish', protect, finishInterview);
router.get('/history', protect, getInterviewHistory);
router.get('/:id', protect, getInterview);

export default router;
