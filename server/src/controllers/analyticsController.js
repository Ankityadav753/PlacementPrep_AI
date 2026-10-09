import { getUserAnalyticsOverview } from '../services/analyticsService.js';
import { getResumeHistoryByUserId } from '../services/resumeService.js';
import { getCodingHistoryByUserId } from '../services/codingService.js';
import { getInterviewHistoryByUserId } from '../services/interviewService.js';

const getUserId = (req) => {
  return req.user?._id?.toString() || req.user?.id?.toString();
};

/**
 * GET /api/analytics/overview
 * Retrieve comprehensive placement prep analytics for the authenticated candidate
 */
export const getAnalyticsOverviewController = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Access denied.',
      });
    }

    const data = await getUserAnalyticsOverview(userId);

    return res.status(200).json({
      success: true,
      message: 'Candidate analytics overview retrieved successfully.',
      data,
    });
  } catch (error) {
    console.error('Error in getAnalyticsOverviewController:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve analytics overview.',
    });
  }
};

/**
 * Route aliases for convenience under /api/analytics/history/*
 */
export const getResumeHistoryAlias = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const { page, limit } = req.query;
    if (page !== undefined && (!Number.isInteger(Number(page)) || Number(page) < 1)) {
      return res.status(400).json({ success: false, message: 'Invalid page parameter.' });
    }
    if (limit !== undefined && (!Number.isInteger(Number(limit)) || Number(limit) < 1 || Number(limit) > 50)) {
      return res.status(400).json({ success: false, message: 'Invalid limit parameter.' });
    }

    const result = await getResumeHistoryByUserId({
      userId,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
    });

    return res.status(200).json({ success: true, data: result.items, pagination: result.pagination });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve resume history.' });
  }
};

export const getCodingHistoryAlias = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const { page, limit } = req.query;
    if (page !== undefined && (!Number.isInteger(Number(page)) || Number(page) < 1)) {
      return res.status(400).json({ success: false, message: 'Invalid page parameter.' });
    }
    if (limit !== undefined && (!Number.isInteger(Number(limit)) || Number(limit) < 1 || Number(limit) > 50)) {
      return res.status(400).json({ success: false, message: 'Invalid limit parameter.' });
    }

    const result = await getCodingHistoryByUserId({
      userId,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
    });

    return res.status(200).json({ success: true, data: result.items, pagination: result.pagination });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve coding history.' });
  }
};

export const getInterviewHistoryAlias = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const { page, limit } = req.query;
    if (page !== undefined && (!Number.isInteger(Number(page)) || Number(page) < 1)) {
      return res.status(400).json({ success: false, message: 'Invalid page parameter.' });
    }
    if (limit !== undefined && (!Number.isInteger(Number(limit)) || Number(limit) < 1 || Number(limit) > 50)) {
      return res.status(400).json({ success: false, message: 'Invalid limit parameter.' });
    }

    const result = await getInterviewHistoryByUserId({
      userId,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
    });

    return res.status(200).json({ success: true, data: result.items, pagination: result.pagination });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve interview history.' });
  }
};

export default {
  getAnalyticsOverviewController,
  getResumeHistoryAlias,
  getCodingHistoryAlias,
  getInterviewHistoryAlias,
};
