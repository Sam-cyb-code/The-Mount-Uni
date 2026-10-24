import React, { useState, useRef, useEffect } from 'react';
import { Menu, Search, X, ChevronDown, ShieldCheck, MapPin, Phone, GraduationCap } from 'lucide-react';
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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
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
            ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-slate-200'
            : 'bg-white border-b border-slate-200'
        }`}
        onMouseLeave={handleMouseLeaveNav}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4 sm:gap-8">
            {/* Zone 1: School Brand & Logo */}
            <a
              href="/"
              className="flex items-center gap-3 group shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg p-1"
            >
              <img
                src="/school-images/the-mount-uni-logo.png"
                alt="The Mount Uni Logo"
                className="w-11 h-11 sm:w-12 sm:h-12 object-contain shrink-0"
              />
              <div className="flex flex-col">
                <span className="font-serif font-bold tracking-tight text-slate-900 text-lg sm:text-xl group-hover:text-blue-900 transition-colors whitespace-nowrap">
                  The Mount Uni
                </span>
                <span className="text-[11px] font-sans font-medium text-blue-800 -mt-0.5 tracking-wide">
                  Classes 1 to 10 · Quality Education
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
                      className={`inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold tracking-wide rounded-md transition-all whitespace-nowrap shrink-0 ${
                        isActive
                          ? 'text-blue-900 bg-blue-50/80 border border-blue-200/60'
                          : 'text-slate-700 hover:text-blue-900 hover:bg-slate-50'
                      }`}
                    >
                      {tab.label}
                      {tab.hasDropdown && (
                        <ChevronDown
                          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                            isActive ? 'rotate-180 text-blue-700' : ''
                          }`}
                        />
                      )}
                    </a>

                    {/* Active Tab Underline Indicator */}
                    {isActive && (
                      <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-blue-700 rounded-full" />
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Zone 3: Quick Action Buttons */}
            <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
              {/* Location Quick Button */}
              <a
                href="#location"
                onClick={(e) => {
                  e.preventDefault();
                  const target = document.querySelector('#location');
                  target?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg text-slate-700 hover:text-blue-900 bg-slate-100 hover:bg-blue-50 border border-slate-200 transition-all cursor-pointer whitespace-nowrap"
                title="View School Location on Yandex Maps"
              >
                <MapPin className="w-3.5 h-3.5 text-blue-700" />
                <span>Our Location</span>
              </a>

              {/* Admissions 1-10 CTA */}
              <a
                href="#admissions-apply"
                onClick={(e) => {
                  e.preventDefault();
                  const target = document.querySelector('#admissions');
                  target?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold rounded-lg text-white bg-blue-900 hover:bg-blue-800 transition-all shadow-sm hover:shadow whitespace-nowrap"
              >
                Admissions 1–10
              </a>

              {/* Mobile Hamburger Button */}
              <button
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                aria-label="Open navigation menu"
                aria-expanded={isDrawerOpen}
                className="lg:hidden p-2 text-slate-700 hover:text-blue-900 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
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
