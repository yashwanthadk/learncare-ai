import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import type { User, EducatorProfile } from '../types/index.ts';
import {
  Search,
  Filter,
  Star,
  Clock,
  Calendar,
  GraduationCap,
  Award,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';

interface CombinedEducator extends User {
  profile?: EducatorProfile;
}

export const EducatorsPage: React.FC = () => {
  const { openBookingModal, setSelectedEducatorId, setCurrentView } = useApp();
  const [educators, setEducators] = useState<CombinedEducator[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [selectedDuration, setSelectedDuration] = useState('All Durations');
  const [sortBy, setSortBy] = useState('highest_rated');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (searchTerm) params.append('query', searchTerm);
    if (selectedSubject !== 'All Subjects') params.append('subject', selectedSubject);
    if (selectedDuration !== 'All Durations') params.append('duration', selectedDuration);
    if (sortBy) params.append('sort', sortBy);

    fetch(`/api/educators?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setEducators(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [searchTerm, selectedSubject, selectedDuration, sortBy]);

  const subjects = [
    'All Subjects',
    'Multivariable Calculus',
    'Differential Equations',
    'Linear Algebra',
    'Algorithms & Complexity',
    'Data Structures',
    'Classical Mechanics',
    'Electromagnetism',
    'Study Planning',
    'Learning Difficulties Support',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="max-w-3xl">
        <div className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
          Faculty Directory
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Find an Expert Academic Mentor
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          Connect with vetted university faculty, learning specialists, and graduate tutors for 1-on-1 personalized academic guidance.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          {/* Search box */}
          <div className="relative md:col-span-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by name, subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Subject Filter */}
          <div>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500"
            >
              {subjects.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>

          {/* Duration Filter */}
          <div>
            <select
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All Durations">All Durations</option>
              <option value="15">15 Minutes</option>
              <option value="30">30 Minutes</option>
              <option value="45">45 Minutes</option>
              <option value="60">60 Minutes</option>
            </select>
          </div>

          {/* Sorting */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500"
            >
              <option value="highest_rated">Highest Rated</option>
              <option value="most_experienced">Most Experienced</option>
              <option value="reviews">Most Reviews</option>
            </select>
          </div>
        </div>
      </div>

      {/* Educator List */}
      {isLoading ? (
        <div className="py-16 text-center text-xs text-slate-400">Loading educators...</div>
      ) : educators.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
          <GraduationCap className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-700">No educators matched your filters</h3>
          <p className="text-xs text-slate-400">Try adjusting your subject or search criteria.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedSubject('All Subjects');
              setSelectedDuration('All Durations');
            }}
            className="px-4 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {educators.map((edu) => (
            <div
              key={edu.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col hover:border-indigo-300 hover:shadow-md transition-all"
            >
              <div className="p-6 flex-1 space-y-4">
                <div className="flex items-start gap-4">
                  <img
                    src={edu.avatar}
                    alt={edu.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-sm text-slate-900">{edu.name}</h3>
                      {edu.profile?.isVerified && (
                        <span title="Verified Faculty" className="inline-flex">
                          <CheckCircle className="w-4 h-4 text-indigo-600" />
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{edu.profile?.title}</p>
                    <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 mt-1">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{edu.profile?.rating || 4.9}</span>
                      </div>
                      <span className="text-slate-400 font-normal">
                        ({edu.profile?.reviewCount || 100} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {edu.profile?.bio || edu.bio}
                </p>

                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                  <div>
                    <span className="font-semibold text-slate-700">Specializations:</span>
                    <div className="text-slate-600 mt-0.5">
                      {edu.profile?.subjectSpecializations.join(', ')}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-slate-500 pt-1 text-[11px]">
                    <span>{edu.profile?.experienceYears} years experience</span>
                    <span>Durations: {edu.profile?.availableSlotDurations.map((d) => `${d}m`).join(', ')}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedEducatorId(edu.id);
                    setCurrentView('educator-detail');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex-1 py-2 text-center text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
                >
                  View Full Profile
                </button>
                <button
                  onClick={() => openBookingModal(edu.id, edu.profile?.subjectSpecializations[0])}
                  className="flex-1 py-2 text-center text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Session</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
