import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Radio,
  Clock,
  Edit3,
  Check,
  PhoneOff,
  User,
} from 'lucide-react';
import {
  startInterview,
  getInterview,
  submitInterviewAnswer,
  getNextQuestion,
  finishInterview,
} from '../services/interviewService';
import {
  isSpeechRecognitionSupported,
  isSpeechSynthesisSupported,
  speakQuestionAloud,
  cancelSpeechSynthesis,
  VoiceRecognitionController,
} from '../utils/speechRecognition';

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

const formatTimer = (totalSeconds) => {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

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

  // Spoken transcript & candidate response
  const [candidateTranscript, setCandidateTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [showManualEditor, setShowManualEditor] = useState(false);

  // Voice Interaction States
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [micError, setMicError] = useState('');
  const [isAiMuted, setIsAiMuted] = useState(false);

  // Active answer evaluation state
  const [evaluation, setEvaluation] = useState(null);
  const [isLimitReached, setIsLimitReached] = useState(false);

  // Completed session state
  const [completedData, setCompletedData] = useState(null);
  const [expandedReviews, setExpandedReviews] = useState({});

  // Loading and action states
  const [initialLoading, setInitialLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [advancing, setAdvancing] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [error, setError] = useState('');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Controller reference
  const voiceControllerRef = useRef(null);
  const isAiSpeakingRef = useRef(isAiSpeaking);
  isAiSpeakingRef.current = isAiSpeaking;

  const candidateTranscriptRef = useRef(candidateTranscript);
  candidateTranscriptRef.current = candidateTranscript;

  // Session elapsed timer
  useEffect(() => {
    let timerInterval = null;
    if (viewMode === 'active') {
      timerInterval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [viewMode]);

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      cancelSpeechSynthesis();
      if (voiceControllerRef.current) {
        voiceControllerRef.current.abort();
      }
    };
  }, []);

  /**
   * Helper to trigger AI speech for a given question
   */
  const triggerAiSpeak = useCallback((questionText) => {
    if (!questionText) return;

    // Abort speech recognition so candidate mic is silent while AI speaks
    if (voiceControllerRef.current) {
      voiceControllerRef.current.abort();
    }
    setIsListening(false);

    if (isAiMuted || !isSpeechSynthesisSupported()) {
      setIsAiSpeaking(false);
      // If voice is muted or unsupported, directly enable mic for user
      if (voiceControllerRef.current && isSpeechRecognitionSupported()) {
        voiceControllerRef.current.start(candidateTranscriptRef.current);
      }
      return;
    }

    setIsAiSpeaking(true);
    speakQuestionAloud(questionText, {
      onStart: () => {
        setIsAiSpeaking(true);
      },
      onEnd: () => {
        setIsAiSpeaking(false);
        // Automatically start listening for candidate's answer once AI finishes speaking
        if (voiceControllerRef.current && isSpeechRecognitionSupported()) {
          voiceControllerRef.current.start(candidateTranscriptRef.current);
        }
      },
      onError: () => {
        setIsAiSpeaking(false);
        if (voiceControllerRef.current && isSpeechRecognitionSupported()) {
          voiceControllerRef.current.start(candidateTranscriptRef.current);
        }
      },
    });
  }, [isAiMuted]);

  /**
   * Initialize voice controller instance
   */
  useEffect(() => {
    voiceControllerRef.current = new VoiceRecognitionController({
      onTranscriptUpdate: ({ fullText, interim }) => {
        setCandidateTranscript(fullText);
        setInterimTranscript(interim);
      },
      onStateChange: (state) => {
        setIsListening(state === 'listening');
      },
      onError: (err) => {
        setMicError(err.message || 'Microphone error.');
        setShowManualEditor(true);
      },
    });

    return () => {
      if (voiceControllerRef.current) {
        voiceControllerRef.current.abort();
      }
    };
  }, []);

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
              setCandidateTranscript(lastAns.answer);
              setIsLimitReached(questions.length >= 10);
            } else {
              setEvaluation(null);
              setCandidateTranscript('');
              setIsLimitReached(false);
              // Trigger AI speaking for restored active question
              setTimeout(() => {
                triggerAiSpeak(lastQ.text);
              }, 400);
            }
          }
          setViewMode('active');
        } else {
          localStorage.removeItem(LOCAL_STORAGE_KEY);
        }
      }
    } catch {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } finally {
      setInitialLoading(false);
    }
  }, [triggerAiSpeak]);

  useEffect(() => {
    recoverInterviewSession();
  }, [recoverInterviewSession]);

  /**
   * Start a new voice interview session
   */
  const handleStartInterview = async () => {
    setError('');
    setMicError('');
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
        setCandidateTranscript('');
        setInterimTranscript('');
        setEvaluation(null);
        setIsLimitReached(false);
        setElapsedSeconds(0);
        setViewMode('active');

        localStorage.setItem(LOCAL_STORAGE_KEY, newId);

        // AI speaks the first question aloud
        setTimeout(() => {
          triggerAiSpeak(firstQ.text);
        }, 500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start interview. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Toggle candidate microphone listening state
   */
  const handleToggleListening = () => {
    if (isAiSpeaking) {
      // If AI is speaking, cancel speech so candidate can talk immediately
      cancelSpeechSynthesis();
      setIsAiSpeaking(false);
    }

    if (isListening) {
      if (voiceControllerRef.current) {
        voiceControllerRef.current.stop();
      }
      setIsListening(false);
    } else {
      setMicError('');
      if (voiceControllerRef.current) {
        voiceControllerRef.current.start(candidateTranscript);
      }
    }
  };

  /**
   * Re-speak the current interview question
   */
  const handleRepeatQuestion = () => {
    if (currentQuestion) {
      triggerAiSpeak(currentQuestion.text);
    }
  };

  /**
   * Submit spoken answer for the active question
   */
  const handleSubmitSpokenAnswer = async () => {
    const finalAnswer = candidateTranscript.trim();
    if (!finalAnswer || finalAnswer.length < 5) {
      setMicError('Please speak or type a complete answer before submitting (at least 5 characters).');
      return;
    }

    // Stop microphone listening & speech synthesis
    if (voiceControllerRef.current) {
      voiceControllerRef.current.stop();
    }
    cancelSpeechSynthesis();
    setIsAiSpeaking(false);
    setIsListening(false);

    setError('');
    setMicError('');
    setSubmitting(true);

    try {
      const response = await submitInterviewAnswer({
        interviewId,
        questionId: currentQuestion.questionId,
        answer: finalAnswer,
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
   * Request next adaptive question and speak it aloud
   */
  const handleNextQuestion = async () => {
    setError('');
    setMicError('');
    setAdvancing(true);

    try {
      const response = await getNextQuestion(interviewId);
      if (response && response.success && response.data) {
        const nextQ = response.data;
        setCurrentQuestion(nextQ);
        setQuestionNumber(nextQ.questionNumber);
        setTotalQuestions(nextQ.totalQuestions || 10);
        setCandidateTranscript('');
        setInterimTranscript('');
        setEvaluation(null);

        // AI interviewer speaks the new question aloud
        setTimeout(() => {
          triggerAiSpeak(nextQ.text);
        }, 400);
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
    cancelSpeechSynthesis();
    if (voiceControllerRef.current) {
      voiceControllerRef.current.abort();
    }
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
   * Reset and return to initial setup
   */
  const handleReset = () => {
    cancelSpeechSynthesis();
    if (voiceControllerRef.current) {
      voiceControllerRef.current.abort();
    }
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setInterviewId(null);
    setCurrentQuestion(null);
    setCandidateTranscript('');
    setInterimTranscript('');
    setEvaluation(null);
    setCompletedData(null);
    setViewMode('start');
    setError('');
    setMicError('');
    setElapsedSeconds(0);
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
        <p className="text-sm font-medium">Connecting to AI Voice Interview Studio...</p>
      </div>
    );
  }

  // =========================================================================
  // VIEW MODE A: START SCREEN (Role Selection & Voice Briefing)
  // =========================================================================
  if (viewMode === 'start') {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 mb-3 shadow-xs">
            <Radio className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
            <span>Module 03 • Voice-First AI Mock Interview</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            AI Voice Mock Interview
          </h1>
          <p className="text-base text-slate-600 mt-1 max-w-3xl leading-relaxed">
            Experience a realistic oral placement interview. The AI interviewer speaks questions aloud, and you answer through your microphone with real-time speech transcription.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-600" />
            <div className="text-sm">{error}</div>
          </div>
        )}

        {/* Browser Voice Support Notice */}
        {!isSpeechRecognitionSupported() && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-start gap-3 text-xs leading-relaxed">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-600 mt-0.5" />
            <div>
              <span className="font-semibold block mb-0.5">Voice Recognition Notice:</span>
              Your browser does not natively support Web Speech Recognition. You can still hear the AI speak questions aloud and use the seamless text input fallback to provide your answers.
            </div>
          </div>
        )}

        {/* Role Selector Grid */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 mb-8">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Select Target Role</h2>
              <p className="text-xs text-slate-500">
                Choose the domain track to calibrate question domain knowledge, depth, and terminology.
              </p>
            </div>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
              {SUPPORTED_ROLES.length} Tracks Available
            </span>
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
                      ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`p-2 rounded-lg ${
                        isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold text-slate-900">{r.title}</span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{r.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Voice Session Format Briefing */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 mb-8">
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Radio className="w-4 h-4 text-indigo-600" />
            Voice Interview Guidelines
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="font-semibold text-slate-900 block flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
                Listen to Questions
              </span>
              The AI interviewer asks each adaptive question aloud. You can replay the audio anytime with the Repeat button.
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="font-semibold text-slate-900 block flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5 text-emerald-600" />
                Speak Your Answer
              </span>
              The microphone activates automatically once the AI finishes speaking. Your speech is converted to text in real time.
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="font-semibold text-slate-900 block flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Adaptive Evaluation
              </span>
              Receive immediate feedback on technical accuracy, concept clarity, and communication structure.
            </div>
          </div>
        </div>

        {/* Start Button */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            id="start-voice-interview-button"
            onClick={handleStartInterview}
            disabled={submitting}
            className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Preparing Interview Studio...</span>
              </>
            ) : (
              <>
                <Radio className="w-4 h-4" />
                <span>Enter Voice Interview Room</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW MODE B: ACTIVE VOICE INTERVIEW ROOM
  // =========================================================================
  if (viewMode === 'active' && currentQuestion) {
    const isEvaluated = Boolean(evaluation);
    const wordCount = candidateTranscript.trim() ? candidateTranscript.trim().split(/\s+/).length : 0;
    const charCount = candidateTranscript.length;

    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Top Control Bar: Progress, Timer & End Interview */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-5 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold">
                <Radio className="w-3.5 h-3.5 animate-pulse text-indigo-600" />
                <span>Voice Room</span>
              </div>
              <span className="text-xs font-bold text-slate-900 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">
                {role}
              </span>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${getCategoryBadge(
                  currentQuestion.category
                )}`}
              >
                {currentQuestion.category.toUpperCase()}
              </span>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${getDifficultyBadge(
                  currentQuestion.difficulty
                )}`}
              >
                {currentQuestion.difficulty}
              </span>
            </div>

            {/* Timer & Conclude Controls */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-mono font-bold">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>{formatTimer(elapsedSeconds)}</span>
              </div>

              <button
                type="button"
                id="end-interview-early-button"
                onClick={handleFinishInterview}
                disabled={finishing || advancing}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold transition-all active:scale-95 disabled:opacity-50"
              >
                {finishing ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <PhoneOff className="w-3.5 h-3.5" />
                )}
                <span>End Interview</span>
              </button>
            </div>
          </div>

          {/* Question Counter Bar */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="font-semibold text-slate-700">
              Question {questionNumber} of {totalQuestions}
            </span>
            <span>{Math.round((questionNumber / totalQuestions) * 100)}% Completed</span>
          </div>
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

        {/* ---------------- 1. AI INTERVIEWER STAGE ---------------- */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-7 mb-6 relative overflow-hidden">
          {/* Active Speaking Indicator Top Bar */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              {/* Interviewer Persona Avatar with Audio Waveform Animation */}
              <div className="relative">
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                    isAiSpeaking
                      ? 'bg-indigo-600 text-white shadow-md ring-4 ring-indigo-500/20'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  <Bot className="w-6 h-6" />
                </div>
                {isAiSpeaking && (
                  <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-indigo-600" />
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span>AI Interviewer</span>
                  <span className="text-[11px] font-medium text-slate-400 font-sans">• Technical Evaluation</span>
                </h3>
                {isAiSpeaking ? (
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 mt-0.5 animate-pulse">
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Speaking question aloud...</span>
                  </div>
                ) : isListening ? (
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 mt-0.5">
                    <Mic className="w-3.5 h-3.5" />
                    <span>Listening to your response...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mt-0.5">
                    <Radio className="w-3.5 h-3.5 text-slate-400" />
                    <span>Awaiting your answer</span>
                  </div>
                )}
              </div>
            </div>

            {/* Audio Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                id="repeat-question-button"
                onClick={handleRepeatQuestion}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold transition-all active:scale-95"
                title="Repeat question aloud"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
                <span>Repeat Question</span>
              </button>

              <button
                type="button"
                id="toggle-ai-voice-button"
                onClick={() => {
                  if (!isAiMuted) {
                    cancelSpeechSynthesis();
                    setIsAiSpeaking(false);
                  }
                  setIsAiMuted((prev) => !prev);
                }}
                className={`p-2 rounded-xl border text-xs font-semibold transition-all ${
                  isAiMuted
                    ? 'bg-rose-50 border-rose-200 text-rose-700'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
                title={isAiMuted ? 'Unmute AI Voice' : 'Mute AI Voice'}
              >
                {isAiMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Prominent Question Display */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
              Question #{questionNumber}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug tracking-tight">
              {currentQuestion.text}
            </h2>
          </div>
        </div>

        {/* ---------------- 2. CANDIDATE VOICE INTERACTION HUB ---------------- */}
        {!isEvaluated && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 mb-6 space-y-6">
            {/* Header & Word Count */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Candidate Voice Response
                </span>
                {isListening && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    Microphone Active
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-400 font-medium">
                {wordCount} words • {charCount} characters
              </span>
            </div>

            {/* Central Animated Microphone Interaction Pod */}
            <div className="flex flex-col items-center justify-center py-4 sm:py-6">
              <div className="relative flex items-center justify-center mb-4">
                {/* Concentric Audio Wave Animation when Listening */}
                {isListening && (
                  <>
                    <span className="absolute w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-emerald-400/20 animate-ping" />
                    <span className="absolute w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-emerald-500/20 animate-pulse" />
                  </>
                )}

                {/* Central Microphone Button */}
                <button
                  type="button"
                  id="voice-mic-button"
                  onClick={handleToggleListening}
                  disabled={submitting}
                  className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-lg active:scale-95 disabled:opacity-50 ${
                    isAiSpeaking
                      ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-300 cursor-pointer'
                      : isListening
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/30'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
                  }`}
                  title={isListening ? 'Click to pause microphone' : 'Click to start speaking'}
                >
                  {isAiSpeaking ? (
                    <>
                      <Volume2 className="w-8 h-8 animate-pulse" />
                      <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">AI Talking</span>
                    </>
                  ) : isListening ? (
                    <>
                      <Mic className="w-8 h-8 animate-bounce" />
                      <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">Listening</span>
                    </>
                  ) : (
                    <>
                      <MicOff className="w-8 h-8 text-slate-500" />
                      <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter text-slate-600">Start Mic</span>
                    </>
                  )}
                </button>
              </div>

              {/* Status Caption */}
              <div className="text-center space-y-1">
                <p className="text-xs font-semibold text-slate-800">
                  {isAiSpeaking
                    ? 'AI interviewer is speaking the question. Listen closely, or click mic to interrupt.'
                    : isListening
                    ? 'Listening to your speech... Speak clearly into your microphone.'
                    : 'Microphone is paused. Click the button above to speak your answer.'}
                </p>
                <p className="text-[11px] text-slate-400">
                  Answers are automatically converted to text in real time.
                </p>
              </div>
            </div>

            {/* Error Notification */}
            {micError && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-600 mt-0.5" />
                <div className="flex-1">
                  <span>{micError}</span>
                  <button
                    type="button"
                    onClick={() => setShowManualEditor(true)}
                    className="block font-semibold text-amber-900 underline mt-1"
                  >
                    Switch to manual text response editor
                  </button>
                </div>
              </div>
            )}

            {/* Live Candidate Speech Transcript Teleprompter */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                  Live Spoken Transcript
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    id="clear-transcript-button"
                    onClick={() => {
                      if (voiceControllerRef.current) {
                        voiceControllerRef.current.clear();
                      }
                      setCandidateTranscript('');
                      setInterimTranscript('');
                    }}
                    className="text-slate-400 hover:text-slate-600 transition-colors text-[11px] flex items-center gap-1"
                    title="Clear current transcript"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Clear</span>
                  </button>

                  <button
                    type="button"
                    id="toggle-manual-editor-button"
                    onClick={() => setShowManualEditor((prev) => !prev)}
                    className="text-indigo-600 hover:text-indigo-700 transition-colors text-[11px] font-medium flex items-center gap-1"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>{showManualEditor ? 'Hide Text Editor' : 'Edit Transcript'}</span>
                  </button>
                </div>
              </div>

              {/* Real-time Voice Transcript Box */}
              {!showManualEditor ? (
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 min-h-[120px] text-xs sm:text-sm text-slate-800 leading-relaxed font-sans shadow-xs transition-all">
                  {candidateTranscript || interimTranscript ? (
                    <p className="whitespace-pre-wrap">
                      <span>{candidateTranscript}</span>
                      {interimTranscript && (
                        <span className="text-slate-400 italic"> {interimTranscript}</span>
                      )}
                    </p>
                  ) : (
                    <p className="text-slate-400 italic">
                      {isListening
                        ? 'Listening... Start speaking to see your answer transcribe in real-time.'
                        : 'Your spoken words will appear here once you begin speaking.'}
                    </p>
                  )}
                </div>
              ) : (
                /* Editable Text Fallback */
                <textarea
                  id="answer-input"
                  rows={5}
                  value={candidateTranscript}
                  onChange={(e) => {
                    const updated = e.target.value;
                    setCandidateTranscript(updated);
                    if (voiceControllerRef.current) {
                      voiceControllerRef.current.setTranscript(updated);
                    }
                  }}
                  placeholder="You can edit or manually type your response here..."
                  className="w-full p-3.5 text-xs sm:text-sm rounded-xl border border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 resize-y font-normal text-slate-800 leading-relaxed shadow-xs"
                />
              )}
            </div>

            {/* Finish Answer & Submit Button */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                Click Finish Answer when you are done speaking to evaluate your response.
              </span>

              <button
                type="button"
                id="submit-spoken-answer-button"
                onClick={handleSubmitSpokenAnswer}
                disabled={submitting || candidateTranscript.trim().length < 5}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Evaluating Spoken Answer...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Finish Answer & Submit</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ---------------- 3. ANSWER EVALUATION STAGE ---------------- */}
        {isEvaluated && evaluation && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-7 mb-6 animate-fadeIn space-y-6">
            {/* Candidate Spoken Transcript Summary */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
              <span className="font-semibold text-slate-500 uppercase tracking-wider block text-[11px]">
                Your Submitted Answer:
              </span>
              <p className="text-slate-800 leading-relaxed italic">"{candidateTranscript}"</p>
            </div>

            {/* Evaluation Score Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">Voice Response Evaluation</h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 block font-medium">Question Score</span>
                <span className="text-2xl font-extrabold text-indigo-700">{evaluation.score}/100</span>
              </div>
            </div>

            {/* Micro Scores */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 block font-medium">Concept Clarity</span>
                <span className="text-lg font-bold text-slate-900">
                  {evaluation.conceptClarity || evaluation.score}%
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 block font-medium">Spoken Communication</span>
                <span className="text-lg font-bold text-slate-900">
                  {evaluation.communication || evaluation.score}%
                </span>
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="space-y-3">
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

            {/* Detailed Feedback Note */}
            {evaluation.feedback && (
              <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-950 leading-relaxed">
                <span className="font-semibold block mb-0.5">Interviewer Note:</span>
                {evaluation.feedback}
              </div>
            )}

            {/* Next Question / Finish Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
              <span className="text-xs text-slate-500">
                {isLimitReached
                  ? 'All interview questions completed.'
                  : `Ready for Question ${questionNumber + 1}?`}
              </span>

              <div className="flex items-center gap-2">
                {!isLimitReached && (
                  <button
                    type="button"
                    id="next-voice-question-button"
                    onClick={handleNextQuestion}
                    disabled={advancing || finishing}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all active:scale-95 disabled:opacity-50"
                  >
                    {advancing ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Generating Next Question...</span>
                      </>
                    ) : (
                      <>
                        <Radio className="w-3.5 h-3.5" />
                        <span>Next Question (Speak Aloud)</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                )}

                <button
                  type="button"
                  id="complete-voice-interview-button"
                  onClick={handleFinishInterview}
                  disabled={finishing || advancing}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-all active:scale-95 disabled:opacity-50"
                >
                  {finishing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Generating Report...</span>
                    </>
                  ) : (
                    <>
                      <Award className="w-3.5 h-3.5" />
                      <span>Complete Interview</span>
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
  // VIEW MODE C: COMPLETED SCORECARD & INTERVIEW REPORT
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
                Voice Interview Completed
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Placement Interview Scorecard
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Target Role: <span className="font-semibold text-slate-800">{completedData.role}</span> •{' '}
                {answers.length} Questions Evaluated
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-xs text-slate-500 block font-medium">Overall Score</span>
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
            <div className="text-xs text-slate-500 mb-1 font-medium">Spoken Communication</div>
            <div className="text-2xl font-bold text-slate-900">
              {report.communication ?? completedData.scores?.communication ?? 0}%
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Verbal clarity & structure</div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="text-xs text-slate-500 mb-1 font-medium">Confidence Indicators</div>
            <div className="text-2xl font-bold text-slate-900">
              {report.confidenceIndicators ?? 75}%
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Observable verbal patterns</div>
          </div>
        </div>

        {/* Executive Summary */}
        {report.summary && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 mb-6">
            <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Executive Interviewer Summary
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{report.summary}</p>
          </div>
        )}

        {/* Action Recommendations & Weak Topics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {report.strengths && report.strengths.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
              <h3 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-3">
                Key Strengths Demonstrated
              </h3>
              <ul className="space-y-2 text-xs text-slate-700">
                {report.strengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {report.recommendations && report.recommendations.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
              <h3 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-3">
                Actionable Recommendations
              </h3>
              <ul className="space-y-2 text-xs text-slate-700">
                {report.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Question-by-Question Review Accordion */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 mb-8">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            Detailed Question-by-Question Breakdown
          </h3>

          <div className="space-y-3">
            {questions.map((q, idx) => {
              const ansObj = answers.find((a) => a.questionId === q.questionId);
              const isExpanded = Boolean(expandedReviews[q.questionId]);
              const evalObj = ansObj?.evaluation;

              return (
                <div key={q.questionId || idx} className="rounded-xl border border-slate-200 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleReviewItem(q.questionId)}
                    className="w-full p-4 text-left flex items-center justify-between gap-3 bg-slate-50 hover:bg-slate-100/70 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-semibold text-slate-900 line-clamp-1">{q.text}</span>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      {evalObj && (
                        <span className="text-xs font-bold text-indigo-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                          {evalObj.score}/100
                        </span>
                      )}
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="p-4 bg-white border-t border-slate-200 space-y-3 text-xs">
                      <div>
                        <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px] block mb-1">
                          Full Question:
                        </span>
                        <p className="text-slate-800 font-medium">{q.text}</p>
                      </div>

                      {ansObj && (
                        <div>
                          <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px] block mb-1">
                            Your Spoken Answer:
                          </span>
                          <p className="text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 whitespace-pre-wrap italic">
                            "{ansObj.answer}"
                          </p>
                        </div>
                      )}

                      {evalObj && (
                        <div className="p-3 rounded-lg bg-indigo-50/60 border border-indigo-100 text-indigo-950">
                          <span className="font-semibold block mb-0.5">Evaluation Feedback:</span>
                          <p>{evalObj.feedback}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Start Another Interview</span>
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default MockInterviewPage;
