import jwt from 'jsonwebtoken';

/**
 * Generate a JWT for an authenticated user
 * @param {string} userId - User ID to encode in token payload
 * @returns {string} - Signed JWT string
 */
export const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not defined');
  }

  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  return jwt.sign({ id: userId }, secret, {
    expiresIn,
  });
};

/**
 * Verify and decode a JWT
 * @param {string} token - JWT string to verify
 * @returns {object} - Decoded token payload
 */
export const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not defined');
  }

  return jwt.verify(token, secret);
};
