import api from './api';

/**
 * Register a new user
 * @param {object} payload - { name, email, password }
 */
export const register = async ({ name, email, password }) => {
  const response = await api.post('/auth/register', { name, email, password });
  return response.data;
};

/**
 * Log in an existing user
 * @param {object} payload - { email, password }
 */
export const login = async ({ email, password }) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

/**
 * Fetch current authenticated user profile
 */
export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export default {
  register,
  login,
  getCurrentUser,
};
