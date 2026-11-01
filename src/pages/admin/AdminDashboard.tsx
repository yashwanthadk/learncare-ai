import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import type {
  User,
  EducatorProfile,
  Appointment,
  LearningAnalytics,
  CourseCategory,
  Feedback,
} from '../../types/index.ts';
import {
  LayoutDashboard,
  Users,
  Calendar,
  BookOpen,
  LineChart,
  Star,
  Settings,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Award,
  Sparkles,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { currentUser, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'users' | 'educator_approval' | 'appointments' | 'courses' | 'ai_monitoring' | 'feedback' | 'settings'
  >('overview');

  const [metrics, setMetrics] = useState<any>({
    registeredStudents: 1244,
    verifiedEducators: 46,
    appointmentsCompleted: 3824,
    studentSatisfactionPercentage: 98.4,
    activeDisengagementAlerts: 1,
  });

  const [users, setUsers] = useState<User[]>([]);
  const [educators, setEducators] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [analytics, setAnalytics] = useState<LearningAnalytics[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  const loadAdminData = () => {
    fetch('/api/admin/metrics')
      .then((res) => res.json())
      .then((data) => setMetrics(data));

    fetch('/api/educators')
      .then((res) => res.json())
      .then((data) => setEducators(data));

    fetch('/api/appointments')
      .then((res) => res.json())
      .then((data) => setAppointments(data));

    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data));

    fetch('/api/analytics/overview')
      .then((res) => res.json())
      .then((data) => setAnalytics(data.students || []));

    fetch('/api/feedback')
      .then((res) => res.json())
      .then((data) => setFeedbacks(data));
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleToggleVerification = async (eduId: string) => {
    try {
      const res = await fetch(`/api/admin/educators/${eduId}/verify`, { method: 'PATCH' });
      if (res.ok) {
        showToast('Educator verification status updated.', 'success');
        loadAdminData();
      }
    } catch (err) {
      showToast('Error updating educator', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-900">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 p-4 shrink-0 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
              AD
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-xs text-white truncate">{currentUser?.name}</div>
              <div className="text-[11px] text-indigo-400 font-medium truncate">Institutional Admin</div>
            </div>
          </div>

          <nav className="space-y-1 text-xs font-medium">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors text-left ${
                activeTab === 'overview'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('educator_approval')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-left ${
                activeTab === 'educator_approval'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Educator Verification</span>
              </div>
              <span className="text-[10px] bg-indigo-900 text-indigo-200 px-1.5 py-0.2 rounded">
                {educators.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('appointments')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors text-left ${
                activeTab === 'appointments'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>All Appointments</span>
            </button>

            <button
              onClick={() => setActiveTab('ai_monitoring')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-left ${
                activeTab === 'ai_monitoring'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4" />
                <span>AI Risk Monitoring</span>
              </div>
              <span className="text-[10px] bg-rose-500 text-white px-1.5 py-0.2 rounded font-bold">
                {metrics.activeDisengagementAlerts} Alert
              </span>
            </button>

            <button
              onClick={() => setActiveTab('courses')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors text-left ${
                activeTab === 'courses'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Course Categories</span>
            </button>

            <button
              onClick={() => setActiveTab('feedback')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors text-left ${
                activeTab === 'feedback'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Star className="w-4 h-4" />
              <span>Feedback & Reviews</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors text-left ${
                activeTab === 'settings'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>System Settings</span>
            </button>
          </nav>
        </div>

        <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500">
          Campus Instance · Fall 2026
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-6xl">
        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Academic Operations Command</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Institutional overview of student academic support volume, educator availability, and early disengagement detection.
              </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
                <div className="text-[11px] font-semibold text-slate-500">Enrolled Students</div>
                <div className="text-2xl font-extrabold text-slate-900 tabular-nums mt-1">
                  {metrics.registeredStudents.toLocaleString()}
                </div>
                <div className="text-[10px] text-emerald-600 mt-1">94% data consent rate</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
                <div className="text-[11px] font-semibold text-slate-500">Active Faculty & Mentors</div>
                <div className="text-2xl font-extrabold text-indigo-700 tabular-nums mt-1">
                  {metrics.verifiedEducators}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Across 4 major divisions</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
                <div className="text-[11px] font-semibold text-slate-500">Total Consultations</div>
                <div className="text-2xl font-extrabold text-slate-900 tabular-nums mt-1">
                  {metrics.appointmentsCompleted.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Zero double bookings logged</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
                <div className="text-[11px] font-semibold text-slate-500">Disengagement Alerts</div>
                <div className="text-2xl font-extrabold text-rose-600 tabular-nums mt-1">
                  {metrics.activeDisengagementAlerts}
                </div>
                <div className="text-[10px] text-rose-600 mt-1">Immediate outreach recommended</div>
              </div>
            </div>

            {/* Quick Actions & Recent Appointments Table */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                  Recent Platform Appointment Requests
                </h3>
                <button
                  onClick={() => setActiveTab('appointments')}
                  className="text-xs text-indigo-600 font-semibold hover:underline"
                >
                  View All
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="py-2">Reference</th>
                      <th className="py-2">Student</th>
                      <th className="py-2">Educator</th>
                      <th className="py-2">Subject</th>
                      <th className="py-2">Date / Slot</th>
                      <th className="py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {appointments.slice(0, 5).map((a) => (
                      <tr key={a.id} className="hover:bg-slate-50">
                        <td className="py-2.5 font-mono font-semibold text-indigo-600">{a.id}</td>
                        <td className="py-2.5 font-semibold text-slate-900">{a.studentName}</td>
                        <td className="py-2.5 text-slate-700">{a.educatorName}</td>
                        <td className="py-2.5 text-slate-600">{a.subject}</td>
                        <td className="py-2.5 font-mono text-[11px]">{a.date} · {a.timeSlot}</td>
                        <td className="py-2.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              a.status === 'Confirmed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : a.status === 'Pending'
                                ? 'bg-amber-100 text-amber-800'
                                : a.status === 'Completed'
                                ? 'bg-indigo-100 text-indigo-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {a.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* EDUCATOR VERIFICATION */}
        {activeTab === 'educator_approval' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Faculty & Educator Verification</h1>
              <p className="text-xs text-slate-500 mt-0.5">Manage faculty credentialing, approve new educator profiles, and toggle verified badges.</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {educators.map((edu) => (
                <div
                  key={edu.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={edu.avatar}
                      alt={edu.name}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-xl object-cover border border-slate-200"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{edu.name}</span>
                        {edu.profile?.isVerified ? (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold">
                            Verified Faculty
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded text-[10px] font-bold">
                            Pending Review
                          </span>
                        )}
                      </div>
                      <div className="text-slate-500">{edu.profile?.title}</div>
                      <div className="text-indigo-700 font-medium mt-0.5">
                        {edu.profile?.subjectSpecializations.join(', ')}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        Degrees: {edu.profile?.qualifications.join(' · ')}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleVerification(edu.id)}
                    className={`px-4 py-2 rounded-lg font-semibold text-xs transition-all whitespace-nowrap shrink-0 ${
                      edu.profile?.isVerified
                        ? 'border border-slate-300 text-slate-700 hover:bg-slate-50'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
                    }`}
                  >
                    {edu.profile?.isVerified ? 'Revoke Verified Badge' : 'Approve & Verify'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ALL APPOINTMENTS */}
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Institution Appointment Registry</h1>
              <p className="text-xs text-slate-500 mt-0.5">Real-time centralized log of all scheduled, completed, and pending consultations.</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                  <tr>
                    <th className="p-3">Ref ID</th>
                    <th className="p-3">Student</th>
                    <th className="p-3">Educator</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Date & Time</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Room Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {appointments.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-semibold text-indigo-700">{a.id}</td>
                      <td className="p-3 font-semibold text-slate-900">{a.studentName}</td>
                      <td className="p-3 text-slate-700">{a.educatorName}</td>
                      <td className="p-3 text-slate-600">{a.appointmentType}</td>
                      <td className="p-3 font-mono">{a.date} · {a.timeSlot}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            a.status === 'Confirmed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : a.status === 'Pending'
                              ? 'bg-amber-100 text-amber-800'
                              : a.status === 'Completed'
                              ? 'bg-indigo-100 text-indigo-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {a.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <a
                          href={a.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-indigo-600 hover:underline font-mono text-[11px]"
                        >
                          Meeting Room
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* AI RISK MONITORING */}
        {activeTab === 'ai_monitoring' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">AI Disengagement Early Detection Console</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Proactive cohort monitoring identifying students with sudden dropoffs in assignment submissions or assessment trends.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-bold text-slate-900 uppercase tracking-wider">Cohort Disengagement Breakdown</span>
                <span className="text-slate-400">Model: Gemini 3.8 Flash Hybrid Rule Evaluator</span>
              </div>

              <div className="space-y-3">
                {analytics.map((stu) => (
                  <div
                    key={stu.studentId}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-bold text-slate-900 text-sm">{stu.studentName}</span>
                        <span className="text-slate-400 ml-2">ID: {stu.studentId}</span>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded text-xs font-bold ${
                          stu.overallRisk === 'High Concern'
                            ? 'bg-rose-100 text-rose-800'
                            : stu.overallRisk === 'Moderate Concern'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {stu.overallRisk} ({stu.riskConfidence}% confidence)
                      </span>
                    </div>

                    <p className="text-slate-600 leading-relaxed italic">
                      "{stu.summaryNote}"
                    </p>

                    <div className="flex flex-wrap gap-4 pt-1 text-[11px] text-slate-500 font-mono">
                      <span>Completion: {stu.assignmentCompletionRate}%</span>
                      <span>Assessment Avg: {stu.assessmentAverage}%</span>
                      <span>Weekly Hours: {stu.weeklyParticipationHours} hrs</span>
                      <span>Missed Activities: {stu.missedActivitiesCount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* COURSE CATEGORIES */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Academic Divisions & Course Subjects</h1>
              <p className="text-xs text-slate-500 mt-0.5">Configured academic subject areas and support modules.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-3 text-xs"
                >
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <h3 className="font-bold text-sm text-slate-900">{cat.name}</h3>
                    <span className="text-indigo-600 font-mono">{cat.totalEducators} Faculty</span>
                  </div>
                  <p className="text-slate-600">{cat.description}</p>
                  <div>
                    <span className="font-semibold text-slate-700 block mb-1">Subjects Covered:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.subjects.map((sub) => (
                        <span key={sub} className="px-2 py-0.5 bg-slate-100 rounded text-slate-700">
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FEEDBACK & REVIEWS */}
        {activeTab === 'feedback' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Student Feedback & Session Ratings</h1>
              <p className="text-xs text-slate-500 mt-0.5">Post-consultation ratings submitted by students across all verified faculty.</p>
            </div>

            <div className="space-y-3">
              {feedbacks.map((fb) => (
                <div
                  key={fb.id}
                  className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-2 text-xs"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-bold text-slate-900">{fb.studentName}</span>
                      <span className="text-slate-400 ml-1">reviewed</span>
                      <span className="font-semibold text-indigo-700 ml-1">{fb.educatorName}</span>
                    </div>
                    <span className="text-amber-500 font-mono">{'★'.repeat(fb.rating)} ({fb.rating}.0)</span>
                  </div>
                  <div className="text-indigo-700 font-medium text-[11px]">{fb.helpfulnessCategory}</div>
                  <p className="text-slate-600 italic">"{fb.comments}"</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SETTINGS */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Institutional Governance & System Settings</h1>
              <p className="text-xs text-slate-500 mt-0.5">Configure booking concurrency locks, scheduling policies, and ethical privacy rules.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-5 text-xs">
              <div className="space-y-2">
                <h3 className="font-bold text-slate-900">Scheduling Engine Rules</h3>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Strict Double-Booking Concurrency Lock</span>
                    <span className="font-semibold text-emerald-600">Active</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Minimum Advance Notice for Booking</span>
                    <span className="font-mono text-slate-700">2 Hours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Cancellation Window Before Session</span>
                    <span className="font-mono text-slate-700">Up to 2 Hours Prior</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h3 className="font-bold text-slate-900">Ethical AI Protection Invariants</h3>
                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 text-emerald-950 space-y-1 text-[11px]">
                  <div>✓ Webcam, keystroke, and audio surveillance disabled at system architecture level.</div>
                  <div>✓ Student non-invasive consent required prior to metric ingestion.</div>
                  <div>✓ Permanent student record deletion supported upon request.</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
