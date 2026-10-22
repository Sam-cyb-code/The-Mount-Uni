import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Award,
  BookOpen,
  Calendar,
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Users,
  Search,
  School,
  X,
  FileText,
  MapPin,
  Clock,
  Sparkles,
  Layers,
  Check,
  LayoutDashboard,
  Shield,
} from 'lucide-react';
import { EmergencyTicker } from './components/EmergencyTicker';
import { Navbar } from './components/Navbar';
import { Home } from './components/Home';
import { Academics } from './components/Academics';
import { CampusLife } from './components/CampusLife';
import { Admissions } from './components/Admissions';
import { Login, UserRole, AuthUser } from './components/Login';
import { ParentPortal } from './components/ParentPortal';
import { AdminDashboard } from './components/AdminDashboard';
import { CurriculumMatrixModal } from './components/CurriculumMatrixModal';
import { VirtualTourModal } from './components/VirtualTourModal';
import { PortalAuthModal } from './components/PortalAuthModal';
import { ACADEMIC_LEVELS, PORTAL_ITEMS } from './data/navigationData';
import { PortalLink } from './types/navigation';
import { testFirestoreConnection } from './lib/firebase';

export type ActiveView = 'main' | 'academics' | 'campus-life' | 'admissions' | 'login' | 'parent-portal' | 'admin-dashboard';

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>('main');
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [selectedAcademicTab, setSelectedAcademicTab] = useState<string>('senior-school');
  const [activePortal, setActivePortal] = useState<PortalLink | null>(null);
  const [isMatrixModalOpen, setIsMatrixModalOpen] = useState(false);
  const [isVirtualTourOpen, setIsVirtualTourOpen] = useState(false);
  const [activeInlineMatrixStream, setActiveInlineMatrixStream] = useState<'cambridge' | 'matric' | 'fsc'>('cambridge');
  const [activeToast, setActiveToast] = useState<string | null>(null);

  // Test connection to Firestore on initial boot per Firebase integration skill
  useEffect(() => {
    testFirestoreConnection();
  }, []);

  // Trigger feedback toast on action
  const showToast = (message: string) => {
    setActiveToast(message);
    setTimeout(() => {
      setActiveToast(null);
    }, 3500);
  };

  const handleNavigate = (href: string) => {
    if (href === '#academics-overview' || href === '#academics' || href === '#academics-showcase') {
      setActiveView('main');
      setTimeout(() => {
        document.querySelector('#academics-showcase')?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
      showToast('Navigated to Academics Division & Course Catalog');
    } else if (href === '#campus-life') {
      setActiveView('main');
      setTimeout(() => {
        document.querySelector('#campus-life')?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
      showToast('Navigated to Campus Life & Topography');
    } else if (href === '#admissions' || href === '#admissions-apply' || href === '#apply-online') {
      setActiveView('main');
      setTimeout(() => {
        document.querySelector('#admissions')?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
      showToast('Navigated to Admissions 2027 & Fee Engine');
    } else if (href === '#portal-parent') {
      if (currentUser?.role === 'parent') {
        setActiveView('parent-portal');
      } else {
        setActiveView('login');
      }
      showToast('Navigating to Parent Engagement Gateway');
    } else if (href === '#portal-faculty' || href === '#admin') {
      if (currentUser?.role === 'staff') {
        setActiveView('admin-dashboard');
      } else {
        setActiveView('login');
      }
      showToast('Navigating to Staff Regent CMS Portal');
    } else if (href === '#virtual-tour') {
      setIsVirtualTourOpen(true);
    } else if (href.startsWith('#')) {
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const currentAcademic =
    ACADEMIC_LEVELS.find((l) => l.id === selectedAcademicTab) || ACADEMIC_LEVELS[3];

  return (
    <div className="min-h-screen bg-[#070E1C] text-stone-100 flex flex-col font-sans selection:bg-blue-600/40 selection:text-blue-100">
      {/* 1. Global Continuous Emergency Ticker (Synced with live Firestore announcements) */}
      <EmergencyTicker
        onNoticeClick={(notice) => {
          showToast(`Opened Dispatch: ${notice.badge}`);
        }}
      />

      {/* 2. Sticky Responsive Navbar (with decoupled MegaMenuDropdown & MobileDrawer) */}
      <Navbar
        onNavigate={handleNavigate}
        onOpenPortalModal={(portalId) => {
          if (portalId === 'parent-gateway') {
            if (currentUser?.role === 'parent') {
              setActiveView('parent-portal');
            } else {
              setActiveView('login');
            }
          } else if (portalId === 'faculty-intranet') {
            if (currentUser?.role === 'staff') {
              setActiveView('admin-dashboard');
            } else {
              setActiveView('login');
            }
          } else {
            const match = portalId ? PORTAL_ITEMS.find((p) => p.id === portalId) : PORTAL_ITEMS[0];
            setActivePortal(match || PORTAL_ITEMS[0]);
          }
        }}
        onOpenCurriculumMatrix={() => {
          setIsMatrixModalOpen(true);
        }}
      />

      {/* View Switcher Bar for Quick Evaluation / Testing */}
      <div className="bg-[#0B1528] border-b border-blue-950 py-2.5 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-stone-400">
            <span className="font-mono text-[11px] uppercase text-amber-400 font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Quick Navigation Hub:
            </span>
            <span className="hidden sm:inline text-stone-500">|</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveView('main')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                activeView === 'main'
                  ? 'bg-amber-400 text-stone-950 font-bold shadow'
                  : 'text-stone-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              Full Institutional Campus
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('#academics-showcase')}
              className="px-3 py-1 rounded-lg text-stone-300 hover:text-white hover:bg-slate-900 transition-all"
            >
              Course Catalog
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('#campus-life')}
              className="px-3 py-1 rounded-lg text-stone-300 hover:text-white hover:bg-slate-900 transition-all"
            >
              Parallax Map & Slider
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('#admissions')}
              className="px-3 py-1 rounded-lg text-stone-300 hover:text-white hover:bg-slate-900 transition-all"
            >
              Admissions Form & Calculator
            </button>

            <span className="text-stone-600 px-1">│</span>

            {/* Portal Views */}
            <button
              type="button"
              onClick={() => {
                if (currentUser?.role === 'parent') {
                  setActiveView('parent-portal');
                } else {
                  setActiveView('login');
                }
              }}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                activeView === 'parent-portal'
                  ? 'bg-blue-600 text-white font-bold shadow'
                  : 'text-stone-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              Parent Portal {currentUser?.role === 'parent' && '✓'}
            </button>
            <button
              type="button"
              onClick={() => {
                if (currentUser?.role === 'staff') {
                  setActiveView('admin-dashboard');
                } else {
                  setActiveView('login');
                }
              }}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                activeView === 'admin-dashboard'
                  ? 'bg-blue-600 text-white font-bold shadow'
                  : 'text-stone-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              Staff Admin CMS {currentUser?.role === 'staff' && '✓'}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Dynamic Content Plane */}
      <main className="flex-1">
        {/* VIEW A: Dedicated Login Gateway */}
        {activeView === 'login' && (
          <Login
            onSuccessLogin={(user) => {
              setCurrentUser(user);
              if (user.role === 'staff') {
                setActiveView('admin-dashboard');
                showToast(`Authenticated as Staff Regent: ${user.name}`);
              } else {
                setActiveView('parent-portal');
                showToast(`Authenticated as Guardian: ${user.name}`);
              }
            }}
            onCancel={() => setActiveView('main')}
          />
        )}

        {/* VIEW B: Protected Parent Portal Dashboard */}
        {activeView === 'parent-portal' && (
          <ParentPortal
            guardianName={currentUser?.name || 'Dr. Salman Hashmi'}
            onLogout={() => {
              setCurrentUser(null);
              setActiveView('main');
              showToast('Guardian session terminated.');
            }}
            onShowToast={showToast}
          />
        )}

        {/* VIEW C: Protected Staff Regent Admin CMS Dashboard */}
        {activeView === 'admin-dashboard' && (
          <AdminDashboard
            staffEmail={currentUser?.email || 'regent.dean@themountuni.edu'}
            onLogout={() => {
              setCurrentUser(null);
              setActiveView('main');
              showToast('Staff regent signed out.');
            }}
            onShowToast={showToast}
          />
        )}

        {/* VIEW D: Standard Comprehensive Institutional Experience (Parts 1, 2, 3, 4, 5) */}
        {activeView === 'main' && (
          <>
            {/* Part 2: Cinematic Hero, Pathways & Scroll Walkthrough */}
            <Home
              onOpenApplyModal={() => handleNavigate('#admissions')}
              onOpenMatrixModal={() => setIsMatrixModalOpen(true)}
              onOpenPortalModal={(portalId) => {
                if (portalId === 'parent-gateway') {
                  setActiveView('parent-portal');
                } else if (portalId === 'faculty-intranet') {
                  setActiveView('admin-dashboard');
                } else {
                  const match = portalId ? PORTAL_ITEMS.find((p) => p.id === portalId) : PORTAL_ITEMS[0];
                  setActivePortal(match || PORTAL_ITEMS[0]);
                }
              }}
              onShowToast={showToast}
            />

            {/* Part 3 Task 1: Academics Showcase & Filterable Course Catalog with Framer Motion layoutId */}
            <Academics
              onOpenCurriculumMatrix={() => setIsMatrixModalOpen(true)}
              onOpenApplication={() => handleNavigate('#admissions')}
            />

            {/* 4. Interactive Academic Continuum Section */}
            <section id="academics-overview" className="py-20 border-b border-blue-950 bg-[#070E1C]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-blue-950">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-widest text-amber-400 block mb-1">
                      Academic Continuum
                    </span>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-100">
                      Four Stages of Scholarly Growth
                    </h2>
                  </div>
                  <p className="mt-2 md:mt-0 text-xs text-stone-400 max-w-md">
                    Select an academic level below to inspect curriculum benchmarks, examination boards, and laboratory facilities.
                  </p>
                </div>

                {/* Level Selector Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-8 p-1.5 rounded-xl bg-[#0B1528] border border-blue-950">
                  {ACADEMIC_LEVELS.map((lvl) => {
                    const isActive = lvl.id === selectedAcademicTab;
                    return (
                      <button
                        key={lvl.id}
                        onClick={() => setSelectedAcademicTab(lvl.id)}
                        className={`px-3 py-2.5 rounded-lg text-xs font-semibold transition-all text-left flex flex-col ${
                          isActive
                            ? 'bg-amber-400 text-stone-950 shadow-md font-bold'
                            : 'text-stone-400 hover:text-stone-100 hover:bg-slate-900/60'
                        }`}
                      >
                        <span>{lvl.title}</span>
                        <span className={`text-[10px] ${isActive ? 'text-stone-800' : 'text-stone-500'}`}>
                          {lvl.ageSpan.split('(')[0].trim()}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Level Deep Dive Card */}
                <div className="rounded-2xl border border-blue-950 bg-[#0B1528]/80 p-6 sm:p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-7">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="px-2.5 py-1 rounded text-xs font-semibold bg-blue-600/20 text-blue-300 border border-blue-500/30">
                          {currentAcademic.curriculumBadge}
                        </span>
                        <span className="text-xs text-stone-400 font-mono">
                          {currentAcademic.ageSpan}
                        </span>
                      </div>

                      <h3 className="font-serif text-2xl font-bold text-stone-100 mb-3">
                        {currentAcademic.title} Faculty & Curriculum
                      </h3>
                      <p className="text-sm text-stone-300 leading-relaxed mb-6 font-light">
                        {currentAcademic.summary}
                      </p>

                      <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400/90 mb-3">
                        Core Modules & Examination Tracks
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                        {currentAcademic.keyLinks.map((link) => (
                          <div
                            key={link.label}
                            className="p-3 rounded-xl bg-[#070E1C] border border-blue-950 flex items-center justify-between"
                          >
                            <span className="text-xs font-medium text-stone-200">{link.label}</span>
                            {link.badge && (
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                                {link.badge}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Tabbed Subject Matrix Quick Launcher if Senior School */}
                      {currentAcademic.id === 'senior-school' && (
                        <div className="p-4 rounded-xl bg-[#070E1C] border border-blue-900/60 mb-6 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-stone-200 flex items-center gap-1.5">
                              <Layers className="w-4 h-4 text-blue-400" />
                              Interactive Dual-Track Comparison Matrix
                            </span>
                            <button
                              type="button"
                              onClick={() => setIsMatrixModalOpen(true)}
                              className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 underline"
                            >
                              Expand Full Screen
                            </button>
                          </div>

                          {/* Inline Tab Toggle */}
                          <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-lg">
                            <button
                              type="button"
                              onClick={() => setActiveInlineMatrixStream('cambridge')}
                              className={`flex-1 py-1 px-2 rounded text-[11px] font-medium transition-colors ${
                                activeInlineMatrixStream === 'cambridge'
                                  ? 'bg-blue-600 text-white shadow-sm'
                                  : 'text-stone-400 hover:text-white'
                              }`}
                            >
                              Cambridge O/A Levels
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveInlineMatrixStream('matric')}
                              className={`flex-1 py-1 px-2 rounded text-[11px] font-medium transition-colors ${
                                activeInlineMatrixStream === 'matric'
                                  ? 'bg-blue-600 text-white shadow-sm'
                                  : 'text-stone-400 hover:text-white'
                              }`}
                            >
                              BISE Matric (9–10)
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveInlineMatrixStream('fsc')}
                              className={`flex-1 py-1 px-2 rounded text-[11px] font-medium transition-colors ${
                                activeInlineMatrixStream === 'fsc'
                                  ? 'bg-blue-600 text-white shadow-sm'
                                  : 'text-stone-400 hover:text-white'
                              }`}
                            >
                              FSc Pre-Med & Pre-Eng
                            </button>
                          </div>

                          <div className="text-[11px] text-stone-300 leading-snug">
                            {activeInlineMatrixStream === 'cambridge' && (
                              <div className="space-y-1">
                                <span className="text-amber-300 font-semibold block">CAIE International Standard:</span>
                                <p>Global syllabus, component weighting papers, direct UCAS & Common App placement support.</p>
                              </div>
                            )}
                            {activeInlineMatrixStream === 'matric' && (
                              <div className="space-y-1">
                                <span className="text-emerald-300 font-semibold block">BISE Board Standard:</span>
                                <p>Part I & II 1100 marks scale, extensive board laboratory practicals, high national merit focus.</p>
                              </div>
                            )}
                            {activeInlineMatrixStream === 'fsc' && (
                              <div className="space-y-1">
                                <span className="text-blue-300 font-semibold block">Pre-Medical & Pre-Engineering:</span>
                                <p>Dedicated entrance coaching for MDCAT, ECAT, NUST NET, and premier engineering seats.</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-4">
                        <button
                          type="button"
                          onClick={() => handleNavigate('#admissions')}
                          className="px-5 py-2.5 rounded-lg text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 transition-colors"
                        >
                          Inquire for {currentAcademic.title}
                        </button>
                        {currentAcademic.id === 'senior-school' && (
                          <button
                            type="button"
                            onClick={() => setIsMatrixModalOpen(true)}
                            className="px-4 py-2.5 rounded-lg text-xs font-semibold text-blue-300 hover:text-white bg-blue-950 border border-blue-800"
                          >
                            Open Detailed Matrix
                          </button>
                        )}
                        <a
                          href="#syllabus"
                          onClick={(e) => {
                            e.preventDefault();
                            showToast(`Downloading syllabus for ${currentAcademic.title}`);
                          }}
                          className="text-xs text-stone-400 hover:text-white underline underline-offset-4"
                        >
                          View Syllabus PDF
                        </a>
                      </div>
                    </div>

                    <div className="lg:col-span-5 rounded-xl border border-blue-950 bg-[#070E1C] p-6 flex flex-col justify-between">
                      <div>
                        <span className="text-[11px] font-mono uppercase text-amber-400 tracking-wider block mb-1">
                          Faculty Leadership
                        </span>
                        <h4 className="text-base font-serif font-bold text-stone-100 mb-2">
                          Dean's Commitment to Dual Rigor
                        </h4>
                        <p className="text-xs text-stone-400 leading-relaxed mb-4">
                          Whether candidates choose the Cambridge International pathway (IGCSE, O-Levels, A-Levels) or the National Matriculation & FSc stream, our faculty delivers uniform laboratory rigor, individual mentorship, and career counseling.
                        </p>
                      </div>

                      <div className="pt-4 border-t border-blue-950 space-y-2 text-xs">
                        <div className="flex items-center justify-between text-stone-400">
                          <span>Faculty Student Ratio</span>
                          <span className="font-semibold text-stone-200">1 : 8</span>
                        </div>
                        <div className="flex items-center justify-between text-stone-400">
                          <span>STEM & AI Laboratories</span>
                          <span className="font-semibold text-stone-200">12 Dedicated Labs</span>
                        </div>
                        <div className="flex items-center justify-between text-stone-400">
                          <span>Scholarship Quota</span>
                          <span className="font-semibold text-amber-400">Up to 100% Merit Aid</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Part 3 Tasks 2 & 3: Campus Life (Parallax Map & Then vs Now Slider) */}
            <CampusLife onOpenVirtualTour={() => setIsVirtualTourOpen(true)} />

            {/* Part 4 Tasks 1 & 2: Admissions Engine & Dynamic Fee Calculator */}
            <Admissions onShowToast={showToast} />

            {/* 5. Institutional Portals Grid */}
            <section id="portals" className="py-20 border-b border-blue-950 bg-[#0B1528]/50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <span className="text-xs font-mono uppercase tracking-widest text-amber-400 block mb-1">
                    Unified Authentication
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-100">
                    Institutional Portals & Services
                  </h2>
                  <p className="mt-2 text-xs text-stone-400">
                    Direct access for students, guardians, faculty regents, and alumni worldwide.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {PORTAL_ITEMS.map((portal) => (
                    <div
                      key={portal.id}
                      className="p-6 rounded-2xl border border-blue-950 bg-[#070E1C] hover:border-blue-700 hover:bg-[#0A162B] transition-all flex flex-col justify-between group"
                    >
                      <div>
                        <div className="w-12 h-12 rounded-xl bg-blue-600/15 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:bg-blue-600/25 transition-all">
                          {portal.iconName === 'GraduationCap' && <GraduationCap className="w-6 h-6" />}
                          {portal.iconName === 'Users' && <Users className="w-6 h-6" />}
                          {portal.iconName === 'BookOpen' && <BookOpen className="w-6 h-6" />}
                          {portal.iconName === 'Compass' && <Compass className="w-6 h-6" />}
                        </div>
                        <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider block mb-1">
                          {portal.audience}
                        </span>
                        <h3 className="text-base font-serif font-bold text-stone-100 mb-2">
                          {portal.name}
                        </h3>
                        <p className="text-xs text-stone-400 leading-relaxed mb-6">
                          {portal.description}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (portal.id === 'parent-gateway') {
                            setActiveView('parent-portal');
                          } else if (portal.id === 'faculty-intranet') {
                            setActiveView('admin-dashboard');
                          } else {
                            setActivePortal(portal);
                          }
                        }}
                        className="w-full py-2.5 px-3 rounded-lg text-xs font-semibold text-stone-200 hover:text-stone-950 bg-slate-900 hover:bg-amber-400 transition-all flex items-center justify-center gap-1.5"
                      >
                        Launch Gateway
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {/* 6. Institutional Footer */}
      <footer className="bg-[#070E1C] border-t border-blue-950 py-12 text-stone-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-blue-950/80">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-serif font-bold">
                MU
              </div>
              <div>
                <span className="font-display font-bold text-stone-200 tracking-wider text-sm block">
                  THE MOUNT UNI
                </span>
                <span className="text-[10px] text-stone-500">
                  Autonomous Foundation for Premier Academic Advancement
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-stone-400 text-xs">
              <button type="button" onClick={() => handleNavigate('#academics-showcase')} className="hover:text-amber-300">Academics</button>
              <button type="button" onClick={() => handleNavigate('#campus-life')} className="hover:text-amber-300">Campus Life</button>
              <button type="button" onClick={() => handleNavigate('#admissions')} className="hover:text-amber-300">Admissions 2027</button>
              <button type="button" onClick={() => setIsMatrixModalOpen(true)} className="hover:text-amber-300">Curriculum Matrix</button>
              <button type="button" onClick={() => setActiveView('parent-portal')} className="hover:text-amber-300">Parent Gateway</button>
              <button type="button" onClick={() => setActiveView('admin-dashboard')} className="hover:text-amber-300">Staff CMS</button>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
            <p>© 2026–2027 The Mount Uni. All rights reserved. Registered under Cambridge International & Federal Charters.</p>
            <p className="font-mono">Admissions Helpline: +92 (042) 111-MOUNT</p>
          </div>
        </div>
      </footer>

      {/* Curriculum Matrix Modal */}
      <CurriculumMatrixModal
        isOpen={isMatrixModalOpen}
        onClose={() => setIsMatrixModalOpen(false)}
        defaultStream={activeInlineMatrixStream}
      />

      {/* Virtual Tour Modal */}
      <VirtualTourModal
        isOpen={isVirtualTourOpen}
        onClose={() => setIsVirtualTourOpen(false)}
      />

      {/* Portal Login / Gateway Dialog */}
      <PortalAuthModal
        isOpen={activePortal !== null}
        onClose={() => setActivePortal(null)}
        selectedPortal={activePortal}
        onSuccessAuth={(roleName) => {
          showToast(`SSO Access granted for ${roleName}. Welcome to The Mount Uni.`);
        }}
      />

      {/* Floating Interactive Toast */}
      {activeToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 bg-[#0B1528] border border-blue-500/40 text-stone-100 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 max-w-sm text-xs animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="font-medium">{activeToast}</span>
        </div>
      )}
    </div>
  );
}
