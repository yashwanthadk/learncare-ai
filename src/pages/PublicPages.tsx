import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  Shield,
  GraduationCap,
  Sparkles,
  BookOpen,
  Calendar,
  Clock,
  Send,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Lock,
  EyeOff,
  UserCheck,
  CheckCircle2,
} from 'lucide-react';

// --- ABOUT US ---
export const AboutPage: React.FC = () => {
  const { setCurrentView, openBookingModal } = useApp();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 text-slate-800">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
          Our Educational Mission
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Pioneering Proactive Academic Mentorship
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed">
          LearnCare AI was created to solve the fundamental lag in modern higher education: students getting stuck in silent frustration until exam failure forces intervention.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            01
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Early Detection Without Intrusion</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            We use non-invasive milestone markers (assignment timeliness, conceptual variance, practice frequency) rather than surveillance to identify students needing support.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            02
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Human Mentorship at the Center</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            AI is a supportive diagnostic compass, never a substitute for an empathetic educator. Our booking engine connects students with real faculty.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            03
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Democratizing Academic Recovery</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Every learner encounters conceptual roadblocks. LearnCare AI normalizes seeking support and eliminates the friction of office-hour scheduling.
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-3xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <h3 className="text-xl font-bold">Ready to connect with an educator?</h3>
          <p className="text-xs text-indigo-200 max-w-lg">
            Schedule a flexible 15 to 60 minute appointment with our verified faculty across STEM and academic strategies.
          </p>
        </div>
        <button
          onClick={() => openBookingModal()}
          className="px-6 py-3 text-xs font-semibold text-indigo-950 bg-white hover:bg-slate-100 rounded-xl shadow-md transition-all whitespace-nowrap shrink-0"
        >
          Book an Appointment
        </button>
      </div>
    </div>
  );
};

// --- HOW IT WORKS ---
export const HowItWorksPage: React.FC = () => {
  const { openBookingModal } = useApp();

  const steps = [
    {
      num: '01',
      title: 'Consent-First Student Onboarding',
      desc: 'Students create an account and grant permission for non-invasive academic milestone tracking. We never use webcams, audio, or invasive monitoring.',
    },
    {
      num: '02',
      title: 'Continuous Ethical Learning Analytics',
      desc: 'Our engine monitors assignment completion streaks, quiz variances, and study pacing to compute supportive, explainable indicators: Low, Moderate, or High Concern.',
    },
    {
      num: '03',
      title: 'Actionable AI Recommendations',
      desc: 'Students and advisors receive tailored study strategies, recommended practice modules, and suggested consultation durations powered by Gemini AI.',
    },
    {
      num: '04',
      title: '1-Click Conflict-Free Booking',
      desc: 'Students book personalized 15, 30, 45, or 60 minute consultations. Real-time locks prevent double bookings and automatically assign video rooms.',
    },
    {
      num: '05',
      title: 'Post-Session Follow-Up & Notes',
      desc: 'Educators document clinical observations and next steps securely, tracking student confidence and academic trajectory over the semester.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
          Architecture & Workflow
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          How LearnCare AI Works
        </h1>
        <p className="text-sm text-slate-500">
          A seamless ecosystem connecting early academic signal detection with real educator consultations.
        </p>
      </div>

      <div className="space-y-4">
        {steps.map((st) => (
          <div
            key={st.num}
            className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex items-start gap-5"
          >
            <div className="text-base font-mono font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100">
              {st.num}
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-slate-900">{st.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{st.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center pt-4">
        <button
          onClick={() => openBookingModal()}
          className="px-6 py-3 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-all"
        >
          Book Your First Session
        </button>
      </div>
    </div>
  );
};

// --- SERVICES ---
export const ServicesPage: React.FC = () => {
  const { openBookingModal } = useApp();

  const services = [
    {
      title: 'Subject Doubt Clearing',
      duration: '15 – 30 mins',
      desc: 'Direct, focused resolution of tricky proofs, algorithmic edge-cases, formula derivations, or laboratory calculations with subject specialists.',
    },
    {
      title: 'Learning Difficulties Support',
      duration: '30 – 45 mins',
      desc: 'Diagnostic consultations for persistent roadblocks, prerequisite skill gaps, and conceptual misunderstandings across challenging coursework.',
    },
    {
      title: 'Study Planning & Pacing',
      duration: '30 – 45 mins',
      desc: 'Structured weekly study calendars, Pomodoro intervals, and prioritization plans designed to beat procrastination and prevent burnout.',
    },
    {
      title: 'Performance Improvement & Exam Turnaround',
      duration: '45 – 60 mins',
      desc: 'Targeted interventions following low midterm or quiz results. Re-evaluates test preparation habits and constructs high-impact revision roadmaps.',
    },
    {
      title: 'Learning Motivation & Re-engagement',
      duration: '30 – 45 mins',
      desc: 'Compassionate guidance from certified academic counselors for students facing mid-semester slumps, imposter syndrome, or academic disengagement.',
    },
    {
      title: 'Academic Guidance & Course Selection',
      duration: '30 – 45 mins',
      desc: 'Long-term curriculum planning, engineering prerequisites, graduate research opportunities, and faculty recommendation navigation.',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
          Appointment Types & Mentorship
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Personalized Academic Services
        </h1>
        <p className="text-sm text-slate-500">
          Tailored support options designed for every stage of your university coursework.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((svc) => (
          <div
            key={svc.title}
            className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-indigo-600">{svc.duration}</span>
                <Clock className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">{svc.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{svc.desc}</p>
            </div>
            <button
              onClick={() => openBookingModal()}
              className="w-full py-2 text-xs font-semibold text-slate-700 hover:text-white bg-slate-100 hover:bg-indigo-600 rounded-lg transition-colors"
            >
              Book This Service
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- CONTACT US ---
export const ContactPage: React.FC = () => {
  const { showToast } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    showToast('Your message has been received. Our team will follow up within 24 hours.', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Contact LearnCare AI Support
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Have questions about educator onboarding, institutional LMS integration, or booking support? We are here to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 text-xs">
          <h3 className="font-bold text-slate-900 text-sm">Direct Contacts</h3>
          <div>
            <div className="font-semibold text-slate-700">Student & Booking Support</div>
            <div className="text-slate-500">support@learncare.ai</div>
          </div>
          <div>
            <div className="font-semibold text-slate-700">Faculty & Institutional Partnerships</div>
            <div className="text-slate-500">educators@learncare.ai</div>
          </div>
          <div>
            <div className="font-semibold text-slate-700">Privacy & Data Governance Officer</div>
            <div className="text-slate-500">privacy@learncare.ai</div>
          </div>
          <div className="pt-2 border-t border-slate-200 text-slate-400">
            Support hours: Mon–Fri, 8:00 AM – 8:00 PM EST
          </div>
        </div>

        <div className="md:col-span-2 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-sm">
          {sent ? (
            <div className="py-12 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">Message Delivered</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Thank you for reaching out. An academic support coordinator will respond to {email} shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="Sarah Lin"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Your Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="sarah.lin@university.edu"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Inquiry Subject *</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. Question regarding rescheduling policy"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Message *</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="How can our support team assist you today?"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

// --- FAQ & POLICIES ---
export const FAQPage: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does LearnCare AI identify student learning difficulties?',
      a: 'We evaluate non-invasive academic indicators—such as submission timeliness on problem sets, score variances across quizzes, and study platform pacing. Our model groups these into Low, Moderate, or High Concern categories with explainable contributing factors. We never make permanent judgments, and we never claim infallible accuracy.',
    },
    {
      q: 'Does LearnCare AI use webcam, microphone, or keystroke tracking?',
      a: 'Absolutely not. We have an unwavering anti-surveillance privacy commitment. No webcam monitoring, no microphone listening, no keystroke tracking, and no screen capture. All analytics are strictly non-invasive academic milestone metrics.',
    },
    {
      q: 'What is the appointment cancellation and rescheduling policy?',
      a: 'Students may cancel or reschedule appointments at any time up to 2 hours prior to the session start time directly through their student dashboard. When rescheduled, the educator schedule updates in real-time to free up the previous slot.',
    },
    {
      q: 'How does LearnCare AI prevent double bookings?',
      a: 'Our booking engine uses strict server-side concurrency checking. Once an appointment is confirmed, the specific educator, date, and time slot are atomically locked, preventing any overlapping bookings.',
    },
    {
      q: 'Can students review and delete their learning data?',
      a: 'Yes. Students maintain full agency over their data. In the student settings panel, you can withdraw consent at any time, download your session history, or request full record deletion.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Everything you need to know about our booking policies, AI model transparency, and student data protection.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden"
          >
            <button
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 focus:outline-none"
            >
              <span className="font-semibold text-xs sm:text-sm text-slate-900">{faq.q}</span>
              {openIdx === idx ? (
                <ChevronUp className="w-4 h-4 text-indigo-600 shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
              )}
            </button>
            {openIdx === idx && (
              <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// --- PRIVACY POLICY ---
export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-slate-800 text-xs sm:text-sm leading-relaxed">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Privacy Policy & Ethical Data Commitments
        </h1>
        <p className="text-xs text-slate-500 mt-1">Last Updated: October 31, 2026</p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-sm space-y-6">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">1. Core Privacy Philosophy</h2>
          <p className="text-slate-600">
            LearnCare AI is designed to empower learners through proactive support, never disciplinary monitoring. Student educational records are confidential and processed strictly to identify academic challenges early.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">2. Strictly Prohibited Surveillance Practices</h2>
          <p className="text-slate-600">
            LearnCare AI strictly prohibits and does not implement:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600 text-xs">
            <li>No webcam or video surveillance of study environments.</li>
            <li>No microphone or ambient audio recording.</li>
            <li>No keystroke or biometric pressure tracking.</li>
            <li>No unauthorized screen monitoring or browser tab tracking.</li>
            <li>No invasive behavioural profiling or third-party ad data sharing.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">3. Consensual Non-Invasive Data Collected</h2>
          <p className="text-slate-600 text-xs">
            We only process educational milestone data provided with student consent: assignment completion timestamps, assessment score trends, self-reported learning goals, and course participation frequencies.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">4. Student Rights: Review, Withdraw, and Delete</h2>
          <p className="text-slate-600 text-xs">
            Students retain the right at any time to:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600 text-xs">
            <li>Review all historical data and AI risk predictions in their dashboard.</li>
            <li>Withdraw processing consent immediately through profile settings.</li>
            <li>Request permanent deletion of their account and appointment history.</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

// --- TERMS AND CONDITIONS ---
export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-slate-800 text-xs sm:text-sm leading-relaxed">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Terms of Service & Booking Policies
        </h1>
        <p className="text-xs text-slate-500 mt-1">Effective: October 2026</p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-sm space-y-6">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">1. Platform Services</h2>
          <p className="text-slate-600 text-xs">
            LearnCare AI provides academic appointment scheduling, personalized learning analytics, and educator consultation workflows for higher education students and mentors.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">2. Non-Diagnostic Disclaimer</h2>
          <p className="text-slate-600 text-xs">
            AI-generated risk indicators (Low, Moderate, High Concern) represent probabilistic academic assistance markers and are not psychological, medical, or official institutional grading evaluations.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">3. Booking, Attendance, and Code of Conduct</h2>
          <p className="text-slate-600 text-xs">
            Students and educators agree to mutual respect during appointments. Double booking is disallowed by the platform scheduling engine. Rescheduling is allowed up to 2 hours in advance.
          </p>
        </section>
      </div>
    </div>
  );
};
