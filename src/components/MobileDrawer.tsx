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
  BookOpen,
  Users,
  Compass,
  FileText,
  MapPin,
  ShieldCheck,
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
  const [expandedAcademicSub, setExpandedAcademicSub] = useState<string | null>('secondary-school');
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
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
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
            className="relative w-full max-w-sm sm:max-w-md h-full bg-white border-l border-slate-200 text-slate-800 flex flex-col shadow-2xl z-10"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-3">
                <img
                  src="/school-images/the-mount-uni-logo.png"
                  alt="The Mount Uni Logo"
                  className="w-10 h-10 object-contain shrink-0"
                />
                <div>
                  <h2 className="text-base font-serif font-bold tracking-tight text-slate-900">
                    The Mount Uni
                  </h2>
                  <p className="text-[11px] text-blue-800 font-semibold">
                    Classes 1 to 10 · Admissions Open
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close navigation menu"
                className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* In-Drawer Search */}
            <div className="px-5 py-3 border-b border-slate-200 bg-white">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Primary, Middle, Secondary..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-8 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
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
                  <span className="text-[11px] font-sans font-semibold text-slate-500 block mb-2">
                    {searchResults.length} Match{searchResults.length !== 1 ? 'es' : ''} found
                  </span>
                  {searchResults.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 text-xs">
                      No matching courses, links or levels found for "{searchQuery}".
                    </div>
                  ) : (
                    searchResults.map((item, idx) => (
                      <a
                        key={idx}
                        href={item.href}
                        onClick={(e) => handleLinkClick(item.href, e)}
                        className="block p-3 rounded-lg bg-slate-50 border border-slate-200 hover:border-blue-300 transition-colors"
                      >
                        <span className="text-xs font-semibold text-slate-900 block">
                          {item.title}
                        </span>
                        {item.description && (
                          <span className="text-[11px] text-slate-600 line-clamp-1 block mt-0.5">
                            {item.description}
                          </span>
                        )}
                        <span className="text-[10px] text-blue-700 font-semibold mt-1 block">
                          {item.category}
                        </span>
                      </a>
                    ))
                  )}
                </div>
              ) : (
                /* Standard Accordion Tabs */
                <div className="space-y-2">
                  {NAV_TABS.map((tab) => {
                    const isExpanded = expandedTab === tab.id;
                    return (
                      <div
                        key={tab.id}
                        className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50/50"
                      >
                        {/* Tab Main Button */}
                        <button
                          type="button"
                          onClick={() => {
                            if (tab.hasDropdown) {
                              toggleTab(tab.id);
                            } else {
                              handleLinkClick(tab.href, {} as React.MouseEvent);
                            }
                          }}
                          className={`w-full p-3.5 flex items-center justify-between text-left text-xs font-bold transition-colors ${
                            isExpanded ? 'text-blue-900 bg-blue-50/80' : 'text-slate-800 hover:bg-slate-100'
                          }`}
                        >
                          <span className="uppercase tracking-wider">{tab.label}</span>
                          {tab.hasDropdown && (
                            <ChevronDown
                              className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
                                isExpanded ? 'rotate-180 text-blue-700' : ''
                              }`}
                            />
                          )}
                        </button>

                        {/* Accordion Content */}
                        {tab.hasDropdown && isExpanded && (
                          <div className="px-3 pb-3 pt-1 border-t border-slate-200/80 bg-white space-y-3">
                            {/* If Academics, render 3 Levels */}
                            {tab.id === 'academics' && (
                              <div className="space-y-2.5 pt-2">
                                {ACADEMIC_LEVELS.map((level) => {
                                  const isSubExpanded = expandedAcademicSub === level.id;
                                  return (
                                    <div
                                      key={level.id}
                                      className="p-3 rounded-lg border border-slate-200 bg-slate-50"
                                    >
                                      <button
                                        type="button"
                                        onClick={() => toggleAcademicSub(level.id)}
                                        className="w-full flex items-center justify-between text-left"
                                      >
                                        <div>
                                          <span className="font-semibold text-slate-900 text-xs block">
                                            {level.title}
                                          </span>
                                          <span className="text-[11px] text-blue-800 font-medium">
                                            {level.ageSpan}
                                          </span>
                                        </div>
                                        <ChevronDown
                                          className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                                            isSubExpanded ? 'rotate-180' : ''
                                          }`}
                                        />
                                      </button>

                                      {isSubExpanded && (
                                        <div className="mt-2.5 pt-2 border-t border-slate-200 space-y-2">
                                          <p className="text-[11px] text-slate-600 leading-relaxed">
                                            {level.summary}
                                          </p>
                                          <ul className="space-y-1.5 pt-1">
                                            {level.keyLinks.map((link) => (
                                              <li key={link.label}>
                                                <a
                                                  href={link.href}
                                                  onClick={(e) => handleLinkClick(link.href, e)}
                                                  className="text-xs text-blue-800 hover:text-blue-950 flex items-center gap-1.5 py-0.5"
                                                >
                                                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                                                  <span>{link.label}</span>
                                                </a>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}

                                {onOpenCurriculumMatrix && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      onOpenCurriculumMatrix();
                                      onClose();
                                    }}
                                    className="w-full py-2 px-3 rounded-lg bg-blue-50 text-blue-900 border border-blue-200 text-xs font-semibold flex items-center justify-center gap-1.5"
                                  >
                                    View Subject Matrix (Classes 1–10)
                                  </button>
                                )}
                              </div>
                            )}

                            {/* If Portals */}
                            {tab.id === 'portals' && (
                              <div className="space-y-2 pt-2">
                                <a
                                  href="https://yandex.com/maps/-/CXVyNN8q"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-3 rounded-lg border border-blue-200 bg-blue-50/60 flex items-center justify-between text-xs font-bold text-blue-900"
                                >
                                  <span className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-blue-700" />
                                    <span>Find on Yandex Maps</span>
                                  </span>
                                  <ArrowRight className="w-3.5 h-3.5 text-blue-700" />
                                </a>
                                {PORTAL_ITEMS.map((portal) => (
                                  <button
                                    key={portal.id}
                                    type="button"
                                    onClick={() => {
                                      if (onOpenPortalAuth) onOpenPortalAuth(portal.id);
                                      onClose();
                                    }}
                                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-left hover:bg-slate-100 flex items-center justify-between text-xs font-medium text-slate-800"
                                  >
                                    <div>
                                      <span className="font-semibold block text-slate-900">
                                        {portal.name}
                                      </span>
                                      <span className="text-[10px] text-slate-500">
                                        {portal.audience}
                                      </span>
                                    </div>
                                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                                  </button>
                                ))}
                              </div>
                            )}

                            {/* Other Sections */}
                            {tab.id !== 'academics' && tab.id !== 'portals' && (
                              <div className="space-y-3 pt-2">
                                {tab.sections?.map((sec, sIdx) => (
                                  <div key={sIdx} className="space-y-1.5">
                                    <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider block">
                                      {sec.title}
                                    </span>
                                    {sec.items.map((item, iIdx) => (
                                      <a
                                        key={iIdx}
                                        href={item.href}
                                        onClick={(e) => handleLinkClick(item.href, e)}
                                        className="block py-1 text-xs text-slate-700 hover:text-blue-900 font-medium"
                                      >
                                        {item.label}
                                      </a>
                                    ))}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Drawer Footer CTA */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-2.5">
              <a
                href="#location"
                onClick={(e) => handleLinkClick('#location', e)}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center gap-2 shadow-2xs"
              >
                <MapPin className="w-3.5 h-3.5 text-blue-700" />
                <span>Our Location on Yandex Maps</span>
              </a>

              <a
                href="#admissions-apply"
                onClick={(e) => handleLinkClick('#admissions-apply', e)}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Apply for Classes 1–10</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
