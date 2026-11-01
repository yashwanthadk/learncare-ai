export type UserRole = 'student' | 'educator' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  phone?: string;
  bio?: string;
  consentGiven: boolean;
  consentDate?: string;
  password?: string;
  createdAt: string;
}

export interface StudentProfile {
  userId: string;
  studentId: string;
  gradeLevel: string;
  major: string;
  currentSemester: string;
  targetGPA: number;
  currentGPA: number;
  enrolledCourses: string[];
  learningGoals: string[];
  difficultySubjects: string[];
}

export interface EducatorProfile {
  userId: string;
  title: string;
  subjectSpecializations: string[];
  qualifications: string[];
  experienceYears: number;
  bio: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  isActive: boolean;
  availableSlotDurations: number[]; // e.g. [15, 30, 45, 60]
  weeklyAvailability: {
    day: string; // 'Monday', 'Tuesday', etc.
    slots: string[]; // e.g. ['09:00 AM', '10:00 AM', ...]
  }[];
}

export type AppointmentType =
  | 'Academic Guidance'
  | 'Subject Doubt Clearing'
  | 'Learning Difficulties Support'
  | 'Study Planning'
  | 'Performance Improvement'
  | 'Learning Motivation Support'
  | 'Personalized Mentoring';

export type AppointmentStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Completed'
  | 'Cancelled'
  | 'Rejected';

export interface Appointment {
  id: string; // e.g. 'LC-APPT-842910'
  studentId: string;
  studentName: string;
  studentEmail: string;
  educatorId: string;
  educatorName: string;
  educatorTitle: string;
  educatorAvatar?: string;
  appointmentType: AppointmentType;
  subject: string;
  date: string; // 'YYYY-MM-DD'
  timeSlot: string; // '10:00 AM'
  durationMinutes: 15 | 30 | 45 | 60;
  reason: string;
  additionalNotes?: string;
  status: AppointmentStatus;
  rejectionReason?: string;
  meetingLink?: string;
  hasFeedback?: boolean;
  hasSessionNotes?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type RiskLevel = 'Low Concern' | 'Moderate Concern' | 'High Concern';

export interface ContributingFactor {
  factor: string;
  impact: 'high' | 'medium' | 'low';
  detail: string;
}

export interface LearningAnalytics {
  studentId: string;
  studentName: string;
  overallRisk: RiskLevel;
  riskConfidence: number; // e.g. 88%
  assignmentCompletionRate: number; // %
  assessmentAverage: number; // %
  assessmentTrend: 'improving' | 'stable' | 'declining';
  weeklyParticipationHours: number;
  missedActivitiesCount: number;
  contributingFactors: ContributingFactor[];
  summaryNote: string;
  suggestedInterventions: string[];
  weeklyTrends: {
    week: string;
    score: number;
    completion: number;
    participation: number;
  }[];
  subjectScores: {
    subject: string;
    score: number;
    trend: 'up' | 'down' | 'same';
  }[];
  lastAnalyzed: string;
}

export interface AIRecommendation {
  id: string;
  studentId: string;
  subject: string;
  category: 'study_strategy' | 'educator_consultation' | 'resource_revision' | 'pacing_adjustment';
  title: string;
  description: string;
  rationale: string;
  suggestedDuration?: string;
  recommendedEducatorId?: string;
  recommendedEducatorName?: string;
  actionLabel: string;
  actionType: 'book_appointment' | 'view_resource' | 'review_material';
  priority: 'urgent' | 'recommended' | 'optional';
  createdAt: string;
}

export interface LearningActivity {
  id: string;
  studentId: string;
  courseId: string;
  courseName: string;
  activityType: 'quiz' | 'assignment' | 'discussion' | 'practice_lab';
  title: string;
  date: string;
  score?: number;
  maxScore?: number;
  status: 'completed' | 'missed' | 'submitted_late';
}

export interface LearningResource {
  id: string;
  title: string;
  subject: string;
  type: 'guide' | 'video_lecture' | 'practice_sheet' | 'interactive_module';
  description: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
}

export interface SessionNote {
  id: string;
  appointmentId: string;
  studentId: string;
  studentName: string;
  educatorId: string;
  educatorName: string;
  subject: string;
  sessionDate: string;
  keyObservations: string;
  recommendationsGiven: string;
  nextSteps: string;
  followUpRequired: boolean;
  followUpDate?: string;
  createdAt: string;
}

export interface Feedback {
  id: string;
  appointmentId: string;
  studentId: string;
  studentName: string;
  educatorId: string;
  educatorName: string;
  rating: number; // 1-5
  helpfulnessCategory: string;
  comments: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  recipientId: string;
  recipientRole: 'student' | 'educator' | 'admin' | 'all';
  title: string;
  message: string;
  type: 'appointment' | 'recommendation' | 'alert' | 'system';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface CourseCategory {
  id: string;
  name: string;
  description: string;
  subjects: string[];
  totalStudents: number;
  totalEducators: number;
}
