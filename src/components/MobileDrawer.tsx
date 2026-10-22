import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ChevronDown,
  ChevronRight,
  GraduationCap,
  Search,
  Phone,
  ArrowRight,
  Sparkles,
  BookOpen,
  Users,
  Compass,
  FileText,
} from 'lucide-react';
import { ACADEMIC_LEVELS, NAV_TABS, PORTAL_ITEMS } from '../data/navigationData';
import { searchNavigation } from '../utils/navigationUtils';
import { TabKey } from '../types/navigation';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (href: string) => void;
  onOpenCurriculumMatrix?: () => void;
  onOpenPortalAuth?: (portalId?: string) => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenCurriculumMatrix,
  onOpenPortalAuth,
}) => {
  const [expandedTab, setExpandedTab] = useState<TabKey | null>('academics');
  const [expandedAcademicSub, setExpandedAcademicSub] = useState<string | null>('senior-school');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleTab = (tabId: TabKey) => {
    setExpandedTab((prev) => (prev === tabId ? null : tabId));
  };

  const toggleAcademicSub = (levelId: string) => {
    setExpandedAcademicSub((prev) => (prev === levelId ? null : levelId));
  };

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

  const searchResults = searchQuery
    ? searchNavigation(searchQuery, NAV_TABS, ACADEMIC_LEVELS)
    : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden overflow-hidden flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-950/75 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Drawer Container */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Navigation Menu"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="relative w-full max-w-sm sm:max-w-md h-full bg-stone-950 border-l border-stone-800 text-stone-200 flex flex-col shadow-2xl z-10"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-stone-800 bg-stone-950">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-serif font-bold text-sm">
                  MU
                </div>
                <div>
                  <h2 className="text-sm font-serif font-bold tracking-wider text-stone-100 uppercase">
                    The Mount Uni
                  </h2>
                  <p className="text-[10px] text-amber-400 tracking-widest font-mono">
                    ADMISSIONS 2027 ACTIVE
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close navigation menu"
                className="p-2 text-stone-400 hover:text-stone-100 hover:bg-stone-900 rounded-lg transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* In-Drawer Search */}
            <div className="px-5 py-3 border-b border-stone-800/80 bg-stone-900/40">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search faculties, O/A Levels, Matric..."
                  className="w-full bg-stone-900 border border-stone-800 rounded-lg pl-9 pr-8 py-2 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/40"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {/* If Searching, show search results */}
              {searchQuery ? (
                <div className="space-y-2">
                  <span className="text-[11px] font-mono uppercase text-stone-400 block mb-2">
                    {searchResults.length} Match{searchResults.length !== 1 ? 'es' : ''} found
                  </span>
                  {searchResults.length === 0 ? (
                    <div className="text-center py-8 text-stone-500 text-xs">
                      No matching courses, links or faculties found for "{searchQuery}".
                    </div>
                  ) : (
                    searchResults.map((item, idx) => (
                      <a
                        key={idx}
                        href={item.href}
                        onClick={(e) => handleLinkClick(item.href, e)}
                        className="block p-3 rounded-lg bg-stone-900 border border-stone-800 hover:border-amber-500/50 transition-colors"
                      >
                        <span className="text-[10px] text-amber-400 font-mono block">
                          {item.category}
                        </span>
                        <span className="text-xs font-semibold text-stone-100 flex items-center justify-between">
                          {item.title}
                          <ArrowRight className="w-3 h-3 text-amber-400" />
                        </span>
                        {item.description && (
                          <span className="text-[11px] text-stone-400 block mt-1 line-clamp-2">
                            {item.description}
                          </span>
                        )}
                      </a>
                    ))
                  )}
                </div>
              ) : (
                /* Main Nested Accordion */
                <nav className="space-y-1.5" aria-label="Mobile Navigation">
                  {NAV_TABS.map((tab) => {
                    const isExpanded = expandedTab === tab.id;
                    return (
                      <div
                        key={tab.id}
                        className="rounded-xl border border-stone-800/80 bg-stone-900/30 overflow-hidden"
                      >
                        {/* Tab Accordion Button */}
                        <button
                          type="button"
                          onClick={() => toggleTab(tab.id)}
                          aria-expanded={isExpanded}
                          className="w-full flex items-center justify-between px-4 py-3 text-left font-serif text-sm font-semibold text-stone-200 hover:text-amber-300 transition-colors"
                        >
                          <span className="flex items-center gap-2">
                            {tab.id === 'academics' && (
                              <GraduationCap className="w-4 h-4 text-amber-400" />
                            )}
                            {tab.label}
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 text-stone-400 transition-transform duration-200 ${
                              isExpanded ? 'rotate-180 text-amber-400' : ''
                            }`}
                          />
                        </button>

                        {/* Nested Content */}
                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                              className="overflow-hidden border-t border-stone-800/60 bg-stone-950/70"
                            >
                              <div className="p-3 space-y-2">
                                {/* ACADEMICS SPECIAL NESTED ACCORDION */}
                                {tab.id === 'academics' && (
                                  <div className="space-y-2">
                                    <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 mb-2">
                                      <span className="font-semibold block mb-0.5">Dual-Stream Curriculum</span>
                                      Cambridge International (O/A Levels) & BISE Matric/FSc Pre-Med & Pre-Engineering.
                                    </div>

                                    {ACADEMIC_LEVELS.map((level) => {
                                      const isSubExpanded = expandedAcademicSub === level.id;
                                      const isSenior = level.id === 'senior-school';
                                      return (
                                        <div
                                          key={level.id}
                                          className={`rounded-lg border transition-colors ${
                                            isSenior
                                              ? 'border-amber-500/40 bg-stone-900/90'
                                              : 'border-stone-800 bg-stone-900/40'
                                          }`}
                                        >
                                          {/* Nested Sub-Accordion Trigger */}
                                          <button
                                            type="button"
                                            onClick={() => toggleAcademicSub(level.id)}
                                            aria-expanded={isSubExpanded}
                                            className="w-full flex items-center justify-between p-3 text-left"
                                          >
                                            <div>
                                              <span className="text-xs font-semibold text-stone-100 block">
                                                {level.title}
                                              </span>
                                              <span className="text-[10px] text-amber-400 font-medium">
                                                {level.ageSpan} · {level.curriculumBadge}
                                              </span>
                                            </div>
                                            <ChevronRight
                                              className={`w-3.5 h-3.5 text-stone-400 transition-transform ${
                                                isSubExpanded ? 'rotate-90 text-amber-400' : ''
                                              }`}
                                            />
                                          </button>

                                          {/* Nested Sub-Level Links */}
                                          <AnimatePresence initial={false}>
                                            {isSubExpanded && (
                                              <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.18 }}
                                                className="overflow-hidden border-t border-stone-800/80 px-3 py-2 bg-stone-950/60"
                                              >
                                                <ul className="space-y-1.5">
                                                  {level.keyLinks.map((link) => (
                                                    <li key={link.label}>
                                                      <a
                                                        href={link.href}
                                                        onClick={(e) => {
                                                          if (isSenior && onOpenCurriculumMatrix && (link.label.includes('Matric') || link.label.includes('Cambridge') || link.label.includes('FSc'))) {
                                                            e.preventDefault();
                                                            onOpenCurriculumMatrix();
                                                            onClose();
                                                            return;
                                                          }
                                                          handleLinkClick(link.href, e);
                                                        }}
                                                        className="flex items-center justify-between py-1 text-xs text-stone-300 hover:text-amber-300"
                                                      >
                                                        <span>{link.label}</span>
                                                        {link.badge && (
                                                          <span className="text-[9px] px-1 py-0.5 rounded bg-stone-800 text-amber-400 border border-stone-700">
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
                                                    className="mt-2.5 w-full py-1.5 px-2 rounded-lg bg-blue-950 text-blue-300 border border-blue-800/80 text-[11px] font-semibold flex items-center justify-center gap-1.5"
                                                  >
                                                    <FileText className="w-3 h-3 text-blue-400" />
                                                    View Subject Matrix & Criteria
                                                  </button>
                                                )}
                                              </motion.div>
                                            )}
                                          </AnimatePresence>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}

                                {/* PORTALS SPECIAL DRAWER LIST */}
                                {tab.id === 'portals' && (
                                  <div className="space-y-2">
                                    {PORTAL_ITEMS.map((portal) => (
                                      <button
                                        key={portal.id}
                                        type="button"
                                        onClick={() => {
                                          if (onOpenPortalAuth) onOpenPortalAuth(portal.id);
                                          onClose();
                                        }}
                                        className="w-full flex items-center gap-3 p-2.5 rounded-lg bg-stone-900 border border-stone-800 hover:border-amber-500/40 text-left"
                                      >
                                        <div className="w-7 h-7 rounded bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                                          {portal.iconName === 'GraduationCap' && <GraduationCap className="w-3.5 h-3.5" />}
                                          {portal.iconName === 'Users' && <Users className="w-3.5 h-3.5" />}
                                          {portal.iconName === 'BookOpen' && <BookOpen className="w-3.5 h-3.5" />}
                                          {portal.iconName === 'Compass' && <Compass className="w-3.5 h-3.5" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <span className="text-xs font-semibold text-stone-200 block truncate">
                                            {portal.name}
                                          </span>
                                          <span className="text-[10px] text-stone-400 block truncate">
                                            {portal.audience}
                                          </span>
                                        </div>
                                        <ChevronRight className="w-3.5 h-3.5 text-stone-500" />
                                      </button>
                                    ))}
                                  </div>
                                )}

                                {/* STANDARD SECTIONS */}
                                {tab.id !== 'academics' && tab.id !== 'portals' && (
                                  <div className="space-y-3">
                                    {tab.sections?.map((section, sIdx) => (
                                      <div key={sIdx} className="space-y-1">
                                        <span className="text-[10px] uppercase font-mono tracking-wider text-amber-400/90 block px-1">
                                          {section.title}
                                        </span>
                                        {section.items.map((item, iIdx) => (
                                          <a
                                            key={iIdx}
                                            href={item.href}
                                            onClick={(e) => handleLinkClick(item.href, e)}
                                            className="block px-2.5 py-1.5 rounded-md hover:bg-stone-900 text-xs text-stone-300 hover:text-amber-300 transition-colors"
                                          >
                                            <span className="font-medium block">{item.label}</span>
                                            {item.description && (
                                              <span className="text-[10px] text-stone-500 block truncate">
                                                {item.description}
                                              </span>
                                            )}
                                          </a>
                                        ))}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </nav>
              )}
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-5 border-t border-stone-800 bg-stone-950 space-y-3">
              <a
                href="#admissions-apply"
                onClick={(e) => handleLinkClick('#admissions-apply', e)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 transition-colors shadow-lg shadow-amber-500/10"
              >
                Apply for Admissions 2027
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <div className="flex items-center justify-between text-[11px] text-stone-400 px-1">
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-amber-400" /> +92 (042) 111-MOUNT
                </span>
                <span className="font-mono text-stone-500">Office of Admissions</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
