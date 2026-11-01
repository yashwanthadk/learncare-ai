import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import type { AppointmentType, Appointment } from '../types/index.ts';
import {
  X,
  Calendar as CalendarIcon,
  Clock,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  GraduationCap,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';

interface EducatorOption {
  id: string;
  name: string;
  avatar: string;
  profile?: {
    title: string;
    subjectSpecializations: string[];
    availableSlotDurations: number[];
    rating: number;
    experienceYears: number;
  };
}

export const BookingModal: React.FC = () => {
  const {
    bookingModalOpen,
    bookingEducatorId,
    bookingPreselectedSubject,
    closeBookingModal,
    currentUser,
    showToast,
    setCurrentView,
  } = useApp();

  // Wizard state
  const [step, setStep] = useState<number>(1);
  const [educators, setEducators] = useState<EducatorOption[]>([]);
  const [selectedEducator, setSelectedEducator] = useState<EducatorOption | null>(null);

  // Form selections
  const [appointmentType, setAppointmentType] = useState<AppointmentType>('Learning Difficulties Support');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<{ time: string; isAvailable: boolean }[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [durationMinutes, setDurationMinutes] = useState<number>(30);
  const [subject, setSubject] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [additionalNotes, setAdditionalNotes] = useState<string>('');
  const [studentName, setStudentName] = useState<string>('');
  const [studentEmail, setStudentEmail] = useState<string>('');

  // Status & Confirmation
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  // Load educators on open
  useEffect(() => {
    if (bookingModalOpen) {
      fetch('/api/educators')
        .then((res) => res.json())
        .then((data) => {
          setEducators(data);
          if (bookingEducatorId) {
            const found = data.find((e: EducatorOption) => e.id === bookingEducatorId);
            if (found) {
              setSelectedEducator(found);
              setStep(2); // Jump to step 2 if educator already chosen
            }
          }
        });

      if (currentUser) {
        setStudentName(currentUser.name);
        setStudentEmail(currentUser.email);
      }

      if (bookingPreselectedSubject) {
        setSubject(bookingPreselectedSubject);
      }

      // Default tomorrow date (YYYY-MM-DD)
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const yyyy = tomorrow.getFullYear();
      const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
      const dd = String(tomorrow.getDate()).padStart(2, '0');
      setSelectedDate(`${yyyy}-${mm}-${dd}`);
    } else {
      // Reset wizard
      setStep(1);
      setSelectedEducator(null);
      setSelectedTimeSlot('');
      setBookingError(null);
      setConfirmedAppointment(null);
    }
  }, [bookingModalOpen, bookingEducatorId, bookingPreselectedSubject, currentUser]);

  // Fetch dynamic slots whenever educator or date changes
  useEffect(() => {
    if (selectedEducator && selectedDate) {
      setIsLoadingSlots(true);
      setSelectedTimeSlot('');
      fetch(`/api/educators/${selectedEducator.id}/slots?date=${selectedDate}`)
        .then((res) => res.json())
        .then((data) => {
          setAvailableSlots(data.slots || []);
          setIsLoadingSlots(false);
        })
        .catch(() => {
          setIsLoadingSlots(false);
        });
    }
  }, [selectedEducator, selectedDate]);

  if (!bookingModalOpen) return null;

  const appointmentTypes: AppointmentType[] = [
    'Academic Guidance',
    'Subject Doubt Clearing',
    'Learning Difficulties Support',
    'Study Planning',
    'Performance Improvement',
    'Learning Motivation Support',
    'Personalized Mentoring',
  ];

  const handleConfirmBooking = async () => {
    if (!selectedEducator || !selectedDate || !selectedTimeSlot || !subject) {
      setBookingError('Please ensure all required fields are filled out.');
      return;
    }

    setIsSubmitting(true);
    setBookingError(null);

    try {
      const payload = {
        studentId: currentUser?.id || 'user-std-1',
        studentName: studentName || currentUser?.name || 'Sarah Lin',
        studentEmail: studentEmail || currentUser?.email || 'sarah.lin@university.edu',
        educatorId: selectedEducator.id,
        educatorName: selectedEducator.name,
        educatorTitle: selectedEducator.profile?.title || 'Academic Educator',
        educatorAvatar: selectedEducator.avatar,
        appointmentType,
        subject,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        durationMinutes,
        reason: reason || `${appointmentType} in ${subject}`,
        additionalNotes,
      };

      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setConfirmedAppointment(data);
        setStep(9); // Step 9: Confirmation Screen
        showToast('Appointment successfully booked!', 'success');
      } else {
        setBookingError(data.error || 'Failed to complete booking.');
      }
    } catch (err) {
      setBookingError('Network error while securing appointment slot. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMinDateString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden text-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
          <div>
            <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
              {step < 9 ? `Step ${step} of 8 · Booking Flow` : 'Booking Confirmed'}
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              {step === 1 && 'Select an Educator'}
              {step === 2 && 'Choose Appointment Type'}
              {step === 3 && 'Select Appointment Date'}
              {step === 4 && 'Choose Available Time Slot'}
              {step === 5 && 'Select Duration'}
              {step === 6 && 'Enter Session Details'}
              {step === 7 && 'Review Booking'}
              {step === 8 && 'Confirm Appointment'}
              {step === 9 && 'Appointment Scheduled'}
            </h2>
          </div>
          <button
            onClick={closeBookingModal}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* STEP 1: Select Educator */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Choose an expert educator or academic mentor best aligned with your subject challenge.
              </p>
              <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                {educators.map((edu) => (
                  <div
                    key={edu.id}
                    onClick={() => {
                      setSelectedEducator(edu);
                      if (!subject && edu.profile?.subjectSpecializations[0]) {
                        setSubject(edu.profile.subjectSpecializations[0]);
                      }
                    }}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      selectedEducator?.id === edu.id
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <img
                        src={edu.avatar}
                        alt={edu.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                      />
                      <div>
                        <div className="font-semibold text-sm text-slate-900">{edu.name}</div>
                        <div className="text-xs text-slate-500">{edu.profile?.title}</div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                          <span>{edu.profile?.experienceYears} yrs exp</span>
                          <span>·</span>
                          <span className="text-amber-600 font-medium">★ {edu.profile?.rating || 4.9}</span>
                        </div>
                      </div>
                    </div>
                    {selectedEducator?.id === edu.id && (
                      <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Choose Appointment Type */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Select the specific nature of support you need for this consultation.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {appointmentTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setAppointmentType(type)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      appointmentType === type
                        ? 'border-indigo-600 bg-indigo-50/60 shadow-sm text-indigo-950 font-semibold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="text-xs font-semibold">{type}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {type === 'Learning Difficulties Support' && 'Target persistent roadblocks and prerequisite gaps'}
                      {type === 'Subject Doubt Clearing' && 'Clarify specific problem set formulas or theories'}
                      {type === 'Academic Guidance' && 'Semester planning and subject course trajectory'}
                      {type === 'Study Planning' && 'Structured weekly cadence and anti-procrastination'}
                      {type === 'Performance Improvement' && 'Targeted exam turnaround strategies'}
                      {type === 'Learning Motivation Support' && 'Re-engagement support and study burnout reduction'}
                      {type === 'Personalized Mentoring' && 'Long-term intellectual & career development'}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Select Date */}
          {step === 3 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Select an upcoming day to meet with <span className="font-semibold text-slate-700">{selectedEducator?.name}</span>.
              </p>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <label className="block text-xs font-semibold text-slate-700">
                  Appointment Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    min={getMinDateString()}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-white px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  <CalendarIcon className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                </div>
                <div className="text-[11px] text-slate-500">
                  Educator availability: {selectedEducator?.profile?.title}. Available on scheduled weekdays.
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Choose Available Slot */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Available time slots for {selectedDate}:</span>
                <span className="text-[11px] text-slate-400">All times in your local timezone</span>
              </div>

              {isLoadingSlots ? (
                <div className="py-12 text-center text-xs text-slate-400 animate-pulse">
                  Querying real-time educator availability...
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="p-6 text-center rounded-xl bg-slate-50 border border-slate-200">
                  <Clock className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-700">No open slots on this date</p>
                  <p className="text-xs text-slate-500 mt-1">
                    The educator is either fully booked or not scheduled on this day of the week. Please select another date.
                  </p>
                  <button
                    onClick={() => setStep(3)}
                    className="mt-3 px-3 py-1.5 text-xs text-indigo-600 font-semibold hover:underline"
                  >
                    ← Pick Another Date
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot.time}
                      type="button"
                      disabled={!slot.isAvailable}
                      onClick={() => setSelectedTimeSlot(slot.time)}
                      className={`py-2.5 px-3 rounded-lg border text-xs font-medium transition-all ${
                        !slot.isAvailable
                          ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through'
                          : selectedTimeSlot === slot.time
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm font-semibold'
                          : 'bg-white text-slate-800 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30'
                      }`}
                    >
                      {slot.time} {!slot.isAvailable && '(Booked)'}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STEP 5: Select Duration */}
          {step === 5 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Choose how long you would like the consultation to run.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[15, 30, 45, 60].map((mins) => {
                  const isSupported = selectedEducator?.profile?.availableSlotDurations.includes(mins) ?? true;
                  return (
                    <button
                      key={mins}
                      type="button"
                      disabled={!isSupported}
                      onClick={() => setDurationMinutes(mins)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        !isSupported
                          ? 'opacity-40 cursor-not-allowed border-slate-200'
                          : durationMinutes === mins
                          ? 'border-indigo-600 bg-indigo-50/60 font-semibold text-indigo-900 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="text-base font-bold">{mins} Minutes</div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {mins === 15 && 'Quick concept check or single formula roadblock'}
                        {mins === 30 && 'Standard doubt clearing & problem breakdown'}
                        {mins === 45 && 'Deep-dive session & structured catch-up plan'}
                        {mins === 60 && 'Comprehensive academic review & assessment prep'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 6: Enter Details */}
          {step === 6 && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Student Name</label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="Sarah Lin"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Student Email</label>
                  <input
                    type="email"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="sarah.lin@university.edu"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subject / Course Name *</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="e.g. Multivariable Calculus, Algorithms & Complexity"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Primary Reason for Appointment *</label>
                <textarea
                  rows={2}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="Briefly describe what you're hoping to unblock during this session..."
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Additional Message / Question Context (Optional)</label>
                <textarea
                  rows={2}
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="e.g. Have already reviewed Chapter 4, stuck on problem set 3."
                />
              </div>
            </div>
          )}

          {/* STEP 7: Review Booking Details */}
          {step === 7 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Please verify all appointment details prior to reservation.
              </p>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 divide-y divide-slate-200/80 text-xs">
                <div className="pb-3 flex items-center justify-between">
                  <span className="text-slate-500">Educator:</span>
                  <span className="font-semibold text-slate-900">{selectedEducator?.name}</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500">Session Type:</span>
                  <span className="font-semibold text-indigo-700">{appointmentType}</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500">Subject:</span>
                  <span className="font-semibold text-slate-900">{subject}</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500">Scheduled Time:</span>
                  <span className="font-semibold text-slate-900 font-mono">
                    {selectedDate} at {selectedTimeSlot}
                  </span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500">Duration:</span>
                  <span className="font-semibold text-slate-900 font-mono">{durationMinutes} mins</span>
                </div>
                <div className="pt-3">
                  <span className="text-slate-500 block mb-1">Stated Reason:</span>
                  <p className="text-slate-800 italic bg-white p-2.5 rounded border border-slate-200">
                    "{reason || 'Academic support consultation'}"
                  </p>
                </div>
              </div>

              {bookingError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{bookingError}</span>
                </div>
              )}
            </div>
          )}

          {/* STEP 8: Confirm Appointment (Pre-flight check) */}
          {step === 8 && (
            <div className="space-y-4 text-center py-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Ready to Confirm Appointment?</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                By confirming, the slot will be locked in the central schedule to prevent any double-booking. Both you and {selectedEducator?.name} will receive automated session links and calendar invites.
              </p>

              {bookingError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs text-left flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{bookingError}</span>
                </div>
              )}

              <div className="pt-2">
                <button
                  disabled={isSubmitting}
                  onClick={handleConfirmBooking}
                  className="px-6 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Securing Slot in Database...' : 'Confirm & Schedule Now'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 9: Confirmation Screen */}
          {step === 9 && confirmedAppointment && (
            <div className="space-y-4 text-center py-3">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Appointment Confirmed!</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Your session has been officially reserved and saved to the database.
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs text-left space-y-2">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Appointment Reference:</span>
                  <span className="font-mono font-bold text-indigo-700">{confirmedAppointment.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Educator:</span>
                  <span className="font-semibold text-slate-900">{confirmedAppointment.educatorName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Date & Time:</span>
                  <span className="font-mono text-slate-900">
                    {confirmedAppointment.date} · {confirmedAppointment.timeSlot} ({confirmedAppointment.durationMinutes} min)
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                  <span className="text-slate-500">Video Room:</span>
                  <a
                    href={confirmedAppointment.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 hover:underline font-mono truncate max-w-[200px]"
                  >
                    {confirmedAppointment.meetingLink}
                  </a>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    closeBookingModal();
                    setCurrentView('student-dashboard');
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-900 hover:bg-indigo-800 rounded-lg shadow-sm"
                >
                  View in My Appointments
                </button>
                <button
                  onClick={closeBookingModal}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer Navigation Controls (Steps 1 to 7) */}
        {step < 8 && (
          <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-100 bg-slate-50/60">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              disabled={
                (step === 1 && !selectedEducator) ||
                (step === 3 && !selectedDate) ||
                (step === 4 && !selectedTimeSlot) ||
                (step === 6 && (!subject || !reason))
              }
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-1 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-1.5 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
