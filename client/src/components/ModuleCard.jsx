import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Code2, Bot, ArrowRight, ShieldCheck, Check } from 'lucide-react';

const iconMap = {
  FileText,
  Code2,
  Bot,
};

export const ModuleCard = ({ module }) => {
  const navigate = useNavigate();
  const IconComponent = iconMap[module.icon] || FileText;

  const handleNavigate = () => {
    navigate(module.route);
  };

  const accentStyles = {
    indigo: {
      border: 'border-slate-200 hover:border-indigo-300',
      icon: 'bg-indigo-50 text-indigo-600 border-indigo-200',
      badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      btn: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs',
      check: 'text-indigo-600',
    },
    emerald: {
      border: 'border-slate-200 hover:border-emerald-300',
      icon: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      btn: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs',
      check: 'text-emerald-600',
    },
    purple: {
      border: 'border-slate-200 hover:border-purple-300',
      icon: 'bg-purple-50 text-purple-600 border-purple-200',
      badge: 'bg-purple-50 text-purple-700 border-purple-200',
      btn: 'bg-purple-600 hover:bg-purple-700 text-white shadow-xs',
      check: 'text-purple-600',
    },
  }[module.accentColor] || {
    border: 'border-slate-200 hover:border-indigo-300',
    icon: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    btn: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs',
    check: 'text-indigo-600',
  };

  return (
    <div
      onClick={handleNavigate}
      className={`group cursor-pointer rounded-2xl border bg-white p-6 sm:p-7 transition-all duration-200 flex flex-col justify-between hover:-translate-y-0.5 shadow-xs hover:shadow-md ${accentStyles.border}`}
    >
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between mb-5">
          <div className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-transform group-hover:scale-105 duration-200 ${accentStyles.icon}`}>
            <IconComponent className="w-6 h-6" />
          </div>
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${accentStyles.badge}`}>
            {module.badge}
          </span>
        </div>

        {/* Title & Tagline */}
        <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-1">
          {module.name}
        </h3>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3.5">
          {module.tagline}
        </p>

        {/* Description */}
        <p className="text-sm text-slate-600 leading-relaxed mb-5">
          {module.description}
        </p>

        {/* Key capabilities preview list */}
        {module.features && module.features.length > 0 && (
          <ul className="space-y-2 mb-6 border-t border-slate-100 pt-4">
            {module.features.map((feature, i) => (
              <li key={i} className="flex items-start text-xs text-slate-600">
                <Check className={`w-3.5 h-3.5 ${accentStyles.check} mr-2 mt-0.5 flex-shrink-0`} />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Button & Navigation */}
      <div className="pt-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleNavigate();
          }}
          className={`w-full flex items-center justify-center py-2.5 px-4 rounded-xl text-sm font-semibold transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-600 ${accentStyles.btn}`}
        >
          <span>{module.buttonText}</span>
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default ModuleCard;
