import React, { useState, useEffect, useCallback } from 'react';
import {
  Bot,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Award,
  BookOpen,
  MessageSquare,
  Loader2,
  ChevronDown,
  ChevronUp,
  Layers,
  ShieldCheck,
  RotateCcw,
  Code2,
  Database,
  Cpu,
  BarChart3,
  Terminal,
  Send,
  HelpCircle,
} from 'lucide-react';
import {
  startInterview,
  getInterview,
  submitInterviewAnswer,
  getNextQuestion,
  finishInterview,
} from '../services/interviewService';

const SUPPORTED_ROLES = [
  {
    title: 'Frontend Developer',
    icon: Code2,
    description: 'React, modern JavaScript (ES6+), DOM, CSS layouts, and web performance.',
  },
  {
    title: 'Backend Developer',
    icon: Database,
    description: 'REST APIs, relational & NoSQL databases, indexing, auth, and error handling.',
  },
  {
    title: 'Full Stack Developer',
    icon: Layers,
    description: 'End-to-end web architecture, client-server lifecycle, state sync, and web security.',
  },
  {
    title: 'Software Developer',
    icon: Terminal,
    description: 'Core OOP, data structures, algorithms, Big-O analysis, and design principles.',
  },
  {
    title: 'Java Developer',
    icon: Cpu,
    description: 'Java fundamentals, JVM internals, Collections, Streams, and enterprise patterns.',
  },
  {
    title: 'Python Developer',
    icon: Code2,
    description: 'Pythonic idioms, data structures, OOP, decorators, generators, and async programming.',
  },
  {
    title: 'Data Analyst',
    icon: BarChart3,
    description: 'SQL queries & window functions, EDA, statistical reasoning, and data cleaning.',
  },
];

const LOCAL_STORAGE_KEY = 'placementprep_active_interview_id';

export const MockInterviewPage = () => {
  // Main view modes: 'start' | 'active' | 'completed'
  const [viewMode, setViewMode] = useState('start');
  const [selectedRole, setSelectedRole] = useState(SUPPORTED_ROLES[0].title);

  // Active session data
  const [interviewId, setInterviewId] = useState(null);
  const [role, setRole] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(10);
  const [userAnswer, setUserAnswer] = useState('');

  // Active answer evaluation state
  const [evaluation, setEvaluation] = useState(null);
  const [isLimitReached, setIsLimitReached] = useState(false);

  // Completed session state
  const [completedData, setCompletedData] = useState(null);
  const [expandedReviews, setExpandedReviews] = useState({});

  // Loading and error states
  const [initialLoading, setInitialLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [advancing, setAdvancing] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [error, setError] = useState('');

  /**
   * Resume / Recover in-progress interview on page load
   */
  const recoverInterviewSession = useCallback(async () => {
    const savedId = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!savedId) {
      setInitialLoading(false);
      return;
    }

    try {
      const response = await getInterview(savedId);
      if (response && response.success && response.data) {
        const intv = response.data;
        setInterviewId(intv.id || intv._id);
        setRole(intv.role);

        if (intv.status === 'completed') {
          setCompletedData(intv);
          setViewMode('completed');
          localStorage.removeItem(LOCAL_STORAGE_KEY);
        } else if (intv.status === 'in_progress') {
          const questions = intv.questions || [];
          const answers = intv.answers || [];
          const lastQ = questions[questions.length - 1];

          if (lastQ) {
            setCurrentQuestion(lastQ);
            setQuestionNumber(questions.length);
            setTotalQuestions(10);

            // Check if last question already has an answer submitted
            const lastAns = answers.find((a) => a.questionId === lastQ.questionId);
            if (lastAns) {
              setEvaluation(lastAns.evaluation);
              setUserAnswer(lastAns.answer);
              setIsLimitReached(questions.length >= 10);
            } else {
              setEvaluation(null);
              setUserAnswer('');
              setIsLimitReached(false);
            }
          }
          setViewMode('active');
        } else {
          localStorage.removeItem(LOCAL_STORAGE_KEY);
        }
      }
    } catch (err) {
      // Stale or unauthorized interview session; clear and return to start
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } finally {
      setInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    recoverInterviewSession();
  }, [recoverInterviewSession]);

  /**
   * Start a new interview session
   */
  const handleStartInterview = async () => {
    setError('');
    setSubmitting(true);
    try {
      const response = await startInterview(selectedRole);
      if (response && response.success && response.data) {
        const { interviewId: newId, role: newRole, currentQuestion: firstQ } = response.data;
        setInterviewId(newId);
        setRole(newRole);
        setCurrentQuestion(firstQ);
        setQuestionNumber(firstQ.questionNumber || 1);
        setTotalQuestions(firstQ.totalQuestions || 10);
        setUserAnswer('');
        setEvaluation(null);
        setIsLimitReached(false);
        setViewMode('active');

        localStorage.setItem(LOCAL_STORAGE_KEY, newId);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start interview. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Submit answer for the active question
   */
  const handleSubmitAnswer = async (e) => {
    e?.preventDefault();
    if (!userAnswer || userAnswer.trim().length < 5) {
      setError('Please provide a substantive answer (at least 5 characters).');
      return;
    }

    setError('');
    setSubmitting(true);
    try {
      const response = await submitInterviewAnswer({
        interviewId,
        questionId: currentQuestion.questionId,
        answer: userAnswer.trim(),
      });

      if (response && response.success && response.data) {
        setEvaluation(response.data.evaluation);
        setIsLimitReached(Boolean(response.data.isLimitReached));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to evaluate answer. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Request next adaptive question
   */
  const handleNextQuestion = async () => {
    setError('');
    setAdvancing(true);
    try {
      const response = await getNextQuestion(interviewId);
      if (response && response.success && response.data) {
        const nextQ = response.data;
        setCurrentQuestion(nextQ);
        setQuestionNumber(nextQ.questionNumber);
        setTotalQuestions(nextQ.totalQuestions || 10);
        setUserAnswer('');
        setEvaluation(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate next question.');
    } finally {
      setAdvancing(false);
    }
  };

  /**
   * Conclude the interview and produce final scorecard report
   */
  const handleFinishInterview = async () => {
    setError('');
    setFinishing(true);
    try {
      const response = await finishInterview(interviewId);
      if (response && response.success && response.data) {
        setCompletedData(response.data);
        setViewMode('completed');
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to finalize interview report.');
    } finally {
      setFinishing(false);
    }
  };

  /**
   * Reset and start fresh
   */
  const handleReset = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setInterviewId(null);
    setCurrentQuestion(null);
    setUserAnswer('');
    setEvaluation(null);
    setCompletedData(null);
    setViewMode('start');
    setError('');
  };

  const toggleReviewItem = (id) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getDifficultyBadge = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Hard':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Medium':
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  const getCategoryBadge = (category) => {
    switch (category) {
      case 'technical':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'project':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'behavioral':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'hr':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-3" />
        <p className="text-sm font-medium">Checking active interview session...</p>
      </div>
    );
  }

  // =========================================================================
  // VIEW MODE A: START SCREEN (Role Selection & Briefing)
  // =========================================================================
  if (viewMode === 'start') {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 mb-3">
            <Bot className="w-3.5 h-3.5" />
            <span>Module 03 • AI Mock Interview</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">AI Mock Interview</h1>
          <p className="text-base text-slate-600 mt-1 max-w-3xl">
            Practice a realistic fresher interview tailored to your target role.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-600" />
            <div className="text-sm">{error}</div>
          </div>
        )}

        {/* Role Selector Grid */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 mb-8">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Select Target Role</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Choose the domain track you are preparing for. All interviews are structured for campus placements.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {SUPPORTED_ROLES.map((r) => {
              const Icon = r.icon;
              const isSelected = selectedRole === r.title;
              return (
                <button
                  key={r.title}
                  type="button"
                  onClick={() => setSelectedRole(r.title)}
                  className={`text-left p-4 rounded-xl border transition-all ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-600/20 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-slate-900 flex items-center justify-between">
                        <span>{r.title}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600 ml-1" />}
                      </div>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{r.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Interview Guidelines Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 mb-8 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            Interview Simulation Format
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-semibold text-slate-900 block mb-1">Adaptive Questions</span>
              8 to 10 questions covering domain fundamentals, real-world project challenges, and behavioral scenarios.
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-semibold text-slate-900 block mb-1">Dynamic Progression</span>
              Question difficulty and follow-ups dynamically adapt based on the depth of your answers.
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-semibold text-slate-900 block mb-1">Objective Feedback</span>
              Instant evaluation on response clarity, technical knowledge, and observable communication patterns.
            </div>
          </div>
        </div>

        {/* Start Button */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleStartInterview}
            disabled={submitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Preparing Interview...
              </>
            ) : (
              <>
                Start Interview
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW MODE B: ACTIVE INTERVIEW UI
  // =========================================================================
  if (viewMode === 'active' && currentQuestion) {
    const isEvaluated = Boolean(evaluation);
    const wordCount = userAnswer.trim() ? userAnswer.trim().split(/\s+/).length : 0;
    const charCount = userAnswer.length;

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Header Badges & Progress */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-5 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Role:</span>
              <span className="text-xs font-bold text-slate-900 px-2.5 py-0.5 rounded-md bg-slate-100 border border-slate-200">
                {role}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-xs font-medium px-2.5 py-0.5 rounded-md border ${getCategoryBadge(
                  currentQuestion.category
                )}`}
              >
                {currentQuestion.category.toUpperCase()}
              </span>
              <span
                className={`text-xs font-medium px-2.5 py-0.5 rounded-md border ${getDifficultyBadge(
                  currentQuestion.difficulty
                )}`}
              >
                {currentQuestion.difficulty}
              </span>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200">
                Question {questionNumber} of {totalQuestions}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (questionNumber / totalQuestions) * 100)}%` }}
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-600" />
            <div className="text-sm">{error}</div>
          </div>
        )}

        {/* Current Question Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 mb-6">
          <div className="flex items-start gap-3 mb-1">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 flex-shrink-0 mt-0.5 border border-indigo-100">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                Question #{questionNumber}
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1 leading-snug">
                {currentQuestion.text}
              </h2>
            </div>
          </div>
        </div>

        {/* Answer Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 mb-6">
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="answer-input" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Your Answer
            </label>
            <span className="text-xs text-slate-400">
              {wordCount} words • {charCount} characters
            </span>
          </div>

          <textarea
            id="answer-input"
            rows={7}
            disabled={isEvaluated || submitting}
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Type your response thoroughly. Explain your thought process, underlying mechanisms, and practical examples where applicable..."
            className="w-full p-3.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 disabled:bg-slate-50 disabled:text-slate-600 resize-y font-normal text-slate-800 leading-relaxed shadow-xs"
          />

          {!isEvaluated && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
              <p className="text-xs text-slate-500">
                Aim for clarity, structure, and technical accuracy.
              </p>
              <button
                type="button"
                onClick={handleSubmitAnswer}
                disabled={submitting || userAnswer.trim().length < 5}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Evaluating Answer...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Answer
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Answer Evaluation Feedback Card */}
        {isEvaluated && evaluation && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 mb-6 animate-fadeIn">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">Answer Evaluation</h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Score</span>
                  <span className="text-lg font-bold text-indigo-700">{evaluation.score}/100</span>
                </div>
              </div>
            </div>

            {/* Micro Scores */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 block">Concept Clarity</span>
                <span className="text-sm font-bold text-slate-900">{evaluation.conceptClarity || evaluation.score}%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 block">Communication</span>
                <span className="text-sm font-bold text-slate-900">{evaluation.communication || evaluation.score}%</span>
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="space-y-3 mb-4">
              {evaluation.strengths && evaluation.strengths.length > 0 && (
                <div>
                  <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block mb-1.5">
                    Strengths Observed
                  </span>
                  <ul className="space-y-1 text-xs text-slate-700">
                    {evaluation.strengths.map((str, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {evaluation.weaknesses && evaluation.weaknesses.length > 0 && (
                <div>
                  <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider block mb-1.5">
                    Areas to Improve
                  </span>
                  <ul className="space-y-1 text-xs text-slate-700">
                    {evaluation.weaknesses.map((wk, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span>{wk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Detailed Feedback */}
            {evaluation.feedback && (
              <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-950 leading-relaxed">
                <span className="font-semibold block mb-0.5">Interviewer Note:</span>
                {evaluation.feedback}
              </div>
            )}

            {/* Next Steps Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 mt-4 border-t border-slate-100">
              <span className="text-xs text-slate-500">
                {isLimitReached
                  ? 'All interview questions answered.'
                  : `Ready for Question ${questionNumber + 1}?`}
              </span>

              <div className="flex items-center gap-2">
                {!isLimitReached && (
                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    disabled={advancing || finishing}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all active:scale-95 disabled:opacity-50"
                  >
                    {advancing ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Generating Question...
                      </>
                    ) : (
                      <>
                        Next Question
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleFinishInterview}
                  disabled={finishing || advancing}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-all active:scale-95 disabled:opacity-50"
                >
                  {finishing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Generating Report...
                    </>
                  ) : (
                    <>
                      <Award className="w-3.5 h-3.5" />
                      Complete Interview
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // VIEW MODE C: COMPLETED SCREEN (Scorecard, Report & Review)
  // =========================================================================
  if (viewMode === 'completed' && completedData) {
    const report = completedData.finalReport || {};
    const questions = completedData.questions || [];
    const answers = completedData.answers || [];

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Banner */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Interview Completed
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Placement Interview Scorecard</h1>
              <p className="text-xs text-slate-500 mt-1">
                Target Role: <span className="font-semibold text-slate-800">{completedData.role}</span> •{' '}
                {answers.length} Questions Evaluated
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-xs text-slate-500 block">Overall Score</span>
                <span className="text-3xl font-extrabold text-indigo-700">
                  {report.overallScore ?? completedData.scores?.technicalKnowledge ?? 0}
                  <span className="text-sm font-normal text-slate-400">/100</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Core Indicators Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="text-xs text-slate-500 mb-1 font-medium">Technical Knowledge</div>
            <div className="text-2xl font-bold text-slate-900">
              {report.technicalKnowledge ?? completedData.scores?.technicalKnowledge ?? 0}%
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Domain concepts & depth</div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="text-xs text-slate-500 mb-1 font-medium">Concept Clarity</div>
            <div className="text-2xl font-bold text-slate-900">
              {report.conceptClarity ?? completedData.scores?.conceptClarity ?? 0}%
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Foundational accuracy</div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="text-xs text-slate-500 mb-1 font-medium">Communication</div>
            <div className="text-2xl font-bold text-slate-900">
              {report.communication ?? completedData.scores?.communication ?? 0}%
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Structure & conciseness</div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="text-xs text-slate-500 mb-1 font-medium">Confidence Indicators</div>
            <div className="text-2xl font-bold text-indigo-700">
              {report.confidenceIndicators ?? completedData.scores?.confidenceIndicators ?? 0}%
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Observable clarity & structure</div>
          </div>
        </div>

        {/* Detailed Report Sections */}
        <div className="space-y-6 mb-8">
          {/* Executive Summary */}
          {report.summary && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                Overall Summary
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed">{report.summary}</p>
            </div>
          )}

          {/* Strengths & Weak Topics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
              <h3 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Demonstrated Strengths
              </h3>
              <ul className="space-y-2 text-xs text-slate-700">
                {(report.strengths || []).map((str, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
              <h3 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                Weak Topics & Improvement Areas
              </h3>
              <ul className="space-y-2 text-xs text-slate-700">
                {(report.weakTopics || []).map((wk, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
                    <span>{wk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Placement Recommendations */}
          {report.recommendations && report.recommendations.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
              <h3 className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                Actionable Recommendations
              </h3>
              <ul className="space-y-2 text-xs text-slate-700">
                {report.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Review Interview Questions & Submissions */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 mb-8">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-indigo-600" />
            Review Interview Submissions ({answers.length})
          </h3>

          <div className="space-y-3.5">
            {answers.map((ans, idx) => {
              const matchedQ = questions.find((q) => q.questionId === ans.questionId) || {};
              const isExpanded = Boolean(expandedReviews[ans.questionId]);
              const ev = ans.evaluation || {};

              return (
                <div
                  key={ans.questionId || idx}
                  className="rounded-xl border border-slate-200 overflow-hidden shadow-xs"
                >
                  <button
                    type="button"
                    onClick={() => toggleReviewItem(ans.questionId)}
                    className="w-full text-left p-4 bg-slate-50 hover:bg-slate-100/70 transition-colors flex items-start justify-between gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-indigo-700">Q{idx + 1}</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                          {ans.category || matchedQ.category || 'Technical'}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                          {ans.difficulty || matchedQ.difficulty || 'Medium'}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-slate-900 line-clamp-1">
                        {matchedQ.text || 'Question'}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        {ev.score || 0}/100
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="p-4 bg-white border-t border-slate-200 space-y-3">
                      <div>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                          Full Question
                        </span>
                        <p className="text-xs font-semibold text-slate-900">{matchedQ.text}</p>
                      </div>

                      <div>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                          Your Answer
                        </span>
                        <p className="text-xs text-slate-700 whitespace-pre-wrap bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
                          {ans.answer}
                        </p>
                      </div>

                      {ev.feedback && (
                        <div>
                          <span className="text-[10px] font-semibold text-indigo-700 uppercase tracking-wider block mb-1">
                            Interviewer Feedback
                          </span>
                          <p className="text-xs text-indigo-950 bg-indigo-50/50 p-3 rounded-xl border border-indigo-100 leading-relaxed">
                            {ev.feedback}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Retake Interview Button */}
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            Start Another Mock Interview
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default MockInterviewPage;
