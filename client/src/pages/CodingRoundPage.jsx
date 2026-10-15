import React, { useState, useEffect, useRef, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import {
  Code2,
  Clock,
  Play,
  Save,
  Send,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Sparkles,
  Layers,
  Terminal,
  ShieldCheck,
  RotateCcw,
  Info,
  Loader2,
  FileCode2,
  Check,
  Zap,
  TrendingUp,
  BookOpen,
  Copy,
  Tag,
  ExternalLink,
} from 'lucide-react';
import {
  startCodingSession,
  saveCodingCode,
  runCode,
  submitCodingQuestion,
  requestCodingReview,
} from '../services/codingService';

const LANGUAGE_OPTIONS = [
  { label: 'JavaScript', value: 'javascript', monaco: 'javascript' },
  { label: 'Python', value: 'python', monaco: 'python' },
  { label: 'Java', value: 'java', monaco: 'java' },
  { label: 'C++', value: 'cpp', monaco: 'cpp' },
];

const REVIEW_TYPES_CONFIG = [
  { key: 'explain_mistakes', label: 'Explain My Mistakes', icon: AlertTriangle },
  { key: 'explain_approach', label: 'Explain My Approach', icon: Sparkles },
  { key: 'optimize_code', label: 'Optimize My Code', icon: Zap },
  { key: 'better_approach', label: 'Better Approach', icon: TrendingUp },
  { key: 'show_solution', label: 'Show Solution', icon: BookOpen, isSpecial: true },
];

export const CodingRoundPage = () => {
  // Session states: 'intro' | 'active' | 'completed'
  const [sessionState, setSessionState] = useState('intro');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [sessionData, setSessionData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Per-question state: code map { [questionId_language]: string }
  const [codeMap, setCodeMap] = useState({});
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [saveStatus, setSaveStatus] = useState(''); // '' | 'saving' | 'saved'
  const [submitting, setSubmitting] = useState(false);

  // Execution state (Run Code against visible sample test cases)
  const [running, setRunning] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [runError, setRunError] = useState('');
  const [activeTestTab, setActiveTestTab] = useState(0);

  // Submission state tracking: 'idle' | 'submitting' | 'submitted' | 'error'
  const [submissionState, setSubmissionState] = useState('idle');
  const [submissionError, setSubmissionError] = useState('');
  const [submissionResults, setSubmissionResults] = useState({}); // { [qId]: submittedAttemptData }
  const [activeSubmitTab, setActiveSubmitTab] = useState(0);
  const isSubmittingRef = useRef(false);

  // AI Coding Review state (strictly available post-submission or expiry)
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [activeReviewType, setActiveReviewType] = useState('explain_mistakes');
  const [reviewsMap, setReviewsMap] = useState({}); // { [`${qId}_${reviewType}`]: reviewData }
  const [copiedSolution, setCopiedSolution] = useState(false);
  const [completionSelectedQ, setCompletionSelectedQ] = useState(0);

  // Timer state (seconds remaining for the currently active question)
  const [secondsRemaining, setSecondsRemaining] = useState(1800);

  const activeQuestion = sessionData?.questions?.[currentQuestionIndex] || null;
  const currentAttempt = sessionData?.attempts?.find(
    (a) => a.questionId === activeQuestion?.id || a.questionId === activeQuestion?._id
  );

  // References to keep current values in timer callbacks
  const codeMapRef = useRef(codeMap);
  const selectedLangRef = useRef(selectedLanguage);
  const sessionDataRef = useRef(sessionData);
  const currentQIndexRef = useRef(currentQuestionIndex);

  useEffect(() => {
    codeMapRef.current = codeMap;
    selectedLangRef.current = selectedLanguage;
    sessionDataRef.current = sessionData;
    currentQIndexRef.current = currentQuestionIndex;
  }, [codeMap, selectedLanguage, sessionData, currentQuestionIndex]);

  // Format seconds to MM:SS
  const formatTime = (secs) => {
    if (secs <= 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Start new coding session
  const handleStartRound = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await startCodingSession();
      if (res && res.success && res.data) {
        const data = res.data;
        setSessionData(data);

        // Pre-populate codeMap with initial code from attempts or starterCode
        const initialMap = {};
        data.questions.forEach((q) => {
          const qId = q.id || q._id;
          const attempt = data.attempts.find((a) => a.questionId === qId);
          LANGUAGE_OPTIONS.forEach((lang) => {
            const key = `${qId}_${lang.value}`;
            initialMap[key] = (attempt && attempt.language === lang.value && attempt.code)
              ? attempt.code
              : (q.starterCode?.[lang.value] || '');
          });
        });

        setCodeMap(initialMap);
        setCurrentQuestionIndex(0);
        setSelectedLanguage('javascript');
        setSubmissionState('idle');
        setSubmissionError('');
        setSubmissionResults({});
        setActiveSubmitTab(0);
        setSessionState('active');
      } else {
        setError(res?.message || 'Failed to start coding round.');
      }
    } catch (err) {
      console.error('Error starting session:', err);
      setError(err.response?.data?.message || err.message || 'Failed to initialize coding round.');
    } finally {
      setLoading(false);
    }
  };

  // Handle local code changes
  const handleEditorChange = (newCode) => {
    if (!activeQuestion) return;
    const qId = activeQuestion.id || activeQuestion._id;
    const key = `${qId}_${selectedLanguage}`;
    setCodeMap((prev) => ({
      ...prev,
      [key]: newCode || '',
    }));
  };

  // Save draft code to server
  const handleSaveCode = useCallback(async () => {
    if (!sessionData || !activeQuestion || !currentAttempt) return;
    const qId = activeQuestion.id || activeQuestion._id;
    const key = `${qId}_${selectedLanguage}`;
    const codeToSave = codeMapRef.current[key] || '';

    setSaveStatus('saving');
    try {
      await saveCodingCode({
        sessionId: sessionData.sessionId,
        questionId: qId,
        language: selectedLanguage,
        code: codeToSave,
      });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 2500);
    } catch (err) {
      console.warn('Draft auto-save notice:', err.message);
      setSaveStatus('');
    }
  }, [sessionData, activeQuestion, currentAttempt, selectedLanguage]);

  // Execute candidate code on visible sample test cases via Judge0
  const handleRunCode = async () => {
    if (!sessionData || !activeQuestion || !currentAttempt) return;
    if (currentAttempt.status === 'submitted' || currentAttempt.status === 'expired') return;

    const qId = activeQuestion.id || activeQuestion._id;
    const key = `${qId}_${selectedLanguage}`;
    const codeToRun = codeMapRef.current[key] || '';

    setRunning(true);
    setRunError('');
    setRunResult(null);

    try {
      // Auto-save draft first
      try {
        await saveCodingCode({
          sessionId: sessionData.sessionId,
          questionId: qId,
          language: selectedLanguage,
          code: codeToRun,
        });
      } catch {
        // Continue even if save threw on deadline boundary
      }

      const res = await runCode({
        sessionId: sessionData.sessionId,
        questionId: qId,
        language: selectedLanguage,
        code: codeToRun,
      });

      if (res && res.success && res.data) {
        setRunResult(res.data);
        setActiveTestTab(0);
      } else {
        setRunError(res?.message || 'Failed to execute code.');
      }
    } catch (err) {
      console.error('Error running code:', err);
      const msg =
        err.response?.data?.message || err.message || 'Code execution service is temporarily unavailable.';
      setRunError(msg);
    } finally {
      setRunning(false);
    }
  };

  // Sync submission state when switching active question
  useEffect(() => {
    if (!sessionData || !activeQuestion) return;
    const qId = activeQuestion.id || activeQuestion._id;
    const attempt = sessionData.attempts?.find((a) => a.questionId === qId);
    if (attempt?.status === 'submitted' || attempt?.status === 'expired') {
      setSubmissionState('submitted');
    } else {
      setSubmissionState('idle');
    }
    setSubmissionError('');
    setActiveSubmitTab(0);
  }, [currentQuestionIndex, sessionData, activeQuestion]);

  // Submit current question
  const handleSubmitQuestion = useCallback(
    async (isAutoExpired = false) => {
      // Race condition / duplicate submission guard
      if (isSubmittingRef.current) return;
      if (!sessionDataRef.current || !activeQuestion) return;

      const qId = activeQuestion.id || activeQuestion._id;
      const attempt = sessionDataRef.current.attempts?.find((a) => a.questionId === qId);
      if (attempt?.status === 'submitted' || attempt?.status === 'expired') return;

      const key = `${qId}_${selectedLangRef.current}`;
      const codeToSave = codeMapRef.current[key] || '';

      isSubmittingRef.current = true;
      setSubmitting(true);
      setSubmissionState('submitting');
      setSubmissionError('');

      try {
        const res = await submitCodingQuestion({
          sessionId: sessionDataRef.current.sessionId,
          questionId: qId,
          code: codeToSave,
          language: selectedLangRef.current,
        });

        // Update local status and evaluation metadata in attempts
        const submittedData = res?.data || {};
        const updatedStatus = isAutoExpired ? 'expired' : (submittedData.status || 'submitted');
        setSessionData((prev) => {
          if (!prev) return prev;
          const updatedAttempts = prev.attempts.map((att) => {
            if (att.questionId === qId) {
              return {
                ...att,
                ...submittedData,
                status: updatedStatus,
                submittedAt: submittedData.submittedAt || new Date().toISOString(),
              };
            }
            return att;
          });
          return {
            ...prev,
            attempts: updatedAttempts,
          };
        });

        setSubmissionResults((prev) => ({
          ...prev,
          [qId]: submittedData,
        }));

        setSubmissionState('submitted');
        setRunResult(null);
        setRunError('');

        // If deadline expired on timer, auto-advance
        if (isAutoExpired) {
          if (currentQIndexRef.current < (sessionDataRef.current.questions.length - 1)) {
            setCurrentQuestionIndex((prev) => prev + 1);
          } else {
            setSessionState('completed');
          }
        }
        // For early manual submission, remain on question to display complete evaluation results!
      } catch (err) {
        console.error('Submit error:', err);
        // If deadline expired on server, mark as expired locally and advance
        if (err.response?.status === 400 && /expired/i.test(err.response?.data?.message || '')) {
          setSessionData((prev) => {
            if (!prev) return prev;
            const updatedAttempts = prev.attempts.map((att) => {
              if (att.questionId === qId) {
                return { ...att, status: 'expired' };
              }
              return att;
            });
            return { ...prev, attempts: updatedAttempts };
          });

          setSubmissionState('submitted');
          setRunResult(null);
          setRunError('');

          if (currentQIndexRef.current < (sessionDataRef.current.questions.length - 1)) {
            setCurrentQuestionIndex((prev) => prev + 1);
          } else {
            setSessionState('completed');
          }
        } else {
          const errMsg =
            err.response?.data?.message || err.message || 'Failed to submit question. Please try again.';
          setSubmissionState('error');
          setSubmissionError(errMsg);
        }
      } finally {
        isSubmittingRef.current = false;
        setSubmitting(false);
      }
    },
    [activeQuestion]
  );

  // Request AI Coding Review for a finalized question attempt
  const handleRequestReview = async (type, specificQId = null) => {
    if (!sessionData) return;
    const qId = specificQId || (activeQuestion?.id || activeQuestion?._id);
    if (!qId) return;

    const attempt = sessionData.attempts?.find((a) => a.questionId === qId);
    if (!attempt || (attempt.status !== 'submitted' && attempt.status !== 'expired')) {
      return;
    }

    const cacheKey = `${qId}_${type}`;
    setActiveReviewType(type);
    setReviewError('');

    // If already cached locally, select it immediately
    if (reviewsMap[cacheKey]) {
      return;
    }

    setReviewLoading(true);
    try {
      const res = await requestCodingReview({
        sessionId: sessionData.sessionId,
        questionId: qId,
        reviewType: type,
      });

      if (res && res.success && res.data) {
        const reviewBody = res.data.review || res.data;
        setReviewsMap((prev) => ({
          ...prev,
          [cacheKey]: reviewBody,
        }));
      } else {
        setReviewError(res?.message || 'Failed to generate review.');
      }
    } catch (err) {
      console.error('AI Review Error:', err);
      const msg = err.response?.data?.message || err.message || 'AI review service is temporarily unavailable.';
      setReviewError(msg);
    } finally {
      setReviewLoading(false);
    }
  };

  // Render structured review content
  const renderReviewContent = (review) => {
    if (!review) return null;

    return (
      <div className="space-y-4 pt-2">
        {/* Title & Summary */}
        <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200/80 space-y-1.5 shadow-xs">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            {review.title || 'Review Analysis'}
          </h4>
          <p className="text-xs text-slate-700 leading-relaxed">
            {review.summary}
          </p>
        </div>

        {/* Detailed Analysis */}
        {review.analysis && (
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Detailed Analysis
            </span>
            <p className="text-xs text-slate-700 p-3.5 rounded-xl bg-white border border-slate-200 leading-relaxed whitespace-pre-wrap shadow-xs">
              {review.analysis}
            </p>
          </div>
        )}

        {/* Identified Issues / Mistakes */}
        {review.issues && review.issues.length > 0 && (
          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-rose-700 uppercase tracking-wider">
              Identified Issues & Evidence
            </span>
            <div className="space-y-2">
              {review.issues.map((issue, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-rose-50/50 border border-rose-200 space-y-2 text-xs shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-rose-900">
                      {idx + 1}. {issue.title}
                    </span>
                  </div>
                  <p className="text-slate-700 text-[11px]">{issue.explanation}</p>
                  {issue.evidence && (
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] text-amber-300 overflow-x-auto">
                      <span className="text-slate-400 font-sans font-semibold">Evidence: </span>
                      {issue.evidence}
                    </div>
                  )}
                  {issue.fix && (
                    <div className="text-[11px] text-emerald-700 pt-1">
                      <strong className="text-slate-600">Recommended Fix: </strong> {issue.fix}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Complexity Analysis */}
        {review.complexity && (review.complexity.time || review.complexity.space) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] text-slate-500 font-sans">Time Complexity</span>
              <p className="text-xs font-mono font-bold text-indigo-700 mt-0.5">
                {review.complexity.time || 'N/A'}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] text-slate-500 font-sans">Space Complexity</span>
              <p className="text-xs font-mono font-bold text-indigo-700 mt-0.5">
                {review.complexity.space || 'N/A'}
              </p>
            </div>
          </div>
        )}

        {/* Actionable Recommendations */}
        {review.recommendations && review.recommendations.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Recommendations & Next Steps
            </span>
            <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
              {review.recommendations.map((rec, idx) => (
                <li key={idx} className="leading-relaxed">
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Reference Solution Code (Only for show_solution) */}
        {review.solution && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">
                Optimal Reference Solution ({selectedLanguage})
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(review.solution);
                  setCopiedSolution(true);
                  setTimeout(() => setCopiedSolution(false), 2000);
                }}
                className="text-[11px] px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center gap-1 transition-all active:scale-95 shadow-xs"
              >
                {copiedSolution ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-slate-500" />
                    <span>Copy Solution</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed shadow-inner">
              {review.solution}
            </pre>
          </div>
        )}
      </div>
    );
  };

  // Timer hook synced strictly to current question's backend deadline
  useEffect(() => {
    if (sessionState !== 'active' || !currentAttempt) return;

    // If attempt is already submitted or expired, freeze timer
    if (currentAttempt.status === 'submitted' || currentAttempt.status === 'expired') {
      setSecondsRemaining(0);
      return;
    }

    const deadlineTime = new Date(currentAttempt.deadline).getTime();

    const updateTimer = () => {
      const now = Date.now();
      const diffSecs = Math.max(0, Math.floor((deadlineTime - now) / 1000));
      setSecondsRemaining(diffSecs);

      if (diffSecs <= 0) {
        // Deadline reached! Automatically submit if not already submitting
        if (!isSubmittingRef.current) {
          handleSubmitQuestion(true);
        }
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [sessionState, currentAttempt?.status, currentAttempt?.deadline, handleSubmitQuestion]);

  // Current code in editor
  const currentCode = activeQuestion
    ? codeMap[`${activeQuestion.id || activeQuestion._id}_${selectedLanguage}`] || ''
    : '';

  // Get difficulty badge color
  const getDifficultyBadge = (diff) => {
    if (diff === 'Easy') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (diff === 'Medium') return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-rose-50 text-rose-700 border-rose-200';
  };

  // Get status pill color
  const getStatusBadge = (status) => {
    if (status === 'submitted') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (status === 'in_progress') return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    if (status === 'expired') return 'bg-rose-50 text-rose-700 border-rose-200';
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 w-full space-y-8 overflow-x-hidden">
      {/* ---------------- A. START / INTRO SCREEN ---------------- */}
      {sessionState === 'intro' && (
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 border border-emerald-200 text-emerald-700">
              <Code2 className="w-3.5 h-3.5" />
              <span>Module 02 • Technical Assessment</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Coding Round
            </h1>
            <p className="text-base sm:text-lg text-slate-600 font-normal max-w-3xl">
              Timed campus recruitment assessment matching top company placement tests.
            </p>
          </div>

          {/* Guidelines Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xs space-y-8">
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Terminal className="w-6 h-6 text-emerald-600" />
                Assessment Instructions & Guidelines
              </h2>
              <p className="text-sm text-slate-600">
                Please review the structural parameters of this programming assessment before initiating the round:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">2 Curated Problems</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  You will receive exactly 2 coding questions chosen randomly from our verified placement question bank covering arrays, strings, algorithms, and data structures.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">Independent 30-Min Timers</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Each question has an independent 30-minute timer enforced by the server. Time remaining on Question 1 does not carry over to Question 2.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">Unassisted Assessment</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  AI assistance, hints, and automated reviews are strictly unavailable during the active coding test to simulate real placement test integrity.
                </p>
              </div>
            </div>

            {error && (
              <div className="flex items-center space-x-3 p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-slate-500">
                Supported languages: C++, Java, Python, JavaScript
              </span>

              <button
                type="button"
                id="start-coding-round-button"
                onClick={handleStartRound}
                disabled={loading}
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-xs transition-all flex items-center justify-center space-x-2 active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Initializing Round...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Start Coding Round</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- B. ACTIVE CODING SCREEN ---------------- */}
      {sessionState === 'active' && activeQuestion && (
        <div className="space-y-6">
          {/* Top Bar: Question Navigator + Timer + Save Status */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Question Selector Tabs */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              {sessionData?.questions.map((q, idx) => {
                const qId = q.id || q._id;
                const att = sessionData.attempts.find((a) => a.questionId === qId);
                const isActive = idx === currentQuestionIndex;

                return (
                  <button
                    key={qId}
                    type="button"
                    onClick={() => {
                      handleSaveCode();
                      setCurrentQuestionIndex(idx);
                      setRunResult(null);
                      setRunError('');
                      setActiveTestTab(0);
                    }}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      isActive
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>Question {idx + 1}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-md border font-medium ${getStatusBadge(att?.status)}`}>
                      {att?.status === 'submitted'
                        ? 'Submitted'
                        : att?.status === 'expired'
                        ? 'Expired'
                        : 'In Progress'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Timer and Save Status Banner */}
            <div className="flex items-center space-x-4 self-end md:self-auto">
              {saveStatus === 'saving' && (
                <span className="text-xs text-slate-500 flex items-center gap-1.5 animate-pulse">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Saving draft...
                </span>
              )}
              {saveStatus === 'saved' && (
                <span className="text-xs text-emerald-700 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  Code saved
                </span>
              )}

              {/* Independent Countdown Timer */}
              <div
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl border text-sm font-mono font-bold shadow-xs ${
                  secondsRemaining <= 300
                    ? 'bg-rose-50 border-rose-200 text-rose-700 animate-pulse'
                    : 'bg-slate-100 border-slate-200 text-slate-800'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>{formatTime(secondsRemaining)}</span>
              </div>
            </div>
          </div>

          {/* Main Problem + Editor 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[620px]">
            {/* Left Column: Problem Description & Test Cases (5 Cols) */}
            <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-6 flex flex-col space-y-6 overflow-y-auto max-h-[720px] shadow-xs">
              {/* Question Header */}
              <div className="space-y-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs px-2.5 py-1 rounded-lg border font-semibold ${getDifficultyBadge(activeQuestion.difficulty)}`}>
                    {activeQuestion.difficulty}
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-medium">
                    {activeQuestion.topic}
                  </span>
                  {activeQuestion.tags && activeQuestion.tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-indigo-50/70 border border-indigo-100 text-indigo-700 font-medium flex items-center gap-1"
                    >
                      <Tag className="w-2.5 h-2.5 text-indigo-500" />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {currentQuestionIndex + 1}. {activeQuestion.title}
                </h2>
              </div>

              {/* Description Body */}
              <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
                <p>{activeQuestion.description}</p>

                {/* Input & Output Format */}
                {(activeQuestion.inputFormat || activeQuestion.outputFormat) && (
                  <div className="space-y-2 pt-1 font-sans text-xs">
                    {activeQuestion.inputFormat && (
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
                        <span className="font-semibold text-slate-700 block text-[11px] uppercase tracking-wider">
                          Input Format:
                        </span>
                        <p className="text-slate-600">{activeQuestion.inputFormat}</p>
                      </div>
                    )}
                    {activeQuestion.outputFormat && (
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
                        <span className="font-semibold text-slate-700 block text-[11px] uppercase tracking-wider">
                          Output Format:
                        </span>
                        <p className="text-slate-600">{activeQuestion.outputFormat}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Examples */}
                {activeQuestion.examples && activeQuestion.examples.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <h3 className="font-semibold text-slate-800 text-xs uppercase tracking-wider">
                      Examples:
                    </h3>
                    {activeQuestion.examples.map((ex, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 font-mono text-xs"
                      >
                        <div>
                          <span className="text-slate-500 font-sans font-semibold">Input: </span>
                          <span className="text-slate-800">{ex.input}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-sans font-semibold">Output: </span>
                          <span className="text-emerald-700 font-semibold">{ex.output}</span>
                        </div>
                        {ex.explanation && (
                          <div className="text-slate-600 text-[11px] font-sans pt-1">
                            <strong>Explanation: </strong> {ex.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Constraints */}
                {activeQuestion.constraints && activeQuestion.constraints.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <h3 className="font-semibold text-slate-800 text-xs uppercase tracking-wider">
                      Constraints:
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 font-mono">
                      {activeQuestion.constraints.map((c, idx) => (
                        <li key={idx}>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Attribution and Reference Source */}
                {activeQuestion.attribution && (
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{activeQuestion.attribution}</span>
                    {activeQuestion.referenceUrl && (
                      <a
                        href={activeQuestion.referenceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1 hover:underline ml-2 flex-shrink-0"
                      >
                        <span>Reference</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Monaco Code Editor + Controls (7 Cols) */}
            <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 flex flex-col space-y-4 shadow-xs">
              {/* Editor Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <FileCode2 className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-semibold text-slate-700">Language:</span>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    disabled={currentAttempt?.status === 'submitted' || currentAttempt?.status === 'expired'}
                    className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    {LANGUAGE_OPTIONS.map((lang) => (
                      <option key={lang.value} value={lang.value}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-slate-400" />
                  <span>Monaco Editor</span>
                </div>
              </div>

              {/* Monaco Editor Container */}
              <div className="flex-1 min-h-[420px] rounded-xl overflow-hidden border border-slate-300 bg-[#1e1e1e] shadow-xs">
                <Editor
                  height="440px"
                  language={selectedLanguage}
                  theme="vs-dark"
                  value={currentCode}
                  onChange={handleEditorChange}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    readOnly: currentAttempt?.status === 'submitted' || currentAttempt?.status === 'expired',
                  }}
                />
              </div>

              {/* Action Buttons Toolbar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
                {/* Run Code Button */}
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <button
                    type="button"
                    id="run-code-button"
                    onClick={handleRunCode}
                    disabled={
                      running ||
                      submitting ||
                      currentAttempt?.status === 'submitted' ||
                      currentAttempt?.status === 'expired'
                    }
                    className="px-4 py-2 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center space-x-2 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none shadow-xs"
                  >
                    {running ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                        <span>Running...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                        <span>Run Code</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
                  {/* Save Draft Button */}
                  <button
                    type="button"
                    onClick={handleSaveCode}
                    disabled={
                      loading ||
                      currentAttempt?.status === 'submitted' ||
                      currentAttempt?.status === 'expired'
                    }
                    className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition-colors disabled:opacity-50 shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5 text-slate-500" />
                    <span>Save Draft</span>
                  </button>

                  {/* Submit Question Button */}
                  <button
                    type="button"
                    id="submit-question-button"
                    onClick={() => handleSubmitQuestion(false)}
                    disabled={
                      submitting ||
                      running ||
                      currentAttempt?.status === 'submitted' ||
                      currentAttempt?.status === 'expired'
                    }
                    className={`px-5 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-xs transition-all ${
                      currentAttempt?.status === 'submitted'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-not-allowed'
                        : currentAttempt?.status === 'expired'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95 disabled:opacity-50'
                    }`}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : currentAttempt?.status === 'submitted' ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Submitted</span>
                      </>
                    ) : currentAttempt?.status === 'expired' ? (
                      <>
                        <XCircle className="w-3.5 h-3.5 text-rose-600" />
                        <span>Expired</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Question</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Submission Error Notification */}
              {submissionError && (
                <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs flex items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                    <span>{submissionError}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSubmitQuestion(false)}
                    disabled={submitting}
                    className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center space-x-1 transition-all active:scale-95 disabled:opacity-50"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Retry</span>
                  </button>
                </div>
              )}

              {/* Secure Execution Output Console (Visible Sample Cases Only) */}
              {(running || runResult || runError) && (
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3 font-mono text-xs shadow-inner">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5 font-sans">
                    <div className="flex items-center space-x-2">
                      <Terminal className="w-4 h-4 text-emerald-400" />
                      <span className="font-semibold text-white text-xs">Run Output</span>
                      <span className="text-[11px] text-slate-400">(Visible Tests Only)</span>
                    </div>

                    {runResult && (
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${
                            runResult.status === 'Accepted'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : runResult.status === 'Compilation Error'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          }`}
                        >
                          {runResult.status}
                        </span>
                        <span className="text-slate-400 text-[11px]">
                          {runResult.testCasesPassed} / {runResult.totalVisibleTestCases} passed
                        </span>
                        {runResult.executionTime > 0 && (
                          <span className="text-slate-400 text-[11px]">
                            • {(runResult.executionTime * 1000).toFixed(0)} ms
                          </span>
                        )}
                        {runResult.memoryUsed > 0 && (
                          <span className="text-slate-400 text-[11px]">
                            • {runResult.memoryUsed} KB
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {running && (
                    <div className="py-6 flex items-center justify-center space-x-2 text-slate-400 font-sans">
                      <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                      <span>Executing in isolated Judge0 sandbox...</span>
                    </div>
                  )}

                  {runError && (
                    <div className="p-3 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 font-sans text-xs flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                      <span>{runError}</span>
                    </div>
                  )}

                  {runResult && (
                    <div className="space-y-3">
                      {/* Compiler error if any */}
                      {runResult.compilerError && (
                        <div className="space-y-1">
                          <span className="text-amber-400 font-semibold text-[11px] font-sans">
                            Compiler Output:
                          </span>
                          <pre className="p-3 rounded-xl bg-slate-900 border border-amber-500/20 text-amber-300 text-[11px] overflow-x-auto whitespace-pre-wrap">
                            {runResult.compilerError}
                          </pre>
                        </div>
                      )}

                      {/* Runtime error if any */}
                      {runResult.runtimeError && (
                        <div className="space-y-1">
                          <span className="text-rose-400 font-semibold text-[11px] font-sans">
                            Runtime Error:
                          </span>
                          <pre className="p-3 rounded-xl bg-slate-900 border border-rose-500/20 text-rose-300 text-[11px] overflow-x-auto whitespace-pre-wrap">
                            {runResult.runtimeError}
                          </pre>
                        </div>
                      )}

                      {/* Sample test cases tabbed list */}
                      {runResult.testResults && runResult.testResults.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 font-sans overflow-x-auto pb-1">
                            {runResult.testResults.map((tc, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setActiveTestTab(idx)}
                                className={`px-3 py-1 rounded-lg text-xs font-medium border flex items-center space-x-1.5 transition-all ${
                                  activeTestTab === idx
                                    ? 'bg-slate-800 border-indigo-500 text-white shadow-xs'
                                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    tc.passed ? 'bg-emerald-400' : 'bg-rose-400'
                                  }`}
                                />
                                <span>Case {idx + 1}</span>
                              </button>
                            ))}
                          </div>

                          {runResult.testResults[activeTestTab] && (
                            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                              <div>
                                <span className="text-slate-400 text-[11px] font-sans">Input:</span>
                                <pre className="mt-0.5 p-2 rounded-lg bg-slate-950 text-slate-200 text-xs overflow-x-auto">
                                  {runResult.testResults[activeTestTab].input || '(no input)'}
                                </pre>
                              </div>
                              <div>
                                <span className="text-slate-400 text-[11px] font-sans">Expected:</span>
                                <pre className="mt-0.5 p-2 rounded-lg bg-slate-950 text-emerald-400 text-xs overflow-x-auto">
                                  {runResult.testResults[activeTestTab].expectedOutput || '(no expected output)'}
                                </pre>
                              </div>
                              <div>
                                <span className="text-slate-400 text-[11px] font-sans">Your Output:</span>
                                <pre
                                  className={`mt-0.5 p-2 rounded-lg bg-slate-950 text-xs overflow-x-auto ${
                                    runResult.testResults[activeTestTab].passed
                                      ? 'text-emerald-400'
                                      : 'text-rose-400'
                                  }`}
                                >
                                  {runResult.testResults[activeTestTab].actualOutput !== undefined
                                    ? runResult.testResults[activeTestTab].actualOutput
                                    : '(empty output)'}
                                </pre>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* SUBMISSION EVALUATION RESULTS */}
              {(() => {
                const qId = activeQuestion.id || activeQuestion._id;
                const evalData = submissionResults[qId] || currentAttempt;
                const isFinalized = evalData?.status === 'submitted' || evalData?.status === 'expired';
                if (!isFinalized || (!evalData?.resultStatus && evalData?.status !== 'submitted')) return null;

                const visibleTestResults = evalData.visibleResults || evalData.testResults || [];
                const isAccepted = evalData.resultStatus === 'Accepted';

                return (
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-xs">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                      <div className="flex items-center space-x-2.5">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                            isAccepted
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                              : 'bg-rose-50 text-rose-600 border border-rose-200'
                          }`}
                        >
                          {isAccepted ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <XCircle className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-slate-900">Evaluation Results</h3>
                            <span
                              className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                                isAccepted
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : evalData.resultStatus === 'Compilation Error'
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : 'bg-rose-50 text-rose-700 border-rose-200'
                              }`}
                            >
                              {evalData.resultStatus || 'Submitted'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500">
                            Evaluated against complete server test suite
                          </p>
                        </div>
                      </div>

                      {/* Score & Metrics */}
                      <div className="flex items-center gap-3">
                        {evalData.score !== undefined && (
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 block font-medium">SCORE</span>
                            <span className="text-sm font-mono font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-lg">
                              {evalData.score} / 100
                            </span>
                          </div>
                        )}
                        {evalData.totalTestCases !== undefined && (
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 block font-medium">TEST CASES</span>
                            <span className="text-xs font-mono font-semibold text-slate-700">
                              {evalData.testCasesPassed || 0} / {evalData.totalTestCases} passed
                            </span>
                          </div>
                        )}
                        {evalData.executionTime > 0 && (
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 block font-medium">RUNTIME</span>
                            <span className="text-xs font-mono text-slate-600">
                              {(evalData.executionTime * 1000).toFixed(0)} ms
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Compiler Output if any */}
                    {evalData.compilerError && (
                      <div className="space-y-1">
                        <span className="text-amber-700 font-semibold text-xs flex items-center gap-1 font-sans">
                          <AlertTriangle className="w-3.5 h-3.5" /> Compiler Output:
                        </span>
                        <pre className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs font-mono overflow-x-auto whitespace-pre-wrap">
                          {evalData.compilerError}
                        </pre>
                      </div>
                    )}

                    {/* Runtime Error if any */}
                    {evalData.runtimeError && (
                      <div className="space-y-1">
                        <span className="text-rose-700 font-semibold text-xs flex items-center gap-1 font-sans">
                          <AlertCircle className="w-3.5 h-3.5" /> Runtime Error:
                        </span>
                        <pre className="p-3 rounded-xl bg-rose-50/70 border border-rose-200 text-rose-900 text-xs font-mono overflow-x-auto whitespace-pre-wrap">
                          {evalData.runtimeError}
                        </pre>
                      </div>
                    )}

                    {/* Visible Test Case tabs */}
                    {visibleTestResults.length > 0 && (
                      <div className="space-y-2.5 pt-1">
                        <span className="text-xs font-semibold text-slate-700">Sample Test Case Results:</span>
                        <div className="flex items-center space-x-2 font-sans overflow-x-auto pb-1">
                          {visibleTestResults.map((tc, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setActiveSubmitTab(idx)}
                              className={`px-3 py-1 rounded-lg text-xs font-medium border flex items-center space-x-1.5 transition-all ${
                                activeSubmitTab === idx
                                  ? 'bg-slate-800 border-indigo-500 text-white shadow-xs'
                                  : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  tc.passed ? 'bg-emerald-500' : 'bg-rose-500'
                                }`}
                              />
                              <span>Case {idx + 1}</span>
                            </button>
                          ))}
                        </div>

                        {visibleTestResults[activeSubmitTab] && (
                          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs space-y-2">
                            <div>
                              <span className="text-slate-500 font-sans text-[11px] font-semibold">Input:</span>
                              <pre className="mt-0.5 p-2 rounded-lg bg-white border border-slate-200 text-slate-800 text-xs overflow-x-auto">
                                {visibleTestResults[activeSubmitTab].input || '(no input)'}
                              </pre>
                            </div>
                            <div>
                              <span className="text-slate-500 font-sans text-[11px] font-semibold">Expected:</span>
                              <pre className="mt-0.5 p-2 rounded-lg bg-white border border-slate-200 text-emerald-700 font-semibold text-xs overflow-x-auto">
                                {visibleTestResults[activeSubmitTab].expectedOutput || '(no expected output)'}
                              </pre>
                            </div>
                            <div>
                              <span className="text-slate-500 font-sans text-[11px] font-semibold">Your Output:</span>
                              <pre
                                className={`mt-0.5 p-2 rounded-lg bg-white border border-slate-200 text-xs overflow-x-auto ${
                                  visibleTestResults[activeSubmitTab].passed ? 'text-emerald-700' : 'text-rose-700'
                                }`}
                              >
                                {visibleTestResults[activeSubmitTab].actualOutput !== undefined
                                  ? visibleTestResults[activeSubmitTab].actualOutput
                                  : '(empty output)'}
                              </pre>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Navigation / Progress actions */}
                    <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <span className="text-xs text-slate-500">
                        {currentQuestionIndex < (sessionData.questions.length - 1)
                          ? `Question ${currentQuestionIndex + 1} submitted. Continue to Question ${currentQuestionIndex + 2} when ready.`
                          : 'All questions completed. Review results or view your complete assessment scorecard.'}
                      </span>

                      {currentQuestionIndex < (sessionData.questions.length - 1) ? (
                        <button
                          type="button"
                          id="next-question-button"
                          onClick={() => {
                            handleSaveCode();
                            setCurrentQuestionIndex((prev) => prev + 1);
                            setRunResult(null);
                            setRunError('');
                            setActiveTestTab(0);
                          }}
                          className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs flex items-center space-x-1.5 transition-all active:scale-95"
                        >
                          <span>Next Question</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          id="view-summary-button"
                          onClick={() => setSessionState('completed')}
                          className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs flex items-center space-x-1.5 transition-all active:scale-95"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>View Assessment Summary</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* POST-SUBMIT AI CODING REVIEW (Strictly visible ONLY when attempt is submitted or expired) */}
              {(currentAttempt?.status === 'submitted' || currentAttempt?.status === 'expired') && (
                <div className="rounded-2xl border border-indigo-200 bg-indigo-50/30 p-4 sm:p-5 space-y-4 shadow-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-100 pb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-lg bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">AI Post-Submit Coding Review</h3>
                        <p className="text-[11px] text-slate-500">
                          Algorithmic analysis unlocked after question submission.
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                      Unlocked
                    </span>
                  </div>

                  {/* 5 Review Category Buttons */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                    {REVIEW_TYPES_CONFIG.map((btn) => {
                      const Icon = btn.icon;
                      const isSelected = activeReviewType === btn.key;
                      const qId = activeQuestion.id || activeQuestion._id;
                      const hasCached = Boolean(reviewsMap[`${qId}_${btn.key}`]);

                      return (
                        <button
                          key={btn.key}
                          type="button"
                          id={`review-btn-${btn.key}`}
                          onClick={() => handleRequestReview(btn.key)}
                          disabled={reviewLoading}
                          className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all active:scale-95 disabled:opacity-50 ${
                            isSelected
                              ? btn.isSpecial
                                ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                                : 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                              : btn.isSpecial
                              ? 'bg-white border-emerald-200 text-emerald-700 hover:bg-emerald-50 shadow-xs'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="truncate">{btn.label}</span>
                          {hasCached && (
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" title="Cached" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Loading Indicator */}
                  {reviewLoading && (
                    <div className="py-8 flex flex-col items-center justify-center space-y-2 text-slate-500 font-sans">
                      <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                      <span className="text-xs">Analyzing your submission with AI review engine...</span>
                    </div>
                  )}

                  {/* Error Notification */}
                  {reviewError && (
                    <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                      <span>{reviewError}</span>
                    </div>
                  )}

                  {/* Render Review Content */}
                  {!reviewLoading && reviewsMap[`${activeQuestion.id || activeQuestion._id}_${activeReviewType}`] &&
                    renderReviewContent(reviewsMap[`${activeQuestion.id || activeQuestion._id}_${activeReviewType}`])
                  }

                  {!reviewLoading && !reviewsMap[`${activeQuestion.id || activeQuestion._id}_${activeReviewType}`] && !reviewError && (
                    <div className="py-6 text-center text-xs text-slate-500">
                      Select a review category above to generate structured AI feedback on your solution.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}



      {/* ---------------- F. COMPLETION SCREEN ---------------- */}
      {sessionState === 'completed' && sessionData && (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 text-center space-y-6 shadow-xs max-w-2xl mx-auto">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Coding Assessment Completed
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              All candidate solutions have been securely evaluated against the full test suite in the isolated sandbox.
            </p>
          </div>

          {/* Aggregate Total Score Banner */}
          {(() => {
            const totalScore = sessionData.attempts.reduce((acc, curr) => acc + (curr.score || 0), 0);
            const maxScore = sessionData.questions.length * 100;
            return (
              <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Total Assessment Score
                </span>
                <span className="text-lg font-mono font-bold text-indigo-700">
                  {totalScore} / {maxScore} pts ({Math.round((totalScore / maxScore) * 100)}%)
                </span>
              </div>
            );
          })()}

          {/* Status Breakdown of Both Questions */}
          <div className="space-y-3 pt-2 text-left">
            {sessionData.questions.map((q, idx) => {
              const qId = q.id || q._id;
              const att = sessionData.attempts.find((a) => a.questionId === qId);

              return (
                <div
                  key={qId}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-900">
                      Problem {idx + 1}: {q.title}
                    </p>
                    <p className="text-xs text-slate-500">
                      Topic: {q.topic} • Difficulty: {q.difficulty}
                    </p>
                    {att?.totalTestCases !== undefined && (
                      <p className="text-[11px] text-slate-500 font-mono">
                        Test cases: {att.testCasesPassed || 0} / {att.totalTestCases || 0} passed
                        {att.executionTime > 0 && ` • ${(att.executionTime * 1000).toFixed(0)} ms`}
                        {att.memoryUsed > 0 && ` • ${att.memoryUsed} KB`}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-3 self-end sm:self-auto">
                    {att?.score !== undefined && (
                      <span className="text-xs font-mono font-bold text-indigo-700 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200">
                        {att.score} / 100
                      </span>
                    )}
                    <span
                      className={`text-xs px-3 py-1 rounded-lg border font-semibold ${getStatusBadge(
                        att?.status
                      )}`}
                    >
                      {att?.status === 'submitted'
                        ? att?.resultStatus || 'Submitted'
                        : att?.status === 'expired'
                        ? 'Expired'
                        : 'Completed'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Post-Assessment AI Review Explorer */}
          <div className="pt-4 border-t border-slate-200 text-left space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  Post-Assessment AI Coding Reviews
                </h3>
                <p className="text-xs text-slate-500">
                  Select a problem and review category to analyze your submitted solutions.
                </p>
              </div>

              {/* Problem Selector Tabs for Completion Screen */}
              <div className="flex items-center gap-2">
                {sessionData.questions.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setCompletionSelectedQ(idx);
                      setReviewError('');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      completionSelectedQ === idx
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs'
                    }`}
                  >
                    Problem {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Review Controls for selected completed question */}
            {(() => {
              const selectedQ = sessionData.questions[completionSelectedQ] || sessionData.questions[0];
              const qId = selectedQ.id || selectedQ._id;
              const currentReview = reviewsMap[`${qId}_${activeReviewType}`];

              return (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4 shadow-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                    <span className="text-xs font-semibold text-slate-900">
                      Problem {completionSelectedQ + 1}: {selectedQ.title}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Topic: {selectedQ.topic} • Difficulty: {selectedQ.difficulty}
                    </span>
                  </div>

                  {/* 5 Review Category Buttons */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                    {REVIEW_TYPES_CONFIG.map((btn) => {
                      const Icon = btn.icon;
                      const isSelected = activeReviewType === btn.key;
                      const hasCached = Boolean(reviewsMap[`${qId}_${btn.key}`]);

                      return (
                        <button
                          key={btn.key}
                          type="button"
                          onClick={() => handleRequestReview(btn.key, qId)}
                          disabled={reviewLoading}
                          className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all active:scale-95 disabled:opacity-50 ${
                            isSelected
                              ? btn.isSpecial
                                ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                                : 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                              : btn.isSpecial
                              ? 'bg-white border-emerald-200 text-emerald-700 hover:bg-emerald-50 shadow-xs'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="truncate">{btn.label}</span>
                          {hasCached && (
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Loading */}
                  {reviewLoading && (
                    <div className="py-8 flex flex-col items-center justify-center space-y-2 text-slate-500 font-sans">
                      <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                      <span className="text-xs">Analyzing your submission with AI review engine...</span>
                    </div>
                  )}

                  {/* Error */}
                  {reviewError && (
                    <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                      <span>{reviewError}</span>
                    </div>
                  )}

                  {/* Content */}
                  {!reviewLoading && currentReview && renderReviewContent(currentReview)}

                  {!reviewLoading && !currentReview && !reviewError && (
                    <div className="py-6 text-center text-xs text-slate-500">
                      Select a review category above to generate structured AI feedback on Problem {completionSelectedQ + 1}.
                    </div>
                  )}
                </div>
              );
            })()}
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-center">
            <button
              type="button"
              onClick={() => {
                setSessionState('intro');
                setSessionData(null);
                setRunResult(null);
                setRunError('');
              }}
              className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all inline-flex items-center space-x-2 border border-slate-200 shadow-xs"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Back to Assessment Overview</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodingRoundPage;
