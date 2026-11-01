import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { db } from './server/dataStore.ts';
import { generateLearningRecommendationsWithAI } from './server/geminiService.ts';
import type { User, AppointmentType } from './src/types/index.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProduction = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 3000;

async function startServer() {
  const app = express();
  app.use(express.json());

  // Global simple session store in-memory for the demo
  let currentActiveUserId = 'user-std-1'; // Default: Sarah Lin (Student)

  // ---------------- AUTH API ----------------
  app.get('/api/auth/me', (req, res) => {
    const user = db.getUserById(currentActiveUserId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const studentProfile = user.role === 'student' ? db.getStudentProfile(user.id) : undefined;
    const educatorProfile = user.role === 'educator' ? db.getEducatorProfile(user.id) : undefined;

    res.json({
      user,
      studentProfile,
      educatorProfile,
    });
  });

  app.post('/api/auth/switch', (req, res) => {
    const { userId } = req.body;
    const user = db.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    currentActiveUserId = user.id;
    const studentProfile = user.role === 'student' ? db.getStudentProfile(user.id) : undefined;
    const educatorProfile = user.role === 'educator' ? db.getEducatorProfile(user.id) : undefined;

    res.json({
      message: `Switched active persona to ${user.name} (${user.role})`,
      user,
      studentProfile,
      educatorProfile,
    });
  });

  app.post('/api/auth/login', (req, res) => {
    const { email, password, role } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }
    const user = db.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'No account found with this email. Please check your spelling or register.' });
    }
    const authCheck = db.validatePassword(email, password);
    if (!authCheck.valid) {
      return res.status(401).json({ error: 'Incorrect password. (For demo accounts, use: Password123!)' });
    }
    if (role && user.role !== role) {
      return res.status(403).json({ error: `Account exists as ${user.role}, not ${role}.` });
    }
    currentActiveUserId = user.id;
    const studentProfile = user.role === 'student' ? db.getStudentProfile(user.id) : undefined;
    const educatorProfile = user.role === 'educator' ? db.getEducatorProfile(user.id) : undefined;

    res.json({ user, studentProfile, educatorProfile });
  });

  app.post('/api/auth/reset-password', (req, res) => {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ error: 'Email and new password are required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }
    const success = db.resetPassword(email, newPassword);
    if (!success) {
      return res.status(404).json({ error: 'No account found with this email' });
    }
    res.json({ message: 'Password has been successfully updated. You can now log in.' });
  });

  app.post('/api/auth/register', (req, res) => {
    const { name, email, password, role, major, gradeLevel, title, specializations, qualifications, experienceYears, consentGiven } = req.body;
    if (!name || !email || !role) {
      return res.status(400).json({ error: 'Name, email, and role are required' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Please create a password of at least 6 characters' });
    }
    const existing = db.getUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const userId = `user-${role.slice(0, 3)}-${Date.now()}`;
    const newUser: User = {
      id: userId,
      name,
      email,
      role,
      password,
      avatar:
        role === 'educator'
          ? '/src/assets/images/avatar_educator_female_1793511807951.jpg'
          : '/src/assets/images/avatar_student_user_1793511807478.jpg',
      consentGiven: Boolean(consentGiven),
      consentDate: consentGiven ? new Date().toISOString() : undefined,
      createdAt: new Date().toISOString(),
    };

    db.createUser(newUser);

    if (role === 'student') {
      db.saveStudentProfile({
        userId,
        studentId: `STU-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        gradeLevel: gradeLevel || 'Undergraduate',
        major: major || 'General Studies',
        currentSemester: 'Fall 2026',
        targetGPA: 3.75,
        currentGPA: 3.5,
        enrolledCourses: ['MATH 241: Multivariable Calculus', 'CS 374: Algorithms & Complexity'],
        learningGoals: ['Improve exam scores and understanding'],
        difficultySubjects: [],
      });

      // Default analytics
      db.saveStudentAnalytics(userId, {
        studentId: userId,
        studentName: name,
        overallRisk: 'Low Concern',
        riskConfidence: 85,
        assignmentCompletionRate: 90,
        assessmentAverage: 85,
        assessmentTrend: 'stable',
        weeklyParticipationHours: 4.5,
        missedActivitiesCount: 0,
        summaryNote: 'Initial baseline profile created. Activity will calibrate over the first 2 weeks.',
        contributingFactors: [],
        suggestedInterventions: ['Connect with an academic mentor to establish early goals.'],
        weeklyTrends: [
          { week: 'W1', score: 85, completion: 90, participation: 4.5 },
        ],
        subjectScores: [
          { subject: 'Multivariable Calculus', score: 85, trend: 'same' },
        ],
        lastAnalyzed: new Date().toISOString(),
      });
    } else if (role === 'educator') {
      db.saveEducatorProfile({
        userId,
        title: title || 'Academic Specialist',
        subjectSpecializations: Array.isArray(specializations) ? specializations : [specializations || 'Mathematics'],
        qualifications: Array.isArray(qualifications) ? qualifications : [qualifications || 'M.Sc. Education'],
        experienceYears: Number(experienceYears) || 5,
        bio: 'Passionate educator committed to proactive student mentorship and learning breakthrough.',
        rating: 5.0,
        reviewCount: 1,
        isVerified: false, // Requires admin approval
        isActive: true,
        availableSlotDurations: [15, 30, 45, 60],
        weeklyAvailability: [
          { day: 'Monday', slots: ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'] },
          { day: 'Wednesday', slots: ['10:00 AM', '01:00 PM', '03:00 PM'] },
          { day: 'Friday', slots: ['09:30 AM', '11:00 AM', '02:00 PM'] },
        ],
      });
    }

    currentActiveUserId = userId;
    res.status(201).json({ user: newUser });
  });

  app.post('/api/auth/consent', (req, res) => {
    const { consentGiven } = req.body;
    const updated = db.updateUser(currentActiveUserId, {
      consentGiven: Boolean(consentGiven),
      consentDate: consentGiven ? new Date().toISOString() : undefined,
    });
    res.json({ user: updated });
  });

  // ---------------- EDUCATORS API ----------------
  app.get('/api/educators', (req, res) => {
    const { query, subject, duration, sort } = req.query;
    const users = db.getUsers().filter((u) => u.role === 'educator');
    const profiles = db.getEducatorProfiles();

    let combined = users.map((u) => {
      const prof = profiles.find((p) => p.userId === u.id);
      return {
        ...u,
        profile: prof,
      };
    });

    // Filters
    if (query && typeof query === 'string') {
      const q = query.toLowerCase();
      combined = combined.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.profile?.title.toLowerCase().includes(q) ||
          e.profile?.subjectSpecializations.some((s) => s.toLowerCase().includes(q))
      );
    }

    if (subject && typeof subject === 'string' && subject !== 'All Subjects') {
      combined = combined.filter((e) =>
        e.profile?.subjectSpecializations.some((s) => s.toLowerCase() === subject.toLowerCase())
      );
    }

    if (duration && !isNaN(Number(duration))) {
      const dur = Number(duration);
      combined = combined.filter((e) => e.profile?.availableSlotDurations.includes(dur));
    }

    // Sorting
    if (sort === 'highest_rated') {
      combined.sort((a, b) => (b.profile?.rating || 0) - (a.profile?.rating || 0));
    } else if (sort === 'most_experienced') {
      combined.sort((a, b) => (b.profile?.experienceYears || 0) - (a.profile?.experienceYears || 0));
    } else if (sort === 'reviews') {
      combined.sort((a, b) => (b.profile?.reviewCount || 0) - (a.profile?.reviewCount || 0));
    }

    res.json(combined);
  });

  app.get('/api/educators/:id', (req, res) => {
    const user = db.getUserById(req.params.id);
    if (!user || user.role !== 'educator') {
      return res.status(404).json({ error: 'Educator not found' });
    }
    const profile = db.getEducatorProfile(user.id);
    const feedbacks = db.getFeedbacks(user.id);

    res.json({
      user,
      profile,
      feedbacks,
    });
  });

  // Calculate dynamic available slots for a specific date
  app.get('/api/educators/:id/slots', (req, res) => {
    const { date } = req.query; // YYYY-MM-DD
    if (!date || typeof date !== 'string') {
      return res.status(400).json({ error: 'Date query param (YYYY-MM-DD) is required' });
    }

    const educator = db.getUserById(req.params.id);
    const profile = db.getEducatorProfile(req.params.id);
    if (!educator || !profile) {
      return res.status(404).json({ error: 'Educator not found' });
    }

    // Determine Day of week from YYYY-MM-DD in local time
    const [year, month, day] = date.split('-').map(Number);
    const selectedDate = new Date(year, month - 1, day);
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = dayNames[selectedDate.getDay()];

    const dayAvailability = profile.weeklyAvailability.find(
      (a) => a.day.toLowerCase() === dayName.toLowerCase()
    );

    if (!dayAvailability || dayAvailability.slots.length === 0) {
      return res.json({ date, dayName, slots: [] });
    }

    // Fetch existing appointments on that date for this educator
    const bookedAppointments = db
      .getAppointments()
      .filter(
        (a) =>
          a.educatorId === educator.id &&
          a.date === date &&
          a.status !== 'Cancelled' &&
          a.status !== 'Rejected'
      );

    const bookedSlots = new Set(bookedAppointments.map((a) => a.timeSlot));

    // Return slots with availability flag
    const slots = dayAvailability.slots.map((time) => ({
      time,
      isAvailable: !bookedSlots.has(time),
    }));

    res.json({
      date,
      dayName,
      slots,
    });
  });

  // ---------------- APPOINTMENTS API ----------------
  app.get('/api/appointments', (req, res) => {
    const { studentId, educatorId, status } = req.query;
    let list = db.getAppointments();

    if (studentId && typeof studentId === 'string') {
      list = list.filter((a) => a.studentId === studentId);
    }
    if (educatorId && typeof educatorId === 'string') {
      list = list.filter((a) => a.educatorId === educatorId);
    }
    if (status && typeof status === 'string') {
      list = list.filter((a) => a.status === status);
    }

    // Sort upcoming first
    list.sort((a, b) => new Date(`${b.date} ${b.timeSlot}`).getTime() - new Date(`${a.date} ${a.timeSlot}`).getTime());

    res.json(list);
  });

  app.get('/api/appointments/:id', (req, res) => {
    const appt = db.getAppointmentById(req.params.id);
    if (!appt) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json(appt);
  });

  // Strict double-booking prevention engine
  app.post('/api/appointments', (req, res) => {
    const {
      studentId,
      studentName,
      studentEmail,
      educatorId,
      educatorName,
      educatorTitle,
      educatorAvatar,
      appointmentType,
      subject,
      date,
      timeSlot,
      durationMinutes,
      reason,
      additionalNotes,
    } = req.body;

    if (!studentId || !educatorId || !date || !timeSlot || !appointmentType || !subject || !durationMinutes) {
      return res.status(400).json({ error: 'Missing required appointment fields.' });
    }

    const bookingResult = db.bookAppointment({
      studentId,
      studentName: studentName || 'Student',
      studentEmail: studentEmail || 'student@university.edu',
      educatorId,
      educatorName,
      educatorTitle,
      educatorAvatar,
      appointmentType: appointmentType as AppointmentType,
      subject,
      date,
      timeSlot,
      durationMinutes: Number(durationMinutes) as 15 | 30 | 45 | 60,
      reason: reason || 'Academic support session',
      additionalNotes: additionalNotes || '',
      status: 'Confirmed', // Direct confirmation with verified educator
    });

    if (!bookingResult.success) {
      return res.status(409).json({ error: bookingResult.error });
    }

    res.status(201).json(bookingResult.appointment);
  });

  app.patch('/api/appointments/:id/status', (req, res) => {
    const { status, rejectionReason } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }
    const updated = db.updateAppointmentStatus(req.params.id, status, rejectionReason);
    if (!updated) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json(updated);
  });

  app.post('/api/appointments/:id/reschedule', (req, res) => {
    const { newDate, newTimeSlot } = req.body;
    if (!newDate || !newTimeSlot) {
      return res.status(400).json({ error: 'New date and new time slot are required' });
    }
    const result = db.rescheduleAppointment(req.params.id, newDate, newTimeSlot);
    if (!result.success) {
      return res.status(409).json({ error: result.error });
    }
    res.json(result.appointment);
  });

  // ---------------- LEARNING ANALYTICS & AI ----------------
  app.get('/api/analytics/student/:id', (req, res) => {
    const analytics = db.getStudentAnalytics(req.params.id);
    if (!analytics) {
      return res.status(404).json({ error: 'No learning analytics available for this student' });
    }
    res.json(analytics);
  });

  app.get('/api/analytics/overview', (req, res) => {
    const all = db.getAllAnalytics();
    const students = db.getUsers().filter((u) => u.role === 'student');

    const highConcern = all.filter((a) => a.overallRisk === 'High Concern').length;
    const moderateConcern = all.filter((a) => a.overallRisk === 'Moderate Concern').length;
    const lowConcern = all.filter((a) => a.overallRisk === 'Low Concern').length;

    res.json({
      totalStudentsAnalyzed: all.length,
      registeredStudentsCount: students.length,
      distribution: {
        highConcern,
        moderateConcern,
        lowConcern,
      },
      students: all,
    });
  });

  // Gemini AI recommendation trigger
  app.post('/api/ai/generate-recommendations', async (req, res) => {
    const { studentId } = req.body;
    const targetId = studentId || currentActiveUserId;
    const student = db.getUserById(targetId);
    const profile = db.getStudentProfile(targetId);
    const analytics = db.getStudentAnalytics(targetId);

    if (!student || !analytics) {
      return res.status(404).json({ error: 'Student learning data not found' });
    }

    try {
      const generated = await generateLearningRecommendationsWithAI(
        student.name,
        analytics,
        profile?.enrolledCourses || ['Multivariable Calculus'],
        profile?.difficultySubjects || ['Multivariable Calculus']
      );

      // Find an appropriate educator for educator consultation actions
      const educators = db.getUsers().filter((u) => u.role === 'educator');

      const savedRecommendations = generated.map((rec, index) => {
        const assignedEducator = educators[index % educators.length];
        return db.addRecommendation({
          id: `rec-ai-${Date.now()}-${index}`,
          studentId: targetId,
          subject: rec.subject || 'Multivariable Calculus',
          category: rec.category || 'educator_consultation',
          title: rec.title || 'Personalized Academic Support Session',
          description: rec.description || 'Targeted 1-on-1 consultation to strengthen key concepts.',
          rationale: rec.rationale || 'Suggested based on your recent activity trajectory.',
          suggestedDuration: rec.suggestedDuration || '30 minutes',
          recommendedEducatorId: assignedEducator?.id || 'user-edu-1',
          recommendedEducatorName: assignedEducator?.name || 'Prof. Elena Rostova',
          actionLabel: rec.actionLabel || 'Book Recommended Session',
          actionType: rec.actionType || 'book_appointment',
          priority: rec.priority || 'recommended',
          createdAt: new Date().toISOString(),
        });
      });

      res.json({
        message: 'Successfully generated AI learning recommendations.',
        recommendations: savedRecommendations,
      });
    } catch (err) {
      console.error('Error generating AI recommendations:', err);
      res.status(500).json({ error: 'Failed to generate recommendations' });
    }
  });

  app.get('/api/recommendations', (req, res) => {
    const { studentId } = req.query;
    const recs = db.getRecommendations(studentId ? String(studentId) : undefined);
    res.json(recs);
  });

  // ---------------- SESSION NOTES & FEEDBACK ----------------
  app.get('/api/session-notes', (req, res) => {
    const { studentId, educatorId, appointmentId } = req.query;
    const notes = db.getSessionNotes({
      studentId: studentId ? String(studentId) : undefined,
      educatorId: educatorId ? String(educatorId) : undefined,
      appointmentId: appointmentId ? String(appointmentId) : undefined,
    });
    res.json(notes);
  });

  app.post('/api/session-notes', (req, res) => {
    const { appointmentId, studentId, studentName, educatorId, educatorName, subject, sessionDate, keyObservations, recommendationsGiven, nextSteps, followUpRequired, followUpDate } = req.body;

    if (!appointmentId || !keyObservations) {
      return res.status(400).json({ error: 'Appointment ID and key observations are required' });
    }

    const note = db.addSessionNote({
      appointmentId,
      studentId: studentId || currentActiveUserId,
      studentName: studentName || 'Student',
      educatorId: educatorId || 'user-edu-1',
      educatorName: educatorName || 'Educator',
      subject: subject || 'Academic Subject',
      sessionDate: sessionDate || new Date().toISOString().split('T')[0],
      keyObservations,
      recommendationsGiven: recommendationsGiven || '',
      nextSteps: nextSteps || '',
      followUpRequired: Boolean(followUpRequired),
      followUpDate,
    });

    res.status(201).json(note);
  });

  app.get('/api/feedback', (req, res) => {
    const { educatorId } = req.query;
    const feedbacks = db.getFeedbacks(educatorId ? String(educatorId) : undefined);
    res.json(feedbacks);
  });

  app.post('/api/feedback', (req, res) => {
    const { appointmentId, studentId, studentName, educatorId, educatorName, rating, helpfulnessCategory, comments } = req.body;

    if (!appointmentId || !rating || !educatorId) {
      return res.status(400).json({ error: 'Appointment ID, rating, and educator ID are required' });
    }

    const feedback = db.addFeedback({
      appointmentId,
      studentId: studentId || currentActiveUserId,
      studentName: studentName || 'Student',
      educatorId,
      educatorName: educatorName || 'Educator',
      rating: Number(rating),
      helpfulnessCategory: helpfulnessCategory || 'Helpful Session',
      comments: comments || '',
    });

    res.status(201).json(feedback);
  });

  // ---------------- NOTIFICATIONS ----------------
  app.get('/api/notifications', (req, res) => {
    const user = db.getUserById(currentActiveUserId);
    const list = db.getNotifications(currentActiveUserId, user?.role);
    res.json(list);
  });

  app.patch('/api/notifications/:id/read', (req, res) => {
    const success = db.markNotificationAsRead(req.params.id);
    res.json({ success });
  });

  // ---------------- RESOURCES & CATEGORIES ----------------
  app.get('/api/resources', (req, res) => {
    res.json(db.getResources());
  });

  app.get('/api/categories', (req, res) => {
    res.json(db.getCategories());
  });

  // ---------------- ADMIN API ----------------
  app.get('/api/admin/metrics', (req, res) => {
    const users = db.getUsers();
    const students = users.filter((u) => u.role === 'student');
    const educators = users.filter((u) => u.role === 'educator');
    const appointments = db.getAppointments();
    const completed = appointments.filter((a) => a.status === 'Completed').length;
    const feedbacks = db.getFeedbacks();
    const avgRating =
      feedbacks.length > 0
        ? Number((feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1))
        : 4.9;

    res.json({
      registeredStudents: students.length + 1240, // Base cohort scale
      verifiedEducators: educators.length + 42,
      appointmentsCompleted: completed + 3820,
      studentSatisfactionPercentage: 98.4,
      averageSessionRating: avgRating,
      activeDisengagementAlerts: db.getAllAnalytics().filter((a) => a.overallRisk === 'High Concern').length,
    });
  });

  app.patch('/api/admin/educators/:id/verify', (req, res) => {
    const profile = db.getEducatorProfile(req.params.id);
    if (!profile) return res.status(404).json({ error: 'Educator profile not found' });
    profile.isVerified = !profile.isVerified;
    db.saveEducatorProfile(profile);
    res.json(profile);
  });

  // ---------------- VITE MIDDLEWARE (DEV) OR STATIC (PROD) ----------------
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`LearnCare AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
