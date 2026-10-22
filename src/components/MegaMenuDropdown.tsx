import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  BookOpen,
  Calendar,
  Award,
  Layers,
  FileText,
  Compass,
  Users,
  Building,
  School,
  ExternalLink,
} from 'lucide-react';
import { ACADEMIC_LEVELS, NAV_TABS, PORTAL_ITEMS } from '../data/navigationData';
import { TabKey } from '../types/navigation';

interface MegaMenuDropdownProps {
  activeTab: TabKey | null;
  onClose: () => void;
  onNavigate?: (href: string) => void;
  onOpenCurriculumMatrix?: () => void;
  onOpenPortalAuth?: (portalId?: string) => void;
}

export const MegaMenuDropdown: React.FC<MegaMenuDropdownProps> = ({
  activeTab,
  onClose,
  onNavigate,
  onOpenCurriculumMatrix,
  onOpenPortalAuth,
}) => {
  if (!activeTab) return null;

  const currentTabConfig = NAV_TABS.find((t) => t.id === activeTab);
  if (!currentTabConfig || !currentTabConfig.hasDropdown) return null;

  const handleLinkClick = (href: string, e: React.MouseEvent) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
    if (onNavigate) {
      onNavigate(href);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute left-0 right-0 top-full w-full bg-stone-950/98 backdrop-blur-2xl border-b border-stone-800 shadow-2xl text-stone-200 z-30"
        onMouseLeave={onClose}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* ACADEMICS FULL-WIDTH SPECIALIZED PANEL */}
          {activeTab === 'academics' && (
            <div>
              {/* Header Context Bar */}
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-stone-800">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-serif font-semibold text-stone-100 tracking-wide">
                      Academic Architecture & Faculties
                    </h2>
                    <p className="text-xs text-stone-400">
                      Cohesive progression from foundational discovery to Cambridge Advanced & National Matric/FSc certifications
                    </p>
                  </div>
                </div>
                <div className="hidden lg:flex items-center gap-4 text-xs font-medium text-stone-400">
                  <span className="flex items-center gap-1.5 text-stone-300">
                    <Award className="w-3.5 h-3.5 text-amber-400" /> Dual-Curriculum Accreditations
                  </span>
                  <span>·</span>
                  <a
                    href="#download-prospectus"
                    onClick={(e) => handleLinkClick('#download-prospectus', e)}
                    className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" /> 2026/2027 Prospectus
                  </a>
                </div>
              </div>

              {/* 4 Levels + Featured Image Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* 4 Academic Levels Column Section */}
                <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {ACADEMIC_LEVELS.map((level) => {
                    const isSenior = level.id === 'senior-school';
                    return (
                      <div
                        key={level.id}
                        className={`p-4 rounded-xl border transition-all duration-200 ${
                          isSenior
                            ? 'bg-stone-900/90 border-amber-500/30 ring-1 ring-amber-500/10'
                            : 'bg-stone-900/50 border-stone-800/80 hover:border-stone-700'
                        }`}
                      >
                        {/* Title & Badge */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <h3 className="text-sm font-semibold text-stone-100 flex items-center gap-2">
                              {level.title}
                              {isSenior && (
                                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                  Matric / FSc & O/A Levels
                                </span>
                              )}
                            </h3>
                            <span className="text-[11px] text-amber-400 font-medium">
                              {level.ageSpan}
                            </span>
                          </div>
                          {!isSenior && (
                            <span className="text-[10px] text-stone-400 px-1.5 py-0.5 rounded bg-stone-800 border border-stone-700/60">
                              {level.curriculumBadge}
                            </span>
                          )}
                        </div>

                        {/* Summary */}
                        <p className="text-xs text-stone-400 leading-relaxed mb-3 line-clamp-2">
                          {level.summary}
                        </p>

                        {/* Links */}
                        <ul className="space-y-1.5 border-t border-stone-800/70 pt-2.5">
                          {level.keyLinks.map((link) => (
                            <li key={link.label}>
                              <a
                                href={link.href}
                                onClick={(e) => {
                                  if (isSenior && (link.label.includes('Matric') || link.label.includes('Cambridge') || link.label.includes('FSc'))) {
                                    if (onOpenCurriculumMatrix) {
                                      e.preventDefault();
                                      onOpenCurriculumMatrix();
                                      onClose();
                                      return;
                                    }
                                  }
                                  handleLinkClick(link.href, e);
                                }}
                                className="group flex items-center justify-between text-xs text-stone-300 hover:text-amber-300 transition-colors py-0.5"
                              >
                                <span className="flex items-center gap-1.5 truncate">
                                  <span className="w-1 h-1 rounded-full bg-stone-600 group-hover:bg-amber-400 transition-colors" />
                                  <span className="truncate group-hover:translate-x-0.5 transition-transform">
                                    {link.label}
                                  </span>
                                </span>
                                {link.badge && (
                                  <span className="shrink-0 text-[10px] font-mono px-1 py-0.2 rounded bg-stone-800 text-stone-400 group-hover:text-amber-300 border border-stone-700/50">
                                    {link.badge}
                                  </span>
                                )}
                              </a>
                            </li>
                          ))}
                        </ul>

                        {isSenior && onOpenCurriculumMatrix && (
                          <button
                            type="button"
                            onClick={() => {
                              onOpenCurriculumMatrix();
                              onClose();
                            }}
                            className="mt-3 w-full py-1.5 px-2 rounded-lg bg-blue-950/60 hover:bg-blue-900/60 text-blue-300 border border-blue-800/60 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <Layers className="w-3 h-3 text-blue-400" />
                            View Subject Matrix & Grading Criteria
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Featured Card alongside Academics */}
                <div className="lg:col-span-4 flex flex-col h-full">
                  <div className="relative overflow-hidden rounded-xl border border-stone-800 bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 p-5 flex flex-col justify-between h-full group hover:border-amber-500/40 transition-colors">
                    {/* Architectural / Library Atmosphere Graphic */}
                    <div className="relative h-44 w-full rounded-lg overflow-hidden mb-4 bg-stone-800 border border-stone-700/70 shadow-inner">
                      {/* SVG Architectural Library Render */}
                      <svg
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                        viewBox="0 0 400 240"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        role="img"
                        aria-label="The Mount Uni Library & Academic Quadrangle"
                      >
                        <defs>
                          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#1e293b" />
                            <stop offset="60%" stopColor="#0f172a" />
                            <stop offset="100%" stopColor="#292524" />
                          </linearGradient>
                          <linearGradient id="warmLight" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#d97706" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#78350f" stopOpacity="0.2" />
                          </linearGradient>
                          <linearGradient id="goldBeam" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#b45309" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <rect width="400" height="240" fill="url(#skyGrad)" />
                        
                        {/* Sun / Light Beam */}
                        <circle cx="200" cy="50" r="80" fill="url(#goldBeam)" />
                        
                        {/* Grand Arched Windows */}
                        <path d="M 60 180 L 60 90 Q 90 60 120 90 L 120 180 Z" fill="#334155" opacity="0.6" />
                        <path d="M 140 180 L 140 75 Q 200 40 260 75 L 260 180 Z" fill="url(#warmLight)" opacity="0.8" />
                        <path d="M 280 180 L 280 90 Q 310 60 340 90 L 340 180 Z" fill="#334155" opacity="0.6" />

                        {/* Window Panes & Mullions */}
                        <line x1="200" y1="45" x2="200" y2="180" stroke="#fcd34d" strokeWidth="1.5" opacity="0.7" />
                        <line x1="140" y1="120" x2="260" y2="120" stroke="#fcd34d" strokeWidth="1.5" opacity="0.7" />
                        <line x1="140" y1="150" x2="260" y2="150" stroke="#fcd34d" strokeWidth="1.5" opacity="0.7" />

                        {/* Book Gallery Silhouettes & Balustrade */}
                        <rect x="0" y="180" width="400" height="60" fill="#1c1917" />
                        <line x1="0" y1="180" x2="400" y2="180" stroke="#78350f" strokeWidth="2" />
                        
                        {/* Study Table with Scholar Silhouettes */}
                        <rect x="130" y="195" width="140" height="8" rx="2" fill="#44403c" />
                        <circle cx="160" cy="188" r="6" fill="#78716c" />
                        <circle cx="240" cy="188" r="6" fill="#78716c" />
                        
                        {/* Atmospheric Glow */}
                        <circle cx="200" cy="190" r="22" fill="#fbbf24" opacity="0.3" filter="blur(8px)" />
                      </svg>
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent opacity-80" />
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-stone-900/90 text-amber-300 border border-amber-500/40 backdrop-blur-md">
                          Faculty Showcase
                        </span>
                      </div>
                      <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] text-stone-300 font-medium">
                        <span className="font-serif italic">Atrium Library & Research Quads</span>
                        <span className="text-amber-400">Est. 1984</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">
                        {currentTabConfig.featured?.tag}
                      </span>
                      <h4 className="text-base font-serif font-bold text-stone-100 mt-1 mb-2 group-hover:text-amber-200 transition-colors">
                        {currentTabConfig.featured?.title}
                      </h4>
                      <p className="text-xs text-stone-400 leading-relaxed mb-4">
                        {currentTabConfig.featured?.description}
                      </p>
                    </div>

                    <a
                      href={currentTabConfig.featured?.ctaHref || '#'}
                      onClick={(e) => handleLinkClick(currentTabConfig.featured?.ctaHref || '#', e)}
                      className="mt-auto w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 transition-colors shadow-md"
                    >
                      {currentTabConfig.featured?.ctaText}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Bottom Quick Bar */}
              <div className="mt-8 pt-4 border-t border-stone-800 flex flex-wrap items-center justify-between gap-4 text-xs text-stone-400">
                <div className="flex items-center gap-6">
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenCurriculumMatrix) onOpenCurriculumMatrix();
                      onClose();
                    }}
                    className="hover:text-amber-300 transition-colors flex items-center gap-1.5"
                  >
                    <Layers className="w-3.5 h-3.5 text-stone-500" />
                    Cambridge vs. Matric/FSc Dual Guide
                  </button>
                  <a
                    href="#academic-calendar"
                    onClick={(e) => handleLinkClick('#academic-calendar', e)}
                    className="hover:text-amber-300 transition-colors flex items-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5 text-stone-500" />
                    Academic Calendar 2026–2027
                  </a>
                  <a
                    href="#faculty-fellows"
                    onClick={(e) => handleLinkClick('#faculty-fellows', e)}
                    className="hover:text-amber-300 transition-colors flex items-center gap-1.5"
                  >
                    <Users className="w-3.5 h-3.5 text-stone-500" />
                    Fellowship & Faculty Directory
                  </a>
                </div>
                <div className="text-[11px] text-stone-500">
                  Accredited by Cambridge Assessment International Education & HEC
                </div>
              </div>
            </div>
          )}

          {/* PORTALS DEDICATED PANEL */}
          {activeTab === 'portals' && (
            <div>
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-stone-800">
                <div>
                  <h2 className="text-base font-serif font-semibold text-stone-100">
                    Authorized Campus Portals & Gateways
                  </h2>
                  <p className="text-xs text-stone-400">
                    Single sign-on access to institutional systems, courseware, and communication channels
                  </p>
                </div>
                <span className="text-xs text-amber-400 font-mono">SSO Enabled 2FA</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {PORTAL_ITEMS.map((portal) => (
                  <button
                    key={portal.id}
                    type="button"
                    onClick={() => {
                      if (onOpenPortalAuth) onOpenPortalAuth(portal.id);
                      onClose();
                    }}
                    className="p-5 rounded-xl border border-stone-800 bg-stone-900/60 hover:border-amber-500/40 hover:bg-stone-900 transition-all group text-left"
                  >
                    <div className="w-10 h-10 rounded-lg bg-stone-800 flex items-center justify-center text-amber-400 mb-3 group-hover:scale-105 group-hover:bg-amber-500/20 transition-all">
                      {portal.iconName === 'GraduationCap' && <GraduationCap className="w-5 h-5" />}
                      {portal.iconName === 'Users' && <Users className="w-5 h-5" />}
                      {portal.iconName === 'BookOpen' && <BookOpen className="w-5 h-5" />}
                      {portal.iconName === 'Compass' && <Compass className="w-5 h-5" />}
                    </div>
                    <span className="text-[11px] font-semibold text-amber-400/80 uppercase tracking-wider block mb-1">
                      {portal.audience}
                    </span>
                    <h4 className="text-sm font-semibold text-stone-100 group-hover:text-amber-300 transition-colors mb-1.5 flex items-center justify-between">
                      {portal.name}
                      <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-amber-400" />
                    </h4>
                    <p className="text-xs text-stone-400 leading-relaxed">
                      {portal.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STANDARD MULTI-COLUMN PANELS FOR OTHER TABS (About, Campus Life, Admissions, News) */}
          {activeTab !== 'academics' && activeTab !== 'portals' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Sections list */}
              <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
                {currentTabConfig.sections?.map((section, sIdx) => (
                  <div key={sIdx}>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-400/90 mb-4 pb-1.5 border-b border-stone-800">
                      {section.title}
                    </h3>
                    <ul className="space-y-3">
                      {section.items.map((item, iIdx) => (
                        <li key={iIdx}>
                          <a
                            href={item.href}
                            onClick={(e) => handleLinkClick(item.href, e)}
                            className="group block text-xs"
                          >
                            <span className="font-semibold text-stone-200 group-hover:text-amber-300 transition-colors flex items-center justify-between">
                              <span className="group-hover:translate-x-0.5 transition-transform">
                                {item.label}
                              </span>
                              {item.isExternal ? (
                                <ExternalLink className="w-3 h-3 text-stone-500" />
                              ) : (
                                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-amber-400" />
                              )}
                            </span>
                            {item.description && (
                              <p className="text-stone-400 text-[11px] mt-0.5 leading-snug">
                                {item.description}
                              </p>
                            )}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Spotlight card */}
              {currentTabConfig.featured && (
                <div className="lg:col-span-4">
                  <div className="p-6 rounded-xl border border-stone-800 bg-stone-900/80 hover:border-amber-500/40 transition-colors">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400 block mb-1">
                      {currentTabConfig.featured.tag}
                    </span>
                    <h4 className="text-base font-serif font-bold text-stone-100 mb-2">
                      {currentTabConfig.featured.title}
                    </h4>
                    <p className="text-xs text-stone-400 leading-relaxed mb-6">
                      {currentTabConfig.featured.description}
                    </p>
                    <a
                      href={currentTabConfig.featured.ctaHref}
                      onClick={(e) => handleLinkClick(currentTabConfig.featured?.ctaHref || '#', e)}
                      className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors"
                    >
                      {currentTabConfig.featured.ctaText}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
