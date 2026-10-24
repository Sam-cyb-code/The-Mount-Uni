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
  Navigation,
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
import { CampusParallaxGallery } from './components/CampusParallaxGallery';
import { ACADEMIC_LEVELS, PORTAL_ITEMS } from './data/navigationData';
import { PortalLink } from './types/navigation';
import { testFirestoreConnection } from './lib/firebase';

export type ActiveView = 'main' | 'academics' | 'campus-life' | 'admissions' | 'login' | 'parent-portal' | 'admin-dashboard';

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>('main');
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [selectedAcademicTab, setSelectedAcademicTab] = useState<string>('secondary-school');
  const [activePortal, setActivePortal] = useState<PortalLink | null>(null);
  const [isMatrixModalOpen, setIsMatrixModalOpen] = useState(false);
  const [isVirtualTourOpen, setIsVirtualTourOpen] = useState(false);
  const [isMonographOpen, setIsMonographOpen] = useState(false);
  const [activeToast, setActiveToast] = useState<string | null>(null);

  // Test connection to Firestore on initial boot
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
      showToast('Navigated to Academics & Curriculum (Classes 1 to 10)');
    } else if (href === '#campus-life') {
      setActiveView('main');
      setTimeout(() => {
        document.querySelector('#campus-life')?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
      showToast('Navigated to Campus Facilities & Photographs');
    } else if (href === '#admissions' || href === '#admissions-apply' || href === '#apply-online') {
      setActiveView('main');
      setTimeout(() => {
        document.querySelector('#admissions')?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
      showToast('Navigated to Student Admissions & Fee Guide');
    } else if (href === '#location' || href === '#school-location') {
      setActiveView('main');
      setTimeout(() => {
        document.querySelector('#school-location')?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
      showToast('Navigated to Our Official School Location');
    } else if (href === '#portal-parent') {
      if (currentUser?.role === 'parent') {
        setActiveView('parent-portal');
      } else {
        setActiveView('login');
      }
      showToast('Navigating to Parent Portal');
    } else if (href === '#portal-faculty' || href === '#admin') {
      if (currentUser?.role === 'staff') {
        setActiveView('admin-dashboard');
      } else {
        setActiveView('login');
      }
      showToast('Navigating to Staff Portal');
    } else if (href === '#virtual-tour') {
      setIsVirtualTourOpen(true);
    } else if (href === '#monograph' || href === '#monograph-gallery') {
      setIsMonographOpen(true);
      showToast('Viewing School Photographic Monograph (#001–#005)');
    } else if (href.startsWith('#')) {
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const currentAcademic =
    ACADEMIC_LEVELS.find((l) => l.id === selectedAcademicTab) || ACADEMIC_LEVELS[2];

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-slate-800 flex flex-col font-sans selection:bg-[#1B365D] selection:text-white">
      {/* 1. Global Continuous Emergency Ticker */}
      <EmergencyTicker
        onNoticeClick={(notice) => {
          showToast(`Opened: ${notice.badge}`);
        }}
      />

      {/* 2. Sticky Responsive Navbar */}
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
      <div className="bg-white border-b border-slate-200 py-2.5 px-4 text-xs shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-500">
            <span className="text-[11px] uppercase tracking-wider text-[#1B365D] font-bold flex items-center gap-1.5">
              <School className="w-3.5 h-3.5 text-amber-600" />
              School Sections:
            </span>
            <span className="hidden sm:inline text-slate-300">|</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveView('main')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeView === 'main'
                  ? 'bg-[#1B365D] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              School Home
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('#academics-showcase')}
              className="px-3 py-1 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
            >
              Classes 1–10 Curriculum
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('#campus-life')}
              className="px-3 py-1 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
            >
              Campus Facilities
            </button>
            <button
              type="button"
              onClick={() => {
                setIsMonographOpen(true);
                showToast('Viewing School Photographic Monograph (#001–#005)');
              }}
              className="px-3 py-1 rounded-lg text-xs font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-all flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>Reference Photos (#001–#005)</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('#admissions')}
              className="px-3 py-1 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
            >
              Admissions & Fee Guide
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('#school-location')}
              className="px-3 py-1 rounded-lg text-xs font-medium text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-all flex items-center gap-1"
            >
              <MapPin className="w-3 h-3 text-blue-600" />
              <span>Official Location</span>
            </button>

            <span className="text-slate-300 px-1 hidden md:inline">│</span>

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
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                activeView === 'parent-portal'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
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
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                activeView === 'admin-dashboard'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Teacher / Staff CMS {currentUser?.role === 'staff' && '✓'}
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
                showToast(`Authenticated as Staff: ${user.name}`);
              } else {
                setActiveView('parent-portal');
                showToast(`Authenticated as Parent: ${user.name}`);
              }
            }}
            onCancel={() => setActiveView('main')}
          />
        )}

        {/* VIEW B: Protected Parent Portal Dashboard */}
        {activeView === 'parent-portal' && (
          <ParentPortal
            guardianName={currentUser?.name || 'Tariq Mehmood'}
            onLogout={() => {
              setCurrentUser(null);
              setActiveView('main');
              showToast('Parent session ended.');
            }}
            onShowToast={showToast}
          />
        )}

        {/* VIEW C: Protected Staff Regent Admin CMS Dashboard */}
        {activeView === 'admin-dashboard' && (
          <AdminDashboard
            staffEmail={currentUser?.email || 'admin@themountschool.edu'}
            onLogout={() => {
              setCurrentUser(null);
              setActiveView('main');
              showToast('Staff member signed out.');
            }}
            onShowToast={showToast}
          />
        )}

        {/* VIEW D: Standard Comprehensive Institutional Experience */}
        {activeView === 'main' && (
          <>
            {/* Part 1: Home Hero, Facilities Gallery, Yandex Location, Academic Pathways */}
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
              onOpenMonograph={() => setIsMonographOpen(true)}
              onShowToast={showToast}
            />

            {/* Part 2: Academics Showcase & Subject Catalog (Classes 1–10) */}
            <Academics
              onOpenCurriculumMatrix={() => setIsMatrixModalOpen(true)}
              onOpenApplication={() => handleNavigate('#admissions')}
            />

            {/* 4. Educational Stages Overview (Classes 1 to 10 Only) */}
            <section id="academics-overview" className="py-20 border-b border-slate-200 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-slate-200">
                  <div>
                    <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#1B365D] uppercase tracking-wider mb-1">
                      <span>Educational Stages</span>
                      <span>·</span>
                      <span>Classes 1 to 10</span>
                    </div>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1B365D]">
                      Three Stages of Student Growth
                    </h2>
                  </div>
                  <p className="mt-2 md:mt-0 text-xs text-slate-500 max-w-md">
                    Select an academic stage below to inspect syllabus focus, student learning goals, and laboratory support.
                  </p>
                </div>

                {/* Level Selector Tabs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 p-1.5 rounded-xl bg-slate-50 border border-slate-200">
                  {ACADEMIC_LEVELS.map((lvl) => {
                    const isActive = lvl.id === selectedAcademicTab;
                    return (
                      <button
                        key={lvl.id}
                        onClick={() => setSelectedAcademicTab(lvl.id)}
                        className={`px-4 py-3 rounded-lg text-xs font-semibold transition-all text-left flex flex-col ${
                          isActive
                            ? 'bg-[#1B365D] text-white shadow-sm font-bold'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                        }`}
                      >
                        <span className="text-sm">{lvl.title}</span>
                        <span className={`text-[11px] font-normal mt-0.5 ${isActive ? 'text-blue-100' : 'text-slate-500'}`}>
                          {lvl.ageSpan}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Level Deep Dive Card */}
                <div className="rounded-2xl border border-slate-200 bg-[#FBF9F5] p-6 sm:p-8 shadow-xs">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-7">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="px-2.5 py-1 rounded text-xs font-semibold bg-blue-100 text-[#1B365D] border border-blue-200">
                          {currentAcademic.curriculumBadge}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          {currentAcademic.ageSpan}
                        </span>
                      </div>

                      <h3 className="font-serif text-2xl font-bold text-[#1B365D] mb-3">
                        {currentAcademic.title} Curriculum & Faculty
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed mb-6 font-light">
                        {currentAcademic.summary}
                      </p>

                      <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-700 mb-3">
                        Core Subjects & Academic Tracks
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                        {currentAcademic.keyLinks.map((link) => (
                          <div
                            key={link.label}
                            className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs"
                          >
                            <span className="font-medium text-slate-800">{link.label}</span>
                            {link.badge && (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                                {link.badge}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleNavigate('#admissions')}
                          className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#1B365D] hover:bg-[#132742] transition-colors shadow-sm"
                        >
                          Admissions for {currentAcademic.title}
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsMatrixModalOpen(true)}
                          className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
                        >
                          View Subject Matrix
                        </button>
                      </div>
                    </div>

                    <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
                      <div>
                        <span className="text-[11px] font-semibold uppercase text-amber-700 tracking-wider block mb-1">
                          Academic Commitment
                        </span>
                        <h4 className="text-base font-serif font-bold text-[#1B365D] mb-2">
                          Dedicated Teaching for Classes 1 to 10
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed mb-4">
                          Our curriculum is systematically designed to ensure seamless transition from foundational primary literacy into middle school analytical thinking, leading to confident success in secondary board examinations.
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs">
                        <div className="flex items-center justify-between text-slate-600">
                          <span>Teacher-Student Ratio</span>
                          <span className="font-bold text-[#1B365D]">1 : 18</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-600">
                          <span>Science & Computer Labs</span>
                          <span className="font-bold text-slate-800">Fully Equipped</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-600">
                          <span>B2 Reading Room</span>
                          <span className="font-bold text-amber-700">Open Daily</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Part 3: Campus Facilities, Photographs (#001–#005) & Parallax Gallery */}
            <CampusLife
              onOpenVirtualTour={() => setIsVirtualTourOpen(true)}
              onOpenMonograph={() => setIsMonographOpen(true)}
            />

            {/* Part 4: Admissions Engine & Dynamic Fee Calculator */}
            <Admissions onShowToast={showToast} />

            {/* 5. School Portals Grid */}
            <section id="portals" className="py-20 border-b border-slate-200 bg-[#FBF9F5]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#1B365D] uppercase tracking-wider mb-1">
                    <span>School Portals</span>
                    <span>·</span>
                    <span>Classes 1 to 10</span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1B365D]">
                    Student, Parent & Staff Portals
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600">
                    Direct access for enrolled students, parents, guardians, and teaching faculty.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {PORTAL_ITEMS.map((portal) => (
                    <div
                      key={portal.id}
                      className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between group"
                    >
                      <div>
                        <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 text-[#1B365D] flex items-center justify-center mb-4 group-hover:scale-105 group-hover:bg-[#1B365D] group-hover:text-white transition-all">
                          {portal.iconName === 'GraduationCap' && <GraduationCap className="w-6 h-6" />}
                          {portal.iconName === 'Users' && <Users className="w-6 h-6" />}
                          {portal.iconName === 'BookOpen' && <BookOpen className="w-6 h-6" />}
                          {portal.iconName === 'Compass' && <Compass className="w-6 h-6" />}
                        </div>
                        <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider block mb-1">
                          {portal.audience}
                        </span>
                        <h3 className="text-base font-serif font-bold text-[#1B365D] mb-2">
                          {portal.name}
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed mb-6 font-light">
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
                        className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold text-[#1B365D] hover:text-white bg-slate-50 hover:bg-[#1B365D] border border-slate-200 hover:border-[#1B365D] transition-all flex items-center justify-center gap-1.5"
                      >
                        Open Portal
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

      {/* 6. Institutional Footer with Official Yandex Maps Integration */}
      <footer className="bg-[#1B365D] text-slate-300 border-t border-[#132742] py-14 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-blue-900/60">
            {/* Column 1: School Identity */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 font-serif font-bold text-lg">
                  M
                </div>
                <div>
                  <span className="font-serif font-bold text-white tracking-wide text-base block">
                    The Mount School
                  </span>
                  <span className="text-[11px] text-amber-300 font-medium">
                    Classes 1 to 10 Only
                  </span>
                </div>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed font-light">
                Providing comprehensive, disciplined, and nurturing education from Class 1 through Class 10 with strong emphasis on academic mastery, character building, and individual mentorship.
              </p>
              <div className="pt-1">
                <span className="inline-block text-[11px] bg-blue-900/70 border border-blue-700/50 text-blue-200 px-2.5 py-1 rounded-md">
                  Primary · Middle · Secondary (1–10)
                </span>
              </div>
            </div>

            {/* Column 2: Official Location & Yandex Maps */}
            <div className="space-y-3">
              <h4 className="text-white font-serif font-bold text-sm tracking-wide flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                Our Official Location
              </h4>
              <p className="text-slate-300 text-xs leading-relaxed font-light">
                Locate our school campus on Yandex Maps for verified directions, travel times, and surrounding landmarks:
              </p>
              <div className="p-3 rounded-xl bg-blue-950/60 border border-blue-800/60 text-xs space-y-1.5 font-mono">
                <div className="text-[11px] text-amber-300">Map Coordinates:</div>
                <div className="text-slate-200">32.834662° N, 72.999090° E</div>
              </div>
              <a
                href="https://yandex.com/maps/-/CXVyNN8q"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-stone-900 bg-amber-400 hover:bg-amber-300 transition-colors shadow-sm"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Get Directions (Yandex Maps)</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Column 3: Quick Navigation */}
            <div className="space-y-3">
              <h4 className="text-white font-serif font-bold text-sm tracking-wide">
                Quick Navigation
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button type="button" onClick={() => handleNavigate('#academics-showcase')} className="text-slate-300 hover:text-white transition-colors">
                    Academics (Classes 1–10)
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => handleNavigate('#campus-life')} className="text-slate-300 hover:text-white transition-colors">
                    Campus Grounds & Facilities
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => handleNavigate('#admissions')} className="text-slate-300 hover:text-white transition-colors">
                    Student Admissions 2026–2027
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => setIsMatrixModalOpen(true)} className="text-slate-300 hover:text-white transition-colors">
                    Classes 1–10 Subject Matrix
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => setIsMonographOpen(true)} className="text-slate-300 hover:text-white transition-colors">
                    School Photographs Gallery
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => setActiveView('parent-portal')} className="text-slate-300 hover:text-white transition-colors">
                    Parent Portal Gateway
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: School Hours & Contact */}
            <div className="space-y-3">
              <h4 className="text-white font-serif font-bold text-sm tracking-wide flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                School Hours & Office
              </h4>
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex justify-between pb-1 border-b border-blue-900/40">
                  <span className="text-slate-400">Monday – Thursday:</span>
                  <span className="text-white font-medium">7:45 AM – 1:45 PM</span>
                </div>
                <div className="flex justify-between pb-1 border-b border-blue-900/40">
                  <span className="text-slate-400">Friday:</span>
                  <span className="text-white font-medium">7:45 AM – 12:15 PM</span>
                </div>
                <div className="flex justify-between pb-1 border-b border-blue-900/40">
                  <span className="text-slate-400">Saturday:</span>
                  <span className="text-white font-medium">Co-Curricular / Office</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Sunday:</span>
                  <span className="text-amber-400">Closed</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 pt-1">
                For admissions queries and campus tours, please visit during official office hours.
              </p>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
            <p>© 2026–2027 The Mount School. Offering education for Classes 1 to 10 only. All rights reserved.</p>
            <div className="flex items-center gap-3">
              <a
                href="https://yandex.com/maps/-/CXVyNN8q"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-300 hover:underline flex items-center gap-1"
              >
                <span>Yandex Maps Location</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Curriculum Matrix Modal */}
      <CurriculumMatrixModal
        isOpen={isMatrixModalOpen}
        onClose={() => setIsMatrixModalOpen(false)}
      />

      {/* Virtual Tour Modal */}
      <VirtualTourModal
        isOpen={isVirtualTourOpen}
        onClose={() => setIsVirtualTourOpen(false)}
      />

      {/* Campus Photographic Monograph Modal (#001 - #005) */}
      {isMonographOpen && (
        <CampusParallaxGallery
          mode="fullscreen"
          isOpen={isMonographOpen}
          onClose={() => setIsMonographOpen(false)}
        />
      )}

      {/* Portal Login / Gateway Dialog */}
      <PortalAuthModal
        isOpen={activePortal !== null}
        onClose={() => setActivePortal(null)}
        selectedPortal={activePortal}
        onSuccessAuth={(roleName) => {
          showToast(`Access granted for ${roleName}. Welcome to The Mount School.`);
        }}
      />

      {/* Floating Interactive Toast */}
      {activeToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 bg-[#1B365D] border border-blue-400/50 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 max-w-sm text-xs animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="font-medium">{activeToast}</span>
        </div>
      )}
    </div>
  );
}
