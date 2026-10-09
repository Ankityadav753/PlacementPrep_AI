import express from 'express';
import healthRoutes from './healthRoutes.js';
import authRoutes from './authRoutes.js';
import resumeRoutes from './resumeRoutes.js';
import codingRoutes from './codingRoutes.js';
import interviewRoutes from './interviewRoutes.js';
import analyticsRoutes from './analyticsRoutes.js';

const router = express.Router();

// Mount individual feature routes
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/resume', resumeRoutes);
router.use('/coding', codingRoutes);
router.use('/interview', interviewRoutes);
router.use('/analytics', analyticsRoutes);

export default router;
