import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Attach JWT token if valid
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('token');
      if (token && typeof token === 'string' && token.trim().length > 0) {
        config.headers.Authorization = `Bearer ${token.trim()}`;
      } else if (config.headers.Authorization) {
        delete config.headers.Authorization;
      }
    } catch (e) {
      console.warn('Could not retrieve token from localStorage:', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Clean 401 handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If unauthorized and we had a token, broadcast unauthorized event to reset state
    if (error.response && error.response.status === 401) {
      const url = error.config?.url || '';
      // Only clear if this wasn't an explicit login attempt
      if (!url.includes('/auth/login') && !url.includes('/auth/register')) {
        try {
          localStorage.removeItem('token');
          window.dispatchEvent(new CustomEvent('auth:unauthorized'));
        } catch (e) {
          // ignore storage error
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
