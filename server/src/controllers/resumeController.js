import { extractTextFromPdf } from '../services/pdfParserService.js';
import { analyzeResume } from '../services/resumeAnalysisService.js';
import {
  createResumeRecord,
  getResumeById,
  updateResumeAnalysis,
  getResumeHistoryByUserId,
} from '../services/resumeService.js';

// Helper to get normalized user ID string
const getUserId = (user) => {
  if (!user) return null;
  return (user._id || user.id || '').toString();
};

/**
 * Helper to verify resume ownership
 */
const verifyOwnership = (resume, userId) => {
  if (!resume || !userId) return false;
  const ownerId = (resume.userId?._id || resume.userId?.id || resume.userId || '').toString();
  return ownerId === userId;
};

/**
 * POST /api/resume/upload
 * Upload PDF, extract plain text, and store resume draft
 */
export const uploadResume = async (req, res) => {
  try {
    const userId = getUserId(req.user);
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Access denied.',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please select and upload a PDF resume file.',
      });
    }

    const { originalname, mimetype, size, buffer } = req.file;
    const targetRole = (req.body.targetRole || 'General / Any Role').trim();

    // 1. Extract plain text from PDF safely
    let extractedText;
    try {
      extractedText = await extractTextFromPdf(buffer);
    } catch (parseErr) {
      return res.status(400).json({
        success: false,
        message: parseErr.message || 'Could not extract readable text from this PDF.',
      });
    }

    // 2. Persist resume document
    const resume = await createResumeRecord({
      userId,
      originalFileName: originalname,
      fileType: mimetype,
      fileSize: size,
      targetRole,
      extractedText,
      analysis: null,
    });

    return res.status(201).json({
      success: true,
      message: 'Resume uploaded and text extracted successfully.',
      data: resume,
    });
  } catch (error) {
    console.error('Error in uploadResume:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to process resume upload. Please try again.',
    });
  }
};

/**
 * POST /api/resume/analyze
 * Analyze resume text and generate ATS report.
 * Supports either:
 *  1) JSON body { resumeId, targetRole }
 *  2) Direct multipart file upload + targetRole
 */
export const analyzeResumeEndpoint = async (req, res) => {
  try {
    const userId = getUserId(req.user);
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Access denied.',
      });
    }

    const targetRole = (req.body.targetRole || 'General / Any Role').trim();

    // Mode A: Direct multipart file upload and analyze in a single step
    if (req.file) {
      const { originalname, mimetype, size, buffer } = req.file;

      let extractedText;
      try {
        extractedText = await extractTextFromPdf(buffer);
      } catch (parseErr) {
        return res.status(400).json({
          success: false,
          message: parseErr.message || 'Could not extract readable text from this PDF.',
        });
      }

      // Run rule-based ATS analysis on extracted text
      const analysisResult = analyzeResume(extractedText, targetRole);

      // Persist resume with analysis
      const resume = await createResumeRecord({
        userId,
        originalFileName: originalname,
        fileType: mimetype,
        fileSize: size,
        targetRole,
        extractedText,
        analysis: analysisResult,
      });

      return res.status(200).json({
        success: true,
        message: 'Resume analyzed successfully.',
        data: resume,
      });
    }

    // Mode B: Analyze an existing resume by resumeId
    const { resumeId } = req.body;
    if (!resumeId || typeof resumeId !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Please provide either a PDF file or an existing resumeId to analyze.',
      });
    }

    const resume = await getResumeById(resumeId);
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found.',
      });
    }

    // Strict ownership verification: User A cannot analyze User B's resume
    if (!verifyOwnership(resume, userId)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not have permission to view or analyze this resume.',
      });
    }

    // Run rule-based ATS analysis on actual extracted resume text
    const effectiveRole = targetRole || resume.targetRole || 'General / Any Role';
    const analysisResult = analyzeResume(resume.extractedText, effectiveRole);

    const updatedResume = await updateResumeAnalysis(
      resumeId,
      analysisResult,
      effectiveRole
    );

    return res.status(200).json({
      success: true,
      message: 'Resume analyzed successfully.',
      data: updatedResume,
    });
  } catch (error) {
    console.error('Error in analyzeResumeEndpoint:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Resume analysis failed. Please try again.',
    });
  }
};

/**
 * GET /api/resume/:id
 * Retrieve a previously analyzed resume by ID with strict ownership validation
 */
export const getResumeByIdController = async (req, res) => {
  try {
    const userId = getUserId(req.user);
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Access denied.',
      });
    }

    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Resume ID parameter is required.',
      });
    }

    const resume = await getResumeById(id);
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found.',
      });
    }

    // Strict ownership protection: User A must never access User B's resume
    if (!verifyOwnership(resume, userId)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not have permission to access this resume.',
      });
    }

    return res.status(200).json({
      success: true,
      data: resume,
    });
  } catch (error) {
    console.error('Error in getResumeByIdController:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve resume details.',
    });
  }
};

/**
 * GET /api/resume/history
 * Retrieve paginated resume history for authenticated user
 */
export const getResumeHistoryController = async (req, res) => {
  try {
    const userId = getUserId(req.user);
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Access denied.',
      });
    }

    const { page, limit } = req.query;

    // Validate pagination parameters
    if (page !== undefined) {
      const parsedPage = Number(page);
      if (!Number.isInteger(parsedPage) || parsedPage < 1) {
        return res.status(400).json({
          success: false,
          message: 'Invalid pagination parameter: page must be a positive integer.',
        });
      }
    }

    if (limit !== undefined) {
      const parsedLimit = Number(limit);
      if (!Number.isInteger(parsedLimit) || parsedLimit < 1 || parsedLimit > 50) {
        return res.status(400).json({
          success: false,
          message: 'Invalid pagination parameter: limit must be an integer between 1 and 50.',
        });
      }
    }

    const result = await getResumeHistoryByUserId({
      userId,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
    });

    return res.status(200).json({
      success: true,
      data: result.items,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error('Error in getResumeHistoryController:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve resume history.',
    });
  }
};

export default {
  uploadResume,
  analyzeResumeEndpoint,
  getResumeByIdController,
  getResumeHistoryController,
};

