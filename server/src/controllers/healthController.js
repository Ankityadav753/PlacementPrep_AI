import mongoose from 'mongoose';

/**
 * Health check controller
 * GET /api/health
 */
export const getHealth = (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  return res.status(200).json({
    success: true,
    message: 'PlacementPrep_AI API is running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    services: {
      database: dbStatus,
    },
  });
};
