import mongoose from 'mongoose';
import CodingQuestion from '../models/CodingQuestion.js';
import CodingAttempt from '../models/CodingAttempt.js';
import CodingReview, { REVIEW_TYPES } from '../models/CodingReview.js';
import { codingQuestionsData } from '../data/codingQuestions.js';
import { executeTestSuite } from './codeExecutionService.js';
import { generateCodingReview } from './aiCodingReviewService.js';

// In-memory attempts, questions, and reviews map for development/testing when MongoDB is offline
export const inMemoryAttempts = new Map();
export const inMemoryQuestions = new Map();
export const inMemoryReviews = new Map();

// Initialize in-memory questions with stable IDs from curated bank
codingQuestionsData.forEach((q, index) => {
  const qId = `cq_${index + 1}`;
  inMemoryQuestions.set(qId, {
    ...q,
    id: qId,
    _id: qId,
  });
});

const isDbConnected = () => mongoose.connection.readyState === 1;

/**
 * Retrieve raw question with full test cases
 */
export const findRawQuestionById = async (questionId) => {
  if (!questionId) return null;
  const normalizedQId = questionId.toString();

  if (isDbConnected()) {
    try {
      const q = await CodingQuestion.findById(normalizedQId);
      if (q) return q;
    } catch {
      // Fallback
    }
  }

  return inMemoryQuestions.get(normalizedQId) || null;
};

// Helper to remove hidden test cases from question objects
export const sanitizeQuestion = (questionDoc) => {
  if (!questionDoc) return null;
  const q = questionDoc.toJSON ? questionDoc.toJSON() : { ...questionDoc };
  const safeId = (q._id || q.id || '').toString();

  // Filter out any hidden test cases so solutions / edge tests are never exposed
  const visibleTestCases = Array.isArray(q.testCases)
    ? q.testCases.filter((tc) => !tc.hidden).map((tc) => ({
        input: tc.input,
        expectedOutput: tc.expectedOutput,
      }))
    : [];

  return {
    id: safeId,
    _id: safeId,
    title: q.title,
    description: q.description,
    difficulty: q.difficulty,
    topic: q.topic,
    constraints: q.constraints || [],
    examples: q.examples || [],
    testCases: visibleTestCases,
    starterCode: q.starterCode || {},
    supportedLanguages: q.supportedLanguages || ['cpp', 'java', 'python', 'javascript'],
  };
};

/**
 * Check if an attempt's server deadline has passed.
 * If expired and not already submitted, mark as 'expired'.
 */
export const checkAndMarkExpired = async (attempt) => {
  if (!attempt) return null;
  const now = new Date();
  const deadline = new Date(attempt.deadline);

  if (now >= deadline && attempt.status !== 'submitted' && attempt.status !== 'expired') {
    attempt.status = 'expired';
    if (isDbConnected() && typeof attempt.save === 'function') {
      await attempt.save();
    } else {
      const existing = inMemoryAttempts.get(`${attempt.sessionId}_${attempt.questionId}`);
      if (existing) {
        existing.status = 'expired';
        existing.updatedAt = now.toISOString();
      }
    }
  }

  return attempt;
};

/**
 * Start a new coding session with 2 random questions and independent 30-minute timers.
 */
export const startCodingSession = async (userId) => {
  if (!userId) {
    const error = new Error('User ID is required to start a coding session.');
    error.statusCode = 401;
    throw error;
  }

  const normalizedUserId = userId.toString();
  let selectedQuestions = [];

  if (isDbConnected()) {
    const count = await CodingQuestion.countDocuments();
    if (count < 2) {
      await CodingQuestion.insertMany(codingQuestionsData);
    }
    selectedQuestions = await CodingQuestion.aggregate([{ $sample: { size: 2 } }]);
  } else {
    const allQuestions = Array.from(inMemoryQuestions.values());
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    selectedQuestions = shuffled.slice(0, 2);
  }

  if (selectedQuestions.length < 2) {
    const error = new Error('Insufficient coding questions available in question bank.');
    error.statusCode = 500;
    throw error;
  }

  const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const now = new Date();
  const durationMs = 30 * 60 * 1000; // 30 minutes

  const attempts = [];
  for (let i = 0; i < selectedQuestions.length; i++) {
    const q = selectedQuestions[i];
    const qId = (q._id || q.id).toString();
    const startedAt = new Date(now.getTime());
    const deadline = new Date(startedAt.getTime() + durationMs);

    const defaultLanguage = 'javascript';
    const initialCode = q.starterCode?.[defaultLanguage] || '';

    if (isDbConnected()) {
      const attemptDoc = await CodingAttempt.create({
        userId: normalizedUserId,
        sessionId,
        questionId: q._id,
        language: defaultLanguage,
        code: initialCode,
        status: 'in_progress',
        startedAt,
        deadline,
      });
      attempts.push(attemptDoc.toJSON ? attemptDoc.toJSON() : attemptDoc);
    } else {
      const attemptRecord = {
        id: `att_${Date.now()}_${i}`,
        _id: `att_${Date.now()}_${i}`,
        userId: normalizedUserId,
        sessionId,
        questionId: qId,
        language: defaultLanguage,
        code: initialCode,
        status: 'in_progress',
        startedAt: startedAt.toISOString(),
        deadline: deadline.toISOString(),
        submittedAt: null,
        resultStatus: 'pending',
        testCasesPassed: 0,
        totalTestCases: (q.testCases || []).length,
        score: 0,
        executionTime: 0,
        memoryUsed: 0,
        compilerError: '',
        runtimeError: '',
        createdAt: startedAt.toISOString(),
        updatedAt: startedAt.toISOString(),
      };
      inMemoryAttempts.set(`${sessionId}_${qId}`, attemptRecord);
      attempts.push(attemptRecord);
    }
  }

  return {
    sessionId,
    questions: selectedQuestions.map((q) => sanitizeQuestion(q)),
    attempts,
  };
};

/**
 * Retrieve session details and verify that only the session owner can view it.
 */
export const getCodingSession = async (userId, sessionId) => {
  const normalizedUserId = userId.toString();
  let attempts = [];

  if (isDbConnected()) {
    attempts = await CodingAttempt.find({ sessionId }).populate('questionId');
  } else {
    for (const [key, att] of inMemoryAttempts.entries()) {
      if (att.sessionId === sessionId) {
        attempts.push({ ...att });
      }
    }
  }

  if (!attempts || attempts.length === 0) {
    const error = new Error('Coding session not found.');
    error.statusCode = 404;
    throw error;
  }

  // Strict ownership check: User A must never access User B's session
  const ownerId = (attempts[0].userId?._id || attempts[0].userId?.id || attempts[0].userId || '').toString();
  if (ownerId !== normalizedUserId) {
    const error = new Error('Access denied. You do not have permission to access this coding session.');
    error.statusCode = 403;
    throw error;
  }

  // Check and update expiration for all attempts
  for (const att of attempts) {
    await checkAndMarkExpired(att);
  }

  // Extract sanitized questions
  const questions = [];
  const sanitizedAttempts = [];

  for (const att of attempts) {
    const rawQ = att.questionId;
    let questionObj = null;

    if (rawQ && typeof rawQ === 'object' && rawQ.title) {
      questionObj = sanitizeQuestion(rawQ);
    } else {
      const qId = (rawQ?._id || rawQ?.id || rawQ || '').toString();
      const found = await findRawQuestionById(qId);
      if (found) questionObj = sanitizeQuestion(found);
    }

    if (questionObj) {
      questions.push(questionObj);
    }

    const attRecord = att.toJSON ? att.toJSON() : { ...att };
    sanitizedAttempts.push({
      id: attRecord.id || attRecord._id,
      sessionId: attRecord.sessionId,
      questionId: (attRecord.questionId?._id || attRecord.questionId?.id || attRecord.questionId || '').toString(),
      language: attRecord.language,
      code: attRecord.code,
      status: attRecord.status,
      startedAt: attRecord.startedAt,
      deadline: attRecord.deadline,
      submittedAt: attRecord.submittedAt,
      resultStatus: attRecord.resultStatus,
      testCasesPassed: attRecord.testCasesPassed,
      totalTestCases: attRecord.totalTestCases,
      score: attRecord.score,
      executionTime: attRecord.executionTime,
      memoryUsed: attRecord.memoryUsed,
      compilerError: attRecord.compilerError,
      runtimeError: attRecord.runtimeError,
    });
  }

  return {
    sessionId,
    questions,
    attempts: sanitizedAttempts,
  };
};

/**
 * Save draft code for a question attempt before submission.
 */
export const saveCodingCode = async (userId, sessionId, questionId, code, language) => {
  const normalizedUserId = userId.toString();
  const normalizedQId = questionId.toString();

  let attempt = null;

  if (isDbConnected()) {
    attempt = await CodingAttempt.findOne({ sessionId, questionId: normalizedQId });
  } else {
    attempt = inMemoryAttempts.get(`${sessionId}_${normalizedQId}`) || null;
  }

  if (!attempt) {
    const error = new Error('Coding attempt not found for this session and question.');
    error.statusCode = 404;
    throw error;
  }

  // Strict ownership check
  const ownerId = (attempt.userId?._id || attempt.userId?.id || attempt.userId || '').toString();
  if (ownerId !== normalizedUserId) {
    const error = new Error('Access denied. You do not have permission to modify this attempt.');
    error.statusCode = 403;
    throw error;
  }

  // Check expiration using server time
  await checkAndMarkExpired(attempt);
  if (attempt.status === 'expired' || attempt.status === 'submitted') {
    const error = new Error(`Cannot save code. Question attempt is already ${attempt.status}.`);
    error.statusCode = 400;
    throw error;
  }

  if (typeof code === 'string') {
    attempt.code = code;
  }
  if (language && ['cpp', 'java', 'python', 'javascript'].includes(language)) {
    attempt.language = language;
  }

  if (isDbConnected() && typeof attempt.save === 'function') {
    await attempt.save();
    return attempt.toJSON ? attempt.toJSON() : attempt;
  } else {
    attempt.updatedAt = new Date().toISOString();
    inMemoryAttempts.set(`${sessionId}_${normalizedQId}`, attempt);
    return attempt;
  }
};

/**
 * Execute code against visible test cases ONLY (Run Code feature).
 * Does NOT submit attempt, does NOT change attempt score, does NOT expose hidden tests.
 */
export const runCodingCode = async (userId, sessionId, questionId, code, language) => {
  const normalizedUserId = userId.toString();
  const normalizedQId = questionId.toString();

  let attempt = null;

  if (isDbConnected()) {
    attempt = await CodingAttempt.findOne({ sessionId, questionId: normalizedQId });
  } else {
    attempt = inMemoryAttempts.get(`${sessionId}_${normalizedQId}`) || null;
  }

  if (!attempt) {
    const error = new Error('Coding attempt not found for this session and question.');
    error.statusCode = 404;
    throw error;
  }

  // Strict ownership check
  const ownerId = (attempt.userId?._id || attempt.userId?.id || attempt.userId || '').toString();
  if (ownerId !== normalizedUserId) {
    const error = new Error('Access denied. You do not have permission to execute code for this session.');
    error.statusCode = 403;
    throw error;
  }

  // Check expiration using server time
  await checkAndMarkExpired(attempt);
  if (attempt.status === 'expired' || attempt.status === 'submitted') {
    const error = new Error(`Cannot run code. Question attempt is already ${attempt.status}.`);
    error.statusCode = 400;
    throw error;
  }

  // Retrieve raw question to access test cases
  const question = await findRawQuestionById(normalizedQId);
  if (!question) {
    const error = new Error('Question details not found.');
    error.statusCode = 404;
    throw error;
  }

  // Run feature evaluates ONLY visible (sample) test cases!
  const allTestCases = question.testCases || [];
  const visibleTestCases = allTestCases.filter((tc) => !tc.hidden);

  const effectiveCode = typeof code === 'string' ? code : attempt.code;
  const effectiveLanguage = language || attempt.language || 'javascript';

  // Execute test suite via isolated Judge0 service
  const execResult = await executeTestSuite({
    code: effectiveCode,
    language: effectiveLanguage,
    testCases: visibleTestCases,
    stopOnFirstError: false,
  });

  // Return clean, safe run result without revealing any internal secrets
  return {
    status: execResult.resultStatus,
    testCasesPassed: execResult.testCasesPassed,
    totalVisibleTestCases: visibleTestCases.length,
    executionTime: execResult.executionTime,
    memoryUsed: execResult.memoryUsed,
    compilerError: execResult.compilerError,
    runtimeError: execResult.runtimeError,
    testResults: execResult.caseResults.map((r) => ({
      index: r.index,
      passed: r.passed,
      status: r.status,
      input: r.input,
      expectedOutput: r.expectedOutput,
      actualOutput: r.actualOutput,
      time: r.time,
      memory: r.memory,
    })),
  };
};

/**
 * Submit a coding question attempt.
 * Evaluates against ALL test cases (visible + hidden) via Judge0, stores final score/metadata,
 * and returns safe aggregate results to client without exposing hidden test data.
 */
export const submitCodingQuestion = async (userId, sessionId, questionId, code, language) => {
  const normalizedUserId = userId.toString();
  const normalizedQId = questionId.toString();

  let attempt = null;

  if (isDbConnected()) {
    attempt = await CodingAttempt.findOne({ sessionId, questionId: normalizedQId });
  } else {
    attempt = inMemoryAttempts.get(`${sessionId}_${normalizedQId}`) || null;
  }

  if (!attempt) {
    const error = new Error('Coding attempt not found for this session and question.');
    error.statusCode = 404;
    throw error;
  }

  // Strict ownership check
  const ownerId = (attempt.userId?._id || attempt.userId?.id || attempt.userId || '').toString();
  if (ownerId !== normalizedUserId) {
    const error = new Error('Access denied. You do not have permission to submit this attempt.');
    error.statusCode = 403;
    throw error;
  }

  // Backend deadline enforcement
  const now = new Date();
  const deadline = new Date(attempt.deadline);

  if (now >= deadline) {
    attempt.status = 'expired';
    if (isDbConnected() && typeof attempt.save === 'function') {
      await attempt.save();
    } else {
      inMemoryAttempts.set(`${sessionId}_${normalizedQId}`, attempt);
    }
    const error = new Error('Deadline has expired for this question. Attempt marked as expired.');
    error.statusCode = 400;
    throw error;
  }

  if (attempt.status === 'submitted') {
    return {
      message: 'Question was already submitted.',
      attempt: attempt.toJSON ? attempt.toJSON() : attempt,
    };
  }

  // Update candidate code if supplied in submit payload
  if (typeof code === 'string') {
    attempt.code = code;
  }
  if (language && ['cpp', 'java', 'python', 'javascript'].includes(language)) {
    attempt.language = language;
  }

  // Retrieve raw question to access full test suite (including hidden test cases)
  const question = await findRawQuestionById(normalizedQId);
  const fullTestSuite = (question && question.testCases) ? question.testCases : [];

  // Execute full test suite via Judge0 execution provider
  const execResult = await executeTestSuite({
    code: attempt.code,
    language: attempt.language,
    testCases: fullTestSuite,
    stopOnFirstError: false,
  });

  // Persist evaluation results into attempt
  attempt.status = 'submitted';
  attempt.submittedAt = now;
  attempt.resultStatus = execResult.resultStatus;
  attempt.testCasesPassed = execResult.testCasesPassed;
  attempt.totalTestCases = execResult.totalTestCases;
  attempt.score = execResult.score;
  attempt.executionTime = execResult.executionTime;
  attempt.memoryUsed = execResult.memoryUsed;
  attempt.compilerError = execResult.compilerError;
  attempt.runtimeError = execResult.runtimeError;

  let savedRecord = null;
  if (isDbConnected() && typeof attempt.save === 'function') {
    await attempt.save();
    savedRecord = attempt.toJSON ? attempt.toJSON() : attempt;
  } else {
    attempt.updatedAt = now.toISOString();
    inMemoryAttempts.set(`${sessionId}_${normalizedQId}`, attempt);
    savedRecord = attempt;
  }

  // Filter caseResults to only return safe information for visible tests
  const safeVisibleResults = execResult.caseResults
    .filter((r) => !r.hidden)
    .map((r) => ({
      index: r.index,
      passed: r.passed,
      status: r.status,
      input: r.input,
      expectedOutput: r.expectedOutput,
      actualOutput: r.actualOutput,
      time: r.time,
      memory: r.memory,
    }));

  return {
    message: 'Question submitted successfully.',
    attempt: {
      id: savedRecord.id || savedRecord._id,
      sessionId: savedRecord.sessionId,
      questionId: normalizedQId,
      language: savedRecord.language,
      status: 'submitted',
      submittedAt: savedRecord.submittedAt,
      resultStatus: savedRecord.resultStatus,
      testCasesPassed: savedRecord.testCasesPassed,
      totalTestCases: savedRecord.totalTestCases,
      score: savedRecord.score,
      executionTime: savedRecord.executionTime,
      memoryUsed: savedRecord.memoryUsed,
      compilerError: savedRecord.compilerError,
      runtimeError: savedRecord.runtimeError,
      visibleResults: safeVisibleResults,
    },
  };
};

/**
 * Retrieve or generate an AI Coding Review for a finalized question attempt.
 * Enforces:
 * - Session ownership
 * - Finalized attempt status (submitted or expired) - rejects in_progress with 403
 * - Review caching to prevent duplicate API invocations
 * - Anti-hallucination and privacy rules
 */
export const getCodingReview = async (userId, sessionId, questionId, reviewType) => {
  const normalizedUserId = (userId || '').toString();
  const normalizedQId = (questionId || '').toString();

  if (!sessionId || !questionId) {
    const error = new Error('sessionId and questionId are required.');
    error.statusCode = 400;
    throw error;
  }

  if (!REVIEW_TYPES.includes(reviewType)) {
    const error = new Error(`Invalid reviewType "${reviewType}". Supported: ${REVIEW_TYPES.join(', ')}.`);
    error.statusCode = 400;
    throw error;
  }

  let attempt = null;
  if (isDbConnected()) {
    attempt = await CodingAttempt.findOne({ sessionId, questionId: normalizedQId });
  } else {
    attempt = inMemoryAttempts.get(`${sessionId}_${normalizedQId}`) || null;
  }

  if (!attempt) {
    const error = new Error('Coding attempt not found for this session and question.');
    error.statusCode = 404;
    throw error;
  }

  // Ownership verification
  const ownerId = (attempt.userId?._id || attempt.userId?.id || attempt.userId || '').toString();
  if (ownerId !== normalizedUserId) {
    const error = new Error('Access denied. You do not have permission to access this coding session.');
    error.statusCode = 403;
    throw error;
  }

  // Check deadline in case question attempt expired without submission
  await checkAndMarkExpired(attempt);

  // STRICT REQUIREMENT: AI review is available ONLY after submission or expiry!
  if (attempt.status !== 'submitted' && attempt.status !== 'expired') {
    const error = new Error('AI review is available only after submission.');
    error.statusCode = 403;
    throw error;
  }

  const attemptId = (attempt._id || attempt.id || `${sessionId}_${normalizedQId}`).toString();
  const language = attempt.language || 'javascript';
  const cacheKey = `${attemptId}_${reviewType}_${language}`;

  // Check cache in MongoDB or in-memory
  let cachedReview = null;
  if (isDbConnected()) {
    cachedReview = await CodingReview.findOne({
      attemptId,
      reviewType,
      language,
    });
  } else {
    cachedReview = inMemoryReviews.get(cacheKey) || null;
  }

  if (cachedReview) {
    const reviewData = cachedReview.toJSON ? cachedReview.toJSON() : cachedReview;
    return {
      cached: true,
      review: reviewData.generatedReview,
      reviewType,
      language,
      sessionId,
      questionId: normalizedQId,
      attemptId,
    };
  }

  // Not cached: retrieve raw question and generate review
  const rawQuestion = await findRawQuestionById(normalizedQId);
  if (!rawQuestion) {
    const error = new Error('Question details not found.');
    error.statusCode = 404;
    throw error;
  }

  // Sanitize question before feeding (anti-hallucination, no hidden test cases)
  const safeQuestion = sanitizeQuestion(rawQuestion);

  const generated = await generateCodingReview({
    question: safeQuestion,
    code: attempt.code || '',
    language,
    attempt: {
      status: attempt.status,
      resultStatus: attempt.resultStatus,
      testCasesPassed: attempt.testCasesPassed,
      totalTestCases: attempt.totalTestCases,
      score: attempt.score,
      executionTime: attempt.executionTime,
      memoryUsed: attempt.memoryUsed,
      compilerError: attempt.compilerError,
      runtimeError: attempt.runtimeError,
    },
    reviewType,
  });

  // Store in database or in-memory cache
  if (isDbConnected()) {
    try {
      const reviewDoc = await CodingReview.create({
        userId: normalizedUserId,
        sessionId,
        attemptId,
        questionId: normalizedQId,
        reviewType,
        language,
        generatedReview: generated,
        model: generated.model || 'placementprep-ai-evaluator',
      });
      cachedReview = reviewDoc.toJSON ? reviewDoc.toJSON() : reviewDoc;
    } catch (saveErr) {
      console.warn('Failed to persist review cache to DB:', saveErr.message);
    }
  } else {
    const reviewRecord = {
      id: `rev_${Date.now()}`,
      userId: normalizedUserId,
      sessionId,
      attemptId,
      questionId: normalizedQId,
      reviewType,
      language,
      generatedReview: generated,
      model: generated.model || 'placementprep-ai-evaluator',
      createdAt: new Date().toISOString(),
    };
    inMemoryReviews.set(cacheKey, reviewRecord);
    cachedReview = reviewRecord;
  }

  return {
    cached: false,
    review: generated,
    reviewType,
    language,
    sessionId,
    questionId: normalizedQId,
    attemptId,
  };
};

/**
 * Retrieve paginated coding history for a user
 * Groups attempts by session and presents session + attempt details without revealing hidden tests
 */
export const getCodingHistoryByUserId = async ({ userId, page = 1, limit = 10 }) => {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
  const skip = (pageNum - 1) * limitNum;
  const normalizedUserId = userId.toString();

  let rawAttempts = [];

  if (isDbConnected()) {
    rawAttempts = await CodingAttempt.find({ userId: normalizedUserId }).sort({ createdAt: -1 });
  } else {
    rawAttempts = Array.from(inMemoryAttempts.values())
      .filter((a) => (a.userId || '').toString() === normalizedUserId)
      .sort((a, b) => new Date(b.createdAt || b.startedAt) - new Date(a.createdAt || a.startedAt));
  }

  // Group attempts by sessionId
  const sessionsMap = new Map();

  for (const doc of rawAttempts) {
    const att = doc.toJSON ? doc.toJSON() : { ...doc };
    att.id = att._id ? att._id.toString() : att.id;

    if (!sessionsMap.has(att.sessionId)) {
      sessionsMap.set(att.sessionId, []);
    }
    sessionsMap.get(att.sessionId).push(att);
  }

  // Build structured session summaries
  const sessionsList = [];

  for (const [sessionId, attempts] of sessionsMap.entries()) {
    const totalQuestions = attempts.length;
    const completedAttempts = attempts.filter((a) => a.status === 'submitted');
    const expiredAttempts = attempts.filter((a) => a.status === 'expired');
    const inProgressAttempts = attempts.filter((a) => a.status === 'in_progress');

    let sessionStatus = 'in_progress';
    if (completedAttempts.length === totalQuestions) {
      sessionStatus = 'submitted';
    } else if (inProgressAttempts.length === 0 && expiredAttempts.length > 0) {
      sessionStatus = 'expired';
    }

    const scoredAttempts = completedAttempts.filter((a) => typeof a.score === 'number');
    const averageScore = scoredAttempts.length > 0
      ? Math.round(scoredAttempts.reduce((acc, curr) => acc + curr.score, 0) / scoredAttempts.length)
      : null;

    const languagesUsed = [...new Set(attempts.map((a) => a.language).filter(Boolean))];

    // Map attempts with question title metadata
    const mappedAttempts = [];
    for (const a of attempts) {
      const q = await findRawQuestionById(a.questionId);
      mappedAttempts.push({
        attemptId: a.id || a._id,
        questionId: (a.questionId || '').toString(),
        questionTitle: q ? q.title : 'Coding Question',
        topic: q ? q.topic : 'Algorithms',
        difficulty: q ? q.difficulty : 'Medium',
        language: a.language || 'javascript',
        status: a.status,
        score: typeof a.score === 'number' ? a.score : 0,
        resultStatus: a.resultStatus || 'pending',
        testCasesPassed: a.testCasesPassed || 0,
        totalTestCases: a.totalTestCases || 0,
        executionTime: a.executionTime || 0,
        memoryUsed: a.memoryUsed || 0,
        startedAt: a.startedAt,
        submittedAt: a.submittedAt,
        deadline: a.deadline,
      });
    }

    // Earliest startedAt / createdAt
    const startedDates = attempts.map((a) => new Date(a.startedAt || a.createdAt).getTime()).filter((t) => !isNaN(t));
    const sessionDate = startedDates.length > 0 ? new Date(Math.min(...startedDates)) : new Date();

    sessionsList.push({
      sessionId,
      startedAt: sessionDate,
      createdAt: sessionDate,
      status: sessionStatus,
      totalQuestions,
      completedQuestions: completedAttempts.length,
      averageScore,
      languages: languagesUsed,
      attempts: mappedAttempts,
    });
  }

  // Sort sessions newest first
  sessionsList.sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt));

  const total = sessionsList.length;
  const pageItems = sessionsList.slice(skip, skip + limitNum);

  return {
    items: pageItems,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
    },
  };
};

export default {
  startCodingSession,
  getCodingSession,
  saveCodingCode,
  runCodingCode,
  submitCodingQuestion,
  getCodingReview,
  sanitizeQuestion,
  checkAndMarkExpired,
  findRawQuestionById,
  getCodingHistoryByUserId,
  inMemoryAttempts,
  inMemoryQuestions,
  inMemoryReviews,
};

