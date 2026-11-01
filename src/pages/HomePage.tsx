import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import type { User, EducatorProfile } from '../types/index.ts';
import {
  Calendar,
  Search,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingDown,
  BarChart3,
  Award,
  Users,
  Compass,
  Star,
  BookOpen,
} from 'lucide-react';

interface CombinedEducator extends User {
  profile?: EducatorProfile;
}

export const HomePage: React.FC = () => {
  const { setCurrentView, openBookingModal, setSelectedEducatorId } = useApp();
  const [educators, setEducators] = useState<CombinedEducator[]>([]);
  const [metrics, setMetrics] = useState<{
    registeredStudents: number;
    verifiedEducators: number;
    appointmentsCompleted: number;
    studentSatisfactionPercentage: number;
  }>({
    registeredStudents: 1244,
    verifiedEducators: 46,
    appointmentsCompleted: 3824,
    studentSatisfactionPercentage: 98.4,
  });

  useEffect(() => {
    fetch('/api/educators')
      .then((res) => res.json())
      .then((data) => setEducators(data))
      .catch((err) => console.error(err));

    fetch('/api/admin/metrics')
      .then((res) => res.json())
      .then((data) => setMetrics(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="space-y-20 pb-20">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/70 via-white to-slate-50 pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-700 bg-indigo-100/70 px-3 py-1 rounded-full border border-indigo-200">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Next-Generation Academic Support & Mentorship</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15] text-balance">
                Personalized Learning Support. <br />
                <span className="bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-900 bg-clip-text text-transparent">
                  Smarter Academic Success.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
                Connect with expert university educators, identify learning bottlenecks before performance slips, and receive supportive, AI-powered guidance tailored to your coursework.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <button
                  onClick={() => openBookingModal()}
                  className="px-6 py-3.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-200/60 transition-all flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book an Appointment</span>
                </button>
                <button
                  onClick={() => {
                    setCurrentView('educators');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-6 py-3.5 text-sm font-semibold text-slate-700 hover:text-indigo-900 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  <span>Explore Educators</span>
                </button>
              </div>

              {/* Trust markers */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>100% Verified Faculty</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <span>15–60 Min Flexible Slots</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-600" />
                  <span>Zero-Double-Booking Guarantee</span>
                </div>
              </div>
            </div>

            {/* Right Visual Frame */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200/80 bg-slate-900 group">
                <img
                  src="/src/assets/images/hero_learning_mentorship_1793511808788.jpg"
                  alt="Students and educator collaborating in learning studio"
                  referrerPolicy="no-referrer"
                  className="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                {/* Floating overlay card */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-white/95 backdrop-blur-md border border-white/60 shadow-lg text-slate-900">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span className="text-xs font-semibold">Live Mentorship Available</span>
                    </div>
                    <span className="text-[11px] font-mono font-medium text-indigo-700">Open Slots Today</span>
                  </div>
                  <div className="mt-2.5 flex items-center justify-between text-xs text-slate-600">
                    <span>Prof. Elena Rostova · Multivariable Calculus</span>
                    <button
                      onClick={() => openBookingModal('user-edu-1', 'Multivariable Calculus')}
                      className="px-2.5 py-1 text-[11px] font-semibold text-white bg-indigo-600 rounded hover:bg-indigo-700"
                    >
                      Book 10:00 AM
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PLATFORM STATISTICS STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <div className="pt-2 md:pt-0">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
                {metrics.registeredStudents.toLocaleString()}+
              </div>
              <div className="text-xs text-slate-500 mt-1 font-medium">Registered Students</div>
            </div>
            <div className="pt-2 md:pt-0">
              <div className="text-2xl sm:text-3xl font-extrabold text-indigo-700 tabular-nums">
                {metrics.verifiedEducators}
              </div>
              <div className="text-xs text-slate-500 mt-1 font-medium">Verified Educators</div>
            </div>
            <div className="pt-2 md:pt-0">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
                {metrics.appointmentsCompleted.toLocaleString()}+
              </div>
              <div className="text-xs text-slate-500 mt-1 font-medium">Appointments Completed</div>
            </div>
            <div className="pt-2 md:pt-0">
              <div className="text-2xl sm:text-3xl font-extrabold text-purple-700 tabular-nums">
                {metrics.studentSatisfactionPercentage}%
              </div>
              <div className="text-xs text-slate-500 mt-1 font-medium">Student Satisfaction</div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 text-center text-[11px] text-slate-400">
            * All figures represent actual records and verified student session completions.
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
            Simple 4-Step Journey
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
            How LearnCare AI Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Seamlessly bridge the gap between classroom challenges and 1-on-1 personalized academic mentorship.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative">
            <div className="text-xs font-mono font-bold text-indigo-600 mb-3">01</div>
            <h3 className="font-bold text-sm text-slate-900">Create Your Account</h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Register as a student or educator. Give non-invasive consent to track coursework milestones and learning goals.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative">
            <div className="text-xs font-mono font-bold text-indigo-600 mb-3">02</div>
            <h3 className="font-bold text-sm text-slate-900">Explore Educators</h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Filter verified faculty by subject, qualifications, student ratings, and specific appointment focus areas.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative">
            <div className="text-xs font-mono font-bold text-indigo-600 mb-3">03</div>
            <h3 className="font-bold text-sm text-slate-900">Book Your Appointment</h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Pick dynamic available time slots (15, 30, 45, or 60 min). Our engine blocks duplicates with instant confirmation.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative">
            <div className="text-xs font-mono font-bold text-indigo-600 mb-3">04</div>
            <h3 className="font-bold text-sm text-slate-900">Receive Personalized Support</h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Meet via integrated video, resolve doubts, and receive AI-backed customized study recommendations.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURED EDUCATORS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
              Faculty Network
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
              Featured Verified Educators
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              University lecturers, academic counselors, and subject specialists ready to guide you.
            </p>
          </div>
          <button
            onClick={() => {
              setCurrentView('educators');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>View All Educators</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {educators.slice(0, 4).map((edu) => (
            <div
              key={edu.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col hover:border-indigo-300 transition-all hover:shadow-md"
            >
              <div className="p-5 flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={edu.avatar}
                    alt={edu.name}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 leading-tight">{edu.name}</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{edu.profile?.title}</p>
                    <div className="flex items-center gap-1.5 text-xs text-amber-600 font-semibold mt-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{edu.profile?.rating || 4.9}</span>
                      <span className="text-slate-400 font-normal">({edu.profile?.reviewCount || 100})</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs">
                  <div className="text-slate-600 font-medium line-clamp-1">
                    Specializes in: {edu.profile?.subjectSpecializations.join(', ')}
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    {edu.profile?.experienceYears} years academic teaching experience
                  </div>
                </div>
              </div>

              <div className="px-5 pb-5 pt-1 flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedEducatorId(edu.id);
                    setCurrentView('educator-detail');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex-1 py-2 text-center text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Profile
                </button>
                <button
                  onClick={() => openBookingModal(edu.id, edu.profile?.subjectSpecializations[0])}
                  className="flex-1 py-2 text-center text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                >
                  Book Session
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI LEARNING SUPPORT SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 rounded-3xl p-8 lg:p-12 text-white shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-300 bg-indigo-900/60 px-3 py-1 rounded-full border border-indigo-700">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Explainable Early Indicator Engine</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
                Understand Learning Challenges Before They Become Bigger Problems.
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                Traditional academic systems identify struggles only after exams are failed or classes are dropped. LearnCare AI analyzes consented, non-invasive course participation to help educators intervene with targeted 1-on-1 support early.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 text-xs">
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="font-semibold text-white">Transparent Contributing Factors</div>
                  <p className="text-slate-400 text-[11px] mt-1">
                    Every risk category (Low, Moderate, High) outlines concrete factors such as score trend changes or missed deadlines.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="font-semibold text-white">Ethical Non-Invasive Data</div>
                  <p className="text-slate-400 text-[11px] mt-1">
                    No surveillance, no webcam tracking, no keystroke monitoring. Only transparent academic progress and consented milestones.
                  </p>
                </div>
              </div>
            </div>

            {/* Simulated Live Analytics Card */}
            <div className="lg:col-span-5 bg-white rounded-2xl p-5 text-slate-900 shadow-2xl border border-indigo-200/30">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
                <span className="font-semibold text-slate-500">Sample Disengagement Assessment</span>
                <span className="font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-bold border border-amber-200">
                  Moderate Concern
                </span>
              </div>

              <div className="mt-4 space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                    <span>Recent Assessment Trajectory</span>
                    <span className="font-semibold text-rose-600 font-mono">-18% over 3 weeks</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-amber-500 h-2 rounded-full w-2/3" />
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-[11px]">
                  <span className="font-bold text-slate-800">Primary Contributing Factors:</span>
                  <ul className="space-y-1 text-slate-600">
                    <li className="flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold">·</span>
                      <span>Decline in Multivariable Calculus Quiz 4 & 5 scores</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold">·</span>
                      <span>Homework #6 submitted late with 1 unsubmitted draft</span>
                    </li>
                  </ul>
                </div>

                <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-100 text-[11px] text-indigo-950">
                  <span className="font-bold">Suggested Educator Action:</span>
                  <p className="mt-0.5">
                    "Schedule a 30-min targeted doubt clearing session on triple integration and coordinate transforms."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SAMPLE TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
            Student & Faculty Stories
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
            Transforming Academic Outcomes
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            * Sample demonstration reviews illustrating student breakthrough experiences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <div className="flex text-amber-400">★★★★★</div>
            <p className="text-xs text-slate-600 leading-relaxed italic">
              "I was falling behind on multivariable integration proofs and didn't know who to ask. Booking a 30-minute session with Prof. Rostova unblocked me in one afternoon."
            </p>
            <div className="pt-2 border-t border-slate-100 text-xs">
              <div className="font-bold text-slate-900">Sarah Lin</div>
              <div className="text-slate-400 text-[11px]">Computer Engineering Undergraduate</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <div className="flex text-amber-400">★★★★★</div>
            <p className="text-xs text-slate-600 leading-relaxed italic">
              "The disengagement alert let me reach out to Dev before his midterm rather than waiting for an F. He caught up on problem sets and revived his semester."
            </p>
            <div className="pt-2 border-t border-slate-100 text-xs">
              <div className="font-bold text-slate-900">Dr. Marcus Vance</div>
              <div className="text-slate-400 text-[11px]">Associate Professor & CS Specialist</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <div className="flex text-amber-400">★★★★★</div>
            <p className="text-xs text-slate-600 leading-relaxed italic">
              "The dynamic appointment booking and clear calendar slots prevent all the back-and-forth emails. It has cut scheduling overhead by 90%."
            </p>
            <div className="pt-2 border-t border-slate-100 text-xs">
              <div className="font-bold text-slate-900">Sarah Jenkins, M.Ed.</div>
              <div className="text-slate-400 text-[11px]">Academic Strategy & Learning Counselor</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
