import {
  startCodingSession,
  getCodingSession,
  saveCodingCode,
  runCodingCode,
  submitCodingQuestion,
  getCodingReview,
  getCodingHistoryByUserId,
} from '../services/codingService.js';
import { MAX_CODE_LENGTH } from '../services/codeExecutionService.js';

// Helper to get normalized user ID string
const getUserId = (user) => {
  if (!user) return null;
  return (user._id || user.id || '').toString();
};

const SUPPORTED_LANGUAGES = ['cpp', 'java', 'python', 'javascript'];

/**
 * Foundation route status probe
 */
export const getCodingStatus = (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Coding Round module initialized and active.',
  });
};

/**
 * GET /api/coding/start
 * Starts a new coding round session with 2 random questions and independent 30-min timers.
 */
export const startSessionController = async (req, res) => {
  try {
    const userId = getUserId(req.user);
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Access denied.',
      });
    }

    const sessionData = await startCodingSession(userId);

    return res.status(201).json({
      success: true,
      message: 'Coding round session initialized successfully.',
      data: sessionData,
    });
  } catch (error) {
    console.error('Error in startSessionController:', error.message);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to initialize coding session.',
    });
  }
};

/**
 * GET /api/coding/session/:sessionId
 * Retrieves active session and attempt details with strict ownership verification.
 */
export const getSessionController = async (req, res) => {
  try {
    const userId = getUserId(req.user);
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Access denied.',
      });
    }

    const { sessionId } = req.params;
    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID parameter is required.',
      });
    }

    const sessionData = await getCodingSession(userId, sessionId);

    return res.status(200).json({
      success: true,
      data: sessionData,
    });
  } catch (error) {
    console.error('Error in getSessionController:', error.message);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to retrieve coding session.',
    });
  }
};

/**
 * POST /api/coding/save
 * Saves draft code for a question attempt before submission.
 */
export const saveCodeController = async (req, res) => {
  try {
    const userId = getUserId(req.user);
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Access denied.',
      });
    }

    const { sessionId, questionId, code, language } = req.body;

    if (!sessionId || !questionId || typeof sessionId !== 'string' || typeof questionId !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'sessionId and questionId are required to save code.',
      });
    }

    const attempt = await saveCodingCode(userId, sessionId, questionId, code, language);

    return res.status(200).json({
      success: true,
      message: 'Code saved successfully.',
      data: attempt,
    });
  } catch (error) {
    console.error('Error in saveCodeController:', error.message);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to save code.',
    });
  }
};

/**
 * POST /api/coding/run
 * Executes candidate code against visible/sample test cases only via Judge0.
 * Does not submit the attempt or alter final score.
 */
export const runCodeController = async (req, res) => {
  try {
    const userId = getUserId(req.user);
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Access denied.',
      });
    }

    const { sessionId, questionId, code, language } = req.body;

    if (!sessionId || !questionId || typeof sessionId !== 'string' || typeof questionId !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'sessionId and questionId are required to run code.',
      });
    }

    if (typeof code !== 'string' || !code.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Source code must be provided as a non-empty string.',
      });
    }

    if (code.length > MAX_CODE_LENGTH) {
      return res.status(400).json({
        success: false,
        message: 'Source code exceeds maximum allowed size (64 KB).',
      });
    }

    const normalizedLang = (language || '').toLowerCase().trim();
    if (!SUPPORTED_LANGUAGES.includes(normalizedLang)) {
      return res.status(400).json({
        success: false,
        message: `Unsupported language "${language}". Supported: ${SUPPORTED_LANGUAGES.join(', ')}.`,
      });
    }

    const runResult = await runCodingCode(userId, sessionId, questionId, code, normalizedLang);

    return res.status(200).json({
      success: true,
      message: 'Code executed on sample test cases successfully.',
      data: runResult,
    });
  } catch (error) {
    console.error('Error in runCodeController:', error.message);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to execute code.',
    });
  }
};

/**
 * POST /api/coding/submit
 * Evaluates candidate code against full server-side test suite via Judge0,
 * calculates score, saves attempt results, and enforces deadline.
 */
export const submitQuestionController = async (req, res) => {
  try {
    const userId = getUserId(req.user);
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Access denied.',
      });
    }

    const { sessionId, questionId, code, language } = req.body;

    if (!sessionId || !questionId || typeof sessionId !== 'string' || typeof questionId !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'sessionId and questionId are required to submit.',
      });
    }

    if (code !== undefined) {
      if (typeof code !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Code must be a string.',
        });
      }
      if (code.length > MAX_CODE_LENGTH) {
        return res.status(400).json({
          success: false,
          message: 'Source code exceeds maximum allowed size (64 KB).',
        });
      }
    }

    if (language !== undefined) {
      const normalizedLang = (language || '').toLowerCase().trim();
      if (!SUPPORTED_LANGUAGES.includes(normalizedLang)) {
        return res.status(400).json({
          success: false,
          message: `Unsupported language "${language}". Supported: ${SUPPORTED_LANGUAGES.join(', ')}.`,
        });
      }
    }

    const result = await submitCodingQuestion(userId, sessionId, questionId, code, language);

    return res.status(200).json({
      success: true,
      message: result.message || 'Question submitted successfully.',
      data: result.attempt,
    });
  } catch (error) {
    console.error('Error in submitQuestionController:', error.message);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to submit question.',
    });
  }
};

/**
 * POST /api/coding/review
 * Requests an AI Coding Review for a finalized question attempt.
 * Available ONLY when attempt status is "submitted" or "expired".
 * Rejects "in_progress" attempts with 403.
 */
export const reviewQuestionController = async (req, res) => {
  try {
    const userId = getUserId(req.user);
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Access denied.',
      });
    }

    const { sessionId, questionId, reviewType } = req.body;

    if (!sessionId || !questionId || typeof sessionId !== 'string' || typeof questionId !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'sessionId and questionId are required.',
      });
    }

    if (!reviewType) {
      return res.status(400).json({
        success: false,
        message: 'reviewType is required.',
      });
    }

    const reviewData = await getCodingReview(userId, sessionId, questionId, reviewType);

    return res.status(200).json({
      success: true,
      message: 'AI coding review generated successfully.',
      data: reviewData,
    });
  } catch (error) {
    console.error('Error in reviewQuestionController:', error.message);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to generate coding review.',
    });
  }
};

/**
 * GET /api/coding/history
 * Retrieve paginated coding round sessions and attempts for authenticated user
 */
export const getCodingHistoryController = async (req, res) => {
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

    const result = await getCodingHistoryByUserId({
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
    console.error('Error in getCodingHistoryController:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve coding history.',
    });
  }
};

export default {
  getCodingStatus,
  startSessionController,
  getSessionController,
  saveCodeController,
  runCodeController,
  submitQuestionController,
  reviewQuestionController,
  getCodingHistoryController,
};

