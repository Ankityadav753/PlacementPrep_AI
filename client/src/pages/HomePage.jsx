import React from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Terminal, 
  Server, 
  Cpu, 
  Database, 
  Layers, 
  Code2, 
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { PLATFORM_MODULES } from '../utils/constants';
import ModuleCard from '../components/ModuleCard';
import { useHealthCheck } from '../hooks/useHealthCheck';

export const HomePage = () => {
  const { status, data, error, refetch } = useHealthCheck();

  return (
    <div className="flex-1 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24 border-b border-slate-200 bg-gradient-to-b from-indigo-50/50 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-6 tracking-wide shadow-xs">
              <span className="w-2 h-2 rounded-full bg-indigo-600" />
              Comprehensive Placement Preparation Platform
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              PlacementPrep<span className="text-indigo-600">_AI</span>
            </h1>

            <p className="mt-5 text-lg sm:text-xl text-slate-600 font-normal leading-relaxed">
              A comprehensive placement preparation platform engineered for college freshers. 
              Built on a decoupled, modular full-stack architecture with three dedicated practice modules.
            </p>

            {/* Architecture Stack Badges */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-xs font-medium text-slate-600">
              <span className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 shadow-xs flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-cyan-600" /> React 18 + Vite
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 shadow-xs flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-indigo-600" /> Express.js API
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 shadow-xs flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-emerald-600" /> MongoDB / Mongoose
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 shadow-xs flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-purple-600" /> Tailwind CSS
              </span>
            </div>
          </div>

          {/* Backend Connectivity Status Box */}
          <div className="mt-12 max-w-2xl mx-auto">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700 tracking-wider uppercase">
                  <Terminal className="w-4 h-4 text-indigo-600" />
                  <span>Backend Health Probe (GET /api/health)</span>
                </div>
                <button
                  onClick={() => refetch()}
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold underline underline-offset-4 focus-visible:ring-2 focus-visible:ring-indigo-600 rounded"
                >
                  Re-test
                </button>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  {status === 'loading' && (
                    <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
                      <Loader2 className="w-5 h-5 animate-spin" />
                    </div>
                  )}
                  {status === 'connected' && (
                    <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  )}
                  {status === 'error' && (
                    <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                  )}

                  <div>
                    <div className="text-sm font-semibold text-slate-900">
                      {status === 'loading' && 'Checking backend status...'}
                      {status === 'connected' && 'Backend Connected & Healthy'}
                      {status === 'error' && 'Backend Disconnected'}
                    </div>
                    <div className="text-xs text-slate-500">
                      {status === 'loading' && 'Sending ping to GET /api/health...'}
                      {status === 'connected' && (
                        <span>Response: <code className="text-emerald-700 font-mono font-medium">{JSON.stringify(data)}</code></span>
                      )}
                      {status === 'error' && (
                        <span className="text-rose-600">Verify backend is running on port 5000</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono font-medium ${
                    status === 'connected' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    status === 'loading' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {status === 'connected' ? '200 OK' : status === 'loading' ? 'PENDING' : 'ERR_CONN'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modules Roadmap Section */}
      <section className="py-16 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Three Separate Core Modules
            </h2>
            <p className="mt-2 text-sm text-slate-600 max-w-2xl">
              PlacementPrep_AI architecture is engineered into three completely independent domains, 
              ensuring clear boundaries and clean scalability.
            </p>
          </div>
          <div className="mt-4 md:mt-0 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-lg w-fit">
            Architecture Blueprint Active
          </div>
        </div>

        {/* 3 Modules Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {PLATFORM_MODULES.map((module, idx) => (
            <ModuleCard key={module.id} module={module} index={idx} />
          ))}
        </div>
      </section>

      {/* Architecture Matrix / API Foundation Specs */}
      <section className="py-12 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-base font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            Backend API Foundation & Modular Route Endpoints
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-xs font-mono font-semibold text-indigo-600">/api/auth</div>
              <div className="text-sm font-semibold text-slate-800 mt-1">Authentication</div>
              <div className="text-xs text-slate-500 mt-1">JWT auth, user accounts & sessions</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-xs font-mono font-semibold text-indigo-600">/api/resume</div>
              <div className="text-sm font-semibold text-slate-800 mt-1">Resume Analyzer</div>
              <div className="text-xs text-slate-500 mt-1">Parsing, ATS scoring & keyword audit</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-xs font-mono font-semibold text-indigo-600">/api/coding</div>
              <div className="text-sm font-semibold text-slate-800 mt-1">Coding Round</div>
              <div className="text-xs text-slate-500 mt-1">DSA challenges & code execution</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-xs font-mono font-semibold text-indigo-600">/api/interview</div>
              <div className="text-sm font-semibold text-slate-800 mt-1">AI Mock Interview</div>
              <div className="text-xs text-slate-500 mt-1">Technical & HR simulation sessions</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
