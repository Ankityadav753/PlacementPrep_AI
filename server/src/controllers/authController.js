import { registerUser, loginUser } from '../services/authService.js';

/**
 * Register a new user
 * POST /api/auth/register
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const result = await registerUser({ name, email, password });

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: result.user,
        token: result.token,
      },
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || 'Registration failed',
    });
  }
};

/**
 * Log in an existing user
 * POST /api/auth/login
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await loginUser({ email, password });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: result.user,
        token: result.token,
      },
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || 'Login failed',
    });
  }
};

/**
 * Get current authenticated user
 * GET /api/auth/me (Protected)
 */
export const getMe = async (req, res, next) => {
  try {
    // req.user is set by protect authMiddleware
    return res.status(200).json({
      success: true,
      data: {
        user: req.user,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve user profile',
    });
  }
};

export default {
  register,
  login,
  getMe,
};
