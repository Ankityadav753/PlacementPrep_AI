import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Layers, ShieldCheck, Clock } from 'lucide-react';

export const ModulePlaceholderPage = ({ title, moduleNumber, description }) => {
  return (
    <div className="flex-1 max-w-4xl mx-auto px-4 py-16 w-full flex flex-col items-center justify-center text-center">
      <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 mb-6 shadow-xs">
        <Layers className="w-7 h-7" />
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 mb-4">
        <Clock className="w-3.5 h-3.5" />
        Module {moduleNumber} • Platform Foundation Active
      </div>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
        {title}
      </h1>

      <p className="text-slate-600 max-w-xl text-base leading-relaxed mb-8">
        {description}
      </p>

      <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs text-slate-500 max-w-md w-full mb-8 shadow-xs">
        <div className="flex items-center justify-center gap-2 text-indigo-700 font-semibold mb-1">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Protected Route Active
        </div>
        Feature implementation for this module is scheduled in subsequent project phases.
      </div>

      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold border border-slate-200 shadow-xs transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>
    </div>
  );
};

export default ModulePlaceholderPage;
