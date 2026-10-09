import mongoose from 'mongoose';
import Interview from '../models/Interview.js';
import {
  SUPPORTED_ROLES,
  INTERVIEW_QUESTION_LIMIT,
  getStartingDifficulty,
  generateInterviewQuestion,
  evaluateInterviewAnswer,
  generateNextQuestion,
  generateFinalReport,
} from './aiInterviewService.js';

// In-memory store for environments where MongoDB is offline or in isolated tests
export const inMemoryInterviews = new Map();

const isDbConnected = () => mongoose.connection.readyState === 1;

/**
 * Format interview document for clean JSON response
 */
const formatInterview = (doc) => {
  if (!doc) return null;
  const raw = doc.toJSON ? doc.toJSON() : { ...doc };
  raw.id = raw._id ? raw._id.toString() : raw.id;
  delete raw.__v;
  return raw;
};

/**
 * Safely look up interview by ID with try/catch protecting against CastError on malformed IDs
 */
export const findInterviewById = async (interviewId) => {
  if (!interviewId) return null;
  const idStr = interviewId.toString();
  if (isDbConnected()) {
    try {
      return await Interview.findById(idStr);
    } catch {
      return null;
    }
  }
  return inMemoryInterviews.get(idStr) || null;
};

/**
 * Start a new interview session
 */
export const startInterviewSession = async ({ userId, role }) => {
  if (!userId) {
    const err = new Error('Authentication required.');
    err.statusCode = 401;
    throw err;
  }

  if (!role || typeof role !== 'string' || !SUPPORTED_ROLES.includes(role.trim())) {
    const err = new Error(
      `Invalid interview request. Supported roles: ${SUPPORTED_ROLES.join(', ')}.`
    );
    err.statusCode = 400;
    throw err;
  }

  const normalizedRole = role.trim();
  const startingDifficulty = getStartingDifficulty(normalizedRole);

  // Generate initial question
  const initialQ = await generateInterviewQuestion({
    role: normalizedRole,
    difficulty: startingDifficulty,
    category: 'technical',
    interviewHistory: [],
  });

  const questionObj = {
    questionId: initialQ.questionId || `q_1_${Date.now()}`,
    text: initialQ.text,
    category: initialQ.category || 'technical',
    difficulty: initialQ.difficulty || startingDifficulty,
    askedAt: new Date(),
    answeredAt: null,
  };

  const initialDoc = {
    userId,
    role: normalizedRole,
    status: 'in_progress',
    questions: [questionObj],
    answers: [],
    scores: {
      technicalKnowledge: 0,
      conceptClarity: 0,
      communication: 0,
      confidenceIndicators: 0,
    },
    startedAt: new Date(),
    completedAt: null,
    finalReport: {
      overallScore: 0,
      summary: '',
      strengths: [],
      weakTopics: [],
      recommendations: [],
      technicalKnowledge: 0,
      conceptClarity: 0,
      communication: 0,
      confidenceIndicators: 0,
    },
  };

  if (isDbConnected()) {
    const interview = await Interview.create(initialDoc);
    const formatted = formatInterview(interview);
    return {
      interviewId: formatted.id,
      role: formatted.role,
      status: formatted.status,
      startedAt: formatted.startedAt,
      currentQuestion: {
        questionId: questionObj.questionId,
        text: questionObj.text,
        category: questionObj.category,
        difficulty: questionObj.difficulty,
        questionNumber: 1,
        totalQuestions: INTERVIEW_QUESTION_LIMIT,
      },
    };
  } else {
    const interviewId = `int_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const record = {
      id: interviewId,
      _id: interviewId,
      ...initialDoc,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    inMemoryInterviews.set(interviewId, record);
    return {
      interviewId,
      role: record.role,
      status: record.status,
      startedAt: record.startedAt,
      currentQuestion: {
        questionId: questionObj.questionId,
        text: questionObj.text,
        category: questionObj.category,
        difficulty: questionObj.difficulty,
        questionNumber: 1,
        totalQuestions: INTERVIEW_QUESTION_LIMIT,
      },
    };
  }
};

/**
 * Retrieve an interview by ID with strict ownership verification
 */
export const getInterviewSession = async ({ interviewId, userId }) => {
  if (!userId) {
    const err = new Error('Authentication required.');
    err.statusCode = 401;
    throw err;
  }

  const record = await findInterviewById(interviewId);

  if (!record) {
    const err = new Error('Interview not found.');
    err.statusCode = 404;
    throw err;
  }

  const recordUserId = record.userId?.toString();
  if (recordUserId !== userId.toString()) {
    const err = new Error('You are not allowed to access this interview.');
    err.statusCode = 403;
    throw err;
  }

  return formatInterview(record);
};

/**
 * Submit an answer for the current interview question
 */
export const submitInterviewAnswer = async ({ interviewId, userId, questionId, answer }) => {
  if (!userId) {
    const err = new Error('Authentication required.');
    err.statusCode = 401;
    throw err;
  }

  if (!interviewId || !questionId || typeof interviewId !== 'string' || typeof questionId !== 'string') {
    const err = new Error('interviewId and questionId are required.');
    err.statusCode = 400;
    throw err;
  }

  if (typeof answer !== 'string' || answer.trim().length < 5) {
    const err = new Error('Answer must be at least 5 characters long.');
    err.statusCode = 400;
    throw err;
  }

  const record = await findInterviewById(interviewId);

  if (!record) {
    const err = new Error('Interview not found.');
    err.statusCode = 404;
    throw err;
  }

  const recordUserId = record.userId?.toString();
  if (recordUserId !== userId.toString()) {
    const err = new Error('You are not allowed to access this interview.');
    err.statusCode = 403;
    throw err;
  }

  if (record.status === 'completed') {
    const err = new Error('Interview is already completed.');
    err.statusCode = 409;
    throw err;
  }

  if (record.status !== 'in_progress') {
    const err = new Error('Interview is not in progress.');
    err.statusCode = 400;
    throw err;
  }

  const question = record.questions.find((q) => q.questionId === questionId);
  if (!question) {
    const err = new Error('Question does not belong to this interview.');
    err.statusCode = 400;
    throw err;
  }

  const alreadyAnswered = record.answers.some((a) => a.questionId === questionId);
  if (alreadyAnswered) {
    const err = new Error('Question has already been answered.');
    err.statusCode = 400;
    throw err;
  }

  // Evaluate answer via AI interview service
  const evaluation = await evaluateInterviewAnswer({
    role: record.role,
    question,
    answer: answer.trim(),
    difficulty: question.difficulty,
    category: question.category,
    interviewHistory: record.answers,
  });

  const answerRecord = {
    questionId,
    answer: answer.trim(),
    category: question.category,
    difficulty: question.difficulty,
    answeredAt: new Date(),
    evaluation: {
      score: evaluation.score,
      strengths: evaluation.strengths || [],
      weaknesses: evaluation.weaknesses || [],
      feedback: evaluation.feedback || '',
      conceptClarity: evaluation.conceptClarity || 0,
      communication: evaluation.communication || 0,
    },
  };

  question.answeredAt = new Date();
  record.answers.push(answerRecord);

  if (isDbConnected()) {
    await record.save();
  } else {
    record.updatedAt = new Date();
    inMemoryInterviews.set(interviewId, record);
  }

  const isLimitReached = record.questions.length >= INTERVIEW_QUESTION_LIMIT;

  return {
    questionId,
    answer: answerRecord.answer,
    evaluation: answerRecord.evaluation,
    canProceedToNext: !isLimitReached,
    isLimitReached,
    questionNumber: record.answers.length,
    totalQuestions: INTERVIEW_QUESTION_LIMIT,
  };
};

/**
 * Generate adaptive next question for the active interview
 */
export const generateNextInterviewQuestion = async ({ interviewId, userId }) => {
  if (!userId) {
    const err = new Error('Authentication required.');
    err.statusCode = 401;
    throw err;
  }

  if (!interviewId || typeof interviewId !== 'string') {
    const err = new Error('interviewId is required.');
    err.statusCode = 400;
    throw err;
  }

  const record = await findInterviewById(interviewId);

  if (!record) {
    const err = new Error('Interview not found.');
    err.statusCode = 404;
    throw err;
  }

  const recordUserId = record.userId?.toString();
  if (recordUserId !== userId.toString()) {
    const err = new Error('You are not allowed to access this interview.');
    err.statusCode = 403;
    throw err;
  }

  if (record.status === 'completed') {
    const err = new Error('Interview is already completed.');
    err.statusCode = 409;
    throw err;
  }

  if (record.status !== 'in_progress') {
    const err = new Error('Interview is not in progress.');
    err.statusCode = 400;
    throw err;
  }

  // Verify that the previous question was answered
  const lastQuestion = record.questions[record.questions.length - 1];
  if (!lastQuestion || !lastQuestion.answeredAt) {
    const err = new Error('Please answer the current question before requesting the next question.');
    err.statusCode = 400;
    throw err;
  }

  // Check if limit has been reached
  if (record.questions.length >= INTERVIEW_QUESTION_LIMIT) {
    const err = new Error('Maximum question limit reached. Please complete the interview.');
    err.statusCode = 400;
    throw err;
  }

  const lastAnswer = record.answers[record.answers.length - 1];
  const previousEvaluation = lastAnswer ? lastAnswer.evaluation : null;

  const nextQ = await generateNextQuestion({
    role: record.role,
    previousQuestion: lastQuestion,
    previousAnswer: lastAnswer?.answer,
    previousEvaluation,
    currentDifficulty: lastQuestion.difficulty,
    interviewHistory: record.questions,
  });

  const questionObj = {
    questionId: nextQ.questionId || `q_${record.questions.length + 1}_${Date.now()}`,
    text: nextQ.text,
    category: nextQ.category,
    difficulty: nextQ.difficulty,
    askedAt: new Date(),
    answeredAt: null,
  };

  record.questions.push(questionObj);

  if (isDbConnected()) {
    await record.save();
  } else {
    record.updatedAt = new Date();
    inMemoryInterviews.set(interviewId, record);
  }

  return {
    questionId: questionObj.questionId,
    text: questionObj.text,
    category: questionObj.category,
    difficulty: questionObj.difficulty,
    questionNumber: record.questions.length,
    totalQuestions: INTERVIEW_QUESTION_LIMIT,
  };
};

/**
 * Finish the interview and generate final evaluation scorecard & report
 */
export const finishInterviewSession = async ({ interviewId, userId }) => {
  if (!userId) {
    const err = new Error('Authentication required.');
    err.statusCode = 401;
    throw err;
  }

  if (!interviewId || typeof interviewId !== 'string') {
    const err = new Error('interviewId is required.');
    err.statusCode = 400;
    throw err;
  }

  const record = await findInterviewById(interviewId);

  if (!record) {
    const err = new Error('Interview not found.');
    err.statusCode = 404;
    throw err;
  }

  const recordUserId = record.userId?.toString();
  if (recordUserId !== userId.toString()) {
    const err = new Error('You are not allowed to access this interview.');
    err.statusCode = 403;
    throw err;
  }

  if (record.status === 'completed') {
    const err = new Error('Interview is already completed.');
    err.statusCode = 409;
    throw err;
  }

  if (record.answers.length === 0) {
    const err = new Error('Cannot complete an interview with no answers submitted.');
    err.statusCode = 400;
    throw err;
  }

  // Generate final grounded report
  const finalReport = await generateFinalReport({
    role: record.role,
    questions: record.questions,
    answers: record.answers,
    interviewHistory: record.questions,
  });

  record.status = 'completed';
  record.completedAt = new Date();
  record.scores = {
    technicalKnowledge: finalReport.technicalKnowledge,
    conceptClarity: finalReport.conceptClarity,
    communication: finalReport.communication,
    confidenceIndicators: finalReport.confidenceIndicators,
  };
  record.finalReport = finalReport;

  if (isDbConnected()) {
    await record.save();
  } else {
    record.updatedAt = new Date();
    inMemoryInterviews.set(interviewId, record);
  }

  return formatInterview(record);
};

/**
 * Retrieve paginated interview history for a user
 */
export const getInterviewHistoryByUserId = async ({ userId, page = 1, limit = 10 }) => {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
  const skip = (pageNum - 1) * limitNum;
  const normalizedUserId = userId.toString();

  if (isDbConnected()) {
    const filter = { userId: normalizedUserId };
    const total = await Interview.countDocuments(filter);
    const interviews = await Interview.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const formatted = interviews.map((doc) => {
      const i = doc.toJSON ? doc.toJSON() : { ...doc };
      const isCompleted = i.status === 'completed';
      return {
        id: i._id ? i._id.toString() : i.id,
        role: i.role,
        status: i.status,
        questionCount: Array.isArray(i.questions) ? i.questions.length : 0,
        answeredCount: Array.isArray(i.answers) ? i.answers.length : 0,
        overallScore: isCompleted && i.finalReport?.overallScore !== undefined ? i.finalReport.overallScore : null,
        scores: isCompleted && i.scores ? i.scores : null,
        summary: isCompleted && i.finalReport?.summary ? i.finalReport.summary : null,
        startedAt: i.startedAt,
        completedAt: i.completedAt,
        createdAt: i.createdAt,
        updatedAt: i.updatedAt,
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
    const userInterviews = Array.from(inMemoryInterviews.values())
      .filter((i) => (i.userId || '').toString() === normalizedUserId)
      .sort((a, b) => new Date(b.createdAt || b.startedAt) - new Date(a.createdAt || a.startedAt));

    const total = userInterviews.length;
    const pageItems = userInterviews.slice(skip, skip + limitNum).map((i) => {
      const isCompleted = i.status === 'completed';
      return {
        id: i.id || i._id,
        role: i.role,
        status: i.status,
        questionCount: Array.isArray(i.questions) ? i.questions.length : 0,
        answeredCount: Array.isArray(i.answers) ? i.answers.length : 0,
        overallScore: isCompleted && i.finalReport?.overallScore !== undefined ? i.finalReport.overallScore : null,
        scores: isCompleted && i.scores ? i.scores : null,
        summary: isCompleted && i.finalReport?.summary ? i.finalReport.summary : null,
        startedAt: i.startedAt,
        completedAt: i.completedAt,
        createdAt: i.createdAt,
        updatedAt: i.updatedAt,
      };
    });

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
  startInterviewSession,
  getInterviewSession,
  submitInterviewAnswer,
  generateNextInterviewQuestion,
  finishInterviewSession,
  getInterviewHistoryByUserId,
  inMemoryInterviews,
};

