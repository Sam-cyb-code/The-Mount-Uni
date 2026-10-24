import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import {
  Compass,
  MapPin,
  Sparkles,
  Maximize2,
  Calendar,
  Users,
  CheckCircle2,
  Sliders,
  ArrowRight,
  Shield,
  Clock,
  Camera,
  BookOpen,
  School,
  ExternalLink,
} from 'lucide-react';
import { CampusParallaxGallery } from './CampusParallaxGallery';

interface ThenNowSliderProps {
  firstLabel?: string;
  secondLabel?: string;
}

export const ThenNowSlider: React.FC<ThenNowSliderProps> = ({
  firstLabel = 'School Academic Corridors & Tactile Pathway',
  secondLabel = 'Natural-Lit Classrooms & Study Desks',
}) => {
  const [sliderPosition, setSliderPosition] = useState(50); // Percentage 0 - 100
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPosition(percentage);
    },
    []
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging) return;
      handleMove(e.touches[0].clientX);
    },
    [isDragging, handleMove]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      handleMove(e.clientX);
    },
    [isDragging, handleMove]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-white select-none">
      <div
        ref={containerRef}
        onMouseDown={(e) => {
          setIsDragging(true);
          handleMove(e.clientX);
        }}
        onTouchStart={(e) => {
          setIsDragging(true);
          handleMove(e.touches[0].clientX);
        }}
        className="relative w-full h-[380px] sm:h-[460px] cursor-ew-resize overflow-hidden"
      >
        {/* Right / Classroom Image Layer (Base) */}
        <div className="absolute inset-0 w-full h-full bg-slate-100 flex items-center justify-center overflow-hidden">
          <img
            src="/school-images/classroom-daylight-desks.jpg"
            alt="School Classroom Environment"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent pointer-events-none" />

          {/* Right Labels */}
          <div className="absolute bottom-5 right-5 text-right z-10 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-200 shadow-lg">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-700 block">
              Learning Space
            </span>
            <span className="font-serif text-sm font-bold text-[#1B365D]">
              {secondLabel}
            </span>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Spacious seating & clean natural daylight
            </p>
          </div>
        </div>

        {/* Left / Corridor Layer (Clipped based on slider position) */}
        <div
          className="absolute inset-y-0 left-0 overflow-hidden bg-slate-200 transition-none"
          style={{ width: `${sliderPosition}%` }}
        >
          <div className="absolute inset-0 w-[100vw] max-w-[1280px] h-full flex items-center justify-center overflow-hidden">
            <img
              src="/school-images/campus-corridor-colonnade.jpg"
              alt="School Red Brick Corridors"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Left Labels */}
          <div className="absolute bottom-5 left-5 text-left z-10 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-200 shadow-lg">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-700 block">
              Campus Architecture
            </span>
            <span className="font-serif text-sm font-bold text-[#1B365D]">
              {firstLabel}
            </span>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Classic red brick columns & textured walkway
            </p>
          </div>
        </div>

        {/* Draggable Divider Handle */}
        <div
          className="absolute inset-y-0 w-1 bg-amber-500 shadow-lg z-20 pointer-events-none flex items-center justify-center"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="w-8 h-8 rounded-full bg-white border-2 border-amber-500 shadow-lg flex items-center justify-center text-amber-700 text-xs font-bold">
            <span>⟷</span>
          </div>
        </div>
      </div>

      {/* Slider Bottom Caption */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            Drag the handle horizontally to view the school corridors alongside our student classroom setting.
          </span>
        </div>
        <div className="font-mono text-slate-700 text-[11px] font-semibold shrink-0">
          Split Position: {Math.round(sliderPosition)}%
        </div>
      </div>
    </div>
  );
};

export const CampusLife: React.FC<{
  onOpenVirtualTour?: () => void;
  onOpenMonograph?: () => void;
}> = ({
  onOpenVirtualTour,
  onOpenMonograph,
}) => {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const bgFacilityTranslateY1 = useTransform(scrollYProgress, [0, 1], [-30, 40]);
  const bgFacilityTranslateY2 = useTransform(scrollYProgress, [0, 1], [-50, 30]);

  const textTranslateY1 = useTransform(scrollYProgress, [0, 1], [20, -30]);
  const textTranslateY2 = useTransform(scrollYProgress, [0, 1], [30, -35]);

  const facilities = [
    {
      id: 'library-reading-room',
      name: 'Library & B2 Reading Room',
      category: 'Quiet Study & Knowledge Center',
      specs: 'Reference collection · Study alcoves · Dedicated reading room',
      quote: '"A Library is a Hospital for the Mind."',
      description:
        'A dedicated quiet learning sanctuary equipped with school reference textbooks, general knowledge volumes, and quiet individual reading desks to foster focused study habits.',
      image: '/school-images/library-hospital-for-mind.jpg',
    },
    {
      id: 'bright-classrooms',
      name: 'Classrooms for Classes 1 to 10',
      category: 'Primary & Secondary Learning Environment',
      specs: 'Spacious wooden bench-desks · Natural ventilation · Teacher presentation boards',
      quote: 'Structured and engaging environment for young minds.',
      description:
        'Well-lit, ventilated classrooms configured with durable student bench-desks to encourage active collaboration, neat presentation, and daily academic engagement under attentive teacher supervision.',
      image: '/school-images/classroom-daylight-desks.jpg',
    },
    {
      id: 'campus-corridors',
      name: 'Central Academic Corridors & Greenery',
      category: 'School Ground & Campus Flow',
      specs: 'Sheltered walkways · Brick pillared arcades · Activity bulletin board',
      quote: 'Safe, orderly movement throughout school hours.',
      description:
        'Covered corridors lined with red brick pillars and tactile walkways facilitate smooth and safe student movement between classes, morning assembly, and school activity rooms.',
      image: '/school-images/campus-corridor-colonnade.jpg',
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="campus-life"
      className="py-20 sm:py-24 bg-white text-slate-800 border-b border-slate-200 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-14 pb-6 border-b border-slate-200 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#1B365D] uppercase tracking-wider mb-2">
              <span>Campus Facilities</span>
              <span>·</span>
              <span>Classes 1 to 10</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1B365D]">
              Our School Campus & Learning Spaces
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 font-light max-w-2xl leading-relaxed">
              Explore the genuine grounds of our school. From welcoming red brick corridors to the peaceful B2 reading room and airy classrooms, our environment is built for student safety, focus, and character.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://yandex.com/maps/-/CXVyNN8q"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
            >
              <MapPin className="w-4 h-4 text-amber-600" />
              <span>View On Map</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            {onOpenMonograph && (
              <button
                type="button"
                onClick={onOpenMonograph}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#1B365D] hover:bg-[#132742] transition-all shadow-sm"
              >
                <Camera className="w-4 h-4 text-amber-400" />
                <span>School Gallery (#001–#005)</span>
              </button>
            )}
          </div>
        </div>

        {/* Interactive Comparison Slider */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider block mb-1">
                Interactive Campus View
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1B365D]">
                Corridors and Classroom Environment
              </h3>
            </div>
            <span className="hidden sm:inline-block text-xs text-slate-500">
              Drag slider to compare spaces
            </span>
          </div>

          <ThenNowSlider />
        </div>

        {/* Parallax Facility Sections */}
        <div className="space-y-20">
          {/* Facility 1: Library & Reading Room */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <motion.div
              style={{ y: bgFacilityTranslateY1 }}
              className="lg:col-span-7 relative rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-100 h-80 sm:h-96 group"
            >
              <img
                src={facilities[0].image}
                alt={facilities[0].name}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-semibold text-[#1B365D]">
                  B2 Reading Room
                </span>
              </div>
            </motion.div>

            <motion.div
              style={{ y: textTranslateY1 }}
              className="lg:col-span-5 p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm"
            >
              <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider block mb-1.5">
                {facilities[0].category}
              </span>
              <h4 className="font-serif text-2xl font-bold text-[#1B365D] mb-3">
                {facilities[0].name}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed mb-4">
                {facilities[0].description}
              </p>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 mb-4 text-xs font-medium text-slate-700">
                {facilities[0].specs}
              </div>
              <blockquote className="text-xs font-serif italic text-amber-800 border-l-2 border-amber-500 pl-3">
                {facilities[0].quote}
              </blockquote>
            </motion.div>
          </div>

          {/* Facility 2: Classrooms (Reversed layout) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <motion.div
              style={{ y: textTranslateY2 }}
              className="lg:col-span-5 order-2 lg:order-1 p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm"
            >
              <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider block mb-1.5">
                {facilities[1].category}
              </span>
              <h4 className="font-serif text-2xl font-bold text-[#1B365D] mb-3">
                {facilities[1].name}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed mb-4">
                {facilities[1].description}
              </p>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 mb-4 text-xs font-medium text-slate-700">
                {facilities[1].specs}
              </div>
              <blockquote className="text-xs font-serif italic text-amber-800 border-l-2 border-amber-500 pl-3">
                {facilities[1].quote}
              </blockquote>
            </motion.div>

            <motion.div
              style={{ y: bgFacilityTranslateY2 }}
              className="lg:col-span-7 order-1 lg:order-2 relative rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-100 h-80 sm:h-96 group"
            >
              <img
                src={facilities[1].image}
                alt={facilities[1].name}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2">
                <School className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-semibold text-[#1B365D]">
                  Classrooms 1–10
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ARCHITECTURAL MONOGRAPH & SCROLL-LINKED PARALLAX GALLERY (#001 - #005)    */}
        {/* ========================================================================= */}
        <div id="monograph-gallery" className="mt-24 pt-16 border-t border-slate-200">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 border border-blue-200 text-[#1B365D] text-xs font-semibold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>School Photographic Monograph (#001 to #005)</span>
              </div>
              <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#1B365D] tracking-tight">
                Authentic School Reference Photographs
              </h3>
              <p className="mt-2 text-sm text-slate-600 font-light max-w-2xl leading-relaxed">
                Scroll through our five verified school locations. The serial indicators (<span className="text-amber-700 font-mono font-bold">#001</span> to <span className="text-amber-700 font-mono font-bold">#005</span>) animate dynamically with vertical page scroll, reflecting the genuine corridors, library, and classrooms of our school.
              </p>
            </div>

            {onOpenMonograph && (
              <button
                type="button"
                onClick={onOpenMonograph}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#1B365D] hover:bg-[#132742] transition-all shadow-sm shrink-0 cursor-pointer"
              >
                <Camera className="w-4 h-4 text-amber-400" />
                <span>Fullscreen Gallery</span>
              </button>
            )}
          </div>

          {/* Embedded Parallax Gallery View */}
          <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-md bg-slate-50">
            <CampusParallaxGallery mode="embedded" />
          </div>
        </div>
      </div>
    </section>
  );
};
