import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [idValue, setIdValue] = useState('MU-2027-8492');
  const [passwordValue, setPasswordValue] = useState('••••••••••••');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isOpen) return null;

  const currentPortal = PORTAL_ITEMS.find((p) => p.id === activePortalId) || PORTAL_ITEMS[0];

  const handleRoleChange = (portalId: string) => {
    setActivePortalId(portalId);
    if (portalId === 'student-portal') setIdValue('MU-2027-8492');
    else if (portalId === 'parent-gateway') setIdValue('PAR-2027-1049');
    else if (portalId === 'faculty-intranet') setIdValue('FAC-ENG-082');
    else setIdValue('ALUM-2021-994');
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
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="portal-auth-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#0B1528] border border-blue-900/60 max-w-lg w-full rounded-2xl shadow-2xl text-stone-100 overflow-hidden relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-blue-950 bg-[#070E1C]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider block">
                  Institutional SSO Authenticator
                </span>
                <h3 id="portal-auth-title" className="text-base font-serif font-bold text-stone-100">
                  {currentPortal.name}
                </h3>
              </div>
            </div>
            <button
              type="button"
              aria-label="Close portal authentication"
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* Role Switcher */}
            <div>
              <label className="block text-[11px] font-semibold text-stone-300 uppercase tracking-wider mb-2">
                Select Your Institutional Role
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
                          ? 'bg-blue-600/20 border-blue-500 text-blue-300 ring-1 ring-blue-500/30'
                          : 'bg-[#070E1C] border-blue-950 text-stone-400 hover:text-stone-200 hover:border-blue-900'
                      }`}
                    >
                      <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                        {portal.iconName === 'GraduationCap' && <GraduationCap className="w-3.5 h-3.5" />}
                        {portal.iconName === 'Users' && <Users className="w-3.5 h-3.5" />}
                        {portal.iconName === 'BookOpen' && <BookOpen className="w-3.5 h-3.5" />}
                        {portal.iconName === 'Compass' && <Compass className="w-3.5 h-3.5" />}
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-semibold block truncate">{portal.audience}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed bg-[#070E1C] p-3 rounded-xl border border-blue-950">
              {currentPortal.description}
            </p>

            {/* Login Form */}
            {isAuthenticated ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-semibold text-stone-100">
                  Authentication Successful
                </h4>
                <p className="text-xs text-stone-400">
                  Redirecting to {currentPortal.name} dashboard...
                </p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-300 uppercase tracking-wider mb-1">
                    Institutional ID / Username
                  </label>
                  <input
                    type="text"
                    required
                    value={idValue}
                    onChange={(e) => setIdValue(e.target.value)}
                    className="w-full bg-[#070E1C] border border-blue-950 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-300 uppercase tracking-wider mb-1">
                    Password / Token
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordValue}
                    onChange={(e) => setPasswordValue(e.target.value)}
                    className="w-full bg-[#070E1C] border border-blue-950 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1">
                  <span className="font-mono text-blue-400">2FA Active</span>
                  <a href="#reset" onClick={(e) => e.preventDefault()} className="hover:text-stone-200 underline">
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl text-xs font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 transition-colors shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 mt-2"
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
