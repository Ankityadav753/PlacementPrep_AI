import mongoose from 'mongoose';
import Resume from '../models/Resume.js';
import { analyzeResume } from './resumeAnalysisService.js';

// In-memory fallback map for test environments where MongoDB server is not locally running
export const inMemoryResumes = new Map();

const isDbConnected = () => mongoose.connection.readyState === 1;

/**
 * Create a new resume record
 */
export const createResumeRecord = async ({
  userId,
  originalFileName,
  fileType = 'application/pdf',
  fileSize,
  targetRole = 'General / Any Role',
  extractedText,
  analysis = null,
}) => {
  if (isDbConnected()) {
    const resume = await Resume.create({
      userId,
      originalFileName,
      fileType,
      fileSize,
      targetRole,
      extractedText,
      analysis,
    });
    return resume.toJSON ? resume.toJSON() : resume;
  } else {
    // In-memory record
    const resumeId = `res_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const now = new Date().toISOString();
    const resumeRecord = {
      id: resumeId,
      _id: resumeId,
      userId,
      originalFileName,
      fileType,
      fileSize,
      targetRole,
      extractedText,
      analysis,
      createdAt: now,
      updatedAt: now,
    };
    inMemoryResumes.set(resumeId, resumeRecord);
    return resumeRecord;
  }
};

/**
 * Get resume by ID
 */
export const getResumeById = async (resumeId) => {
  if (isDbConnected()) {
    try {
      const resume = await Resume.findById(resumeId);
      if (!resume) return null;
      return resume.toJSON ? resume.toJSON() : resume;
    } catch (err) {
      return null;
    }
  } else {
    return inMemoryResumes.get(resumeId) || null;
  }
};

/**
 * Update analysis on an existing resume
 */
export const updateResumeAnalysis = async (resumeId, analysis, targetRole) => {
  if (isDbConnected()) {
    const updateData = { analysis };
    if (targetRole) updateData.targetRole = targetRole;

    const updated = await Resume.findByIdAndUpdate(resumeId, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updated) return null;
    return updated.toJSON ? updated.toJSON() : updated;
  } else {
    const existing = inMemoryResumes.get(resumeId);
    if (!existing) return null;
    existing.analysis = analysis;
    if (targetRole) existing.targetRole = targetRole;
    existing.updatedAt = new Date().toISOString();
    inMemoryResumes.set(resumeId, existing);
    return existing;
  }
};

/**
 * Perform analysis on a resume and save the result
 */
export const performResumeAnalysis = async (resumeId, targetRole) => {
  const resume = await getResumeById(resumeId);
  if (!resume) {
    const error = new Error('Resume not found.');
    error.statusCode = 404;
    throw error;
  }

  const effectiveRole = targetRole || resume.targetRole || 'General / Any Role';
  const analysisResult = analyzeResume(resume.extractedText, effectiveRole);
  const updatedResume = await updateResumeAnalysis(resumeId, analysisResult, effectiveRole);
  return updatedResume;
};

/**
 * Retrieve paginated resume history for a user
 * Excludes extractedText to prevent confidential document leakage
 */
export const getResumeHistoryByUserId = async ({ userId, page = 1, limit = 10 }) => {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
  const skip = (pageNum - 1) * limitNum;

  if (isDbConnected()) {
    const filter = { userId };
    const total = await Resume.countDocuments(filter);
    const resumes = await Resume.find(filter)
      .select('-extractedText')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const formatted = resumes.map((doc) => {
      const r = doc.toJSON ? doc.toJSON() : { ...doc };
      return {
        id: r._id ? r._id.toString() : r.id,
        originalFileName: r.originalFileName,
        targetRole: r.targetRole || 'General / Any Role',
        fileType: r.fileType,
        fileSize: r.fileSize,
        status: r.analysis ? 'analyzed' : 'uploaded',
        atsScore: r.analysis?.atsScore !== undefined ? r.analysis.atsScore : null,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      };
    });

    return {
      items: formatted,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    };
  } else {
    // In-memory fallback
    const userResumes = Array.from(inMemoryResumes.values())
      .filter((r) => r.userId?.toString() === userId.toString())
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const total = userResumes.length;
    const pageItems = userResumes.slice(skip, skip + limitNum).map((r) => ({
      id: r.id || r._id,
      originalFileName: r.originalFileName,
      targetRole: r.targetRole || 'General / Any Role',
      fileType: r.fileType,
      fileSize: r.fileSize,
      status: r.analysis ? 'analyzed' : 'uploaded',
      atsScore: r.analysis?.atsScore !== undefined ? r.analysis.atsScore : null,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));

    return {
      items: pageItems,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    };
  }
};

export default {
  createResumeRecord,
  getResumeById,
  updateResumeAnalysis,
  performResumeAnalysis,
  getResumeHistoryByUserId,
  inMemoryResumes,
};

