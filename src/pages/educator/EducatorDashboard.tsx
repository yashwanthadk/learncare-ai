import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import type {
  Appointment,
  LearningAnalytics,
  SessionNote,
  EducatorProfile,
} from '../../types/index.ts';
import { SessionNoteModal } from '../../components/SessionNoteModal.tsx';
import {
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Video,
  AlertTriangle,
  Sparkles,
  BookOpen,
  Settings,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Award,
} from 'lucide-react';

export const EducatorDashboard: React.FC = () => {
  const { currentUser, educatorProfile, showToast, refreshUserData } = useApp();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'appointments' | 'students' | 'notes' | 'availability' | 'profile'
  >('overview');

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [studentsAnalytics, setStudentsAnalytics] = useState<LearningAnalytics[]>([]);
  const [sessionNotes, setSessionNotes] = useState<SessionNote[]>([]);
  const [rejectionModalAppt, setRejectionModalAppt] = useState<Appointment | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [sessionNoteModalOpen, setSessionNoteModalOpen] = useState(false);
  const [selectedApptForNote, setSelectedApptForNote] = useState<Appointment | null>(null);

  const loadEducatorData = () => {
    if (!currentUser) return;

    fetch(`/api/appointments?educatorId=${currentUser.id}`)
      .then((res) => res.json())
      .then((data) => setAppointments(data))
      .catch((err) => console.error(err));

    fetch('/api/analytics/overview')
      .then((res) => res.json())
      .then((data) => setStudentsAnalytics(data.students || []))
      .catch((err) => console.error(err));

    fetch(`/api/session-notes?educatorId=${currentUser.id}`)
      .then((res) => res.json())
      .then((data) => setSessionNotes(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadEducatorData();
  }, [currentUser]);

  const handleUpdateStatus = async (apptId: string, status: string, reason?: string) => {
    try {
      const res = await fetch(`/api/appointments/${apptId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, rejectionReason: reason }),
      });
      if (res.ok) {
        showToast(`Appointment status updated to ${status}.`, 'success');
        loadEducatorData();
        setRejectionModalAppt(null);
        setRejectionReason('');
      }
    } catch (err) {
      showToast('Failed to update appointment status.', 'error');
    }
  };

  const pendingAppointments = appointments.filter((a) => a.status === 'Pending');
  const confirmedAppointments = appointments.filter((a) => a.status === 'Confirmed');
  const completedAppointments = appointments.filter((a) => a.status === 'Completed');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-900">
      {/* Session Note Modal */}
      <SessionNoteModal
        isOpen={sessionNoteModalOpen}
        appointment={selectedApptForNote}
        onClose={() => setSessionNoteModalOpen(false)}
        onSuccess={() => {
          showToast('Session notes recorded securely.', 'success');
          loadEducatorData();
        }}
      />

      {/* Rejection Reason Modal */}
      {rejectionModalAppt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full space-y-3 text-xs">
            <h3 className="font-bold text-sm text-slate-900">Decline Appointment Request</h3>
            <p className="text-slate-500">Provide a brief note for {rejectionModalAppt.studentName}:</p>
            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Departmental faculty meeting conflict, please select an alternate slot."
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setRejectionModalAppt(null)}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateStatus(rejectionModalAppt.id, 'Rejected', rejectionReason)}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg"
              >
                Confirm Decline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200/90 p-4 shrink-0 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100 flex items-center gap-3">
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-lg object-cover border border-slate-200"
            />
            <div className="min-w-0 flex-1">
              <div className="font-bold text-xs text-slate-900 truncate">{currentUser?.name}</div>
              <div className="text-[11px] text-purple-700 truncate font-medium">Verified Faculty</div>
            </div>
          </div>

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
              onClick={() => setActiveTab('appointments')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-left ${
                activeTab === 'appointments'
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4" />
                <span>Appointments</span>
              </div>
              {pendingAppointments.length > 0 && (
                <span className="text-[10px] bg-amber-500 text-white px-1.5 py-0.2 rounded font-bold">
                  {pendingAppointments.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('students')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors text-left ${
                activeTab === 'students'
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Student Risk Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('notes')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors text-left ${
                activeTab === 'notes'
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Session Notes</span>
            </button>

            <button
              onClick={() => setActiveTab('availability')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors text-left ${
                activeTab === 'availability'
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Availability Calendar</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors text-left ${
                activeTab === 'profile'
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Profile & Durations</span>
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-6xl">
        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Educator Portal · {currentUser?.name}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Review pending appointment requests, upcoming student sessions, and AI disengagement indicators.
              </p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
                <div className="text-[11px] font-semibold text-slate-500">Pending Requests</div>
                <div className="text-2xl font-extrabold text-amber-600 tabular-nums mt-1">
                  {pendingAppointments.length}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Requires review</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
                <div className="text-[11px] font-semibold text-slate-500">Confirmed Upcoming</div>
                <div className="text-2xl font-extrabold text-slate-900 tabular-nums mt-1">
                  {confirmedAppointments.length}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">On your active schedule</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
                <div className="text-[11px] font-semibold text-slate-500">Sessions Completed</div>
                <div className="text-2xl font-extrabold text-indigo-700 tabular-nums mt-1">
                  {completedAppointments.length}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Total student consults</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
                <div className="text-[11px] font-semibold text-slate-500">Student Satisfaction</div>
                <div className="text-2xl font-extrabold text-purple-700 tabular-nums mt-1">
                  {educatorProfile?.rating || 4.9} ★
                </div>
                <div className="text-[10px] text-slate-400 mt-1">From {educatorProfile?.reviewCount || 120} reviews</div>
              </div>
            </div>

            {/* Pending Requests Alert */}
            {pendingAppointments.length > 0 && (
              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Action Needed: Incoming Student Booking Requests ({pendingAppointments.length})</span>
                </div>
                <div className="space-y-2">
                  {pendingAppointments.map((appt) => (
                    <div
                      key={appt.id}
                      className="bg-white p-3.5 rounded-xl border border-amber-200/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs"
                    >
                      <div>
                        <div className="font-bold text-slate-900">
                          {appt.studentName} ({appt.studentEmail})
                        </div>
                        <div className="text-indigo-600 font-medium">
                          {appt.subject} · {appt.appointmentType} · {appt.durationMinutes} mins
                        </div>
                        <div className="text-slate-500 font-mono text-[11px]">
                          {appt.date} at {appt.timeSlot} · Reason: "{appt.reason}"
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateStatus(appt.id, 'Confirmed')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-sm"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => setRejectionModalAppt(appt)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Confirmed Sessions List */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
              <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                Confirmed Upcoming Consultations
              </h3>
              {confirmedAppointments.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">No confirmed upcoming sessions scheduled.</p>
              ) : (
                <div className="space-y-2.5">
                  {confirmedAppointments.map((appt) => (
                    <div
                      key={appt.id}
                      className="p-3.5 rounded-xl border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs hover:border-indigo-200"
                    >
                      <div>
                        <div className="font-bold text-slate-900">{appt.studentName}</div>
                        <div className="text-indigo-700 font-medium">{appt.subject} ({appt.appointmentType})</div>
                        <div className="text-slate-500 font-mono text-[11px]">{appt.date} at {appt.timeSlot} · {appt.durationMinutes} min</div>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={appt.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm flex items-center gap-1"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Launch Video</span>
                        </a>
                        <button
                          onClick={() => {
                            setSelectedApptForNote(appt);
                            setSessionNoteModalOpen(true);
                          }}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
                        >
                          Add Notes
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(appt.id, 'Completed')}
                          className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold rounded-lg border border-emerald-200"
                        >
                          Mark Completed
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* APPOINTMENTS TAB */}
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">All Appointment Records</h1>
              <p className="text-xs text-slate-500 mt-0.5">Manage schedules, accept requests, and document student consultations.</p>
            </div>

            <div className="space-y-3">
              {appointments.map((appt) => (
                <div
                  key={appt.id}
                  className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{appt.studentName}</span>
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
                    <div className="text-indigo-700 font-medium">{appt.subject} · {appt.appointmentType}</div>
                    <div className="text-slate-500 font-mono text-[11px]">{appt.date} at {appt.timeSlot} · Ref: {appt.id}</div>
                    <p className="text-slate-600 italic text-[11px]">"{appt.reason}"</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {appt.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(appt.id, 'Confirmed')}
                          className="px-3 py-1.5 bg-emerald-600 text-white font-semibold rounded-lg"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => setRejectionModalAppt(appt)}
                          className="px-3 py-1.5 bg-slate-100 text-slate-700 font-semibold rounded-lg"
                        >
                          Decline
                        </button>
                      </>
                    )}
                    {appt.status === 'Confirmed' && (
                      <>
                        <a
                          href={appt.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 bg-indigo-600 text-white font-semibold rounded-lg flex items-center gap-1"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Video</span>
                        </a>
                        <button
                          onClick={() => handleUpdateStatus(appt.id, 'Completed')}
                          className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold rounded-lg"
                        >
                          Complete
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => {
                        setSelectedApptForNote(appt);
                        setSessionNoteModalOpen(true);
                      }}
                      className="px-3 py-1.5 bg-slate-100 text-slate-700 font-semibold rounded-lg"
                    >
                      {appt.hasSessionNotes ? 'View/Edit Notes' : '+ Add Notes'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STUDENT RISK ANALYTICS */}
        {activeTab === 'students' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Student Learning Patterns & Risk Indicators</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Consented learning analytics highlighting early indicators of disengagement or prerequisite confusion.
              </p>
            </div>

            <div className="space-y-4">
              {studentsAnalytics.map((stu) => (
                <div
                  key={stu.studentId}
                  className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-3 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{stu.studentName}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            stu.overallRisk === 'High Concern'
                              ? 'bg-rose-100 text-rose-800'
                              : stu.overallRisk === 'Moderate Concern'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {stu.overallRisk}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Model Confidence: {stu.riskConfidence}% · Completion Rate: {stu.assignmentCompletionRate}% · Assessment Avg: {stu.assessmentAverage}%
                      </p>
                    </div>

                    <button
                      onClick={() => showToast(`Drafted outreach email to ${stu.studentName}.`, 'info')}
                      className="px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold rounded-lg"
                    >
                      Send Proactive Outreach
                    </button>
                  </div>

                  <p className="text-slate-700 leading-relaxed italic">
                    "{stu.summaryNote}"
                  </p>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                    <span className="font-bold text-slate-800 text-[11px]">Contributing Factors:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                      {stu.contributingFactors.map((f, i) => (
                        <div key={i} className="p-2 bg-white rounded border border-slate-200">
                          <span className="font-semibold text-slate-900">{f.factor}: </span>
                          <span className="text-slate-600">{f.detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 pt-1">
                    <span className="font-semibold text-slate-700">Recommended Educator Interventions: </span>
                    {stu.suggestedInterventions.join(' · ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SESSION NOTES */}
        {activeTab === 'notes' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Confidential Session Notes</h1>
              <p className="text-xs text-slate-500 mt-0.5">Secure documentation of student diagnostic observations, prescribed practice, and follow-ups.</p>
            </div>

            {sessionNotes.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
                No session notes written yet. Notes can be added directly to any appointment.
              </div>
            ) : (
              <div className="space-y-4">
                {sessionNotes.map((note) => (
                  <div
                    key={note.id}
                    className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-3 text-xs"
                  >
                    <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                      <div>
                        <span className="font-bold text-slate-900">{note.studentName}</span>
                        <span className="text-slate-400 ml-2">· {note.subject}</span>
                      </div>
                      <span className="text-slate-400 font-mono text-[11px]">{note.sessionDate}</span>
                    </div>

                    <div>
                      <span className="font-semibold text-slate-700 block mb-0.5">Observations:</span>
                      <p className="text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                        {note.keyObservations}
                      </p>
                    </div>

                    {note.recommendationsGiven && (
                      <div>
                        <span className="font-semibold text-slate-700 block mb-0.5">Prescribed Work:</span>
                        <p className="text-slate-600">{note.recommendationsGiven}</p>
                      </div>
                    )}

                    {note.nextSteps && (
                      <div className="text-[11px] text-indigo-700 font-medium">
                        Next steps: {note.nextSteps}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* AVAILABILITY CALENDAR */}
        {activeTab === 'availability' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Availability Schedule</h1>
              <p className="text-xs text-slate-500 mt-0.5">Manage the weekdays and recurring time slots when students can schedule sessions with you.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4 text-xs">
              <div className="space-y-3 divide-y divide-slate-100">
                {educatorProfile?.weeklyAvailability.map((avail) => (
                  <div key={avail.day} className="pt-3 first:pt-0 space-y-2">
                    <div className="flex justify-between items-center font-bold text-slate-900">
                      <span>{avail.day}</span>
                      <span className="text-indigo-600 font-normal">{avail.slots.length} Slots</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {avail.slots.map((slot) => (
                        <span
                          key={slot}
                          className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded font-mono text-xs border border-slate-200"
                        >
                          {slot}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PROFILE & SETTINGS */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Educator Qualifications & Durations</h1>
              <p className="text-xs text-slate-500 mt-0.5">Public profile credentials, allowed appointment durations, and subject tags.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Academic Title</label>
                <input
                  type="text"
                  readOnly
                  value={educatorProfile?.title}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Subject Specializations</label>
                <div className="flex flex-wrap gap-2">
                  {educatorProfile?.subjectSpecializations.map((sub) => (
                    <span key={sub} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg font-medium border border-indigo-200">
                      {sub}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Supported Appointment Durations</label>
                <div className="flex gap-2">
                  {[15, 30, 45, 60].map((mins) => (
                    <span
                      key={mins}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold ${
                        educatorProfile?.availableSlotDurations.includes(mins)
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-slate-100 text-slate-400 border-slate-200'
                      }`}
                    >
                      {mins} mins
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
