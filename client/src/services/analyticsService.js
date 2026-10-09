import api from './api';

/**
 * Analytics and History API Service
 */

export const getAnalyticsOverview = async () => {
  const response = await api.get('/analytics/overview');
  return response.data;
};

export const getResumeHistory = async (params = {}) => {
  const response = await api.get('/resume/history', { params });
  return response.data;
};

export const getCodingHistory = async (params = {}) => {
  const response = await api.get('/coding/history', { params });
  return response.data;
};

export const getInterviewHistory = async (params = {}) => {
  const response = await api.get('/interview/history', { params });
  return response.data;
};

export const getResumeDetails = async (resumeId) => {
  const response = await api.get(`/resume/${resumeId}`);
  return response.data;
};

export const getCodingSessionDetails = async (sessionId) => {
  const response = await api.get(`/coding/session/${sessionId}`);
  return response.data;
};

export const getInterviewDetails = async (interviewId) => {
  const response = await api.get(`/interview/${interviewId}`);
  return response.data;
};

export default {
  getAnalyticsOverview,
  getResumeHistory,
  getCodingHistory,
  getInterviewHistory,
  getResumeDetails,
  getCodingSessionDetails,
  getInterviewDetails,
};
