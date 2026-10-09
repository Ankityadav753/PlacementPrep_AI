import api from './api';

/**
 * AI Mock Interview API Client Service
 */

export const startInterview = async (role) => {
  const response = await api.post('/interview/start', { role });
  return response.data;
};

export const getInterview = async (id) => {
  const response = await api.get(`/interview/${id}`);
  return response.data;
};

export const submitInterviewAnswer = async ({ interviewId, questionId, answer }) => {
  const response = await api.post('/interview/answer', {
    interviewId,
    questionId,
    answer,
  });
  return response.data;
};

export const getNextQuestion = async (interviewId) => {
  const response = await api.post('/interview/next', { interviewId });
  return response.data;
};

export const finishInterview = async (interviewId) => {
  const response = await api.post('/interview/finish', { interviewId });
  return response.data;
};

export default {
  startInterview,
  getInterview,
  submitInterviewAnswer,
  getNextQuestion,
  finishInterview,
};
