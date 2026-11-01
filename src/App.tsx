/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { BookingModal } from './components/BookingModal.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { EducatorsPage } from './pages/EducatorsPage.tsx';
import { EducatorDetailPage } from './pages/EducatorDetailPage.tsx';
import {
  AboutPage,
  HowItWorksPage,
  ServicesPage,
  ContactPage,
  FAQPage,
  PrivacyPolicyPage,
  TermsPage,
} from './pages/PublicPages.tsx';
import { AuthPages } from './pages/AuthPages.tsx';
import { StudentDashboard } from './pages/student/StudentDashboard.tsx';
import { EducatorDashboard } from './pages/educator/EducatorDashboard.tsx';
import { AdminDashboard } from './pages/admin/AdminDashboard.tsx';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentView, toastMessage, toastType } = useApp();

  const isDashboardView = currentView.includes('dashboard');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Navbar */}
      <Navbar />

      {/* Global Booking Modal */}
      <BookingModal />

      {/* Global Floating Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl border bg-white text-slate-900 text-xs font-medium animate-in slide-in-from-bottom-5">
          {toastType === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
          {toastType === 'error' && <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
          {toastType === 'info' && <Info className="w-4 h-4 text-indigo-600 shrink-0" />}
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Route Views */}
      <div className="flex-1">
        {currentView === 'home' && <HomePage />}
        {currentView === 'educators' && <EducatorsPage />}
        {currentView === 'educator-detail' && <EducatorDetailPage />}
        {currentView === 'about' && <AboutPage />}
        {currentView === 'how-it-works' && <HowItWorksPage />}
        {currentView === 'services' && <ServicesPage />}
        {currentView === 'contact' && <ContactPage />}
        {currentView === 'faq' && <FAQPage />}
        {currentView === 'privacy' && <PrivacyPolicyPage />}
        {currentView === 'terms' && <TermsPage />}
        {currentView === 'login' && <AuthPages />}
        {currentView === 'student-dashboard' && <StudentDashboard />}
        {currentView === 'educator-dashboard' && <EducatorDashboard />}
        {currentView === 'admin-dashboard' && <AdminDashboard />}
      </div>

      {/* Public Footer (hidden on full dashboard viewports for clean SaaS feel) */}
      {!isDashboardView && <Footer />}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
