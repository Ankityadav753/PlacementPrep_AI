import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  BarChart3,
  FileText,
  Code2,
  Bot,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  Eye,
  RefreshCw,
  Loader2,
  Sparkles,
  Award,
  TrendingUp,
  X,
  Layers,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Check,
  Zap,
} from 'lucide-react';
import {
  getAnalyticsOverview,
  getResumeHistory,
  getCodingHistory,
  getInterviewHistory,
  getResumeDetails,
  getCodingSessionDetails,
  getInterviewDetails,
} from '../services/analyticsService';

export const HistoryPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'overview';

  // Analytics Overview state
  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [analyticsError, setAnalyticsError] = useState('');

  // Module History states
  const [resumeHistory, setResumeHistory] = useState({ items: [], pagination: { page: 1, totalPages: 1 } });
  const [resumeLoading, setResumeLoading] = useState(false);
  const [resumeError, setResumeError] = useState('');

  const [codingHistory, setCodingHistory] = useState({ items: [], pagination: { page: 1, totalPages: 1 } });
  const [codingLoading, setCodingLoading] = useState(false);
  const [codingError, setCodingError] = useState('');

  const [interviewHistory, setInterviewHistory] = useState({ items: [], pagination: { page: 1, totalPages: 1 } });
  const [interviewLoading, setInterviewLoading] = useState(false);
  const [interviewError, setInterviewError] = useState('');

  // Inspection Modals
  const [activeModal, setActiveModal] = useState(null); // { type: 'resume' | 'coding' | 'interview', data: ... }
  const [modalLoading, setModalLoading] = useState(false);

  // Tab changer
  const handleTabChange = (tab) => {
    setSearchParams({ tab });
  };

  // Fetch overview
  const fetchOverview = useCallback(async () => {
    setAnalyticsLoading(true);
    setAnalyticsError('');
    try {
      const res = await getAnalyticsOverview();
      if (res.success) {
        setAnalytics(res.data);
      }
    } catch (err) {
      setAnalyticsError(err.response?.data?.message || 'Failed to load analytics overview.');
    } finally {
      setAnalyticsLoading(false);
    }
  }, []);

  // Fetch Resume history
  const fetchResumeList = useCallback(async (page = 1) => {
    setResumeLoading(true);
    setResumeError('');
    try {
      const res = await getResumeHistory({ page, limit: 8 });
      if (res.success) {
        setResumeHistory({ items: res.data || [], pagination: res.pagination || { page: 1, totalPages: 1 } });
      }
    } catch (err) {
      setResumeError(err.response?.data?.message || 'Failed to load resume history.');
    } finally {
      setResumeLoading(false);
    }
  }, []);

  // Fetch Coding history
  const fetchCodingList = useCallback(async (page = 1) => {
    setCodingLoading(true);
    setCodingError('');
    try {
      const res = await getCodingHistory({ page, limit: 8 });
      if (res.success) {
        setCodingHistory({ items: res.data || [], pagination: res.pagination || { page: 1, totalPages: 1 } });
      }
    } catch (err) {
      setCodingError(err.response?.data?.message || 'Failed to load coding round history.');
    } finally {
      setCodingLoading(false);
    }
  }, []);

  // Fetch Interview history
  const fetchInterviewList = useCallback(async (page = 1) => {
    setInterviewLoading(true);
    setInterviewError('');
    try {
      const res = await getInterviewHistory({ page, limit: 8 });
      if (res.success) {
        setInterviewHistory({ items: res.data || [], pagination: res.pagination || { page: 1, totalPages: 1 } });
      }
    } catch (err) {
      setInterviewError(err.response?.data?.message || 'Failed to load mock interview history.');
    } finally {
      setInterviewLoading(false);
    }
  }, []);

  // Initial and reactive data loading
  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  useEffect(() => {
    if (currentTab === 'resume') {
      fetchResumeList(1);
    } else if (currentTab === 'coding') {
      fetchCodingList(1);
    } else if (currentTab === 'interview') {
      fetchInterviewList(1);
    }
  }, [currentTab, fetchResumeList, fetchCodingList, fetchInterviewList]);

  // Modal loaders
  const handleOpenResumeDetails = async (resumeId) => {
    setModalLoading(true);
    try {
      const res = await getResumeDetails(resumeId);
      if (res.success && res.data) {
        setActiveModal({ type: 'resume', data: res.data });
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Could not load resume analysis details.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleOpenCodingDetails = async (sessionId) => {
    setModalLoading(true);
    try {
      const res = await getCodingSessionDetails(sessionId);
      if (res.success && res.data) {
        setActiveModal({ type: 'coding', data: res.data });
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Could not load coding session details.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleOpenInterviewDetails = async (interviewId) => {
    setModalLoading(true);
    try {
      const res = await getInterviewDetails(interviewId);
      if (res.success && res.data) {
        setActiveModal({ type: 'interview', data: res.data });
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Could not load interview details.');
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 w-full space-y-8">
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 border border-indigo-200 text-indigo-700 mb-2">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Step 9 • History & Reports</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              History, Reports & Analytics
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-1">
              Track your campus placement preparation progress across all three independent modules.
            </p>
          </div>

          <button
            onClick={() => {
              fetchOverview();
              if (currentTab === 'resume') fetchResumeList(resumeHistory.pagination.page);
              if (currentTab === 'coding') fetchCodingList(codingHistory.pagination.page);
              if (currentTab === 'interview') fetchInterviewList(interviewHistory.pagination.page);
            }}
            disabled={analyticsLoading || resumeLoading || codingLoading || interviewLoading}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 shadow-xs transition-all self-start sm:self-center disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${analyticsLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Analytics</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 space-x-2 sm:space-x-4 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => handleTabChange('overview')}
          className={`flex items-center space-x-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
            currentTab === 'overview'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Analytics Overview</span>
        </button>

        <button
          onClick={() => handleTabChange('resume')}
          className={`flex items-center space-x-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
            currentTab === 'resume'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Resume Analyzer History</span>
        </button>

        <button
          onClick={() => handleTabChange('coding')}
          className={`flex items-center space-x-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
            currentTab === 'coding'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>Coding Round History</span>
        </button>

        <button
          onClick={() => handleTabChange('interview')}
          className={`flex items-center space-x-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
            currentTab === 'interview'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>Mock Interview History</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: OVERVIEW & ANALYTICS */}
      {/* ========================================================================= */}
      {currentTab === 'overview' && (
        <div className="space-y-8 animate-fadeIn">
          {analyticsLoading ? (
            <div className="flex flex-col items-center justify-center p-12 text-slate-500">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-3" />
              <p className="text-sm">Calculating candidate metrics across modules...</p>
            </div>
          ) : analyticsError ? (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center justify-between">
              <span>{analyticsError}</span>
              <button
                onClick={fetchOverview}
                className="px-3 py-1 bg-rose-100 hover:bg-rose-200 rounded-lg text-xs font-semibold"
              >
                Retry
              </button>
            </div>
          ) : analytics ? (
            <>
              {/* Primary KPIs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {/* Readiness Score */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs relative overflow-hidden">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-2">
                    <span>Placement Readiness</span>
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                      {analytics.overview.overallReadinessScore !== null
                        ? `${analytics.overview.overallReadinessScore}%`
                        : '—'}
                    </span>
                    <span className="text-xs text-slate-500">
                      {analytics.overview.overallReadinessScore !== null ? 'Aggregate' : 'No scored sessions'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    {analytics.overview.overallReadinessScore !== null
                      ? analytics.overview.overallReadinessScore >= 75
                        ? 'High readiness across completed modules.'
                        : 'Developing foundation. Keep practicing!'
                      : 'Complete module tests to unlock overall readiness.'}
                  </p>
                </div>

                {/* Resume Score */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-2">
                    <span>Average ATS Score</span>
                    <FileText className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl sm:text-4xl font-extrabold text-emerald-600">
                      {analytics.overview.averageAtsScore !== null
                        ? `${analytics.overview.averageAtsScore}/100`
                        : '—'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    {analytics.overview.totalResumesAnalyzed} of {analytics.overview.totalResumes} resumes analyzed
                  </p>
                </div>

                {/* Coding Score */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-2">
                    <span>Average Coding Score</span>
                    <Code2 className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl sm:text-4xl font-extrabold text-blue-600">
                      {analytics.overview.averageCodingScore !== null
                        ? `${analytics.overview.averageCodingScore}%`
                        : '—'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    {analytics.overview.completedCodingAttempts} questions submitted across {analytics.overview.totalCodingSessions} sessions
                  </p>
                </div>

                {/* Interview Score */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-2">
                    <span>Average Interview Score</span>
                    <Bot className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl sm:text-4xl font-extrabold text-indigo-600">
                      {analytics.overview.averageInterviewScore !== null
                        ? `${analytics.overview.averageInterviewScore}%`
                        : '—'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    {analytics.overview.completedInterviews} completed of {analytics.overview.totalInterviews} simulated
                  </p>
                </div>
              </div>

              {/* Module Performance Summaries Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Module 1: Resume Analyzer */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col justify-between space-y-4 shadow-xs">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200">
                          <FileText className="w-4 h-4" />
                        </div>
                        <h3 className="font-bold text-slate-900 text-base">Module 01: Resume Analyzer</h3>
                      </div>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {analytics.modules.resume.totalAnalyzed > 0 ? 'Active' : 'Empty'}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs text-slate-600 pt-2">
                      <div className="flex justify-between py-1.5 border-b border-slate-100">
                        <span className="text-slate-500">Resumes Uploaded</span>
                        <span className="font-semibold text-slate-900">{analytics.modules.resume.totalUploaded}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-100">
                        <span className="text-slate-500">Completed Analyses</span>
                        <span className="font-semibold text-slate-900">{analytics.modules.resume.totalAnalyzed}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-100">
                        <span className="text-slate-500">Highest ATS Score</span>
                        <span className="font-semibold text-emerald-600">
                          {analytics.modules.resume.highestAtsScore !== null
                            ? `${analytics.modules.resume.highestAtsScore}/100`
                            : '—'}
                        </span>
                      </div>
                      <div className="flex justify-between py-1.5">
                        <span className="text-slate-500">Latest Analysis</span>
                        <span className="font-medium text-slate-700">
                          {formatDate(analytics.modules.resume.latestAnalysisDate)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleTabChange('resume')}
                    className="w-full flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition-colors shadow-xs"
                  >
                    <span>View Resume History</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Module 2: Coding Round */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col justify-between space-y-4 shadow-xs">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
                          <Code2 className="w-4 h-4" />
                        </div>
                        <h3 className="font-bold text-slate-900 text-base">Module 02: Coding Round</h3>
                      </div>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        {analytics.modules.coding.totalSessions > 0 ? 'Active' : 'Empty'}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs text-slate-600 pt-2">
                      <div className="flex justify-between py-1.5 border-b border-slate-100">
                        <span className="text-slate-500">Total Practice Sessions</span>
                        <span className="font-semibold text-slate-900">{analytics.modules.coding.totalSessions}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-100">
                        <span className="text-slate-500">Submitted Attempts</span>
                        <span className="font-semibold text-slate-900">{analytics.modules.coding.completedAttempts}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-100">
                        <span className="text-slate-500">Highest Score</span>
                        <span className="font-semibold text-blue-600">
                          {analytics.modules.coding.highestScore !== null
                            ? `${analytics.modules.coding.highestScore}/100`
                            : '—'}
                        </span>
                      </div>
                      <div className="flex justify-between py-1.5">
                        <span className="text-slate-500">Languages Used</span>
                        <span className="font-medium text-slate-700">
                          {Object.entries(analytics.modules.coding.languageBreakdown)
                            .filter(([_, count]) => count > 0)
                            .map(([lang]) => lang)
                            .join(', ') || 'None yet'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleTabChange('coding')}
                    className="w-full flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition-colors shadow-xs"
                  >
                    <span>View Coding History</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Module 3: AI Mock Interview */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col justify-between space-y-4 shadow-xs">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200">
                          <Bot className="w-4 h-4" />
                        </div>
                        <h3 className="font-bold text-slate-900 text-base">Module 03: Mock Interview</h3>
                      </div>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {analytics.modules.interview.totalInterviews > 0 ? 'Active' : 'Empty'}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs text-slate-600 pt-2">
                      <div className="flex justify-between py-1.5 border-b border-slate-100">
                        <span className="text-slate-500">Simulations Started</span>
                        <span className="font-semibold text-slate-900">{analytics.modules.interview.totalInterviews}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-100">
                        <span className="text-slate-500">Completed Sessions</span>
                        <span className="font-semibold text-slate-900">{analytics.modules.interview.completedInterviews}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-100">
                        <span className="text-slate-500">Technical Depth Average</span>
                        <span className="font-semibold text-indigo-600">
                          {analytics.modules.interview.averageTechnicalKnowledge !== null
                            ? `${analytics.modules.interview.averageTechnicalKnowledge}%`
                            : '—'}
                        </span>
                      </div>
                      <div className="flex justify-between py-1.5">
                        <span className="text-slate-500">Communication Rating</span>
                        <span className="font-medium text-slate-700">
                          {analytics.modules.interview.averageCommunication !== null
                            ? `${analytics.modules.interview.averageCommunication}%`
                            : '—'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleTabChange('interview')}
                    className="w-full flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition-colors shadow-xs"
                  >
                    <span>View Interview History</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Cross-Module Recent Activity Feed */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-600" />
                    Recent Activity Across Modules
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">
                    {analytics.recentActivity.length} event(s) recorded
                  </span>
                </div>

                {analytics.recentActivity.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 text-xs">
                    No recent activity found. Begin by analyzing your resume or starting a coding session.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {analytics.recentActivity.map((act, index) => {
                      const Icon =
                        act.module === 'resume' ? FileText : act.module === 'coding' ? Code2 : Bot;
                      const iconColor =
                        act.module === 'resume'
                          ? 'text-emerald-600 bg-emerald-50 border border-emerald-200'
                          : act.module === 'coding'
                          ? 'text-blue-600 bg-blue-50 border border-blue-200'
                          : 'text-indigo-600 bg-indigo-50 border border-indigo-200';

                      return (
                        <div
                          key={`${act.id}_${index}`}
                          className="py-3 flex items-center justify-between hover:bg-slate-50 px-2 rounded-xl transition-colors cursor-pointer"
                          onClick={() => {
                            if (act.module === 'resume') handleOpenResumeDetails(act.id);
                            if (act.module === 'coding') handleOpenCodingDetails(act.id);
                            if (act.module === 'interview') handleOpenInterviewDetails(act.id);
                          }}
                        >
                          <div className="flex items-center space-x-3 min-w-0">
                            <div className={`p-2 rounded-lg ${iconColor} flex-shrink-0`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                                {act.title}
                              </p>
                              <p className="text-[11px] text-slate-500 truncate">{act.subtitle}</p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3 flex-shrink-0 ml-4">
                            {act.score !== null && (
                              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md">
                                Score: {act.score}
                              </span>
                            )}
                            <span className="text-[11px] text-slate-400 hidden sm:inline">
                              {formatDate(act.timestamp)}
                            </span>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          ) : null}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: RESUME ANALYZER HISTORY */}
      {/* ========================================================================= */}
      {currentTab === 'resume' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Previous Resume Analyses</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Inspect past ATS scores, extracted feedback, and targeting suggestions.
              </p>
            </div>
            <Link
              to="/resume-analyzer"
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all shadow-xs"
            >
              <span>Upload New Resume</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {resumeLoading ? (
            <div className="flex flex-col items-center justify-center p-12 text-slate-500">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mb-3" />
              <p className="text-sm">Loading resume records...</p>
            </div>
          ) : resumeError ? (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
              {resumeError}
            </div>
          ) : resumeHistory.items.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center space-y-3 shadow-xs">
              <FileText className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No Resumes Analyzed Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Upload your resume in PDF format to receive instant ATS evaluation and suggestions.
              </p>
              <Link
                to="/resume-analyzer"
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs"
              >
                <span>Analyze Resume Now</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 uppercase tracking-wider font-semibold text-[11px]">
                      <tr>
                        <th className="py-3.5 px-4">File Name</th>
                        <th className="py-3.5 px-4">Target Role</th>
                        <th className="py-3.5 px-4">ATS Score</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4">Uploaded Date</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600">
                      {resumeHistory.items.map((r) => (
                        <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-4 font-semibold text-slate-900 flex items-center gap-2">
                            <FileText className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                            <span className="truncate max-w-[200px]">{r.originalFileName}</span>
                          </td>
                          <td className="py-3 px-4">{r.targetRole}</td>
                          <td className="py-3 px-4">
                            {r.atsScore !== null ? (
                              <span className="inline-flex items-center font-bold px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700">
                                {r.atsScore}/100
                              </span>
                            ) : (
                              <span className="text-slate-400">Unanalyzed</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                r.status === 'analyzed'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}
                            >
                              {r.status === 'analyzed' ? 'Analyzed' : 'Draft'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-500">{formatDate(r.createdAt)}</td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => handleOpenResumeDetails(r.id)}
                              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold transition-all"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View Report</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination Bar */}
              {resumeHistory.pagination.totalPages > 1 && (
                <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
                  <span>
                    Page {resumeHistory.pagination.page} of {resumeHistory.pagination.totalPages} (
                    {resumeHistory.pagination.total} total)
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => fetchResumeList(resumeHistory.pagination.page - 1)}
                      disabled={resumeHistory.pagination.page <= 1}
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 shadow-xs font-medium"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => fetchResumeList(resumeHistory.pagination.page + 1)}
                      disabled={resumeHistory.pagination.page >= resumeHistory.pagination.totalPages}
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 shadow-xs font-medium"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: CODING ROUND HISTORY */}
      {/* ========================================================================= */}
      {currentTab === 'coding' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Coding Sessions & Attempts</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Review your problem submissions, test suite results, and time metrics.
              </p>
            </div>
            <Link
              to="/coding-round"
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all shadow-xs"
            >
              <span>Start Coding Session</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {codingLoading ? (
            <div className="flex flex-col items-center justify-center p-12 text-slate-500">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-3" />
              <p className="text-sm">Loading coding attempts...</p>
            </div>
          ) : codingError ? (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
              {codingError}
            </div>
          ) : codingHistory.items.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center space-y-3 shadow-xs">
              <Code2 className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No Coding Attempts Recorded</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Begin a timed coding round session to practice data structures and algorithm challenges.
              </p>
              <Link
                to="/coding-round"
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs"
              >
                <span>Launch Coding Round</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {codingHistory.items.map((sess) => (
                  <div
                    key={sess.sessionId}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-900">Session #{sess.sessionId.substring(0, 8)}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            sess.status === 'submitted'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : sess.status === 'expired'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {sess.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 text-xs text-slate-500">
                        <span>{formatDate(sess.startedAt)}</span>
                        {sess.averageScore !== null && (
                          <span className="font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                            Avg Score: {sess.averageScore}%
                          </span>
                        )}
                        <button
                          onClick={() => handleOpenCodingDetails(sess.sessionId)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200 transition-colors"
                        >
                          Details
                        </button>
                      </div>
                    </div>

                    {/* Attempts in this session */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {sess.attempts.map((att) => (
                        <div
                          key={att.attemptId}
                          className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200 flex items-start justify-between gap-3"
                        >
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-semibold text-slate-900">{att.questionTitle}</span>
                              <span className="text-[10px] text-slate-400">({att.difficulty})</span>
                            </div>
                            <div className="flex items-center space-x-2 text-[11px] text-slate-500 mt-1">
                              <span>Lang: <strong className="text-slate-700">{att.language}</strong></span>
                              <span>•</span>
                              <span>Tests: <strong className="text-slate-700">{att.testCasesPassed}/{att.totalTestCases}</strong></span>
                            </div>
                          </div>

                          <div className="text-right">
                            <span
                              className={`text-xs font-bold block ${
                                att.score >= 70
                                  ? 'text-emerald-600'
                                  : att.score >= 40
                                  ? 'text-amber-600'
                                  : 'text-rose-600'
                              }`}
                            >
                              {att.score}/100
                            </span>
                            <span className="text-[10px] text-slate-400">{att.resultStatus}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Bar */}
              {codingHistory.pagination.totalPages > 1 && (
                <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
                  <span>
                    Page {codingHistory.pagination.page} of {codingHistory.pagination.totalPages} (
                    {codingHistory.pagination.total} total)
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => fetchCodingList(codingHistory.pagination.page - 1)}
                      disabled={codingHistory.pagination.page <= 1}
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 shadow-xs font-medium"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => fetchCodingList(codingHistory.pagination.page + 1)}
                      disabled={codingHistory.pagination.page >= codingHistory.pagination.totalPages}
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 shadow-xs font-medium"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: MOCK INTERVIEW HISTORY */}
      {/* ========================================================================= */}
      {currentTab === 'interview' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">AI Mock Interview Sessions</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Review past role simulations, adaptive difficulties, and comprehensive placement scorecards.
              </p>
            </div>
            <Link
              to="/mock-interview"
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-all shadow-xs"
            >
              <span>Start New Interview</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {interviewLoading ? (
            <div className="flex flex-col items-center justify-center p-12 text-slate-500">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600 mb-3" />
              <p className="text-sm">Loading interview records...</p>
            </div>
          ) : interviewError ? (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
              {interviewError}
            </div>
          ) : interviewHistory.items.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center space-y-3 shadow-xs">
              <Bot className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No Mock Interviews Completed</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Practice realistic fresher questions tailored to your chosen technical track with real-time feedback.
              </p>
              <Link
                to="/mock-interview"
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs"
              >
                <span>Launch Mock Interview</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {interviewHistory.items.map((intv) => (
                  <div
                    key={intv.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-900">{intv.role}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            intv.status === 'completed'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {intv.status === 'completed' ? 'Completed' : 'In Progress'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                          <span className="text-slate-500 block text-[10px]">Overall Score</span>
                          <span className="font-bold text-purple-600 text-base">
                            {intv.overallScore !== null ? `${intv.overallScore}%` : '—'}
                          </span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                          <span className="text-slate-500 block text-[10px]">Questions Answered</span>
                          <span className="font-bold text-slate-800 text-base">
                            {intv.answeredCount}/{intv.questionCount}
                          </span>
                        </div>
                      </div>

                      {intv.summary && (
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed italic">
                          "{intv.summary}"
                        </p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span>{formatDate(intv.createdAt || intv.startedAt)}</span>
                      <button
                        onClick={() => handleOpenInterviewDetails(intv.id)}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-semibold transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Scorecard</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Bar */}
              {interviewHistory.pagination.totalPages > 1 && (
                <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
                  <span>
                    Page {interviewHistory.pagination.page} of {interviewHistory.pagination.totalPages} (
                    {interviewHistory.pagination.total} total)
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => fetchInterviewList(interviewHistory.pagination.page - 1)}
                      disabled={interviewHistory.pagination.page <= 1}
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 shadow-xs font-medium"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => fetchInterviewList(interviewHistory.pagination.page + 1)}
                      disabled={interviewHistory.pagination.page >= interviewHistory.pagination.totalPages}
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 shadow-xs font-medium"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* DETAIL INSPECTION MODALS */}
      {/* ========================================================================= */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center space-x-2.5">
                {activeModal.type === 'resume' && <FileText className="w-5 h-5 text-emerald-600" />}
                {activeModal.type === 'coding' && <Code2 className="w-5 h-5 text-blue-600" />}
                {activeModal.type === 'interview' && <Bot className="w-5 h-5 text-purple-600" />}
                <h3 className="font-bold text-slate-900 text-base">
                  {activeModal.type === 'resume'
                    ? `Resume Analysis: ${activeModal.data.originalFileName}`
                    : activeModal.type === 'coding'
                    ? `Coding Session #${activeModal.data.sessionId?.substring(0, 8)}`
                    : `${activeModal.data.role} Mock Interview Scorecard`}
                </h3>
              </div>
              <button
                onClick={closeModal}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-600">
              {/* RESUME DETAILS MODAL */}
              {activeModal.type === 'resume' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div>
                      <span className="text-slate-500 block">Target Role</span>
                      <span className="font-bold text-slate-900 text-sm">{activeModal.data.targetRole}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-500 block">ATS Score</span>
                      <span className="text-2xl font-extrabold text-emerald-600">
                        {activeModal.data.analysis?.atsScore !== undefined
                          ? `${activeModal.data.analysis.atsScore}/100`
                          : 'Unanalyzed'}
                      </span>
                    </div>
                  </div>

                  {activeModal.data.analysis ? (
                    <div className="space-y-4">
                      {activeModal.data.analysis.strengths?.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-emerald-700 uppercase tracking-wider text-[11px] mb-2">
                            Observed Strengths
                          </h4>
                          <ul className="space-y-1 bg-emerald-50/50 p-3 rounded-lg border border-emerald-100 text-slate-700">
                            {activeModal.data.analysis.strengths.map((s, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                                <span>{s}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {activeModal.data.analysis.issues?.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-amber-700 uppercase tracking-wider text-[11px] mb-2">
                            Improvement Opportunities
                          </h4>
                          <ul className="space-y-1 bg-amber-50/50 p-3 rounded-lg border border-amber-100 text-slate-700">
                            {activeModal.data.analysis.issues.map((iss, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
                                <span>{iss}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-slate-400 italic">This resume was uploaded without full analysis.</p>
                  )}
                </div>
              )}

              {/* CODING DETAILS MODAL */}
              {activeModal.type === 'coding' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-slate-500 block">Session Status</span>
                      <span className="font-bold text-slate-900 text-sm uppercase">
                        {activeModal.data.status || 'Active'}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-500 block">Total Problems</span>
                      <span className="font-bold text-blue-600 text-sm">
                        {activeModal.data.attempts?.length || 0}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-slate-900 uppercase tracking-wider text-[11px]">
                      Session Question Attempts
                    </h4>
                    {activeModal.data.attempts?.map((att) => (
                      <div
                        key={att.questionId}
                        className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 text-sm">
                            {att.questionId?.title || 'Coding Problem'}
                          </span>
                          <span className="font-bold text-blue-600">Score: {att.score ?? 0}/100</span>
                        </div>
                        <div className="flex items-center space-x-3 text-slate-500 text-[11px]">
                          <span>Status: <strong className="text-slate-700">{att.status}</strong></span>
                          <span>•</span>
                          <span>Result: <strong className="text-slate-700">{att.resultStatus || 'pending'}</strong></span>
                          <span>•</span>
                          <span>Tests Passed: <strong className="text-slate-700">{att.testCasesPassed}/{att.totalTestCases}</strong></span>
                        </div>
                        {att.code && (
                          <div className="mt-2">
                            <span className="text-slate-500 block text-[10px] mb-1">Submitted Source Code:</span>
                            <pre className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-100 overflow-x-auto max-h-40">
                              {att.code}
                            </pre>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* INTERVIEW DETAILS MODAL */}
              {activeModal.type === 'interview' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 block text-[10px]">Overall Score</span>
                      <span className="text-lg font-bold text-purple-600">
                        {activeModal.data.finalReport?.overallScore ?? activeModal.data.scores?.technicalKnowledge ?? 0}%
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 block text-[10px]">Technical Knowledge</span>
                      <span className="text-lg font-bold text-slate-900">
                        {activeModal.data.finalReport?.technicalKnowledge ?? activeModal.data.scores?.technicalKnowledge ?? 0}%
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 block text-[10px]">Concept Clarity</span>
                      <span className="text-lg font-bold text-slate-900">
                        {activeModal.data.finalReport?.conceptClarity ?? activeModal.data.scores?.conceptClarity ?? 0}%
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 block text-[10px]">Communication</span>
                      <span className="text-lg font-bold text-slate-900">
                        {activeModal.data.finalReport?.communication ?? activeModal.data.scores?.communication ?? 0}%
                      </span>
                    </div>
                  </div>

                  {activeModal.data.finalReport?.summary && (
                    <div className="p-4 rounded-xl bg-purple-50/40 border border-purple-100 space-y-1">
                      <span className="font-semibold text-purple-900 block text-[11px]">Interviewer Executive Summary</span>
                      <p className="text-slate-700 leading-relaxed">{activeModal.data.finalReport.summary}</p>
                    </div>
                  )}

                  {/* Question and Answers preview */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-slate-900 uppercase tracking-wider text-[11px]">
                      Interview Questions ({activeModal.data.answers?.length || 0})
                    </h4>
                    <div className="space-y-2">
                      {activeModal.data.answers?.map((ans, idx) => {
                        const q = activeModal.data.questions?.find((x) => x.questionId === ans.questionId);
                        return (
                          <div key={idx} className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200 space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-purple-700 text-xs">Q{idx + 1}: {q?.text || 'Question'}</span>
                              <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                                {ans.evaluation?.score ?? 0}/100
                              </span>
                            </div>
                            <p className="text-slate-700 bg-white p-2.5 rounded border border-slate-200 leading-relaxed">
                              {ans.answer}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50/60 flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
