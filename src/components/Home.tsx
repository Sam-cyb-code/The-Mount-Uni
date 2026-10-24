import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  Compass,
  Users,
  GraduationCap,
  Award,
  Sparkles,
  BookOpen,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Calendar,
  Layers,
  ChevronRight,
  Clock,
  Building,
  Maximize2,
  X,
  ExternalLink,
  Phone,
  FileText,
} from 'lucide-react';
import { PATHWAY_DATA, PathwayRole, getPathwayContent } from '../utils/homeUtils';
import { MONOGRAPH_VIGNETTES, MonographVignette } from '../data/monographData';

interface HomeProps {
  onOpenApplyModal?: () => void;
  onOpenMatrixModal?: () => void;
  onOpenPortalModal?: (portalId?: string) => void;
  onOpenMonograph?: () => void;
  onShowToast?: (msg: string) => void;
}

export const Home: React.FC<HomeProps> = ({
  onOpenApplyModal,
  onOpenMatrixModal,
  onOpenPortalModal,
  onOpenMonograph,
  onShowToast,
}) => {
  const [selectedRole, setSelectedRole] = useState<PathwayRole>('parent');
  const [activePhoto, setActivePhoto] = useState<MonographVignette | null>(null);

  const currentPathway = getPathwayContent(selectedRole);

  const officialYandexMapUrl = 'https://yandex.com/maps/-/CXVyNN8q';

  return (
    <div className="w-full bg-[#FBF9F5] text-slate-800 selection:bg-blue-100 selection:text-blue-900">
      {/* ========================================================================= */}
      {/* 1. WELCOMING HERO SECTION WITH GENUINE SCHOOL PHOTOGRAPHY                 */}
      {/* ========================================================================= */}
      <section
        className="relative bg-gradient-to-b from-white via-[#F8FAFC] to-[#F1F5F9] border-b border-slate-200 py-12 sm:py-16 lg:py-20 overflow-hidden"
        aria-label="Welcome to The Mount School"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: School Introduction & Purpose */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Institution Identity Kicker */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-900 text-xs font-semibold tracking-wide shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                <span>The Mount School · Dedicated to Classes 1 through 10</span>
              </div>

              {/* Main Headline */}
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-[3.25rem] font-bold tracking-tight text-slate-900 leading-[1.18]">
                Nurturing Character, Discipline, and{' '}
                <span className="text-blue-900 underline decoration-amber-400 decoration-3 underline-offset-6">
                  Academic Excellence
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl">
                A welcoming, structured educational environment designed exclusively for students from{' '}
                <strong className="text-slate-900 font-semibold">Class 1 through Class 10</strong>. We combine fundamental literacy, core sciences, and moral values with caring, experienced teachers.
              </p>

              {/* Clean Academic Stage Markers (Zero-Pill Discipline) */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-700 font-medium pt-1">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0" />
                  Primary School (Classes 1–5)
                </span>
                <span className="text-slate-300" aria-hidden="true">·</span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0" />
                  Middle School (Classes 6–8)
                </span>
                <span className="text-slate-300" aria-hidden="true">·</span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0" />
                  Secondary School (Classes 9–10)
                </span>
              </div>

              {/* Call-to-Action Buttons */}
              <div className="pt-4 flex flex-wrap items-center gap-3.5 sm:gap-4">
                {/* Primary CTA: Admissions 1-10 */}
                <button
                  type="button"
                  onClick={() => {
                    const target = document.querySelector('#admissions');
                    target?.scrollIntoView({ behavior: 'smooth' });
                    if (onShowToast) onShowToast('Navigated to Admissions (Classes 1–10).');
                  }}
                  className="px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-blue-900 hover:bg-blue-800 transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <span>Admissions Open (Classes 1–10)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Secondary CTA: Location & Directions */}
                <a
                  href="#location"
                  onClick={(e) => {
                    e.preventDefault();
                    const target = document.querySelector('#location');
                    target?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-5 py-3.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:text-blue-950 bg-white hover:bg-slate-50 border border-slate-300 shadow-2xs hover:shadow-xs transition-all flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4 text-blue-700" />
                  <span>Find Our School</span>
                </a>

                {/* Tertiary CTA: School Gallery */}
                <a
                  href="#school-gallery"
                  onClick={(e) => {
                    e.preventDefault();
                    const target = document.querySelector('#school-gallery');
                    target?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-4 py-3.5 rounded-xl text-xs sm:text-sm font-semibold text-blue-900 hover:bg-blue-50 transition-colors flex items-center gap-1.5"
                >
                  <span>View Facilities Gallery</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Right Column: Hero Real School Photograph Frame */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-xl group">
                <img
                  src="/school-images/campus-corridor-colonnade.jpg"
                  alt="School Campus Corridor with Classic Brick Colonnade"
                  className="w-full h-[360px] sm:h-[420px] object-cover transition-transform duration-500 group-hover:scale-102"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

                {/* Photo Caption Tag */}
                <div className="absolute bottom-4 left-4 right-4 text-white text-left">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-sans font-bold uppercase tracking-wider bg-blue-900 text-white inline-block mb-1">
                    Campus Infrastructure
                  </span>
                  <h3 className="font-serif text-base sm:text-lg font-bold text-white leading-snug">
                    Central Academic Corridor & Brick Colonnade
                  </h3>
                  <p className="text-xs text-slate-200 font-light mt-0.5 line-clamp-2">
                    Naturally ventilated hallways with classic red brick columns and tactile guidance pathways.
                  </p>
                </div>
              </div>

              {/* Quiet Micro Feature Badge */}
              <div className="absolute -bottom-4 -left-3 hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-md text-xs font-semibold text-slate-800">
                <Building className="w-4 h-4 text-amber-600" />
                <span>Safe, Disciplined Learning Campus</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. SCHOOL CORE PILLARS & EDUCATIONAL VALUES (CLASSES 1–10)                */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-900 block mb-2">
              Our Educational Mission
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              A Solid Foundation from Primary to Secondary
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
              We focus on cultivating strong foundational skills in literacy, numeracy, and scientific thinking while instilling respect, integrity, and good character in every student.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-[#FBF9F5] hover:border-blue-300 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-100/80 text-blue-900 flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-bold text-slate-900 mb-2">
                  Classes 1 to 10 Curriculum
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  A structured syllabus providing comprehensive coverage in English, Urdu, Mathematics, General Science, and Social Studies, leading to Secondary Board readiness.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-200 text-xs font-semibold text-blue-900 flex items-center gap-1">
                <span>Classes 1–10 Only</span>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-[#FBF9F5] hover:border-blue-300 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-100/80 text-amber-800 flex items-center justify-center mb-4">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-bold text-slate-900 mb-2">
                  B2 Reading Room & Library
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Home to our dedicated library and quiet reading wing, inspired by the guiding philosophy: <em className="text-slate-800">“A library is a hospital for the mind.”</em>
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-200 text-xs font-semibold text-amber-800 flex items-center gap-1">
                <span>Active Reading Culture</span>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-[#FBF9F5] hover:border-blue-300 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center mb-4">
                  <Building className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-bold text-slate-900 mb-2">
                  Spacious, Sunlit Classrooms
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Wide, naturally illuminated classrooms featuring multi-pane windows looking onto outdoor trees, durable dual-seater desks, and fresh cross ventilation.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-200 text-xs font-semibold text-emerald-800 flex items-center gap-1">
                <span>Inspiring Study Spaces</span>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-[#FBF9F5] hover:border-blue-300 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-100/80 text-purple-900 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-bold text-slate-900 mb-2">
                  Discipline & Moral Character
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Dedicated teachers who take personal interest in each student's progress, maintaining respectful classroom etiquette and regular parent feedback.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-200 text-xs font-semibold text-purple-900 flex items-center gap-1">
                <span>Dedicated Faculty</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. AUTHENTIC SCHOOL PHOTO GALLERY (THE 5 REFERENCE PHOTOGRAPHS)          */}
      {/* ========================================================================= */}
      <section
        id="school-gallery"
        className="py-16 sm:py-20 bg-[#F8FAFC] border-b border-slate-200"
        aria-label="Genuine School Photographs"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-4 border-b border-slate-200 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-900 block mb-1.5">
                Authentic Campus Documentation
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
                School Facilities & Reference Photographs
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-600">
                Actual photographs of our campus corridors, classrooms, B2 library reading room, and academic notice board.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-600">5 Documented Facilities</span>
            </div>
          </div>

          {/* Grid of the 5 Actual Photographs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MONOGRAPH_VIGNETTES.map((item, idx) => (
              <div
                key={item.rawIndex}
                className={`rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col justify-between ${
                  idx === 0 ? 'md:col-span-2 lg:col-span-2' : ''
                }`}
              >
                {/* Photo Media */}
                <div
                  className="relative overflow-hidden bg-slate-100 cursor-pointer h-64 sm:h-72"
                  onClick={() => setActivePhoto(item)}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/10 transition-colors" />

                  {/* Top Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded text-[11px] font-sans font-bold bg-white/95 text-blue-950 shadow-xs border border-slate-200">
                      {item.serial} · {item.year}
                    </span>
                  </div>

                  {/* Expand Icon */}
                  <div className="absolute bottom-3 right-3 p-2 rounded-lg bg-white/90 text-slate-800 shadow-sm opacity-90 group-hover:opacity-100">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>

                {/* Caption Details */}
                <div className="p-5 text-left flex flex-col justify-between flex-1">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800 block mb-1">
                      {item.classification}
                    </span>
                    <h3 className="font-serif text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-900 transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-xs text-slate-600 font-normal leading-relaxed line-clamp-3">
                      {item.summary}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-500 font-medium">
                      {item.specifications[0]}
                    </span>
                    <button
                      type="button"
                      onClick={() => setActivePhoto(item)}
                      className="text-xs font-bold text-blue-900 hover:text-blue-700 underline underline-offset-2 cursor-pointer"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. DEDICATED OFFICIAL LOCATION SECTION (YANDEX MAPS INTEGRATION)         */}
      {/* ========================================================================= */}
      <section
        id="location"
        className="py-16 sm:py-20 bg-white border-b border-slate-200"
        aria-label="Official School Location on Yandex Maps"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50/60 via-white to-amber-50/40 p-6 sm:p-10 shadow-md">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Location Info & Official Yandex Maps CTA */}
              <div className="lg:col-span-7 space-y-5 text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 text-blue-900 text-xs font-bold tracking-wide">
                  <MapPin className="w-4 h-4 text-blue-700 shrink-0" />
                  <span>Official School Location · Yandex Maps</span>
                </div>

                <h2 className="font-serif text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                  Find Our School & Plan Your Visit
                </h2>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  Our school campus is conveniently located and easily accessible. Parents, students, and visitors are welcome to visit during official administrative hours for admissions, inquiries, or scheduled campus meetings.
                </p>

                {/* Location Coordinates & Key Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
                    <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider block mb-1">
                      Map Coordinates
                    </span>
                    <span className="text-sm font-mono font-semibold text-slate-800">
                      32.834662° N, 72.999090° E
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
                    <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider block mb-1">
                      Admissions Office Hours
                    </span>
                    <span className="text-xs font-medium text-slate-700">
                      Monday – Saturday: 8:00 AM – 2:00 PM
                    </span>
                  </div>
                </div>

                {/* Direct Get Directions Link Button */}
                <div className="pt-3 flex flex-wrap items-center gap-4">
                  <a
                    href={officialYandexMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-blue-900 hover:bg-blue-800 transition-all shadow-md hover:shadow-lg flex items-center gap-2.5 cursor-pointer"
                  >
                    <MapPin className="w-4 h-4 text-amber-300" />
                    <span>Get Directions on Yandex Maps</span>
                    <ExternalLink className="w-4 h-4 text-white/80" />
                  </a>

                  <span className="text-xs text-slate-500">
                    Official link: <span className="font-mono text-slate-700">{officialYandexMapUrl}</span>
                  </span>
                </div>
              </div>

              {/* Right Column: Visual Map Representation Card */}
              <div className="lg:col-span-5">
                <div className="rounded-2xl border border-slate-300 bg-white p-5 shadow-lg relative overflow-hidden">
                  {/* Stylized Interactive Map Card */}
                  <div className="relative h-64 sm:h-72 w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex flex-col items-center justify-center p-6 text-center">
                    {/* Map Grid Pattern */}
                    <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:20px_20px] opacity-40" />

                    {/* Central Pin */}
                    <div className="relative z-10 w-16 h-16 rounded-full bg-blue-900 text-white flex items-center justify-center shadow-xl border-4 border-white animate-bounce">
                      <MapPin className="w-8 h-8 text-amber-400" />
                    </div>

                    <div className="relative z-10 mt-4 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm max-w-xs">
                      <h4 className="font-serif font-bold text-slate-900 text-sm">
                        The Mount School
                      </h4>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Classes 1–10 Main Campus
                      </p>
                      <a
                        href={officialYandexMapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-900 hover:text-blue-700 underline mt-1"
                      >
                        <span>Open Yandex Maps</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                    <span>Direct GPS Routing</span>
                    <a
                      href={officialYandexMapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-blue-900 hover:underline"
                    >
                      Open Navigation →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. ACADEMIC LEVELS (CLASSES 1 TO 10 BREAKDOWN)                             */}
      {/* ========================================================================= */}
      <section
        id="academics-showcase"
        className="py-16 sm:py-20 bg-[#FBF9F5] border-b border-slate-200"
        aria-label="Academic Classes Breakdown"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-900 block mb-1.5">
              Academic Progression
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Classes 1 through 10 Structure
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Carefully organized educational stages designed to build confidence, deep understanding, and examination readiness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Primary School (1-5) */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-900 inline-block mb-3">
                  Stage 1 · Foundation
                </span>
                <h3 className="font-serif text-xl font-bold text-slate-900 mb-1">
                  Primary School
                </h3>
                <span className="text-xs text-blue-800 font-semibold block mb-3">
                  Classes 1 to 5 (Ages 5–10)
                </span>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Focusing on strong foundations in language reading, handwriting, basic arithmetic, curiosity-driven science, and moral values.
                </p>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                    <span>English & Urdu Language Literacy</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                    <span>Arithmetic & Numerical Fluency</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                    <span>General Science & Environmental Studies</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                    <span>Art, Drawing & Creative Projects</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100">
                <span className="text-xs font-semibold text-blue-900">Dedicated Classroom Environment</span>
              </div>
            </div>

            {/* Middle School (6-8) */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-900 inline-block mb-3">
                  Stage 2 · Preparatory
                </span>
                <h3 className="font-serif text-xl font-bold text-slate-900 mb-1">
                  Middle School
                </h3>
                <span className="text-xs text-amber-800 font-semibold block mb-3">
                  Classes 6 to 8 (Ages 11–13)
                </span>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Developing intermediate problem solving, introductory experimental science concepts, computer studies, and history/geography.
                </p>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>General Science (Physics, Chemistry, Biology)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>Algebra, Geometry & Practical Math</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>Computer Studies & Typing Fundamentals</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>Social Studies, History & Geography</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100">
                <span className="text-xs font-semibold text-amber-900">Analytical & Study Habits</span>
              </div>
            </div>

            {/* Secondary School (9-10) */}
            <div className="p-6 rounded-2xl border border-blue-200 bg-blue-50/40 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-blue-900 text-white inline-block mb-3">
                  Stage 3 · Board Examination
                </span>
                <h3 className="font-serif text-xl font-bold text-slate-900 mb-1">
                  Secondary School
                </h3>
                <span className="text-xs text-blue-900 font-semibold block mb-3">
                  Classes 9 and 10 (Ages 14–16)
                </span>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Comprehensive preparation for Secondary School Certificate (SSC) Matriculation board examinations with subject specializations.
                </p>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-800 shrink-0" />
                    <span className="font-semibold text-slate-800">Science Group:</span>
                    <span>Physics, Chemistry, Biology / Computer</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-800 shrink-0" />
                    <span className="font-semibold text-slate-800">Humanities Group:</span>
                    <span>General Science, Civics & Arts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-800 shrink-0" />
                    <span>Mathematics (Advanced / General)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-800 shrink-0" />
                    <span>Science Lab Practicals & Past Papers</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200">
                <span className="text-xs font-semibold text-blue-900">Secondary Certificate Readiness</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. INFORMATION FOR PARENTS, STUDENTS & COMMUNITY                          */}
      {/* ========================================================================= */}
      <section id="pathways" className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-900 block mb-1">
              School Community
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Information Tailored to Your Role
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600">
              Select your role to quickly access relevant guidelines, fees, schedules, and portal services.
            </p>
          </div>

          {/* Role Selection Tabs */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200">
              <button
                type="button"
                onClick={() => setSelectedRole('parent')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedRole === 'parent'
                    ? 'bg-white text-blue-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Parents & Guardians
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('student')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedRole === 'student'
                    ? 'bg-white text-blue-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Enrolled Students
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('alumni')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedRole === 'alumni'
                    ? 'bg-white text-blue-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Graduates & Alumni
              </button>
            </div>
          </div>

          {/* Active Role Content Card */}
          <div className="max-w-4xl mx-auto p-6 sm:p-8 rounded-2xl border border-slate-200 bg-[#FBF9F5] shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-7 space-y-3">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-900 inline-block">
                  {currentPathway.badge}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
                  {currentPathway.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {currentPathway.description}
                </p>

                <div className="pt-2 space-y-1.5">
                  {currentPathway.keyHighlights.map((hl, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons Tray */}
              <div className="md:col-span-5 p-5 rounded-xl bg-white border border-slate-200 space-y-3 shadow-2xs">
                <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider block">
                  Quick Access
                </span>
                <a
                  href={currentPathway.primaryAction.href}
                  onClick={(e) => {
                    if (currentPathway.primaryAction.href.startsWith('#portal')) {
                      e.preventDefault();
                      if (onOpenPortalModal) onOpenPortalModal();
                    } else if (currentPathway.primaryAction.href === '#admissions-apply') {
                      e.preventDefault();
                      const target = document.querySelector('#admissions');
                      target?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="w-full py-2.5 px-3 rounded-lg text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <span>{currentPathway.primaryAction.label}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>

                {currentPathway.secondaryActions.map((sec, idx) => (
                  <a
                    key={idx}
                    href={sec.href}
                    onClick={(e) => {
                      if (sec.href === '#location') {
                        e.preventDefault();
                        const target = document.querySelector('#location');
                        target?.scrollIntoView({ behavior: 'smooth' });
                      } else if (sec.href === '#fee-schedule') {
                        e.preventDefault();
                        const target = document.querySelector('#admissions');
                        target?.scrollIntoView({ behavior: 'smooth' });
                      } else if (sec.href.includes('portal')) {
                        e.preventDefault();
                        if (onOpenPortalModal) onOpenPortalModal();
                      }
                    }}
                    className="w-full py-2 px-3 rounded-lg text-xs font-semibold text-slate-700 hover:text-blue-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center justify-between"
                  >
                    <span>{sec.label}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. PHOTO LIGHTBOX MODAL                                                   */}
      {/* ========================================================================= */}
      {activePhoto && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActivePhoto(null)}
              aria-label="Close photo view"
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Photo */}
            <div className="relative h-72 sm:h-96 w-full bg-slate-100">
              <img
                src={activePhoto.image}
                alt={activePhoto.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content Details */}
            <div className="p-6 text-left">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-900">
                  {activePhoto.serial} · {activePhoto.year}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {activePhoto.coordinates}
                </span>
              </div>
              <h3 className="font-serif text-xl font-bold text-slate-900">
                {activePhoto.title}
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {activePhoto.summary}
              </p>

              {/* Highlights */}
              <div className="mt-4 pt-3 border-t border-slate-200">
                <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block mb-2">
                  Facility Specifications
                </span>
                <ul className="space-y-1 text-xs text-slate-600">
                  {activePhoto.specifications.map((spec, sIdx) => (
                    <li key={sIdx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActivePhoto(null)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Close Photo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
