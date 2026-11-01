import React, { useState, useEffect } from 'react';
import type { Appointment } from '../types/index.ts';
import { X, Calendar, Clock, AlertCircle } from 'lucide-react';

interface RescheduleModalProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const RescheduleModal: React.FC<RescheduleModalProps> = ({
  appointment,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [newDate, setNewDate] = useState('');
  const [newTimeSlot, setNewTimeSlot] = useState('');
  const [availableSlots, setAvailableSlots] = useState<{ time: string; isAvailable: boolean }[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (appointment && isOpen) {
      // Set tomorrow as default new date
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 2);
      const yyyy = tomorrow.getFullYear();
      const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
      const dd = String(tomorrow.getDate()).padStart(2, '0');
      setNewDate(`${yyyy}-${mm}-${dd}`);
      setError(null);
    }
  }, [appointment, isOpen]);

  useEffect(() => {
    if (appointment && newDate) {
      setIsLoadingSlots(true);
      setNewTimeSlot('');
      fetch(`/api/educators/${appointment.educatorId}/slots?date=${newDate}`)
        .then((res) => res.json())
        .then((data) => {
          setAvailableSlots(data.slots || []);
          setIsLoadingSlots(false);
        })
        .catch(() => {
          setIsLoadingSlots(false);
        });
    }
  }, [appointment, newDate]);

  if (!isOpen || !appointment) return null;

  const handleReschedule = async () => {
    if (!newDate || !newTimeSlot) {
      setError('Please select both a new date and an available time slot.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/appointments/${appointment.id}/reschedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newDate,
          newTimeSlot,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        setError(data.error || 'Failed to reschedule appointment.');
      }
    } catch (err) {
      setError('Network error while rescheduling.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden text-slate-900">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Reschedule Appointment</h3>
            <p className="text-xs text-slate-500">Ref: {appointment.id}</p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100">
            <span className="font-semibold text-indigo-900">Current Booking:</span>
            <div className="text-slate-600 mt-0.5">
              {appointment.educatorName} · {appointment.date} at {appointment.timeSlot}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Select New Date</label>
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Available Slots on Selected Date</label>
            {isLoadingSlots ? (
              <div className="py-4 text-center text-slate-400">Loading open slots...</div>
            ) : availableSlots.length === 0 ? (
              <div className="py-3 text-center text-slate-500 bg-slate-50 rounded-lg border border-slate-200">
                No slots available on this date. Please pick another date.
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2 max-h-36 overflow-y-auto">
                {availableSlots.map((slot) => (
                  <button
                    key={slot.time}
                    disabled={!slot.isAvailable}
                    onClick={() => setNewTimeSlot(slot.time)}
                    className={`py-2 px-1 text-center rounded border text-xs ${
                      !slot.isAvailable
                        ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through'
                        : newTimeSlot === slot.time
                        ? 'bg-indigo-600 text-white font-semibold border-indigo-600'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-400'
                    }`}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            )}
          </div>

          {error && (
            <div className="p-2.5 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-slate-100 bg-slate-50">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            disabled={isSubmitting || !newTimeSlot}
            onClick={handleReschedule}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg disabled:opacity-40"
          >
            {isSubmitting ? 'Rescheduling...' : 'Confirm Reschedule'}
          </button>
        </div>
      </div>
    </div>
  );
};
