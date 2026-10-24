import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ShieldCheck,
  User,
  Lock,
  Sparkles,
  AlertCircle,
  Users,
  GraduationCap,
  ArrowRight,
  Eye,
  EyeOff,
  Check,
  School,
} from 'lucide-react';
import {
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from '../lib/firebase';

export type UserRole = 'parent' | 'staff';

export interface AuthUser {
  email: string;
  role: UserRole;
  name: string;
}

interface LoginProps {
  onSuccessLogin: (user: AuthUser) => void;
  onCancel?: () => void;
  initialRole?: UserRole;
}

export const Login: React.FC<LoginProps> = ({
  onSuccessLogin,
  onCancel,
  initialRole = 'parent',
}) => {
  const [role, setRole] = useState<UserRole>(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Framer Motion error shake trigger state
  const [shakeTrigger, setShakeTrigger] = useState(false);

  const triggerErrorShake = (msg: string) => {
    setErrorMessage(msg);
    setShakeTrigger(true);
    setTimeout(() => setShakeTrigger(false), 600);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      triggerErrorShake('Please enter both your email and password.');
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      onSuccessLogin({
        email: userCredential.user.email || email,
        role,
        name: role === 'staff' ? 'School Administrator' : 'Guardian Account',
      });
    } catch (err: any) {
      console.warn('Firebase Auth notice:', err);

      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        try {
          const newCred = await createUserWithEmailAndPassword(auth, email.trim(), password);
          onSuccessLogin({
            email: newCred.user.email || email,
            role,
            name: role === 'staff' ? 'School Administrator' : 'Guardian Account',
          });
          return;
        } catch (signupErr) {
          triggerErrorShake('Invalid credentials. Please verify your password.');
        }
      } else {
        triggerErrorShake(err.message || 'Authentication failed. Please verify credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Quick 1-click Demo Logins
  const handleQuickDemo = (demoRole: UserRole) => {
    setRole(demoRole);
    if (demoRole === 'staff') {
      setEmail('admin@themountschool.edu');
      setPassword('SchoolStaff2027!');
      onSuccessLogin({
        email: 'admin@themountschool.edu',
        role: 'staff',
        name: 'Teacher / School Administrator',
      });
    } else {
      setEmail('parent@themountschool.edu');
      setPassword('SchoolParent2027!');
      onSuccessLogin({
        email: 'parent@themountschool.edu',
        role: 'parent',
        name: 'Tariq Mehmood (Parent)',
      });
    }
  };

  return (
    <div className="min-h-[580px] flex items-center justify-center p-4 bg-[#FBF9F5]">
      {/* Container with Shake Animation */}
      <motion.div
        animate={
          shakeTrigger
            ? {
                x: [-10, 10, -8, 8, -4, 4, 0],
                transition: { duration: 0.5 },
              }
            : { x: 0 }
        }
        className="w-full max-w-md rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm relative text-slate-800"
      >
        {/* Header / Brand */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1B365D] mx-auto mb-3">
            <School className="w-6 h-6" />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-700 block mb-1">
            Official Portal Login · Classes 1 to 10
          </span>
          <h3 className="font-serif text-2xl font-bold text-[#1B365D]">
            The Mount School
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Access student progress, attendance, circulars & school dashboard
          </p>
        </div>

        {/* Role Tabs */}
        <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200 mb-6">
          <button
            type="button"
            onClick={() => {
              setRole('parent');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
              role === 'parent'
                ? 'bg-[#1B365D] text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Parent Portal</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setRole('staff');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
              role === 'staff'
                ? 'bg-[#1B365D] text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Teacher / Staff</span>
          </button>
        </div>

        {/* Error message alert */}
        {errorMessage && (
          <div
            role="alert"
            className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5 animate-in fade-in"
          >
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span className="leading-snug">{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {role === 'staff' ? 'Staff Official Email' : 'Registered Parent Email'}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={
                  role === 'staff' ? 'staff@themountschool.edu' : 'parent@example.com'
                }
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#1B365D] focus:ring-1 focus:ring-[#1B365D] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#1B365D] focus:ring-1 focus:ring-[#1B365D] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-[#1B365D] hover:bg-[#132742] transition-all shadow-sm flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-white" />
                Signing in...
              </>
            ) : (
              <>
                Sign In to {role === 'staff' ? 'Staff Portal' : 'Parent Portal'}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* 1-Click Fast-Track Demo Logins */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <span className="text-[10px] font-semibold uppercase text-slate-500 tracking-wider block text-center mb-2.5">
            1-Click Demo Evaluation
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('parent')}
              className="p-2 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 text-xs text-slate-700 font-medium transition-all text-center"
            >
              Demo Parent
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('staff')}
              className="p-2 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 text-xs text-slate-700 font-medium transition-all text-center"
            >
              Demo Staff
            </button>
          </div>
        </div>

        {onCancel && (
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={onCancel}
              className="text-xs text-slate-500 hover:text-slate-800 transition-colors"
            >
              ← Back to School Website
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
