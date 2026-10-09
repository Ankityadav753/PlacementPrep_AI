import React from 'react';
import { Layers } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-slate-600 text-xs sm:text-sm">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span className="font-semibold text-slate-900">PlacementPrep_AI</span>
            <span className="text-slate-300">•</span>
            <span>Comprehensive placement preparation platform for college freshers</span>
          </div>
          <div className="text-xs text-slate-500">
            Professional AI Preparation Suite • Secure & Reliable
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
