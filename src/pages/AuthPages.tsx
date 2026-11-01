import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  GraduationCap,
  Shield,
  CheckCircle2,
  Lock,
  Mail,
  User as UserIcon,
  Eye,
  EyeOff,
  KeyRound,
  ArrowRight,
  Sparkles,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export const AuthPages: React.FC = () => {
  const { setCurrentView, showToast, refreshUserData } = useApp();
  const [mode, setMode] = useState<'login' | 'register_student' | 'register_educator' | 'reset_password'>('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('sarah.lin@university.edu');
  const [loginPassword, setLoginPassword] = useState('Password123!');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Student register form state
  const [stdName, setStdName] = useState('');
  const [stdEmail, setStdEmail] = useState('');
  const [stdPassword, setStdPassword] = useState('');
  const [stdConfirmPassword, setStdConfirmPassword] = useState('');
  const [showStdPassword, setShowStdPassword] = useState(false);
  const [stdMajor, setStdMajor] = useState('Computer Engineering');
  const [stdGrade, setStdGrade] = useState('Junior');
  const [stdConsent, setStdConsent] = useState(true);

  // Educator register form state
  const [eduName, setEduName] = useState('');
  const [eduEmail, setEduEmail] = useState('');
  const [eduPassword, setEduPassword] = useState('');
  const [eduConfirmPassword, setEduConfirmPassword] = useState('');
  const [showEduPassword, setShowEduPassword] = useState(false);
  const [eduTitle, setEduTitle] = useState('Assistant Professor');
  const [eduSubject, setEduSubject] = useState('Multivariable Calculus');
  const [eduQual, setEduQual] = useState('Ph.D. in Applied Mathematics');
  const [eduExp, setEduExp] = useState(5);

  // Password reset form state
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper for password strength calculation
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: 'None', color: 'bg-slate-200' };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 2) return { score: 33, label: 'Weak', color: 'bg-rose-500' };
    if (score <= 4) return { score: 66, label: 'Medium', color: 'bg-amber-500' };
    return { score: 100, label: 'Strong', color: 'bg-emerald-500' };
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setError('Please enter both your email address and password.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail.trim(),
          password: loginPassword,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        showToast(`Welcome back, ${data.user.name}!`, 'success');
        await refreshUserData();
        if (data.user.role === 'student') setCurrentView('student-dashboard');
        else if (data.user.role === 'educator') setCurrentView('educator-dashboard');
        else setCurrentView('admin-dashboard');
      } else {
        setError(data.error || 'Authentication failed. Please verify your credentials.');
      }
    } catch (err) {
      setError('Connection error during sign-in.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stdName.trim() || !stdEmail.trim() || !stdPassword) {
      setError('Please fill in your name, email, and create a password.');
      return;
    }
    if (stdPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (stdPassword !== stdConfirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }
    if (!stdConsent) {
      setError('Please grant consent for non-invasive educational progress tracking.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: stdName.trim(),
          email: stdEmail.trim(),
          password: stdPassword,
          role: 'student',
          major: stdMajor,
          gradeLevel: stdGrade,
          consentGiven: stdConsent,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        showToast('Student account created successfully!', 'success');
        await refreshUserData();
        setCurrentView('student-dashboard');
      } else {
        setError(data.error || 'Registration failed.');
      }
    } catch (err) {
      setError('Registration error.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterEducator = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eduName.trim() || !eduEmail.trim() || !eduPassword) {
      setError('Please fill in your name, email, and create a password.');
      return;
    }
    if (eduPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (eduPassword !== eduConfirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: eduName.trim(),
          email: eduEmail.trim(),
          password: eduPassword,
          role: 'educator',
          title: eduTitle,
          specializations: [eduSubject],
          qualifications: [eduQual],
          experienceYears: eduExp,
          consentGiven: true,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        showToast('Educator profile registered! You can now access your educator portal.', 'success');
        await refreshUserData();
        setCurrentView('educator-dashboard');
      } else {
        setError(data.error || 'Registration failed.');
      }
    } catch (err) {
      setError('Registration error.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim() || !newPassword) {
      setError('Please enter your email and specify a new password.');
      return;
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: resetEmail.trim(),
          newPassword,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setResetSuccess(true);
        showToast('Password updated! You can now log in with your new password.', 'success');
      } else {
        setError(data.error || 'Failed to update password.');
      }
    } catch (err) {
      setError('Error resetting password.');
    } finally {
      setIsLoading(false);
    }
  };

  const studentStrength = getPasswordStrength(stdPassword);
  const educatorStrength = getPasswordStrength(eduPassword);

  return (
    <div className="max-w-md mx-auto px-4 py-12 text-slate-900">
      {/* Brand Header */}
      <div className="text-center space-y-2 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-indigo-900 text-white flex items-center justify-center mx-auto shadow-md">
          <GraduationCap className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">
          {mode === 'login' && 'Sign In to LearnCare AI'}
          {mode === 'register_student' && 'Create Student Account'}
          {mode === 'register_educator' && 'Create Educator Account'}
          {mode === 'reset_password' && 'Reset Your Password'}
        </h1>
        <p className="text-xs text-slate-500">
          {mode === 'login' && 'Enter your registered email and password to access your dashboard.'}
          {mode === 'register_student' && 'Register with your email and create a password to book mentors.'}
          {mode === 'register_educator' && 'Set up your educator profile and create credentials to manage appointments.'}
          {mode === 'reset_password' && 'Enter your email address and choose a new password.'}
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-sm space-y-5">
        {/* Toggle Mode */}
        {mode !== 'reset_password' && (
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl text-xs font-medium text-slate-600">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError(null);
              }}
              className={`py-1.5 rounded-lg transition-all ${
                mode === 'login' ? 'bg-white text-indigo-900 font-bold shadow-sm' : 'hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register_student');
                setError(null);
              }}
              className={`py-1.5 rounded-lg transition-all ${
                mode === 'register_student' ? 'bg-white text-indigo-900 font-bold shadow-sm' : 'hover:text-slate-900'
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register_educator');
                setError(null);
              }}
              className={`py-1.5 rounded-lg transition-all ${
                mode === 'register_educator' ? 'bg-white text-indigo-900 font-bold shadow-sm' : 'hover:text-slate-900'
              }`}
            >
              Educator
            </button>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 1. LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="name@university.edu"
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-700">Password</label>
                <button
                  type="button"
                  onClick={() => {
                    setMode('reset_password');
                    setError(null);
                    setResetSuccess(false);
                    setResetEmail(loginEmail);
                  }}
                  className="text-indigo-600 hover:underline text-[11px]"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter your account password"
                  className="w-full pl-9 pr-10 py-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-all disabled:opacity-50"
            >
              {isLoading ? 'Signing In...' : 'Sign In with Email & Password'}
            </button>

            {/* Quick Demo Credentials Helper */}
            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700">Demo Account Credentials:</span>
                <span className="font-mono text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                  Password123!
                </span>
              </div>
              <div className="grid grid-cols-1 gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setLoginEmail('sarah.lin@university.edu');
                    setLoginPassword('Password123!');
                  }}
                  className="text-left px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 flex justify-between items-center"
                >
                  <span>Sarah Lin (Student)</span>
                  <span className="text-[10px] text-indigo-600 font-semibold">Autofill</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginEmail('elena.rostova@learncare.edu');
                    setLoginPassword('Password123!');
                  }}
                  className="text-left px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 flex justify-between items-center"
                >
                  <span>Prof. Elena Rostova (Educator)</span>
                  <span className="text-[10px] text-indigo-600 font-semibold">Autofill</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginEmail('eleanor.ward@learncare.edu');
                    setLoginPassword('Password123!');
                  }}
                  className="text-left px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 flex justify-between items-center"
                >
                  <span>Eleanor Ward (Admin)</span>
                  <span className="text-[10px] text-indigo-600 font-semibold">Autofill</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* 2. REGISTER STUDENT FORM */}
        {mode === 'register_student' && (
          <form onSubmit={handleRegisterStudent} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Student Full Name *</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={stdName}
                  onChange={(e) => setStdName(e.target.value)}
                  placeholder="e.g. Maya Chen"
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">University Email Address *</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={stdEmail}
                  onChange={(e) => setStdEmail(e.target.value)}
                  placeholder="maya.chen@university.edu"
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* Create Password */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Create Password *</label>
              <div className="relative">
                <input
                  type={showStdPassword ? 'text' : 'password'}
                  required
                  value={stdPassword}
                  onChange={(e) => setStdPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-9 pr-10 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowStdPassword(!showStdPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showStdPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {stdPassword && (
                <div className="mt-1.5 space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Password Strength:</span>
                    <span className="font-semibold text-slate-700">{studentStrength.label}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-300 ${studentStrength.color}`}
                      style={{ width: `${studentStrength.score}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Confirm Password *</label>
              <div className="relative">
                <input
                  type={showStdPassword ? 'text' : 'password'}
                  required
                  value={stdConfirmPassword}
                  onChange={(e) => setStdConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              </div>
              {stdConfirmPassword && (
                <div className="text-[11px] mt-1">
                  {stdPassword === stdConfirmPassword ? (
                    <span className="text-emerald-600 font-medium">✓ Passwords match</span>
                  ) : (
                    <span className="text-rose-600 font-medium">✕ Passwords do not match</span>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Academic Major</label>
                <input
                  type="text"
                  value={stdMajor}
                  onChange={(e) => setStdMajor(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Year / Grade</label>
                <select
                  value={stdGrade}
                  onChange={(e) => setStdGrade(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Freshman">Freshman</option>
                  <option value="Sophomore">Sophomore</option>
                  <option value="Junior">Junior</option>
                  <option value="Senior">Senior</option>
                  <option value="Graduate">Graduate</option>
                </select>
              </div>
            </div>

            {/* Data Consent */}
            <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl space-y-1.5">
              <label className="flex items-start gap-2 cursor-pointer font-medium text-slate-800 text-[11px] leading-tight">
                <input
                  type="checkbox"
                  required
                  checked={stdConsent}
                  onChange={(e) => setStdConsent(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded mt-0.5"
                />
                <span>
                  I consent to non-invasive academic milestone tracking (quiz variances, assignment timeliness) to receive early learning support. No webcam, audio, or keystroke tracking is used.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading || !stdConsent}
              className="w-full py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-all disabled:opacity-50"
            >
              {isLoading ? 'Creating Account...' : 'Create Student Account & Set Password'}
            </button>
          </form>
        )}

        {/* 3. REGISTER EDUCATOR FORM */}
        {mode === 'register_educator' && (
          <form onSubmit={handleRegisterEducator} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Name & Title *</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={eduName}
                  onChange={(e) => setEduName(e.target.value)}
                  placeholder="e.g. Dr. Arthur Pendelton"
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Institutional Email *</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={eduEmail}
                  onChange={(e) => setEduEmail(e.target.value)}
                  placeholder="arthur.pendelton@university.edu"
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* Create Password */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Create Password *</label>
              <div className="relative">
                <input
                  type={showEduPassword ? 'text' : 'password'}
                  required
                  value={eduPassword}
                  onChange={(e) => setEduPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-9 pr-10 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowEduPassword(!showEduPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showEduPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {eduPassword && (
                <div className="mt-1.5 space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Password Strength:</span>
                    <span className="font-semibold text-slate-700">{educatorStrength.label}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-300 ${educatorStrength.color}`}
                      style={{ width: `${educatorStrength.score}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Confirm Password *</label>
              <div className="relative">
                <input
                  type={showEduPassword ? 'text' : 'password'}
                  required
                  value={eduConfirmPassword}
                  onChange={(e) => setEduConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              </div>
              {eduConfirmPassword && (
                <div className="text-[11px] mt-1">
                  {eduPassword === eduConfirmPassword ? (
                    <span className="text-emerald-600 font-medium">✓ Passwords match</span>
                  ) : (
                    <span className="text-rose-600 font-medium">✕ Passwords do not match</span>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Academic Role / Title</label>
              <input
                type="text"
                value={eduTitle}
                onChange={(e) => setEduTitle(e.target.value)}
                placeholder="e.g. Associate Professor of Mathematics"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Primary Subject Specialization</label>
              <input
                type="text"
                value={eduSubject}
                onChange={(e) => setEduSubject(e.target.value)}
                placeholder="e.g. Differential Equations, Algorithms"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Degrees / Qualification</label>
                <input
                  type="text"
                  value={eduQual}
                  onChange={(e) => setEduQual(e.target.value)}
                  placeholder="Ph.D. in Computer Science"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Years Teaching</label>
                <input
                  type="number"
                  min={1}
                  value={eduExp}
                  onChange={(e) => setEduExp(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-all disabled:opacity-50"
            >
              {isLoading ? 'Registering...' : 'Create Educator Account & Set Password'}
            </button>
          </form>
        )}

        {/* 4. RESET PASSWORD VIEW */}
        {mode === 'reset_password' && (
          <div className="space-y-4 text-xs">
            {resetSuccess ? (
              <div className="text-center py-6 space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="text-sm font-bold text-slate-900">Password Successfully Updated!</h3>
                <p className="text-xs text-slate-500">
                  Your new password is now active. You can log in using your updated credentials.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setLoginPassword(newPassword);
                    setError(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Registered Account Email</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="e.g. sarah.lin@university.edu"
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Create New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full pl-9 pr-10 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Re-enter your new password"
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setError(null);
                    }}
                    className="text-indigo-600 hover:underline"
                  >
                    ← Back to Sign In
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg disabled:opacity-50"
                  >
                    {isLoading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
