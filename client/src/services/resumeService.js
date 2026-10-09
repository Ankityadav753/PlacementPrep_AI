import api from './api';

/**
 * Resume API Service
 * Handles uploading PDF resumes, requesting ATS analysis, and fetching previous analyses.
 */

export const uploadResume = async (file, targetRole = 'General / Any Role') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('targetRole', targetRole);

  const response = await api.post('/resume/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const analyzeResume = async ({ file, resumeId, targetRole = 'General / Any Role' }) => {
  if (file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('targetRole', targetRole);

    const response = await api.post('/resume/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  const response = await api.post('/resume/analyze', {
    resumeId,
    targetRole,
  });
  return response.data;
};

export const getResumeById = async (id) => {
  const response = await api.get(`/resume/${id}`);
  return response.data;
};

export default {
  uploadResume,
  analyzeResume,
  getResumeById,
};
