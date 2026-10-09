import express from 'express';
import protect from '../middleware/authMiddleware.js';
import { handlePdfUpload, handleOptionalPdfUpload } from '../middleware/uploadMiddleware.js';
import {
  uploadResume,
  analyzeResumeEndpoint,
  getResumeByIdController,
  getResumeHistoryController,
} from '../controllers/resumeController.js';

const router = express.Router();

// All Resume routes require authentication via JWT protect middleware

// POST /api/resume/upload - Upload PDF, extract text, and save initial record
router.post('/upload', protect, handlePdfUpload, uploadResume);

// POST /api/resume/analyze - Analyze resume (supports { resumeId, targetRole } or multipart file upload)
router.post('/analyze', protect, handleOptionalPdfUpload, analyzeResumeEndpoint);

// GET /api/resume/history - Retrieve paginated resume history for user
router.get('/history', protect, getResumeHistoryController);

// GET /api/resume/:id - Retrieve resume by ID (strictly protected by user ownership)
router.get('/:id', protect, getResumeByIdController);

export default router;
