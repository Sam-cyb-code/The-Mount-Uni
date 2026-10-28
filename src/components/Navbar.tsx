import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, ShieldCheck, MapPin, Phone, GraduationCap, LayoutDashboard } from 'lucide-react';

interface NavbarProps {
  onNavigate?: (href: string) => void;
  onOpenPortalModal?: () => void;
  onOpenManagementSystem?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigate,
  onOpenPortalModal,
  onOpenManagementSystem,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    setIsDrawerOpen(false);
  };

  const navLinks = [
    { label: 'Home', href: '#' },
    { label: 'About Us', href: '#about' },
    { label: 'Academics', href: '#academics' },
    { label: 'AI & Digital', href: '#digital-learning' },
    { label: 'School Life', href: '#school-life' },
    { label: 'Admissions', href: '#admissions' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-[#E2E8F0]'
            : 'bg-white border-b border-[#E2E8F0]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center justify-between h-20 gap-4 xl:gap-6 w-full">
            {/* Zone 1: Official School Brand & Logo */}
            <a
              href="#"
              onClick={(e) => handleLinkClick('#', e)}
              className="flex items-center gap-2.5 sm:gap-3 group shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5132] rounded-lg p-1"
            >
              <img
                src="/school-images/the-mount-uni-logo.png"
                alt="The Mont Uni Pre Cadet Academy Logo"
                className="w-10 h-10 sm:w-11 sm:h-11 object-contain shrink-0"
              />
              <div className="flex flex-col text-left">
                <span className="font-serif font-bold tracking-tight text-slate-900 text-sm sm:text-base lg:text-lg group-hover:text-[#0F5132] transition-colors whitespace-nowrap">
                  The Mont Uni Pre Cadet Academy
                </span>
                <span className="text-[10px] sm:text-[11px] font-sans font-semibold text-[#0F5132] -mt-0.5 tracking-wide whitespace-nowrap">
                  Classes 1 to 10 · Chakwal, Punjab
                </span>
              </div>
            </a>

            {/* Zone 2: Clean Desktop Navigation Links (No collision or overlap) */}
            <nav
              className="hidden xl:flex items-center gap-1 2xl:gap-2 h-full shrink-0"
              aria-label="Main Navigation"
            >
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleLinkClick(link.href, e)}
                  className="px-2.5 py-1.5 2xl:px-3 text-xs font-semibold tracking-wide rounded-md text-slate-700 hover:text-[#0F5132] hover:bg-[#EAF2EB] transition-all whitespace-nowrap"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Zone 3: Actions (Staff Portal & Admissions CTA) */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Staff Portal Link */}
              <button
                type="button"
                onClick={() => {
                  if (onOpenManagementSystem) {
                    onOpenManagementSystem();
                  } else if (onOpenPortalModal) {
                    onOpenPortalModal();
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl text-[#0F5132] hover:text-[#0c4128] bg-[#EAF2EB] hover:bg-[#d9e9db] border border-[#0F5132]/20 transition-all cursor-pointer whitespace-nowrap"
                title="Authorised Staff Portal"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#0F5132]" />
                <span className="hidden sm:inline">Staff Portal</span>
              </button>

              {/* Enquire About Admissions Primary CTA */}
              <a
                href="#admissions"
                onClick={(e) => handleLinkClick('#admissions', e)}
                className="hidden sm:inline-flex items-center justify-center px-3.5 py-2 text-xs font-bold rounded-xl text-white bg-[#0F5132] hover:bg-[#0c4128] transition-all shadow-xs hover:shadow whitespace-nowrap cursor-pointer border border-[#0c4128]"
              >
                <span>Admissions</span>
              </a>

              {/* Mobile Hamburger Button */}
              <button
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                aria-label="Open navigation menu"
                aria-expanded={isDrawerOpen}
                className="xl:hidden p-2 text-slate-700 hover:text-[#0F5132] hover:bg-[#EAF2EB] border border-slate-200 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5132] cursor-pointer"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 xl:hidden overflow-hidden flex justify-end">
          {/* Backdrop */}
          <div
            onClick={() => setIsDrawerOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            aria-hidden="true"
          />

          {/* Drawer Container */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Navigation Menu"
            className="relative w-full max-w-sm h-full bg-white border-l border-slate-200 text-slate-800 flex flex-col shadow-2xl z-10 animate-in slide-in-from-right duration-250"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-[#F8FAF7]">
              <div className="flex items-center gap-3">
                <img
                  src="/school-images/the-mount-uni-logo.png"
                  alt="Logo"
                  className="w-10 h-10 object-contain shrink-0"
                />
                <div>
                  <h2 className="text-sm font-serif font-bold tracking-tight text-slate-900 leading-tight">
                    The Mont Uni Pre Cadet Academy
                  </h2>
                  <p className="text-[11px] text-[#0F5132] font-semibold">
                    Classes 1 to 10 · Chakwal, Punjab
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                aria-label="Close navigation menu"
                className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body: Navigation Links */}
            <div className="flex-1 overflow-y-auto p-5 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-2">
                Website Navigation
              </span>
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleLinkClick(link.href, e)}
                  className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:text-[#0F5132] hover:bg-[#EAF2EB] transition-colors"
                >
                  {link.label}
                </a>
              ))}

              <div className="pt-6 border-t border-slate-100 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block">
                  Quick Access
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsDrawerOpen(false);
                    if (onOpenManagementSystem) onOpenManagementSystem();
                  }}
                  className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-[#0F5132] bg-[#EAF2EB] hover:bg-[#d8e7da] border border-[#0F5132]/20 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <ShieldCheck className="w-4 h-4 text-[#0F5132]" />
                  <span>Authorised Staff Portal</span>
                </button>

                <a
                  href="#admissions"
                  onClick={(e) => handleLinkClick('#admissions', e)}
                  className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-[#0F5132] hover:bg-[#0c4128] text-center block shadow-sm"
                >
                  Enquire About Admissions (Classes 1–10)
                </a>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-200 bg-[#F8FAF7] text-xs text-slate-500">
              <p className="font-semibold text-slate-700">Location: Chakwal area, Punjab</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Mon–Thu: 7:45 AM – 1:45 PM | Fri: 7:45 AM – 12:15 PM</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
