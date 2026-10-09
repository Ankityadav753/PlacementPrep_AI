import express from 'express';
import protect from '../middleware/authMiddleware.js';
import {
  getAnalyticsOverviewController,
  getResumeHistoryAlias,
  getCodingHistoryAlias,
  getInterviewHistoryAlias,
} from '../controllers/analyticsController.js';

const router = express.Router();

// All analytics routes require valid JWT authentication
router.get('/overview', protect, getAnalyticsOverviewController);
router.get('/history/resume', protect, getResumeHistoryAlias);
router.get('/history/coding', protect, getCodingHistoryAlias);
router.get('/history/interview', protect, getInterviewHistoryAlias);

export default router;
