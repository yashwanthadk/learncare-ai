import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  User,
  StudentProfile,
  EducatorProfile,
  Appointment,
  LearningAnalytics,
  AIRecommendation,
  Notification,
} from '../types/index.ts';

interface AppContextType {
  currentUser: User | null;
  studentProfile: StudentProfile | null;
  educatorProfile: EducatorProfile | null;
  currentView: string; // 'home' | 'about' | 'how-it-works' | 'services' | 'educators' | 'educator-detail' | 'contact' | 'faq' | 'privacy' | 'terms' | 'login' | 'register' | 'student-dashboard' | 'educator-dashboard' | 'admin-dashboard'
  selectedEducatorId: string | null;
  bookingModalOpen: boolean;
  bookingEducatorId: string | null;
  bookingPreselectedSubject?: string;
  notifications: Notification[];
  unreadNotifCount: number;
  toastMessage: string | null;
  toastType: 'success' | 'error' | 'info';
  setCurrentView: (view: string) => void;
  setSelectedEducatorId: (id: string | null) => void;
  openBookingModal: (educatorId?: string, subject?: string) => void;
  closeBookingModal: () => void;
  switchUser: (userId: string) => Promise<void>;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  refreshUserData: () => Promise<void>;
  markNotificationAsRead: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [educatorProfile, setEducatorProfile] = useState<EducatorProfile | null>(null);
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedEducatorId, setSelectedEducatorId] = useState<string | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState<boolean>(false);
  const [bookingEducatorId, setBookingEducatorId] = useState<string | null>(null);
  const [bookingPreselectedSubject, setBookingPreselectedSubject] = useState<string | undefined>(undefined);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');

  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const refreshUserData = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
        setStudentProfile(data.studentProfile || null);
        setEducatorProfile(data.educatorProfile || null);
      }
      // Notifications
      const notifRes = await fetch('/api/notifications');
      if (notifRes.ok) {
        const list = await notifRes.json();
        setNotifications(list);
      }
    } catch (err) {
      console.error('Failed to load user data:', err);
    }
  };

  useEffect(() => {
    refreshUserData();
  }, []);

  const switchUser = async (userId: string) => {
    try {
      const res = await fetch('/api/auth/switch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
        setStudentProfile(data.studentProfile || null);
        setEducatorProfile(data.educatorProfile || null);

        // Update notifications for new user
        const notifRes = await fetch('/api/notifications');
        if (notifRes.ok) {
          setNotifications(await notifRes.json());
        }

        showToast(`Active persona: ${data.user.name} (${data.user.role})`, 'success');

        // Route to their default dashboard if currently in a dashboard view
        if (currentView.includes('dashboard')) {
          if (data.user.role === 'student') setCurrentView('student-dashboard');
          else if (data.user.role === 'educator') setCurrentView('educator-dashboard');
          else if (data.user.role === 'admin') setCurrentView('admin-dashboard');
        }
      }
    } catch (err) {
      showToast('Failed to switch user', 'error');
    }
  };

  const markNotificationAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const openBookingModal = (educatorId?: string, subject?: string) => {
    setBookingEducatorId(educatorId || null);
    setBookingPreselectedSubject(subject);
    setBookingModalOpen(true);
  };

  const closeBookingModal = () => {
    setBookingModalOpen(false);
    setBookingEducatorId(null);
    setBookingPreselectedSubject(undefined);
  };

  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        studentProfile,
        educatorProfile,
        currentView,
        selectedEducatorId,
        bookingModalOpen,
        bookingEducatorId,
        bookingPreselectedSubject,
        notifications,
        unreadNotifCount,
        toastMessage,
        toastType,
        setCurrentView,
        setSelectedEducatorId,
        openBookingModal,
        closeBookingModal,
        switchUser,
        showToast,
        refreshUserData,
        markNotificationAsRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
