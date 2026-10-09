import mongoose from 'mongoose';
import Resume from '../models/Resume.js';
import CodingAttempt from '../models/CodingAttempt.js';
import Interview from '../models/Interview.js';
import { inMemoryResumes } from './resumeService.js';
import { inMemoryAttempts } from './codingService.js';
import { inMemoryInterviews } from './interviewService.js';

const isDbConnected = () => mongoose.connection.readyState === 1;

/**
 * Compute comprehensive analytics overview for an authenticated user
 * Strictly read-only, handles empty states, excludes incomplete sessions from score averages,
 * and never treats missing scores as zero.
 */
export const getUserAnalyticsOverview = async (userId) => {
  if (!userId) {
    const err = new Error('Authentication required.');
    err.statusCode = 401;
    throw err;
  }

  const normalizedUserId = userId.toString();

  let userResumes = [];
  let userAttempts = [];
  let userInterviews = [];

  if (isDbConnected()) {
    userResumes = await Resume.find({ userId: normalizedUserId }).sort({ createdAt: -1 });
    userAttempts = await CodingAttempt.find({ userId: normalizedUserId }).sort({ createdAt: -1 });
    userInterviews = await Interview.find({ userId: normalizedUserId }).sort({ createdAt: -1 });
  } else {
    userResumes = Array.from(inMemoryResumes.values())
      .filter((r) => (r.userId || '').toString() === normalizedUserId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    userAttempts = Array.from(inMemoryAttempts.values())
      .filter((a) => (a.userId || '').toString() === normalizedUserId)
      .sort((a, b) => new Date(b.createdAt || b.startedAt) - new Date(a.createdAt || a.startedAt));

    userInterviews = Array.from(inMemoryInterviews.values())
      .filter((i) => (i.userId || '').toString() === normalizedUserId)
      .sort((a, b) => new Date(b.createdAt || b.startedAt) - new Date(a.createdAt || a.startedAt));
  }

  // 1. Resume Analytics
  const totalResumes = userResumes.length;
  const analyzedResumes = userResumes.filter(
    (r) => r.analysis && typeof r.analysis.atsScore === 'number'
  );
  const totalResumesAnalyzed = analyzedResumes.length;

  let averageAtsScore = null;
  let highestAtsScore = null;
  if (totalResumesAnalyzed > 0) {
    const atsScores = analyzedResumes.map((r) => r.analysis.atsScore);
    const sumAts = atsScores.reduce((acc, curr) => acc + curr, 0);
    averageAtsScore = Math.round(sumAts / totalResumesAnalyzed);
    highestAtsScore = Math.max(...atsScores);
  }

  const latestAnalyzedResume = analyzedResumes[0];
  const latestAnalysisDate = latestAnalyzedResume
    ? latestAnalyzedResume.updatedAt || latestAnalyzedResume.createdAt
    : null;

  // 2. Coding Round Analytics
  // Unique sessions
  const sessionsSet = new Set(userAttempts.map((a) => a.sessionId).filter(Boolean));
  const totalCodingSessions = sessionsSet.size;
  const totalCodingAttempts = userAttempts.length;

  const completedCodingAttempts = userAttempts.filter((a) => a.status === 'submitted');
  const inProgressCodingAttempts = userAttempts.filter((a) => a.status === 'in_progress');
  const expiredCodingAttempts = userAttempts.filter((a) => a.status === 'expired');

  let averageCodingScore = null;
  let highestCodingScore = null;
  const scoredCodingAttempts = completedCodingAttempts.filter((a) => typeof a.score === 'number');
  if (scoredCodingAttempts.length > 0) {
    const scores = scoredCodingAttempts.map((a) => a.score);
    const sumScore = scores.reduce((acc, curr) => acc + curr, 0);
    averageCodingScore = Math.round(sumScore / scoredCodingAttempts.length);
    highestCodingScore = Math.max(...scores);
  }

  const languageBreakdown = {
    javascript: 0,
    python: 0,
    java: 0,
    cpp: 0,
  };
  for (const a of userAttempts) {
    const lang = (a.language || 'javascript').toLowerCase();
    if (languageBreakdown[lang] !== undefined) {
      languageBreakdown[lang]++;
    }
  }

  // 3. AI Mock Interview Analytics
  const totalInterviews = userInterviews.length;
  const completedInterviews = userInterviews.filter((i) => i.status === 'completed');
  const inProgressInterviews = userInterviews.filter((i) => i.status === 'in_progress');

  let averageInterviewScore = null;
  let highestInterviewScore = null;
  let averageTechnicalKnowledge = null;
  let averageConceptClarity = null;
  let averageCommunication = null;
  let averageConfidenceIndicators = null;

  const scoredInterviews = completedInterviews.filter(
    (i) => i.finalReport && typeof i.finalReport.overallScore === 'number'
  );

  if (scoredInterviews.length > 0) {
    const scores = scoredInterviews.map((i) => i.finalReport.overallScore);
    averageInterviewScore = Math.round(scores.reduce((a, b) => a + b, 0) / scoredInterviews.length);
    highestInterviewScore = Math.max(...scores);

    const techScores = scoredInterviews
      .map((i) => i.finalReport.technicalKnowledge ?? i.scores?.technicalKnowledge)
      .filter((s) => typeof s === 'number');
    if (techScores.length > 0) {
      averageTechnicalKnowledge = Math.round(techScores.reduce((a, b) => a + b, 0) / techScores.length);
    }

    const clarityScores = scoredInterviews
      .map((i) => i.finalReport.conceptClarity ?? i.scores?.conceptClarity)
      .filter((s) => typeof s === 'number');
    if (clarityScores.length > 0) {
      averageConceptClarity = Math.round(clarityScores.reduce((a, b) => a + b, 0) / clarityScores.length);
    }

    const commScores = scoredInterviews
      .map((i) => i.finalReport.communication ?? i.scores?.communication)
      .filter((s) => typeof s === 'number');
    if (commScores.length > 0) {
      averageCommunication = Math.round(commScores.reduce((a, b) => a + b, 0) / commScores.length);
    }

    const confScores = scoredInterviews
      .map((i) => i.finalReport.confidenceIndicators ?? i.scores?.confidenceIndicators)
      .filter((s) => typeof s === 'number');
    if (confScores.length > 0) {
      averageConfidenceIndicators = Math.round(confScores.reduce((a, b) => a + b, 0) / confScores.length);
    }
  }

  const roleBreakdown = {};
  for (const i of userInterviews) {
    if (i.role) {
      roleBreakdown[i.role] = (roleBreakdown[i.role] || 0) + 1;
    }
  }

  // 4. Overall Placement Readiness Score (weighted across completed modules)
  const validModuleScores = [];
  if (averageAtsScore !== null) validModuleScores.push(averageAtsScore);
  if (averageCodingScore !== null) validModuleScores.push(averageCodingScore);
  if (averageInterviewScore !== null) validModuleScores.push(averageInterviewScore);

  const overallReadinessScore = validModuleScores.length > 0
    ? Math.round(validModuleScores.reduce((a, b) => a + b, 0) / validModuleScores.length)
    : null;

  // 5. Unified Cross-Module Recent Activity Stream (top 10 newest items)
  const activityItems = [];

  // Resume activities
  for (const r of userResumes.slice(0, 5)) {
    const isAnalyzed = Boolean(r.analysis && typeof r.analysis.atsScore === 'number');
    activityItems.push({
      id: r.id || r._id ? (r.id || r._id).toString() : `res_${Date.now()}`,
      module: 'resume',
      type: 'resume_analysis',
      title: r.originalFileName || 'Resume Document',
      subtitle: `Target: ${r.targetRole || 'General'}`,
      status: isAnalyzed ? 'completed' : 'uploaded',
      score: isAnalyzed ? r.analysis.atsScore : null,
      timestamp: new Date(r.createdAt || r.updatedAt),
    });
  }

  // Group coding sessions for recent activity
  const codingSessionBuckets = new Map();
  for (const a of userAttempts) {
    if (!codingSessionBuckets.has(a.sessionId)) {
      codingSessionBuckets.set(a.sessionId, []);
    }
    codingSessionBuckets.get(a.sessionId).push(a);
  }

  for (const [sessId, atts] of codingSessionBuckets.entries()) {
    const submitted = atts.filter((a) => a.status === 'submitted');
    const scored = submitted.filter((a) => typeof a.score === 'number');
    const sessScore = scored.length > 0
      ? Math.round(scored.reduce((acc, curr) => acc + curr.score, 0) / scored.length)
      : null;

    let sessStatus = 'in_progress';
    if (submitted.length === atts.length) {
      sessStatus = 'completed';
    } else if (atts.every((a) => a.status === 'expired')) {
      sessStatus = 'expired';
    }

    const earlistDate = atts[0]?.startedAt || atts[0]?.createdAt || new Date();

    activityItems.push({
      id: sessId,
      module: 'coding',
      type: 'coding_session',
      title: 'Coding Round Session',
      subtitle: `${atts.length} questions • Lang: ${atts[0]?.language || 'javascript'}`,
      status: sessStatus,
      score: sessScore,
      timestamp: new Date(earlistDate),
    });
  }

  // Interview activities
  for (const i of userInterviews.slice(0, 5)) {
    const isComp = i.status === 'completed';
    activityItems.push({
      id: i.id || i._id ? (i.id || i._id).toString() : `int_${Date.now()}`,
      module: 'interview',
      type: 'mock_interview',
      title: `${i.role || 'Domain'} Mock Interview`,
      subtitle: `${i.questions?.length || 0} questions asked`,
      status: i.status || 'in_progress',
      score: isComp && typeof i.finalReport?.overallScore === 'number' ? i.finalReport.overallScore : null,
      timestamp: new Date(i.startedAt || i.createdAt),
    });
  }

  // Sort unified activity newest first and limit to top 10
  activityItems.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  const recentActivity = activityItems.slice(0, 10);

  return {
    overview: {
      totalResumes,
      totalResumesAnalyzed,
      averageAtsScore,
      highestAtsScore,
      totalCodingSessions,
      totalCodingAttempts,
      completedCodingAttempts: completedCodingAttempts.length,
      averageCodingScore,
      highestCodingScore,
      totalInterviews,
      completedInterviews: completedInterviews.length,
      averageInterviewScore,
      highestInterviewScore,
      overallReadinessScore,
    },
    modules: {
      resume: {
        totalUploaded: totalResumes,
        totalAnalyzed: totalResumesAnalyzed,
        averageAtsScore,
        highestAtsScore,
        latestAnalysisDate,
        statusSummary: {
          analyzed: totalResumesAnalyzed,
          uploaded: Math.max(0, totalResumes - totalResumesAnalyzed),
        },
      },
      coding: {
        totalSessions: totalCodingSessions,
        totalAttempts: totalCodingAttempts,
        completedAttempts: completedCodingAttempts.length,
        inProgressAttempts: inProgressCodingAttempts.length,
        expiredAttempts: expiredCodingAttempts.length,
        averageScore: averageCodingScore,
        highestScore: highestCodingScore,
        languageBreakdown,
      },
      interview: {
        totalInterviews,
        completedInterviews: completedInterviews.length,
        inProgressInterviews: inProgressInterviews.length,
        averageScore: averageInterviewScore,
        highestScore: highestInterviewScore,
        averageTechnicalKnowledge,
        averageConceptClarity,
        averageCommunication,
        averageConfidenceIndicators,
        roleBreakdown,
      },
    },
    recentActivity,
  };
};

export default {
  getUserAnalyticsOverview,
};
