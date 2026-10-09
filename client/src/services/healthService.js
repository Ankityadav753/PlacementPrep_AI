import api from './api';

/**
 * Health service to check backend connectivity
 * Calls GET /api/health
 */
export const checkHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default {
  checkHealth,
};
