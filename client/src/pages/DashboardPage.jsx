import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  LogOut, 
  Layers, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Terminal,
  RefreshCw,
  Loader2,
  BarChart3,
  FileText,
  Code2,
  Bot,
  ArrowRight,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { PLATFORM_MODULES } from '../utils/constants';
import ModuleCard from '../components/ModuleCard';
import { useAuth } from '../context/AuthContext';
import { useHealthCheck } from '../hooks/useHealthCheck';
import { getAnalyticsOverview } from '../services/analyticsService';

export const DashboardPage = () => {
  const { currentUser, logout } = useAuth();
  const { status, refetch } = useHealthCheck();

  const [analytics, setAnalytics] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);
  const [analyticsError, setAnalyticsError] = useState('');

  const userName = currentUser?.name || 'Candidate';
  const userEmail = currentUser?.email || '—';

  useEffect(() => {
    let isMounted = true;
    const fetchAnalytics = async () => {
      setLoadingAnalytics(true);
      setAnalyticsError('');
      try {
        const res = await getAnalyticsOverview();
        if (isMounted && res.success) {
          setAnalytics(res.data);
        }
      } catch (err) {
        if (isMounted) {
          setAnalyticsError('Could not load analytics summary.');
        }
      } finally {
        if (isMounted) {
          setLoadingAnalytics(false);
        }
      }
    };

    fetchAnalytics();
    return () => {
      isMounted = false;
    };
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 w-full space-y-8 overflow-x-hidden">
      {/* Welcome & Profile Header Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 md:p-10 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 border border-indigo-200 text-indigo-700 shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Campus Placement Preparation Portal</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
              Welcome back, <span className="text-indigo-600">{userName}</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 font-normal">
              Prepare smarter. Practice better. Get placement ready.
            </p>

            <div className="flex flex-wrap items-center gap-2.5 pt-2 text-xs text-slate-600">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 font-medium">
                <User className="w-3.5 h-3.5 text-indigo-600" />
                <span>{userName}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 font-medium">
                <Mail className="w-3.5 h-3.5 text-indigo-600" />
                <span>{userEmail}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Authenticated Candidate</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start md:self-center">
            <button
              onClick={logout}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition-all shadow-xs focus-visible:ring-2 focus-visible:ring-rose-500"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* History & Analytics Live Summary Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              Placement Performance & Activity
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Real-time metrics computed directly from your verified activity records.
            </p>
          </div>

          <Link
            to="/history"
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-all shadow-xs focus-visible:ring-2 focus-visible:ring-indigo-600 self-start sm:self-center"
          >
            <span>View Detailed Reports</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loadingAnalytics ? (
          <div className="py-8 flex items-center justify-center text-slate-500 text-xs gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
            <span>Loading your performance summary...</span>
          </div>
        ) : analyticsError ? (
          <div className="py-4 text-xs text-slate-500 italic">{analyticsError}</div>
        ) : analytics ? (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                <span className="text-xs font-medium text-slate-500 block mb-1">Resume Analyses</span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-bold text-slate-900">
                    {analytics.overview.totalResumesAnalyzed}
                  </span>
                  <span className="text-xs text-slate-500">completed</span>
                </div>
                <div className="mt-2 text-xs font-semibold text-emerald-700">
                  {analytics.overview.averageAtsScore !== null
                    ? `Avg ATS: ${analytics.overview.averageAtsScore}/100`
                    : 'No ATS score yet'}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                <span className="text-xs font-medium text-slate-500 block mb-1">Coding Submissions</span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-bold text-slate-900">
                    {analytics.overview.completedCodingAttempts}
                  </span>
                  <span className="text-xs text-slate-500">questions</span>
                </div>
                <div className="mt-2 text-xs font-semibold text-blue-700">
                  {analytics.overview.averageCodingScore !== null
                    ? `Avg Score: ${analytics.overview.averageCodingScore}%`
                    : 'No submissions yet'}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                <span className="text-xs font-medium text-slate-500 block mb-1">Mock Interviews</span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-bold text-slate-900">
                    {analytics.overview.completedInterviews}
                  </span>
                  <span className="text-xs text-slate-500">completed</span>
                </div>
                <div className="mt-2 text-xs font-semibold text-purple-700">
                  {analytics.overview.averageInterviewScore !== null
                    ? `Avg Score: ${analytics.overview.averageInterviewScore}%`
                    : 'No completed interviews'}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                <span className="text-xs font-medium text-slate-500 block mb-1">Placement Readiness</span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-bold text-indigo-600">
                    {analytics.overview.overallReadinessScore !== null
                      ? `${analytics.overview.overallReadinessScore}%`
                      : '—'}
                  </span>
                </div>
                <div className="mt-2 text-xs text-slate-500">
                  {analytics.overview.overallReadinessScore !== null
                    ? 'Aggregate performance'
                    : 'Awaiting module activity'}
                </div>
              </div>
            </div>

            {/* Recent Activity Snippet */}
            {analytics.recentActivity.length > 0 && (
              <div className="pt-2">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Recent Activity</span>
                </div>
                <div className="space-y-2">
                  {analytics.recentActivity.slice(0, 3).map((act, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center space-x-2.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            act.module === 'resume'
                              ? 'bg-emerald-500'
                              : act.module === 'coding'
                              ? 'bg-blue-500'
                              : 'bg-purple-500'
                          }`}
                        />
                        <span className="font-semibold text-slate-800">{act.title}</span>
                        <span className="text-slate-500 hidden sm:inline">• {act.subtitle}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-500">
                        {act.score !== null && (
                          <span className="font-bold text-slate-700">Score: {act.score}</span>
                        )}
                        <span>{formatDate(act.timestamp)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Module Overview Section Header */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            Three Independent Preparation Modules
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            Select a module to view its workflow
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
          Each module operates independently to prepare you for every stage of your college campus placement process.
        </p>
      </div>

      {/* Three Major Module Cards in Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PLATFORM_MODULES.map((module) => (
          <ModuleCard key={module.id} module={module} />
        ))}
      </div>

      {/* Backend Health Probe Footnote */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-600 shadow-xs">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-indigo-600" />
          <span className="font-medium text-slate-700">System Status:</span>
          <span className="text-slate-600">
            {status === 'connected' ? 'API Server Online (200 OK)' : status === 'loading' ? 'Checking API...' : 'API Offline'}
          </span>
        </div>
        <button
          onClick={() => refetch()}
          className="inline-flex items-center space-x-1.5 text-indigo-600 hover:text-indigo-700 transition-colors font-medium focus-visible:ring-2 focus-visible:ring-indigo-600 rounded"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Re-probe System</span>
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;
