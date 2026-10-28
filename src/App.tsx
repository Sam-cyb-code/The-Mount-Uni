import React, { useState, useEffect } from 'react';
import {
  School,
  Sparkles,
  LayoutDashboard,
  Users,
  Award,
  BookOpen,
  MapPin,
  Clock,
  Shield,
  Eye,
} from 'lucide-react';
import { EmergencyTicker } from './components/EmergencyTicker';
import { Navbar } from './components/Navbar';
import { Home } from './components/Home';
import { SchoolManagementSystem } from './components/SchoolManagementSystem';
import { testFirestoreConnection } from './lib/firebase';

export type ActiveView = 'main' | 'portal';

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.startsWith('/staff') || hash === '#staff' || hash === '#portal') {
        return 'portal';
      }
    }
    return 'main';
  });
  const [activeToast, setActiveToast] = useState<string | null>(null);

  // Sync URL on mount and popstate
  useEffect(() => {
    testFirestoreConnection();

    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.startsWith('/staff') || hash === '#staff' || hash === '#portal') {
        setActiveView('portal');
      } else {
        setActiveView('main');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const switchView = (view: ActiveView, targetPath?: string) => {
    setActiveView(view);
    if (typeof window !== 'undefined') {
      const dest = targetPath || (view === 'portal' ? '/staff/dashboard' : '/');
      if (window.location.pathname !== dest) {
        window.history.pushState(null, '', dest);
      }
    }
  };

  // Trigger feedback toast on action
  const showToast = (message: string) => {
    setActiveToast(message);
    setTimeout(() => {
      setActiveToast(null);
    }, 3500);
  };

  const handleNavigate = (href: string) => {
    switchView('main', '/');
    if (href.startsWith('#')) {
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF7] text-slate-800 flex flex-col font-sans selection:bg-[#0F5132] selection:text-white w-full max-w-full">
      {/* 1. Global Continuous Emergency Ticker (Website View Only) */}
      {activeView === 'main' && (
        <EmergencyTicker
          onNoticeClick={(notice) => {
            showToast(`Announcement: ${notice.badge}`);
          }}
        />
      )}

      {/* 2. Responsive Brand Navbar (Website View Only) */}
      {activeView === 'main' && (
        <Navbar
          onNavigate={handleNavigate}
          onOpenPortalModal={() => {
            switchView('portal', '/staff/login');
            showToast('Opening Authorised Staff Portal...');
          }}
          onOpenManagementSystem={() => {
            switchView('portal', '/staff/dashboard');
            showToast('Opening Authorised Staff Portal...');
          }}
        />
      )}

      {/* Reviewable First-Stage Implementation Banner for School Owner */}
      <div className="bg-[#EAF2EB] border-b border-[#0F5132]/20 py-2 sm:py-2.5 px-3 sm:px-4 text-xs shadow-2xs w-full max-w-full">
        <div className="max-w-7xl mx-auto w-full min-w-0 flex flex-wrap items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 sm:gap-2 text-[#0F5132] min-w-0">
            <span className="text-[11px] uppercase tracking-wider font-bold flex items-center gap-1.5 shrink-0">
              <School className="w-3.5 h-3.5 text-[#0F5132]" />
              Stage 1 Review Mode:
            </span>
            <span className="text-slate-600 font-medium hidden sm:inline truncate">
              Pakistani School Branding & SMS Preview (Awaiting Owner Review)
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                switchView('main', '/');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeView === 'main'
                  ? 'bg-[#0F5132] text-white shadow-xs'
                  : 'text-[#0F5132] hover:bg-white/80'
              }`}
            >
              School Website (8 Sections)
            </button>

            <button
              type="button"
              onClick={() => {
                switchView('main', '/#academics');
                setTimeout(() => {
                  document.querySelector('#academics')?.scrollIntoView({ behavior: 'smooth' });
                }, 50);
              }}
              className="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-700 hover:text-[#0F5132] hover:bg-white/80 transition-all"
            >
              Classes 1–10
            </button>

            <button
              type="button"
              onClick={() => {
                switchView('main', '/#digital-learning');
                setTimeout(() => {
                  document.querySelector('#digital-learning')?.scrollIntoView({ behavior: 'smooth' });
                }, 50);
              }}
              className="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-700 hover:text-[#0F5132] hover:bg-white/80 transition-all"
            >
              AI & Digital Learning
            </button>

            <button
              type="button"
              onClick={() => {
                switchView('main', '/#school-life');
                setTimeout(() => {
                  document.querySelector('#school-life')?.scrollIntoView({ behavior: 'smooth' });
                }, 50);
              }}
              className="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-700 hover:text-[#0F5132] hover:bg-white/80 transition-all"
            >
              School Life Photos
            </button>

            <button
              type="button"
              onClick={() => {
                switchView('main', '/#admissions');
                setTimeout(() => {
                  document.querySelector('#admissions')?.scrollIntoView({ behavior: 'smooth' });
                }, 50);
              }}
              className="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-700 hover:text-[#0F5132] hover:bg-white/80 transition-all"
            >
              Admissions Form
            </button>

            <span className="text-slate-300 px-1 hidden md:inline">│</span>

            {/* Authorised Staff Portal Trigger */}
            <button
              type="button"
              onClick={() => {
                switchView('portal', '/staff/dashboard');
                showToast('Switched to Authorised Staff Portal.');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeView === 'portal'
                  ? 'bg-[#1E40AF] text-white shadow-xs'
                  : 'bg-white text-[#1E40AF] border border-[#1E40AF]/30 hover:bg-[#EDF3FA]'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Staff Portal (/staff/login)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Dynamic Content Plane */}
      <main className="flex-1">
        {activeView === 'portal' ? (
          <SchoolManagementSystem
            onBackToWebsite={() => switchView('main', '/')}
            onShowToast={showToast}
          />
        ) : (
          <Home
            onOpenApplyModal={() => handleNavigate('#admissions')}
            onOpenManagementSystem={() => {
              switchView('portal', '/staff/dashboard');
              showToast('Opened Authorised Staff Portal.');
            }}
            onShowToast={showToast}
          />
        )}
      </main>

      {/* Floating Interactive Toast */}
      {activeToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 bg-[#0F5132] border border-emerald-500/50 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 max-w-sm text-xs animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0" />
          <span className="font-medium">{activeToast}</span>
        </div>
      )}
    </div>
  );
}
