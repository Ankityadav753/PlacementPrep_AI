import React, { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  Layers, 
  RefreshCw, 
  LogOut, 
  User, 
  LogIn, 
  UserPlus, 
  Menu, 
  X,
  FileText,
  Code2,
  Bot,
  LayoutDashboard,
  BarChart3,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useHealthCheck } from '../hooks/useHealthCheck';

export const Navbar = () => {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const { status, refetch } = useHealthCheck();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    setMobileMenuOpen(false);
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Resume Analyzer', path: '/resume-analyzer', icon: FileText },
    { name: 'Coding Round', path: '/coding-round', icon: Code2 },
    { name: 'AI Mock Interview', path: '/mock-interview', icon: Bot },
    { name: 'History & Analytics', path: '/history', icon: BarChart3 },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/95 border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link
            to={isAuthenticated ? "/dashboard" : "/"}
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-3 group flex-shrink-0 focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-xl"
            aria-label="PlacementPrep AI Home"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-600/20 group-hover:bg-indigo-700 transition-colors">
              <Layers className="w-5 h-5 text-white group-hover:scale-105 transition-transform duration-200" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-1">
                PlacementPrep<span className="text-indigo-600 font-extrabold">_AI</span>
              </span>
              <span className="block text-[10px] text-slate-500 font-medium tracking-wider uppercase">
                {isAuthenticated ? 'Candidate Portal' : 'Placement Platform'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 text-sm font-medium" aria-label="Main Navigation">
            {isAuthenticated ? (
              navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all focus-visible:ring-2 focus-visible:ring-indigo-600 ${
                      active
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/90 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-transparent'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{link.name}</span>
                  </Link>
                );
              })
            ) : (
              <span className="text-xs text-slate-500 font-medium">
                Campus Placement Preparation Suite
              </span>
            )}
          </nav>

          {/* Right Actions */}
          <div className="hidden sm:flex items-center space-x-3">
            {/* Backend Status indicator */}
            <button
              onClick={() => refetch()}
              title="Click to re-check backend status"
              aria-label={`Backend status: ${status}. Click to refresh`}
              className="flex items-center space-x-2 px-2.5 py-1.5 rounded-full border text-xs font-medium transition-all duration-200 bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 focus-visible:ring-2 focus-visible:ring-indigo-600"
            >
              <span className="relative flex h-2 w-2">
                {status === 'connected' && (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </>
                )}
                {status === 'loading' && (
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400 animate-pulse"></span>
                )}
                {status === 'error' && (
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                )}
              </span>
              <span className="text-slate-600 text-[11px] font-medium">
                {status === 'connected' && 'Online'}
                {status === 'loading' && 'Checking...'}
                {status === 'error' && 'Offline'}
              </span>
              <RefreshCw className="w-2.5 h-2.5 text-slate-400 hover:text-slate-600" />
            </button>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100/90 border border-slate-200 text-xs font-medium text-slate-800">
                  <User className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="max-w-[130px] truncate">{currentUser?.name || 'Candidate'}</span>
                </span>
                <button
                  onClick={handleLogout}
                  title="Log out of session"
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all focus-visible:ring-2 focus-visible:ring-rose-500"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs transition-all focus-visible:ring-2 focus-visible:ring-indigo-600"
                >
                  <LogIn className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-xs shadow-indigo-600/20 focus-visible:ring-2 focus-visible:ring-indigo-600"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-indigo-600"
              aria-label="Toggle mobile menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer / Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-150">
          {isAuthenticated ? (
            <>
              {/* Mobile Candidate Profile Card */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{currentUser?.name || 'Candidate'}</div>
                    <div className="text-[11px] text-slate-500">{currentUser?.email || ''}</div>
                  </div>
                </div>
                <button
                  onClick={() => refetch()}
                  className="text-[11px] text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                >
                  <span>{status === 'connected' ? 'API Online' : 'Check API'}</span>
                </button>
              </div>

              {/* Mobile Navigation Links */}
              <div className="space-y-1 pt-1" role="menu">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const active = isActive(link.path);
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        active
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{link.name}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Mobile Logout Button */}
              <div className="pt-2 border-t border-slate-200">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-2 pt-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200"
              >
                <LogIn className="w-4 h-4 text-indigo-600" />
                <span>Sign In</span>
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm"
              >
                <UserPlus className="w-4 h-4" />
                <span>Create Account</span>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
