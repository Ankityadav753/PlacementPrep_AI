import { verifyToken } from '../utils/jwt.js';
import { getUserById } from '../services/authService.js';

/**
 * Authentication Middleware
 * Protects routes by validating JWT Bearer token and attaching user to req.user
 */
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Authorization token required. Access denied.',
      });
    }

    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Invalid authorization format. Format must be: Bearer <token>',
      });
    }

    const token = authHeader.split(' ')[1];
    if (!token || token.trim() === '') {
      return res.status(401).json({
        success: false,
        message: 'Authentication token missing.',
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expired. Please log in again.',
        });
      }
      return res.status(401).json({
        success: false,
        message: 'Invalid or malformed token.',
      });
    }

    if (!decoded || !decoded.id) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token payload.',
      });
    }

    // Retrieve user by ID
    const user = await getUserById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found or session has been revoked.',
      });
    }

    // Attach user to request object (never trusting client-supplied user IDs)
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Authentication error during token validation.',
    });
  }
};

export default protect;
