import api from './api';

/**
 * Coding Round API Service
 * Handles starting sessions, retrieving active session questions, saving code, and submitting questions.
 */

export const startCodingSession = async () => {
  const response = await api.get('/coding/start');
  return response.data;
};

export const getCodingSession = async (sessionId) => {
  const response = await api.get(`/coding/session/${sessionId}`);
  return response.data;
};

export const saveCodingCode = async ({ sessionId, questionId, code, language }) => {
  const response = await api.post('/coding/save', {
    sessionId,
    questionId,
    code,
    language,
  });
  return response.data;
};

export const runCode = async ({ sessionId, questionId, code, language }) => {
  const response = await api.post('/coding/run', {
    sessionId,
    questionId,
    code,
    language,
  });
  return response.data;
};

export const submitCodingQuestion = async ({ sessionId, questionId, code, language }) => {
  const response = await api.post('/coding/submit', {
    sessionId,
    questionId,
    code,
    language,
  });
  return response.data;
};

export const requestCodingReview = async ({ sessionId, questionId, reviewType }) => {
  const response = await api.post('/coding/review', {
    sessionId,
    questionId,
    reviewType,
  });
  return response.data;
};

export default {
  startCodingSession,
  getCodingSession,
  saveCodingCode,
  runCode,
  submitCodingQuestion,
  requestCodingReview,
};
