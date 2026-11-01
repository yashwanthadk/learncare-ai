import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import type { User, EducatorProfile, Feedback } from '../types/index.ts';
import {
  Calendar,
  Star,
  Award,
  CheckCircle,
  ArrowLeft,
  Clock,
  BookOpen,
  MessageSquare,
  Shield,
} from 'lucide-react';

interface EducatorDetailData {
  user: User;
  profile: EducatorProfile;
  feedbacks: Feedback[];
}

export const EducatorDetailPage: React.FC = () => {
  const { selectedEducatorId, setCurrentView, openBookingModal } = useApp();
  const [data, setData] = useState<EducatorDetailData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedEducatorId) {
      setLoading(true);
      fetch(`/api/educators/${selectedEducatorId}`)
        .then((res) => res.json())
        .then((result) => {
          setData(result);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [selectedEducatorId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-xs text-slate-400">
        Loading educator profile...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <p className="text-slate-600">Educator not found.</p>
        <button
          onClick={() => setCurrentView('educators')}
          className="px-4 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-lg"
        >
          Return to Educators Directory
        </button>
      </div>
    );
  }

  const { user, profile, feedbacks } = data;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <button
        onClick={() => setCurrentView('educators')}
        className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Educators</span>
      </button>

      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-start gap-5">
            <img
              src={user.avatar}
              alt={user.name}
              referrerPolicy="no-referrer"
              className="w-20 h-20 rounded-2xl object-cover border border-slate-200 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{user.name}</h1>
                {profile.isVerified && (
                  <span title="Verified Faculty Member" className="inline-flex">
                    <CheckCircle className="w-5 h-5 text-indigo-600" />
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-600 font-medium mt-0.5">{profile.title}</p>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
                <div className="flex items-center gap-1 text-amber-600 font-semibold">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{profile.rating}</span>
                </div>
                <span>·</span>
                <span>{profile.experienceYears} Years Academic Experience</span>
                <span>·</span>
                <span className="font-semibold text-emerald-600">Active Faculty</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => openBookingModal(user.id, profile.subjectSpecializations[0])}
            className="w-full sm:w-auto px-6 py-3 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Book 1-on-1 Appointment</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Bio & Experience) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Biography */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-3">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-xs">
              About & Pedagogical Philosophy
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {profile.bio}
            </p>
          </div>

          {/* Academic Qualifications */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-3">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-xs">
              Degrees & Honors
            </h2>
            <div className="space-y-2">
              {profile.qualifications.map((q, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                  <Award className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span>{q}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Student Reviews */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-xs">
                Student Feedback & Ratings
              </h2>
              <span className="text-xs font-semibold text-amber-600">
                ★ {profile.rating} average
              </span>
            </div>

            {feedbacks.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                No public student reviews logged yet for this educator.
              </p>
            ) : (
              <div className="space-y-3">
                {feedbacks.map((fb) => (
                  <div key={fb.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800">{fb.studentName}</span>
                      <span className="text-amber-500 font-mono">{'★'.repeat(fb.rating)}</span>
                    </div>
                    <div className="text-[11px] font-semibold text-indigo-700">
                      {fb.helpfulnessCategory}
                    </div>
                    <p className="text-xs text-slate-600 italic">
                      "{fb.comments}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (Availability & Subjects) */}
        <div className="space-y-6">
          {/* Subjects */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-3">
            <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
              Subject Specializations
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {profile.subjectSpecializations.map((sub) => (
                <span
                  key={sub}
                  className="px-2.5 py-1 text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg"
                >
                  {sub}
                </span>
              ))}
            </div>
          </div>

          {/* Weekly Schedule */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-3 text-xs">
            <h3 className="font-bold text-slate-900 uppercase tracking-wider">
              Weekly Office Hours Availability
            </h3>
            <div className="space-y-2 divide-y divide-slate-100">
              {profile.weeklyAvailability.map((sched) => (
                <div key={sched.day} className="pt-2 flex justify-between items-center text-slate-600">
                  <span className="font-semibold text-slate-800">{sched.day}</span>
                  <span className="text-[11px] text-indigo-600 font-medium">
                    {sched.slots.length} slots available
                  </span>
                </div>
              ))}
            </div>
            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400">
              Available durations: {profile.availableSlotDurations.map((d) => `${d} min`).join(', ')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
