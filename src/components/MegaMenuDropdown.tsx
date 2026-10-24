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
  MapPin,
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
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        className="absolute left-0 right-0 top-full w-full bg-white/98 backdrop-blur-xl border-b border-slate-200 shadow-xl text-slate-800 z-30"
        onMouseLeave={onClose}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7">
          {/* ACADEMICS PANEL (CLASSES 1 TO 10) */}
          {activeTab === 'academics' && (
            <div>
              {/* Header Context Bar */}
              <div className="flex items-center justify-between pb-3.5 mb-5 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-900">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-serif font-bold text-slate-900 tracking-tight">
                      Academic Curriculum & Levels (Classes 1 to 10)
                    </h2>
                    <p className="text-xs text-slate-500">
                      Progressive education from Primary literacy through Middle School concepts to Secondary board examinations
                    </p>
                  </div>
                </div>
                <div className="hidden lg:flex items-center gap-4 text-xs font-semibold text-slate-600">
                  <span className="flex items-center gap-1.5 text-blue-950 font-bold">
                    <Award className="w-4 h-4 text-amber-600" /> Classes 1–10 Dedicated School
                  </span>
                  <span>·</span>
                  <a
                    href="#location"
                    onClick={(e) => handleLinkClick('#location', e)}
                    className="text-blue-900 hover:text-blue-700 flex items-center gap-1 transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5 text-amber-600" /> Our Location
                  </a>
                </div>
              </div>

              {/* 3 Levels + Featured Image Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
                {/* 3 Academic Levels (Primary, Middle, Secondary) */}
                <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {ACADEMIC_LEVELS.map((level) => {
                    const isSecondary = level.id === 'secondary-school';
                    return (
                      <div
                        key={level.id}
                        className={`p-4 rounded-xl border transition-all duration-200 ${
                          isSecondary
                            ? 'bg-blue-50/50 border-blue-200 hover:border-blue-300'
                            : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {/* Title & Badge */}
                        <div className="mb-2">
                          <h3 className="text-sm font-serif font-bold text-slate-900">
                            {level.title}
                          </h3>
                          <span className="text-[11px] text-blue-800 font-semibold block mt-0.5">
                            {level.ageSpan}
                          </span>
                        </div>

                        {/* Summary */}
                        <p className="text-xs text-slate-600 leading-relaxed mb-3 line-clamp-3">
                          {level.summary}
                        </p>

                        {/* Links */}
                        <ul className="space-y-1.5 border-t border-slate-200 pt-2.5">
                          {level.keyLinks.map((link) => (
                            <li key={link.label}>
                              <a
                                href={link.href}
                                onClick={(e) => handleLinkClick(link.href, e)}
                                className="group flex items-center justify-between text-xs text-slate-700 hover:text-blue-900 transition-colors py-0.5"
                              >
                                <span className="flex items-center gap-1.5 truncate">
                                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 group-hover:bg-blue-600 transition-colors" />
                                  <span className="truncate group-hover:translate-x-0.5 transition-transform">
                                    {link.label}
                                  </span>
                                </span>
                                {link.badge && (
                                  <span className="shrink-0 text-[10px] font-sans px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold">
                                    {link.badge}
                                  </span>
                                )}
                              </a>
                            </li>
                          ))}
                        </ul>

                        {onOpenCurriculumMatrix && (
                          <button
                            type="button"
                            onClick={() => {
                              onOpenCurriculumMatrix();
                              onClose();
                            }}
                            className="mt-3 w-full py-1.5 px-2 rounded-lg bg-white hover:bg-blue-100/60 text-blue-900 border border-slate-200 hover:border-blue-300 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all shadow-2xs"
                          >
                            <Layers className="w-3 h-3 text-blue-700" />
                            View Subject Matrix
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Featured Real Photo alongside Academics */}
                <div className="lg:col-span-4 flex flex-col h-full">
                  <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-4 flex flex-col justify-between h-full group hover:border-blue-300 shadow-sm transition-all">
                    {/* Genuine School Photo */}
                    <div className="relative h-40 w-full rounded-lg overflow-hidden mb-3 bg-slate-100 border border-slate-200">
                      <img
                        src="/school-images/campus-corridor-colonnade.jpg"
                        alt="The Mount Uni Academic Corridor"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2.5 left-2.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/95 text-blue-900 shadow-xs border border-slate-200">
                          Campus Colonnade
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800">
                        Campus Life & Facilities
                      </span>
                      <h4 className="text-sm font-serif font-bold text-slate-900 mt-1 mb-1.5 group-hover:text-blue-900 transition-colors">
                        Spacious, Sunlit School Campus
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed mb-4">
                        Naturally ventilated classrooms, dedicated B2 Reading Room library, and expansive corridors built for student safety.
                      </p>
                    </div>

                    <a
                      href="#location"
                      onClick={(e) => handleLinkClick('#location', e)}
                      className="mt-auto w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 transition-colors shadow-xs"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Find Our School</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PORTALS & LOCATION DEDICATED PANEL */}
          {activeTab === 'portals' && (
            <div>
              <div className="flex items-center justify-between pb-3.5 mb-5 border-b border-slate-200">
                <div>
                  <h2 className="text-base font-serif font-bold text-slate-900">
                    School Portals & Official Location
                  </h2>
                  <p className="text-xs text-slate-500">
                    Direct access for students, parents, staff, and visitors to our campus
                  </p>
                </div>
                <a
                  href="https://yandex.com/maps/-/CXVyNN8q"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-800 font-bold hover:underline flex items-center gap-1"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Open on Yandex Maps</span>
                </a>
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
                    className="p-5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50/50 hover:border-blue-300 transition-all group text-left shadow-2xs"
                  >
                    <div className="w-10 h-10 rounded-lg bg-blue-100/80 flex items-center justify-center text-blue-900 mb-3 group-hover:scale-105 group-hover:bg-blue-900 group-hover:text-white transition-all">
                      {portal.iconName === 'GraduationCap' && <GraduationCap className="w-5 h-5" />}
                      {portal.iconName === 'Users' && <Users className="w-5 h-5" />}
                      {portal.iconName === 'BookOpen' && <BookOpen className="w-5 h-5" />}
                      {portal.iconName === 'Compass' && <Compass className="w-5 h-5" />}
                    </div>
                    <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider block mb-1">
                      {portal.audience}
                    </span>
                    <h4 className="text-sm font-serif font-bold text-slate-900 group-hover:text-blue-900 transition-colors mb-1.5 flex items-center justify-between">
                      {portal.name}
                      <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-blue-800" />
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {portal.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STANDARD MULTI-COLUMN PANELS FOR OTHER TABS */}
          {activeTab !== 'academics' && activeTab !== 'portals' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
              {/* Sections list */}
              <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-7">
                {currentTabConfig.sections?.map((section, sIdx) => (
                  <div key={sIdx}>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900 mb-3 pb-1.5 border-b border-slate-200">
                      {section.title}
                    </h3>
                    <ul className="space-y-2.5">
                      {section.items.map((item, iIdx) => (
                        <li key={iIdx}>
                          <a
                            href={item.href}
                            onClick={(e) => handleLinkClick(item.href, e)}
                            className="group block text-xs"
                          >
                            <span className="font-semibold text-slate-800 group-hover:text-blue-900 transition-colors flex items-center justify-between">
                              <span className="group-hover:translate-x-0.5 transition-transform">
                                {item.label}
                              </span>
                              {item.isExternal ? (
                                <ExternalLink className="w-3 h-3 text-slate-400" />
                              ) : (
                                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-blue-800" />
                              )}
                            </span>
                            {item.description && (
                              <p className="text-slate-500 text-[11px] mt-0.5 leading-snug">
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

              {/* Spotlight card with real photo */}
              {currentTabConfig.featured && (
                <div className="lg:col-span-4">
                  <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 hover:border-blue-300 transition-all shadow-2xs">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800 block mb-1">
                      {currentTabConfig.featured.tag}
                    </span>
                    <h4 className="text-sm font-serif font-bold text-slate-900 mb-1.5">
                      {currentTabConfig.featured.title}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      {currentTabConfig.featured.description}
                    </p>
                    <a
                      href={currentTabConfig.featured.ctaHref}
                      onClick={(e) => handleLinkClick(currentTabConfig.featured?.ctaHref || '#', e)}
                      className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg transition-colors shadow-2xs"
                    >
                      <span>{currentTabConfig.featured.ctaText}</span>
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
