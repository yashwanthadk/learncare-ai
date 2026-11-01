import React, { useState } from 'react';
import type { Appointment } from '../types/index.ts';
import { X, FileText, CheckCircle } from 'lucide-react';

interface SessionNoteModalProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const SessionNoteModal: React.FC<SessionNoteModalProps> = ({
  appointment,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [keyObservations, setKeyObservations] = useState('');
  const [recommendationsGiven, setRecommendationsGiven] = useState('');
  const [nextSteps, setNextSteps] = useState('');
  const [followUpRequired, setFollowUpRequired] = useState(false);
  const [followUpDate, setFollowUpDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !appointment) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyObservations) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/session-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appointmentId: appointment.id,
          studentId: appointment.studentId,
          studentName: appointment.studentName,
          educatorId: appointment.educatorId,
          educatorName: appointment.educatorName,
          subject: appointment.subject,
          sessionDate: appointment.date,
          keyObservations,
          recommendationsGiven,
          nextSteps,
          followUpRequired,
          followUpDate: followUpRequired ? followUpDate : undefined,
        }),
      });

      if (res.ok) {
        onSuccess();
        onClose();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden text-slate-900">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Add Confidential Session Notes</h3>
            <p className="text-xs text-slate-500">Student: {appointment.studentName} · {appointment.subject}</p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Key Academic Observations & Bottlenecks *
            </label>
            <textarea
              rows={3}
              required
              value={keyObservations}
              onChange={(e) => setKeyObservations(e.target.value)}
              placeholder="e.g. Student grasped the initial integration theorem but experienced conceptual blockages during spherical Jacobian transforms..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Pedagogical Recommendations & Practice Prescribed
            </label>
            <textarea
              rows={2}
              value={recommendationsGiven}
              onChange={(e) => setRecommendationsGiven(e.target.value)}
              placeholder="e.g. Recommended visual coordinate graphing simulator and textbook problem set 8.1..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Actionable Next Steps for Student
            </label>
            <input
              type="text"
              value={nextSteps}
              onChange={(e) => setNextSteps(e.target.value)}
              placeholder="e.g. Complete review problems 3 & 4 and submit ahead of next quiz."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
              <input
                type="checkbox"
                checked={followUpRequired}
                onChange={(e) => setFollowUpRequired(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <span>Schedule follow-up check-in required</span>
            </label>

            {followUpRequired && (
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Suggested Follow-Up Date</label>
                <input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-xs bg-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !keyObservations}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Session Notes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
