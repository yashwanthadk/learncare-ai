import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import type {
  Appointment,
  LearningAnalytics,
  AIRecommendation,
  LearningResource,
  Notification,
} from '../../types/index.ts';
import { RescheduleModal } from '../../components/RescheduleModal.tsx';
import { FeedbackModal } from '../../components/FeedbackModal.tsx';
import {
  LayoutDashboard,
  Calendar,
  LineChart,
  Sparkles,
  BookOpen,
  Bell,
  Settings,
  User as UserIcon,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Shield,
  Video,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Star,
  XCircle,
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const {
    currentUser,
    studentProfile,
    openBookingModal,
    showToast,
    refreshUserData,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'analytics'
    | 'appointments'
    | 'recommendations'
    | 'resources'
    | 'notifications'
    | 'profile'
    | 'settings'
  >('overview');

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [analytics, setAnalytics] = useState<LearningAnalytics | null>(null);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Modals
  const [selectedAppointmentForReschedule, setSelectedAppointmentForReschedule] = useState<Appointment | null>(null);
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [selectedAppointmentForFeedback, setSelectedAppointmentForFeedback] = useState<Appointment | null>(null);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);

  // Appointment filter
  const [appointmentFilter, setAppointmentFilter] = useState<'all' | 'Upcoming' | 'Completed' | 'Pending'>('all');

  // Consent local toggle
  const [consentGranted, setConsentGranted] = useState(currentUser?.consentGiven ?? true);

  const loadData = () => {
    if (!currentUser) return;

    fetch(`/api/appointments?studentId=${currentUser.id}`)
      .then((res) => res.json())
      .then((data) => setAppointments(data))
      .catch((err) => console.error(err));

    fetch(`/api/analytics/student/${currentUser.id}`)
      .then((res) => res.json())
      .then((data) => setAnalytics(data))
      .catch((err) => console.error(err));

    fetch(`/api/recommendations?studentId=${currentUser.id}`)
      .then((res) => res.json())
      .then((data) => setRecommendations(data))
      .catch((err) => console.error(err));

    fetch('/api/resources')
      .then((res) => res.json())
      .then((data) => setResources(data))
      .catch((err) => console.error(err));

    fetch('/api/notifications')
      .then((res) => res.json())
      .then((data) => setNotifications(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadData();
    if (currentUser) {
      setConsentGranted(currentUser.consentGiven);
    }
  }, [currentUser]);

  const handleCancelAppointment = async (apptId: string) => {
    if (!window.confirm('Are you sure you want to cancel this appointment? The slot will be released back to the educator.')) {
      return;
    }
    try {
      const res = await fetch(`/api/appointments/${apptId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Cancelled' }),
      });
      if (res.ok) {
        showToast('Appointment cancelled successfully.', 'info');
        loadData();
      }
    } catch (err) {
      showToast('Error cancelling appointment', 'error');
    }
  };

  const handleGenerateAIRecommendations = async () => {
    if (!currentUser) return;
    setIsGeneratingAI(true);
    try {
      const res = await fetch('/api/ai/generate-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: currentUser.id }),
      });
      if (res.ok) {
        showToast('Generated fresh personalized AI recommendations via Gemini.', 'success');
        loadData();
      } else {
        showToast('Unable to generate AI recommendations right now.', 'error');
      }
    } catch (err) {
      showToast('Network error generating recommendations.', 'error');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleConsentToggle = async (granted: boolean) => {
    try {
      const res = await fetch('/api/auth/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ consentGiven: granted }),
      });
      if (res.ok) {
        setConsentGranted(granted);
        showToast(
          granted
            ? 'Consent saved. Non-invasive learning tracking enabled.'
            : 'Consent withdrawn. Non-invasive tracking paused.',
          'info'
        );
        refreshUserData();
      }
    } catch (err) {
      showToast('Failed to update consent preferences', 'error');
    }
  };

  const upcomingAppointments = appointments.filter(
    (a) => a.status === 'Confirmed' || a.status === 'Pending'
  );

  const filteredAppointments = appointments.filter((a) => {
    if (appointmentFilter === 'all') return true;
    if (appointmentFilter === 'Upcoming') return a.status === 'Confirmed' || a.status === 'Pending';
    return a.status === appointmentFilter;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-900">
      {/* Reschedule Modal */}
      <RescheduleModal
        isOpen={rescheduleModalOpen}
        appointment={selectedAppointmentForReschedule}
        onClose={() => setRescheduleModalOpen(false)}
        onSuccess={() => {
          showToast('Appointment rescheduled successfully!', 'success');
          loadData();
        }}
      />

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={feedbackModalOpen}
        appointment={selectedAppointmentForFeedback}
        onClose={() => setFeedbackModalOpen(false)}
        onSuccess={() => {
          showToast('Feedback submitted! Thank you.', 'success');
          loadData();
        }}
      />

      {/* Dashboard Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200/90 p-4 shrink-0 flex flex-col justify-between">
        <div className="space-y-6">
          {/* User mini profile card */}
          <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 flex items-center gap-3">
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-lg object-cover border border-slate-200"
            />
            <div className="min-w-0 flex-1">
              <div className="font-bold text-xs text-slate-900 truncate">{currentUser?.name}</div>
              <div className="text-[11px] text-slate-500 truncate">
                {studentProfile?.major || 'Undergraduate'}
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-medium">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors text-left ${
                activeTab === 'overview'
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-left ${
                activeTab === 'analytics'
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LineChart className="w-4 h-4" />
                <span>Learning Analytics</span>
              </div>
              {analytics && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                    analytics.overallRisk === 'High Concern'
                      ? 'bg-rose-100 text-rose-800'
                      : analytics.overallRisk === 'Moderate Concern'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {analytics.overallRisk.split(' ')[0]}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('appointments')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-left ${
                activeTab === 'appointments'
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4" />
                <span>My Appointments</span>
              </div>
              {upcomingAppointments.length > 0 && (
                <span className="text-[10px] bg-indigo-100 text-indigo-800 px-1.5 py-0.2 rounded font-semibold">
                  {upcomingAppointments.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('recommendations')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors text-left ${
                activeTab === 'recommendations'
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Recommendations</span>
            </button>

            <button
              onClick={() => setActiveTab('resources')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors text-left ${
                activeTab === 'resources'
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Learning Resources</span>
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-left ${
                activeTab === 'notifications'
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Bell className="w-4 h-4" />
                <span>Notifications</span>
              </div>
              {notifications.filter((n) => !n.read).length > 0 && (
                <span className="text-[10px] bg-rose-500 text-white px-1.5 py-0.2 rounded font-semibold">
                  {notifications.filter((n) => !n.read).length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors text-left ${
                activeTab === 'profile'
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <UserIcon className="w-4 h-4" />
              <span>Academic Profile</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors text-left ${
                activeTab === 'settings'
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Data & Privacy</span>
            </button>
          </nav>
        </div>

        {/* Quick action button */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <button
            onClick={() => openBookingModal()}
            className="w-full py-2.5 px-3 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book New Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-6xl">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Welcome back, {currentUser?.name?.split(' ')[0]}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Here is your current academic trajectory, upcoming consultations, and proactive support indicators.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
                <div className="text-[11px] font-semibold text-slate-500">Upcoming Appointments</div>
                <div className="text-2xl font-extrabold text-slate-900 tabular-nums mt-1">
                  {upcomingAppointments.length}
                </div>
                <div className="text-[10px] text-indigo-600 mt-1">Next: {upcomingAppointments[0]?.date || 'None'}</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
                <div className="text-[11px] font-semibold text-slate-500">Assignment Completion</div>
                <div className="text-2xl font-extrabold text-indigo-700 tabular-nums mt-1">
                  {analytics?.assignmentCompletionRate || 85}%
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Target: &gt;90%</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
                <div className="text-[11px] font-semibold text-slate-500">Recent Assessment Trend</div>
                <div className="text-2xl font-extrabold text-slate-900 tabular-nums mt-1 flex items-center gap-1">
                  <span>{analytics?.assessmentAverage || 78}%</span>
                  {analytics?.assessmentTrend === 'declining' ? (
                    <TrendingDown className="w-4 h-4 text-amber-500" />
                  ) : (
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                  )}
                </div>
                <div className="text-[10px] text-amber-600 mt-1 capitalize">{analytics?.assessmentTrend} trend</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
                <div className="text-[11px] font-semibold text-slate-500">Disengagement Risk Status</div>
                <div
                  className={`text-sm font-extrabold px-2 py-1 rounded inline-block mt-2 ${
                    analytics?.overallRisk === 'High Concern'
                      ? 'bg-rose-100 text-rose-800'
                      : analytics?.overallRisk === 'Moderate Concern'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {analytics?.overallRisk || 'Low Concern'}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">{analytics?.riskConfidence || 88}% model confidence</div>
              </div>
            </div>

            {/* Next Upcoming Appointment Highlight */}
            {upcomingAppointments.length > 0 ? (
              <div className="bg-gradient-to-r from-indigo-900 to-indigo-950 text-white p-5 rounded-2xl shadow-md space-y-3">
                <div className="flex items-center justify-between text-xs text-indigo-200">
                  <span className="font-semibold uppercase tracking-wider text-[10px]">Next Scheduled Mentorship Session</span>
                  <span className="font-mono bg-indigo-800/80 px-2 py-0.5 rounded text-[11px]">{upcomingAppointments[0].id}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={upcomingAppointments[0].educatorAvatar}
                      alt={upcomingAppointments[0].educatorName}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-xl object-cover border border-white/20"
                    />
                    <div>
                      <h3 className="font-bold text-sm text-white">{upcomingAppointments[0].educatorName}</h3>
                      <p className="text-xs text-indigo-200">{upcomingAppointments[0].subject} · {upcomingAppointments[0].appointmentType}</p>
                      <p className="text-[11px] text-indigo-300 font-mono mt-0.5">
                        {upcomingAppointments[0].date} at {upcomingAppointments[0].timeSlot} ({upcomingAppointments[0].durationMinutes} mins)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={upcomingAppointments[0].meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 text-xs font-semibold text-indigo-950 bg-white hover:bg-slate-100 rounded-lg shadow-sm transition-all flex items-center gap-1.5"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Join Video Room</span>
                    </a>
                    <button
                      onClick={() => {
                        setSelectedAppointmentForReschedule(upcomingAppointments[0]);
                        setRescheduleModalOpen(true);
                      }}
                      className="px-3 py-2 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      Reschedule
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-white rounded-2xl border border-slate-200 text-center space-y-2">
                <Calendar className="w-8 h-8 text-slate-300 mx-auto" />
                <h3 className="font-bold text-sm text-slate-800">No Upcoming Appointments</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Need help with homework, conceptual doubt clearing, or exam study planning? Book a session with an educator.
                </p>
                <button
                  onClick={() => openBookingModal()}
                  className="mt-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                >
                  Book Session
                </button>
              </div>
            )}

            {/* AI Recommendation Alert */}
            {recommendations.length > 0 && (
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                      Top AI Academic Recommendation
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('recommendations')}
                    className="text-xs text-indigo-600 hover:underline font-semibold"
                  >
                    View All ({recommendations.length})
                  </button>
                </div>

                <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">
                      {recommendations[0].subject} · {recommendations[0].suggestedDuration || '30 mins'}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900">{recommendations[0].title}</h4>
                    <p className="text-xs text-slate-600">{recommendations[0].description}</p>
                    <p className="text-[11px] text-slate-400 italic">"{recommendations[0].rationale}"</p>
                  </div>
                  <button
                    onClick={() => {
                      if (recommendations[0].actionType === 'book_appointment') {
                        openBookingModal(recommendations[0].recommendedEducatorId, recommendations[0].subject);
                      } else {
                        setActiveTab('resources');
                      }
                    }}
                    className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm whitespace-nowrap shrink-0"
                  >
                    {recommendations[0].actionLabel}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* LEARNING ANALYTICS TAB */}
        {activeTab === 'analytics' && analytics && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Learning Analytics & Disengagement Indicators</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Consensual, non-invasive activity tracking to help you and your educators identify learning bottlenecks before final grades suffer.
              </p>
            </div>

            {/* Risk Assessment Box */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="text-xs font-semibold text-slate-500">Current Computed Risk Level</div>
                  <div className="flex items-center gap-3 mt-1">
                    <span
                      className={`text-lg font-bold px-3 py-1 rounded-lg ${
                        analytics.overallRisk === 'High Concern'
                          ? 'bg-rose-100 text-rose-800'
                          : analytics.overallRisk === 'Moderate Concern'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {analytics.overallRisk}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Uncertainty / Confidence: {analytics.riskConfidence}%
                    </span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-500 max-w-xs sm:text-right">
                  Important: Risk indicators are non-judgmental assistance signals derived strictly from coursework timeliness and score variance.
                </div>
              </div>

              {/* Contributing Factors Breakdown */}
              <div className="space-y-3">
                <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                  Contributing Factors Behind This Assessment
                </h3>
                <div className="space-y-2">
                  {analytics.contributingFactors.map((f, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start justify-between text-xs gap-3"
                    >
                      <div>
                        <div className="font-semibold text-slate-900">{f.factor}</div>
                        <div className="text-slate-500 text-[11px] mt-0.5">{f.detail}</div>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ${
                          f.impact === 'high'
                            ? 'bg-rose-100 text-rose-700'
                            : f.impact === 'medium'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {f.impact} impact
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weekly Trend Table */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                  Weekly Academic Engagement History (Consented LMS Metrics)
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500">
                        <th className="py-2 font-medium">Timeline</th>
                        <th className="py-2 font-medium">Assessment Avg</th>
                        <th className="py-2 font-medium">Assignment Completion</th>
                        <th className="py-2 font-medium">Platform Hours</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {analytics.weeklyTrends.map((w) => (
                        <tr key={w.week} className="hover:bg-slate-50">
                          <td className="py-2.5 font-semibold text-slate-900">{w.week}</td>
                          <td className="py-2.5 font-mono tabular-nums">{w.score}%</td>
                          <td className="py-2.5 font-mono tabular-nums">{w.completion}%</td>
                          <td className="py-2.5 font-mono tabular-nums">{w.participation} hrs</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Interventions */}
              <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100 space-y-2 text-xs">
                <span className="font-bold text-indigo-950">Recommended Educator Support Interventions:</span>
                <ul className="list-disc pl-5 space-y-1 text-slate-700 text-xs">
                  {analytics.suggestedInterventions.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* MY APPOINTMENTS TAB */}
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Appointments</h1>
                <p className="text-xs text-slate-500 mt-0.5">Manage upcoming sessions, reschedule dates, and review session notes.</p>
              </div>
              <button
                onClick={() => openBookingModal()}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
              >
                + Book New Appointment
              </button>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-slate-200/90 text-xs w-fit">
              {(['all', 'Upcoming', 'Completed', 'Pending'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setAppointmentFilter(filter)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    appointmentFilter === filter
                      ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Appointments list */}
            {filteredAppointments.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 space-y-2">
                <Calendar className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs">No appointments found matching this filter.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredAppointments.map((appt) => (
                  <div
                    key={appt.id}
                    className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-indigo-200 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={appt.educatorAvatar}
                        alt={appt.educatorName}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm text-slate-900">{appt.educatorName}</h3>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              appt.status === 'Confirmed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : appt.status === 'Pending'
                                ? 'bg-amber-100 text-amber-800'
                                : appt.status === 'Completed'
                                ? 'bg-indigo-100 text-indigo-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {appt.status}
                          </span>
                        </div>
                        <div className="text-xs text-indigo-600 font-semibold">{appt.subject} · {appt.appointmentType}</div>
                        <div className="text-xs text-slate-500 font-mono">
                          {appt.date} · {appt.timeSlot} ({appt.durationMinutes} mins) · Ref: {appt.id}
                        </div>
                        {appt.reason && (
                          <p className="text-[11px] text-slate-600 italic">"{appt.reason}"</p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0">
                      {appt.status === 'Confirmed' && (
                        <>
                          <a
                            href={appt.meetingLink}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm flex items-center gap-1.5"
                          >
                            <Video className="w-3.5 h-3.5" />
                            <span>Join Video</span>
                          </a>
                          <button
                            onClick={() => {
                              setSelectedAppointmentForReschedule(appt);
                              setRescheduleModalOpen(true);
                            }}
                            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
                          >
                            Reschedule
                          </button>
                          <button
                            onClick={() => handleCancelAppointment(appt.id)}
                            className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg"
                          >
                            Cancel
                          </button>
                        </>
                      )}

                      {appt.status === 'Completed' && !appt.hasFeedback && (
                        <button
                          onClick={() => {
                            setSelectedAppointmentForFeedback(appt);
                            setFeedbackModalOpen(true);
                          }}
                          className="px-3.5 py-1.5 text-xs font-semibold text-indigo-900 bg-indigo-50 hover:bg-indigo-100 rounded-lg flex items-center gap-1"
                        >
                          <Star className="w-3.5 h-3.5 text-amber-500" />
                          <span>Leave Review</span>
                        </button>
                      )}

                      {appt.status === 'Completed' && appt.hasFeedback && (
                        <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Review Submitted</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* AI RECOMMENDATIONS TAB */}
        {activeTab === 'recommendations' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">AI Learning Recommendations</h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Personalized suggestions synthesized with Gemini AI based on your coursework and assessment trajectories.
                </p>
              </div>

              <button
                disabled={isGeneratingAI}
                onClick={handleGenerateAIRecommendations}
                className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isGeneratingAI ? 'Synthesizing with Gemini...' : 'Synthesize Fresh Recommendations'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                      {rec.subject} · {rec.category.replace('_', ' ')}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        rec.priority === 'urgent'
                          ? 'bg-rose-100 text-rose-700'
                          : rec.priority === 'recommended'
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {rec.priority}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900">{rec.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{rec.description}</p>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700">Model Rationale: </span>
                    {rec.rationale}
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      Duration: {rec.suggestedDuration || '30 mins'}
                    </span>
                    <button
                      onClick={() => {
                        if (rec.actionType === 'book_appointment') {
                          openBookingModal(rec.recommendedEducatorId, rec.subject);
                        } else {
                          setActiveTab('resources');
                        }
                      }}
                      className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
                    >
                      {rec.actionLabel}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RESOURCES TAB */}
        {activeTab === 'resources' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Curated Learning Resources</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Targeted practice sheets, interactive modules, and revision guides vetted by university faculty.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resources.map((res) => (
                <div
                  key={res.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-indigo-600">{res.subject}</span>
                      <span className="text-[11px] text-slate-400 font-mono">{res.duration}</span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-900">{res.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{res.description}</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {res.tags.map((tag) => (
                        <span key={tag} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => showToast(`Opened "${res.title}" in student workspace.`, 'info')}
                    className="w-full py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                  >
                    Open Resource
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* NOTIFICATIONS TAB */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Notifications</h1>
              <p className="text-xs text-slate-500 mt-0.5">Updates on appointments, AI recommendations, and session confirmations.</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm divide-y divide-slate-100">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">No notifications at this time.</div>
              ) : (
                notifications.map((n) => (
                  <div key={n.id} className="p-4 flex items-start justify-between gap-4 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900">{n.title}</span>
                        {!n.read && (
                          <span className="w-2 h-2 rounded-full bg-indigo-600" />
                        )}
                      </div>
                      <p className="text-slate-600">{n.message}</p>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {new Date(n.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Academic Profile</h1>
              <p className="text-xs text-slate-500 mt-0.5">Your student identification, enrolled coursework, and target academic milestones.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-500 block mb-1">Full Name</label>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 font-semibold">
                    {currentUser?.name}
                  </div>
                </div>
                <div>
                  <label className="font-semibold text-slate-500 block mb-1">Student ID</label>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 font-mono">
                    {studentProfile?.studentId || 'STU-2026-8812'}
                  </div>
                </div>
                <div>
                  <label className="font-semibold text-slate-500 block mb-1">Academic Major</label>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    {studentProfile?.major}
                  </div>
                </div>
                <div>
                  <label className="font-semibold text-slate-500 block mb-1">Current Academic Standing</label>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    {studentProfile?.gradeLevel} · GPA: {studentProfile?.currentGPA} / 4.0
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <span className="font-semibold text-slate-700 block mb-2">Enrolled Courses (Consented Sync):</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {studentProfile?.enrolledCourses.map((c) => (
                    <div key={c} className="p-2.5 bg-indigo-50/50 rounded-lg border border-indigo-100 font-medium text-indigo-950">
                      {c}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS & PRIVACY TAB */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Privacy & Consent Controls</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage your data processing permissions, review transparency reports, or request data deletion.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-6 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">Non-Invasive Learning Data Consent</h3>
                    <p className="text-slate-500 mt-1">
                      Allows LearnCare AI to evaluate assignment submission timeliness and quiz score trajectories to provide early learning difficulty indicators.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={consentGranted}
                    onChange={(e) => handleConsentToggle(e.target.checked)}
                    className="w-5 h-5 text-indigo-600 rounded mt-1 cursor-pointer"
                  />
                </div>
                <div className="text-[11px] text-emerald-600 font-medium">
                  {consentGranted ? '✓ Consent active. You will receive early difficulty indicators.' : '✕ Consent withdrawn. Tracking is currently suspended.'}
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-100">
                <h3 className="font-bold text-slate-900">Data Deletion & Student Rights</h3>
                <p className="text-slate-500">
                  Under our student data policy, you may request complete deletion of your session notes and learning logs at any time.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => showToast('Student activity log exported as JSON.', 'info')}
                    className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 font-semibold"
                  >
                    Export My Data
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Delete all historical session notes and learning data?')) {
                        showToast('Data deletion request submitted to institutional compliance.', 'info');
                      }
                    }}
                    className="px-4 py-2 text-rose-600 border border-rose-200 rounded-lg hover:bg-rose-50 font-semibold"
                  >
                    Request Data Deletion
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
