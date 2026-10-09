import React, { useState, useRef } from 'react';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Briefcase,
  GraduationCap,
  Award,
  Layers,
  ArrowRight,
  Trash2,
  Loader2,
  ShieldAlert,
  Sparkles,
  RefreshCw,
  FileSearch,
  Check,
  Tag,
  AlertCircle
} from 'lucide-react';
import { analyzeResume } from '../services/resumeService';

const TARGET_ROLES = [
  'General / Any Role',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Software Developer',
  'Java Developer',
  'Python Developer',
  'Data Analyst',
];

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export const ResumeAnalyzerPage = () => {
  const [selectedRole, setSelectedRole] = useState('General / Any Role');
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [analysisData, setAnalysisData] = useState(null);

  const fileInputRef = useRef(null);

  // Format file size for clean display
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    if (bytes < k) return `${bytes} B`;
    if (bytes < k * k) return `${(bytes / k).toFixed(1)} KB`;
    return `${(bytes / (k * k)).toFixed(2)} MB`;
  };

  // Validate selected file
  const validateAndSetFile = (candidateFile) => {
    setValidationError('');
    setApiError('');

    if (!candidateFile) return;

    // Check extension and mime type
    const isPdfExt = /\.pdf$/i.test(candidateFile.name);
    const isPdfMime =
      candidateFile.type === 'application/pdf' ||
      candidateFile.type === 'application/x-pdf' ||
      candidateFile.type === ''; // Some operating systems leave mime empty on drag

    if (!isPdfExt || (!isPdfMime && candidateFile.type)) {
      setValidationError('Invalid file type. Only PDF documents (.pdf) are allowed.');
      return;
    }

    if (candidateFile.size > MAX_FILE_SIZE_BYTES) {
      setValidationError(
        `File size exceeds the 5 MB limit (${formatFileSize(candidateFile.size)}). Please choose a smaller PDF.`
      );
      return;
    }

    if (candidateFile.size === 0) {
      setValidationError('The selected file appears to be empty (0 bytes).');
      return;
    }

    setFile(candidateFile);
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setValidationError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setValidationError('Please select a PDF resume file to analyze.');
      return;
    }

    setLoading(true);
    setApiError('');

    try {
      const response = await analyzeResume({
        file,
        targetRole: selectedRole,
      });

      if (response && response.success && response.data) {
        setAnalysisData(response.data);
      } else {
        setApiError(response?.message || 'Resume analysis could not be completed. Please try again.');
      }
    } catch (err) {
      console.error('Resume analysis error:', err);
      const serverMessage =
        err.response?.data?.message || err.message || 'An unexpected error occurred during analysis.';
      setApiError(serverMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResetAll = () => {
    setAnalysisData(null);
    setFile(null);
    setValidationError('');
    setApiError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const analysis = analysisData?.analysis;

  // Determine score color badge
  const getScoreColor = (score) => {
    if (score >= 75) {
      return {
        bg: 'bg-emerald-50/70',
        border: 'border-emerald-200',
        text: 'text-emerald-700',
        badge: 'High ATS Compatibility',
      };
    }
    if (score >= 50) {
      return {
        bg: 'bg-amber-50/70',
        border: 'border-amber-200',
        text: 'text-amber-700',
        badge: 'Moderate ATS Compatibility',
      };
    }
    return {
      bg: 'bg-rose-50/70',
      border: 'border-rose-200',
      text: 'text-rose-700',
      badge: 'Action Required',
    };
  };

  const scoreStyle = analysis ? getScoreColor(analysis.atsScore) : null;

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 w-full space-y-8 overflow-x-hidden">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 border border-indigo-200 text-indigo-700 shadow-xs">
          <FileText className="w-3.5 h-3.5" />
          <span>Module 01 • Resume Optimization</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Resume Analyzer
        </h1>
        <p className="text-base sm:text-lg text-slate-600 font-normal max-w-3xl">
          Analyze your resume for ATS compatibility and get actionable improvement suggestions.
        </p>
      </div>

      {/* Main Form & Upload Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Target Role Dropdown */}
          <div className="space-y-2 md:col-span-1">
            <label
              htmlFor="target-role-select"
              className="block text-sm font-semibold text-slate-700"
            >
              Target Role (Optional)
            </label>
            <p className="text-xs text-slate-500">
              Tailors keyword matching and evaluation criteria to your target placement profile.
            </p>
            <div className="relative pt-1">
              <select
                id="target-role-select"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                disabled={loading}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
              >
                {TARGET_ROLES.map((role) => (
                  <option key={role} value={role} className="bg-white text-slate-800">
                    {role}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* PDF Upload Drop Zone */}
          <div className="space-y-2 md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700">
              Resume Document (PDF)
            </label>
            <p className="text-xs text-slate-500">
              Upload your resume in PDF format (maximum 5 MB).
            </p>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => {
                if (!file && fileInputRef.current) {
                  fileInputRef.current.click();
                }
              }}
              className={`relative rounded-2xl border-2 border-dashed p-6 transition-all duration-200 flex flex-col items-center justify-center text-center cursor-pointer ${
                dragActive
                  ? 'border-indigo-500 bg-indigo-50/50'
                  : file
                  ? 'border-indigo-300 bg-indigo-50/20'
                  : 'border-slate-300 hover:border-slate-400 bg-slate-50/60'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                disabled={loading}
                className="hidden"
                id="resume-file-input"
              />

              {!file ? (
                <div className="space-y-3 py-4">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-xs">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-800">
                      Drag and drop your PDF resume here, or{' '}
                      <span className="text-indigo-600 font-semibold hover:underline">browse files</span>
                    </p>
                    <p className="text-xs text-slate-500">Supports PDF format only • Maximum 5 MB</p>
                  </div>
                </div>
              ) : (
                <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 p-2">
                  <div className="flex items-center space-x-3 text-left">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 flex-shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 break-all">{file.name}</p>
                      <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (fileInputRef.current) fileInputRef.current.click();
                      }}
                      disabled={loading}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs text-slate-700 font-medium transition-colors shadow-xs"
                    >
                      Replace File
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFile();
                      }}
                      disabled={loading}
                      className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors"
                      title="Remove file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Validation Errors & API Error Displays */}
        {validationError && (
          <div className="flex items-start space-x-3 p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 text-xs sm:text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600 mt-0.5" />
            <span className="font-medium">{validationError}</span>
          </div>
        )}

        {apiError && (
          <div className="flex items-start space-x-3 p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 text-xs sm:text-sm">
            <XCircle className="w-5 h-5 flex-shrink-0 text-rose-600 mt-0.5" />
            <div>
              <p className="font-semibold text-rose-900">Analysis Error</p>
              <p className="mt-0.5">{apiError}</p>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Selected target role:{' '}
            <span className="font-semibold text-slate-800">{selectedRole}</span>
          </p>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {analysisData && (
              <button
                type="button"
                onClick={handleResetAll}
                disabled={loading}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-all inline-flex items-center justify-center space-x-2 shadow-xs"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Upload Another Resume</span>
              </button>
            )}

            <button
              type="button"
              id="analyze-resume-button"
              onClick={handleAnalyze}
              disabled={!file || loading}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all inline-flex items-center justify-center space-x-2 ${
                !file || loading
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-600'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Analyzing Resume...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Resume</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Initial State Prompt (when no analysis has been performed yet) */}
      {!analysisData && !loading && (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 text-center space-y-4 shadow-xs">
          <div className="w-14 h-14 mx-auto rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
            <FileSearch className="w-7 h-7" />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Upload your resume to see your ATS analysis
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Our evaluation engine checks keywords against entry-level placement standards, action verbs, section formats, and quantifiable impacts.
            </p>
          </div>
        </div>
      )}

      {/* Analysis Results View */}
      {analysis && (
        <div className="space-y-8 animate-fadeIn">
          {/* Section 1: ATS Score Banner */}
          <div
            className={`rounded-2xl border ${scoreStyle.border} ${scoreStyle.bg} p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6`}
          >
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-slate-200 text-slate-700 shadow-xs">
                <span>Target: {analysisData.targetRole || selectedRole}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Estimated ATS Compatibility Score
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
                Calculated by parsing section completeness, technical keyword matches for {analysisData.targetRole || selectedRole}, dynamic action verbs, quantifiable achievements, and contact visibility.
              </p>
            </div>

            <div className="flex items-center space-x-4 self-center md:self-auto bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs">
              <div className="text-center">
                <span className={`text-4xl sm:text-5xl font-black ${scoreStyle.text}`}>
                  {analysis.atsScore}
                </span>
                <span className="text-slate-400 text-lg font-bold"> / 100</span>
                <p className={`text-xs font-semibold mt-1 ${scoreStyle.text}`}>
                  {scoreStyle.badge}
                </p>
              </div>
            </div>
          </div>

          {/* Section 2 & 3: Strengths and Issues Side-by-Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4 shadow-xs">
              <div className="flex items-center space-x-2 text-emerald-600">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <h3 className="text-lg font-bold text-slate-900">Strengths</h3>
              </div>
              {analysis.strengths && analysis.strengths.length > 0 ? (
                <ul className="space-y-2.5">
                  {analysis.strengths.map((str, idx) => (
                    <li
                      key={idx}
                      className="flex items-start space-x-2.5 text-xs sm:text-sm text-slate-700"
                    >
                      <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-500">No specific strengths identified.</p>
              )}
            </div>

            {/* Issues */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4 shadow-xs">
              <div className="flex items-center space-x-2 text-amber-600">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <h3 className="text-lg font-bold text-slate-900">Issues to Address</h3>
              </div>
              {analysis.issues && analysis.issues.length > 0 ? (
                <ul className="space-y-2.5">
                  {analysis.issues.map((iss, idx) => (
                    <li
                      key={idx}
                      className="flex items-start space-x-2.5 text-xs sm:text-sm text-slate-700"
                    >
                      <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <span>{iss}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-500">No critical issues detected.</p>
              )}
            </div>
          </div>

          {/* Section 4: Missing Keywords */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4 shadow-xs">
            <div className="flex items-center space-x-2 text-indigo-600">
              <Tag className="w-5 h-5" />
              <h3 className="text-lg font-bold text-slate-900">
                Missing Keywords ({analysisData.targetRole || selectedRole})
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              These placement-critical keywords for your selected target role were not detected in your resume text.
            </p>
            {analysis.missingKeywords && analysis.missingKeywords.length > 0 ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {analysis.missingKeywords.map((kw, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-rose-50 border border-rose-200 text-rose-700"
                  >
                    + {kw}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-emerald-700 font-medium">
                Great job! All high-priority keywords for this role were found in your resume.
              </p>
            )}
          </div>

          {/* Section 5: Skills Analysis */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4 shadow-xs">
            <div className="flex items-center space-x-2 text-indigo-600">
              <Layers className="w-5 h-5" />
              <h3 className="text-lg font-bold text-slate-900">Skills Analysis</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* Technical */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <p className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                  Technical Skills ({analysis.skillAnalysis?.categorized?.technical?.length || 0})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.skillAnalysis?.categorized?.technical?.length > 0 ? (
                    analysis.skillAnalysis.categorized.technical.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md text-[11px] bg-white border border-slate-200 text-slate-700 font-medium"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500">None detected</span>
                  )}
                </div>
              </div>

              {/* Tools & Frameworks */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <p className="text-xs font-semibold text-cyan-700 uppercase tracking-wider">
                  Tools & Platforms ({analysis.skillAnalysis?.categorized?.tools?.length || 0})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.skillAnalysis?.categorized?.tools?.length > 0 ? (
                    analysis.skillAnalysis.categorized.tools.map((tool, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md text-[11px] bg-white border border-slate-200 text-slate-700 font-medium"
                      >
                        {tool}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500">None detected</span>
                  )}
                </div>
              </div>

              {/* Soft Skills */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                  Professional / Soft Skills ({analysis.skillAnalysis?.categorized?.soft?.length || 0})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.skillAnalysis?.categorized?.soft?.length > 0 ? (
                    analysis.skillAnalysis.categorized.soft.map((soft, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md text-[11px] bg-white border border-slate-200 text-slate-700 font-medium"
                      >
                        {soft}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500">None detected</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 6, 7, 8, 9: Sections Deep Dive in 2x2 Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Projects Analysis */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3 shadow-xs">
              <div className="flex items-center space-x-2 text-indigo-600">
                <Briefcase className="w-5 h-5" />
                <h3 className="text-lg font-bold text-slate-900">Projects Analysis</h3>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
                  Estimated Projects: <strong className="text-slate-900">{analysis.projectAnalysis?.count || 0}</strong>
                </span>
                <span
                  className={`px-2.5 py-1 rounded-lg border text-xs font-medium ${
                    analysis.projectAnalysis?.hasMetrics
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      : 'bg-amber-50 border-amber-200 text-amber-700'
                  }`}
                >
                  {analysis.projectAnalysis?.hasMetrics ? 'Metrics Included' : 'Missing Metrics'}
                </span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {analysis.projectAnalysis?.feedback?.map((fb, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-indigo-600">•</span>
                    <span>{fb}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Education Analysis */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3 shadow-xs">
              <div className="flex items-center space-x-2 text-indigo-600">
                <GraduationCap className="w-5 h-5" />
                <h3 className="text-lg font-bold text-slate-900">Education Analysis</h3>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span
                  className={`px-2.5 py-1 rounded-lg border text-xs font-medium ${
                    analysis.educationAnalysis?.found
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      : 'bg-rose-50 border-rose-200 text-rose-700'
                  }`}
                >
                  {analysis.educationAnalysis?.found ? 'Education Detected' : 'Section Missing'}
                </span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {analysis.educationAnalysis?.feedback?.map((fb, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-indigo-600">•</span>
                    <span>{fb}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Experience Analysis */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3 shadow-xs">
              <div className="flex items-center space-x-2 text-indigo-600">
                <Briefcase className="w-5 h-5" />
                <h3 className="text-lg font-bold text-slate-900">Experience & Internships</h3>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span
                  className={`px-2.5 py-1 rounded-lg border text-xs font-medium ${
                    analysis.experienceAnalysis?.hasExperience
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      : 'bg-amber-50 border-amber-200 text-amber-700'
                  }`}
                >
                  {analysis.experienceAnalysis?.hasExperience ? 'Experience Found' : 'No Work Section'}
                </span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {analysis.experienceAnalysis?.feedback?.map((fb, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-indigo-600">•</span>
                    <span>{fb}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Certifications Analysis */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3 shadow-xs">
              <div className="flex items-center space-x-2 text-indigo-600">
                <Award className="w-5 h-5" />
                <h3 className="text-lg font-bold text-slate-900">Certifications & Credentials</h3>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span
                  className={`px-2.5 py-1 rounded-lg border text-xs font-medium ${
                    analysis.certificationAnalysis?.found
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      : 'bg-slate-100 border-slate-200 text-slate-600'
                  }`}
                >
                  {analysis.certificationAnalysis?.found
                    ? `${analysis.certificationAnalysis?.count || 1} Credentials Recognized`
                    : 'No Certifications Detected'}
                </span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {analysis.certificationAnalysis?.feedback?.map((fb, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-indigo-600">•</span>
                    <span>{fb}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Section 10, 11, 12: Formatting, Grammar, Unnecessary Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Formatting */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-600" />
                Formatting Issues
              </h3>
              {analysis.formattingIssues && analysis.formattingIssues.length > 0 ? (
                <ul className="space-y-2 text-xs text-slate-700">
                  {analysis.formattingIssues.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-amber-800">
                      <span>•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-emerald-700 font-medium">No formatting issues detected.</p>
              )}
            </div>

            {/* Grammar / Wording */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                Grammar & Wording
              </h3>
              {analysis.grammarIssues && analysis.grammarIssues.length > 0 ? (
                <ul className="space-y-2 text-xs text-slate-700">
                  {analysis.grammarIssues.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-amber-800">
                      <span>•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-emerald-700 font-medium">Clean phrasing and appropriate third-person tone.</p>
              )}
            </div>

            {/* Unnecessary Information */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                Unnecessary Content
              </h3>
              {analysis.unnecessaryInformation && analysis.unnecessaryInformation.length > 0 ? (
                <ul className="space-y-2 text-xs text-slate-700">
                  {analysis.unnecessaryInformation.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-rose-800">
                      <span>•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-emerald-700 font-medium">No outdated or unnecessary details found.</p>
              )}
            </div>
          </div>

          {/* Section 13: Bullet Point Improvements */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                Bullet Point Improvements
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Action-oriented, quantified before-and-after suggestions derived from your resume content.
              </p>
            </div>

            <div className="space-y-4">
              {analysis.bulletPointSuggestions && analysis.bulletPointSuggestions.length > 0 ? (
                analysis.bulletPointSuggestions.map((suggestion, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3"
                  >
                    <div className="space-y-1">
                      <span className="text-[11px] font-semibold text-rose-700 uppercase tracking-wider">
                        Original Bullet Point
                      </span>
                      <p className="text-xs sm:text-sm text-slate-700 bg-white p-3 rounded-lg border border-slate-200 italic">
                        "{suggestion.original}"
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Recommended ATS-Optimized Version
                      </span>
                      <p className="text-xs sm:text-sm text-emerald-950 bg-emerald-50/80 p-3 rounded-lg border border-emerald-200 font-medium">
                        "{suggestion.improved}"
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 pt-1">
                      <strong className="text-slate-800">Why this is better:</strong>{' '}
                      {suggestion.reason}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500">No bullet point rewrites generated.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeAnalyzerPage;
