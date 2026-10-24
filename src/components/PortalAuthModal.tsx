import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, GraduationCap, Users, BookOpen, Compass, Key, ShieldCheck, ArrowRight, Check } from 'lucide-react';
import { PortalLink } from '../types/navigation';
import { PORTAL_ITEMS } from '../data/navigationData';

interface PortalAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPortal?: PortalLink | null;
  onSuccessAuth?: (roleName: string) => void;
}

export const PortalAuthModal: React.FC<PortalAuthModalProps> = ({
  isOpen,
  onClose,
  selectedPortal,
  onSuccessAuth,
}) => {
  const [activePortalId, setActivePortalId] = useState<string>(
    selectedPortal?.id || 'student-portal'
  );
  const [idValue, setIdValue] = useState('SCH-2027-8492');
  const [passwordValue, setPasswordValue] = useState('••••••••••••');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isOpen) return null;

  const currentPortal = PORTAL_ITEMS.find((p) => p.id === activePortalId) || PORTAL_ITEMS[0];

  const handleRoleChange = (portalId: string) => {
    setActivePortalId(portalId);
    if (portalId === 'student-portal') setIdValue('STU-2027-8492');
    else if (portalId === 'parent-gateway') setIdValue('PAR-2027-1049');
    else if (portalId === 'faculty-intranet') setIdValue('TCH-SEC-082');
    else setIdValue('ADM-2027-994');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticated(true);
    setTimeout(() => {
      if (onSuccessAuth) {
        onSuccessAuth(currentPortal.name);
      }
      setIsAuthenticated(false);
      onClose();
    }, 1000);
  };

  return (
    <AnimatePresence>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="portal-auth-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white border border-slate-200 max-w-lg w-full rounded-2xl shadow-2xl text-slate-800 overflow-hidden relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-[#FBF9F5]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1B365D]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-semibold text-amber-700 uppercase tracking-wider block">
                  School Portal Login · Classes 1 to 10
                </span>
                <h3 id="portal-auth-title" className="text-base font-serif font-bold text-[#1B365D]">
                  {currentPortal.name}
                </h3>
              </div>
            </div>
            <button
              type="button"
              aria-label="Close portal authentication"
              onClick={onClose}
              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* Role Switcher */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Select Your Portal Role
              </label>
              <div className="grid grid-cols-2 gap-2">
                {PORTAL_ITEMS.map((portal) => {
                  const isSelected = portal.id === activePortalId;
                  return (
                    <button
                      key={portal.id}
                      type="button"
                      onClick={() => handleRoleChange(portal.id)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-blue-50 border-blue-400 text-[#1B365D] ring-1 ring-blue-400 font-semibold'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 text-[#1B365D]">
                        {portal.iconName === 'GraduationCap' && <GraduationCap className="w-3.5 h-3.5" />}
                        {portal.iconName === 'Users' && <Users className="w-3.5 h-3.5" />}
                        {portal.iconName === 'BookOpen' && <BookOpen className="w-3.5 h-3.5" />}
                        {portal.iconName === 'Compass' && <Compass className="w-3.5 h-3.5" />}
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs block truncate">{portal.audience.split('(')[0].trim()}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
              {currentPortal.description}
            </p>

            {/* Login Form */}
            {isAuthenticated ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-semibold text-slate-900">
                  Authentication Successful
                </h4>
                <p className="text-xs text-slate-500">
                  Opening {currentPortal.name}...
                </p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Student / Parent / Staff ID
                  </label>
                  <input
                    type="text"
                    required
                    value={idValue}
                    onChange={(e) => setIdValue(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#1B365D] focus:ring-1 focus:ring-[#1B365D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Password / Access Code
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordValue}
                    onChange={(e) => setPasswordValue(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#1B365D] focus:ring-1 focus:ring-[#1B365D]"
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span className="font-mono text-emerald-700 font-medium">Secured SSL Session</span>
                  <a href="#reset" onClick={(e) => e.preventDefault()} className="hover:text-slate-900 underline">
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl text-xs font-bold text-white bg-[#1B365D] hover:bg-[#132742] transition-colors shadow-sm flex items-center justify-center gap-2 mt-2"
                >
                  <Key className="w-3.5 h-3.5" />
                  Sign In to {currentPortal.name}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
