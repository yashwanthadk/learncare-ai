import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  GraduationCap,
  Calendar,
  UserCheck,
  ChevronDown,
  Menu,
  X,
  Bell,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    currentView,
    setCurrentView,
    openBookingModal,
    switchUser,
    unreadNotifCount,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [personaDropdownOpen, setPersonaDropdownOpen] = useState(false);

  const personas = [
    { id: 'user-std-1', label: 'Sarah Lin (Student)', role: 'student' },
    { id: 'user-std-2', label: 'Dev Patel (Student - Risk Alert)', role: 'student' },
    { id: 'user-edu-1', label: 'Prof. Elena Rostova (Educator - Math)', role: 'educator' },
    { id: 'user-edu-2', label: 'Dr. Marcus Vance (Educator - CS)', role: 'educator' },
    { id: 'user-adm-1', label: 'Eleanor Ward (Admin)', role: 'admin' },
  ];

  const handleNavClick = (view: string) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getDashboardViewForRole = (role?: string) => {
    if (role === 'educator') return 'educator-dashboard';
    if (role === 'admin') return 'admin-dashboard';
    return 'student-dashboard';
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 text-left text-slate-900 focus:outline-none whitespace-nowrap shrink-0 group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-900 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                LearnCare<span className="text-indigo-600 font-extrabold ml-0.5">AI</span>
              </span>
            </div>
          </button>

          {/* Zone 2: Clean single-line text navigation links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
            <button
              onClick={() => handleNavClick('home')}
              className={`hover:text-indigo-600 transition-colors whitespace-nowrap shrink-0 ${
                currentView === 'home' ? 'text-indigo-600 font-semibold' : ''
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('educators')}
              className={`hover:text-indigo-600 transition-colors whitespace-nowrap shrink-0 ${
                currentView === 'educators' ? 'text-indigo-600 font-semibold' : ''
              }`}
            >
              Find Educators
            </button>
            <button
              onClick={() => handleNavClick('how-it-works')}
              className={`hover:text-indigo-600 transition-colors whitespace-nowrap shrink-0 ${
                currentView === 'how-it-works' ? 'text-indigo-600 font-semibold' : ''
              }`}
            >
              How It Works
            </button>
            <button
              onClick={() => handleNavClick('services')}
              className={`hover:text-indigo-600 transition-colors whitespace-nowrap shrink-0 ${
                currentView === 'services' ? 'text-indigo-600 font-semibold' : ''
              }`}
            >
              Services
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className={`hover:text-indigo-600 transition-colors whitespace-nowrap shrink-0 ${
                currentView === 'about' ? 'text-indigo-600 font-semibold' : ''
              }`}
            >
              About
            </button>
            <button
              onClick={() => handleNavClick('faq')}
              className={`hover:text-indigo-600 transition-colors whitespace-nowrap shrink-0 ${
                currentView === 'faq' ? 'text-indigo-600 font-semibold' : ''
              }`}
            >
              FAQ
            </button>
          </nav>

          {/* Zone 3: 1 primary action + Persona Switcher */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Quick Persona Switcher for easy testing */}
            <div className="relative">
              <button
                onClick={() => setPersonaDropdownOpen(!personaDropdownOpen)}
                className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors border border-slate-200"
                title="Switch demo persona"
              >
                <div className="w-2 h-2 rounded-full bg-indigo-600" />
                <span className="max-w-[120px] truncate">{currentUser?.name || 'Switch Role'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {personaDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs">
                  <div className="px-3 py-1.5 font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                    Switch Demo Account
                  </div>
                  {personas.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        switchUser(p.id);
                        setPersonaDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-indigo-50 hover:text-indigo-700 transition-colors ${
                        currentUser?.id === p.id ? 'bg-indigo-50/60 font-semibold text-indigo-700' : 'text-slate-700'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span>{p.label}</span>
                        <span className="text-[10px] text-slate-400 capitalize">{p.role} account</span>
                      </div>
                      {currentUser?.id === p.id && <UserCheck className="w-3.5 h-3.5 text-indigo-600" />}
                    </button>
                  ))}
                  <div className="border-t border-slate-100 mt-1 pt-1 px-3 py-1.5 text-[11px] text-slate-400">
                    Switching roles immediately updates dashboard views and permissions.
                  </div>
                </div>
              )}
            </div>

            {/* If logged in, show Dashboard link */}
            {currentUser ? (
              <button
                onClick={() => handleNavClick(getDashboardViewForRole(currentUser.role))}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-900 hover:bg-indigo-800 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
              >
                <span>Dashboard</span>
              </button>
            ) : (
              <button
                onClick={() => handleNavClick('login')}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-indigo-900 border border-slate-300 rounded-lg hover:border-slate-400 transition-colors whitespace-nowrap shrink-0"
              >
                Log In
              </button>
            )}

            <button
              onClick={() => openBookingModal()}
              className="hidden md:inline-flex px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0 items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Appointment</span>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-2 text-sm font-medium text-slate-700">
            <button
              onClick={() => handleNavClick('home')}
              className="text-left px-3 py-2 rounded-md hover:bg-slate-50"
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('educators')}
              className="text-left px-3 py-2 rounded-md hover:bg-slate-50"
            >
              Find Educators
            </button>
            <button
              onClick={() => handleNavClick('how-it-works')}
              className="text-left px-3 py-2 rounded-md hover:bg-slate-50"
            >
              How It Works
            </button>
            <button
              onClick={() => handleNavClick('services')}
              className="text-left px-3 py-2 rounded-md hover:bg-slate-50"
            >
              Services
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className="text-left px-3 py-2 rounded-md hover:bg-slate-50"
            >
              About Us
            </button>
            <button
              onClick={() => handleNavClick('faq')}
              className="text-left px-3 py-2 rounded-md hover:bg-slate-50"
            >
              FAQ & Policies
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className="text-left px-3 py-2 rounded-md hover:bg-slate-50"
            >
              Contact Us
            </button>
          </nav>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <div className="text-xs font-semibold text-slate-400">Switch Demo Role:</div>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {personas.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    switchUser(p.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-2 py-1.5 rounded border text-left truncate ${
                    currentUser?.id === p.id
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-semibold'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  {p.label.split(' (')[0]}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                openBookingModal();
                setMobileMenuOpen(false);
              }}
              className="w-full mt-2 py-2.5 text-center text-xs font-semibold text-white bg-indigo-600 rounded-lg"
            >
              Book an Appointment
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
