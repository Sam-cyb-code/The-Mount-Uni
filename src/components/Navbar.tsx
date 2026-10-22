import React, { useState, useRef, useEffect } from 'react';
import { Menu, Search, X, ChevronDown, GraduationCap, ShieldCheck } from 'lucide-react';
import { NAV_TABS } from '../data/navigationData';
import { MegaMenuDropdown } from './MegaMenuDropdown';
import { MobileDrawer } from './MobileDrawer';
import { TabKey } from '../types/navigation';

interface NavbarProps {
  onNavigate?: (href: string) => void;
  onOpenPortalModal?: (portalId?: string) => void;
  onOpenCurriculumMatrix?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigate,
  onOpenPortalModal,
  onOpenCurriculumMatrix,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Monitor scroll for subtle elevation styles & auto-close dropdown
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      setActiveTab(null);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseEnterTab = (tabId: TabKey) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setActiveTab(tabId);
  };

  const handleMouseLeaveNav = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setActiveTab(null);
    }, 180);
  };

  const handleTabClick = (tabId: TabKey, href: string, e: React.MouseEvent) => {
    if (tabId === 'portals' && onOpenPortalModal) {
      e.preventDefault();
      onOpenPortalModal();
      return;
    }

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
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-stone-950/95 backdrop-blur-md shadow-xl border-b border-stone-800'
            : 'bg-stone-950 border-b border-stone-800'
        }`}
        onMouseLeave={handleMouseLeaveNav}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-8">
            {/* Zone 1: Brand Wordmark & Crest */}
            <a
              href="/"
              className="flex items-center gap-3 group shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-lg p-1"
            >
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:bg-amber-500/20 group-hover:border-amber-400 transition-all shadow-inner">
                {/* Traditional Academic Shield Icon */}
                <ShieldCheck className="w-5 h-5 text-amber-400" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold tracking-widest text-stone-100 text-lg group-hover:text-amber-300 transition-colors whitespace-nowrap">
                  THE MOUNT UNI
                </span>
                <span className="text-[10px] tracking-widest uppercase font-mono text-stone-400 -mt-0.5">
                  Veritas · Disciplina · Lux
                </span>
              </div>
            </a>

            {/* Zone 2: Desktop Navigation Links */}
            <nav
              className="hidden lg:flex items-center gap-1 xl:gap-2 h-full"
              aria-label="Main Navigation"
            >
              {NAV_TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <div
                    key={tab.id}
                    className="relative h-full flex items-center"
                    onMouseEnter={() => handleMouseEnterTab(tab.id)}
                  >
                    <a
                      href={tab.href}
                      onClick={(e) => handleTabClick(tab.id, tab.href, e)}
                      aria-expanded={tab.hasDropdown ? isActive : undefined}
                      aria-haspopup={tab.hasDropdown ? 'true' : undefined}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider rounded-md transition-all whitespace-nowrap shrink-0 ${
                        isActive
                          ? 'text-amber-300 bg-stone-900 border border-stone-700/80'
                          : 'text-stone-300 hover:text-white hover:bg-stone-900/60'
                      }`}
                    >
                      {tab.label}
                      {tab.hasDropdown && (
                        <ChevronDown
                          className={`w-3.5 h-3.5 text-stone-400 transition-transform duration-200 ${
                            isActive ? 'rotate-180 text-amber-400' : ''
                          }`}
                        />
                      )}
                    </a>

                    {/* Active Tab Underline Indicator */}
                    {isActive && (
                      <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-amber-400 rounded-full" />
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Zone 3: Quick CTA & Mobile Hamburger */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Quick Admissions 2027 CTA */}
              <a
                href="#admissions-apply"
                onClick={(e) => {
                  e.preventDefault();
                  const target = document.querySelector('#admissions-apply');
                  target?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg text-stone-950 bg-amber-400 hover:bg-amber-300 transition-all shadow-md shadow-amber-500/10 hover:shadow-amber-500/20 whitespace-nowrap shrink-0"
              >
                Apply 2027
              </a>

              {/* Hamburger Button for Mobile */}
              <button
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                aria-label="Open mobile navigation menu"
                aria-expanded={isDrawerOpen}
                className="lg:hidden p-2.5 text-stone-300 hover:text-white hover:bg-stone-900 border border-stone-800 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Mega Menu Dropdown */}
        <MegaMenuDropdown
          activeTab={activeTab}
          onClose={() => setActiveTab(null)}
          onNavigate={onNavigate}
          onOpenCurriculumMatrix={onOpenCurriculumMatrix}
          onOpenPortalAuth={onOpenPortalModal}
        />
      </header>

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onNavigate={onNavigate}
        onOpenCurriculumMatrix={onOpenCurriculumMatrix}
        onOpenPortalAuth={onOpenPortalModal}
      />
    </>
  );
};
