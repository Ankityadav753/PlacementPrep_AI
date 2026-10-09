import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Clock, ShieldCheck } from 'lucide-react';

export const ModuleLandingLayout = ({
  icon: Icon,
  badgeText,
  title,
  tagline,
  description,
  preparationSteps,
  accentColor = 'indigo',
}) => {
  const accentStyles = {
    indigo: {
      iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-200',
      badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      cardBorder: 'border-slate-200',
      stepIcon: 'text-indigo-600',
    },
    emerald: {
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      cardBorder: 'border-slate-200',
      stepIcon: 'text-emerald-600',
    },
    purple: {
      iconBg: 'bg-purple-50 text-purple-600 border-purple-200',
      badge: 'bg-purple-50 text-purple-700 border-purple-200',
      cardBorder: 'border-slate-200',
      stepIcon: 'text-purple-600',
    },
  }[accentColor] || {
    iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    cardBorder: 'border-slate-200',
    stepIcon: 'text-indigo-600',
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex flex-col justify-center">
      {/* Top back navigation */}
      <div className="mb-6">
        <Link
          to="/dashboard"
          className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-600 rounded"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Dashboard
        </Link>
      </div>

      {/* Main Container Card */}
      <div className={`rounded-2xl border ${accentStyles.cardBorder} bg-white p-8 sm:p-12 shadow-xs text-center flex flex-col items-center`}>
        {/* Module Icon */}
        <div className={`w-16 h-16 rounded-2xl border ${accentStyles.iconBg} flex items-center justify-center mb-6 shadow-xs`}>
          {Icon && <Icon className="w-8 h-8" />}
        </div>

        {/* Badge */}
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${accentStyles.badge} mb-4`}>
          <Clock className="w-3.5 h-3.5" />
          <span>{badgeText || 'Module Foundation Active'}</span>
        </div>

        {/* Title & Tagline */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
          {title}
        </h1>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">
          {tagline}
        </p>

        {/* Short Description */}
        <p className="text-base text-slate-600 max-w-2xl leading-relaxed mb-8">
          {description}
        </p>

        {/* Coming Next & Preparation Roadmap */}
        <div className="w-full max-w-xl bg-slate-50 rounded-xl border border-slate-200 p-6 text-left mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-700 pb-3 border-b border-slate-200 mb-4">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Upcoming Implementation Roadmap</span>
          </div>

          <div className="space-y-3">
            {preparationSteps && preparationSteps.map((step, index) => (
              <div key={index} className="flex items-start text-xs sm:text-sm text-slate-700">
                <CheckCircle2 className={`w-4 h-4 mr-3 mt-0.5 flex-shrink-0 ${accentStyles.stepIcon}`} />
                <span>{step}</span>
              </div>
            ))}
          </div>

          <p className="mt-4 pt-4 border-t border-slate-200 text-[11px] text-slate-500">
            Note: Feature implementation for this module is scheduled in the upcoming dedicated step. The architectural route and session integration are verified.
          </p>
        </div>

        {/* Bottom CTA */}
        <Link
          to="/dashboard"
          className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold transition-all border border-slate-200"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default ModuleLandingLayout;
