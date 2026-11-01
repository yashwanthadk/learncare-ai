import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { GraduationCap, Shield, Lock, HeartHandshake } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView } = useApp();

  const handleNav = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                LearnCare<span className="text-indigo-400">AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering students and educators through ethical, non-invasive learning analytics and timely academic support consultations.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 pt-1">
              <Shield className="w-3.5 h-3.5" />
              <span>Consensual, non-invasive analytics only</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => handleNav('home')} className="hover:text-white transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('educators')} className="hover:text-white transition-colors">
                  Find Educators
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('how-it-works')} className="hover:text-white transition-colors">
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('services')} className="hover:text-white transition-colors">
                  Services & Guidance
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('faq')} className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </button>
              </li>
            </ul>
          </div>

          {/* User Roles */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Portals
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => handleNav('student-dashboard')} className="hover:text-white transition-colors">
                  Student Learning Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('educator-dashboard')} className="hover:text-white transition-colors">
                  Educator Portal & Notes
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('admin-dashboard')} className="hover:text-white transition-colors">
                  Institutional Admin Console
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('login')} className="hover:text-white transition-colors">
                  Sign In / Register
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Governance */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Ethics & Privacy
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => handleNav('privacy')} className="hover:text-white transition-colors">
                  Privacy Policy & Data Rights
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('terms')} className="hover:text-white transition-colors">
                  Terms of Service & Booking Rules
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('contact')} className="hover:text-white transition-colors">
                  Contact Support & Feedback
                </button>
              </li>
            </ul>
            <div className="mt-4 p-3 rounded-lg bg-slate-800/80 border border-slate-700/60 text-[11px] text-slate-300 leading-normal">
              No biometric, webcam, keystroke, or audio tracking. Student data is encrypted and processed strictly with consent.
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 LearnCare AI Platform. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-300 cursor-pointer" onClick={() => handleNav('privacy')}>Privacy</span>
            <span>·</span>
            <span className="hover:text-slate-300 cursor-pointer" onClick={() => handleNav('terms')}>Terms</span>
            <span>·</span>
            <span className="hover:text-slate-300 cursor-pointer" onClick={() => handleNav('contact')}>Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
