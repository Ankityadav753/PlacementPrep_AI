import {
  startInterviewSession,
  getInterviewSession,
  submitInterviewAnswer,
  generateNextInterviewQuestion,
  finishInterviewSession,
  getInterviewHistoryByUserId,
} from '../services/interviewService.js';

/**
 * Helper to safely extract user ID from authenticated request
 */
const getUserId = (req) => {
  return req.user?._id?.toString() || req.user?.id?.toString();
};

/**
 * POST /api/interview/start
 * Initialize a new interview session and return the first question
 */
export const startInterview = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    const { role } = req.body;
    const session = await startInterviewSession({ userId, role });

    return res.status(201).json({
      success: true,
      message: 'Interview session created successfully.',
      data: session,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }
    console.error('Error starting interview session:', error.message);
    return res.status(500).json({
      success: false,
      message: 'AI interview service is temporarily unavailable.',
    });
  }
};

/**
 * POST /api/interview/answer
 * Submit an answer for evaluation
 */
export const submitAnswer = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    const { interviewId, questionId, answer } = req.body;
    const result = await submitInterviewAnswer({
      interviewId,
      userId,
      questionId,
      answer,
    });

    return res.status(200).json({
      success: true,
      message: 'Answer evaluated successfully.',
      data: result,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }
    console.error('Error evaluating answer:', error.message);
    return res.status(500).json({
      success: false,
      message: 'AI interview service is temporarily unavailable.',
    });
  }
};

/**
 * POST /api/interview/next
 * Generate the next adaptive question based on previous performance
 */
export const getNextQuestion = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    const { interviewId } = req.body;
    const nextQuestion = await generateNextInterviewQuestion({
      interviewId,
      userId,
    });

    return res.status(200).json({
      success: true,
      message: 'Next question generated successfully.',
      data: nextQuestion,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }
    console.error('Error generating next question:', error.message);
    return res.status(500).json({
      success: false,
      message: 'AI interview service is temporarily unavailable.',
    });
  }
};

/**
 * POST /api/interview/finish
 * Conclude the interview and produce the final scorecard report
 */
export const finishInterview = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    const { interviewId } = req.body;
    const result = await finishInterviewSession({
      interviewId,
      userId,
    });

    return res.status(200).json({
      success: true,
      message: 'Interview concluded successfully.',
      data: result,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }
    console.error('Error finishing interview session:', error.message);
    return res.status(500).json({
      success: false,
      message: 'AI interview service is temporarily unavailable.',
    });
  }
};

/**
 * GET /api/interview/:id
 * Retrieve details of an interview session
 */
export const getInterview = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    const { id } = req.params;
    const interview = await getInterviewSession({
      interviewId: id,
      userId,
    });

    return res.status(200).json({
      success: true,
      data: interview,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }
    console.error('Error retrieving interview:', error.message);
    return res.status(500).json({
      success: false,
      message: 'AI interview service is temporarily unavailable.',
    });
  }
};

/**
 * GET /api/interview/history
 * Retrieve paginated interview history for authenticated user
 */
export const getInterviewHistory = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
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

    const result = await getInterviewHistoryByUserId({
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
    console.error('Error retrieving interview history:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve interview history.',
    });
  }
};

export default {
  startInterview,
  submitAnswer,
  getNextQuestion,
  finishInterview,
  getInterview,
  getInterviewHistory,
};

