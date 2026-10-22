import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import {
  Compass,
  MapPin,
  Cpu,
  Trophy,
  Activity,
  BookOpen,
  Sparkles,
  Maximize2,
  Calendar,
  Users,
  CheckCircle2,
  Sliders,
  ArrowRight,
  Shield,
  Clock,
} from 'lucide-react';

interface ThenNowSliderProps {
  oldImageLabel?: string;
  newImageLabel?: string;
}

export const ThenNowSlider: React.FC<ThenNowSliderProps> = ({
  oldImageLabel = 'Founding Quadrangle (1984)',
  newImageLabel = 'Autonomous Innovation Campus (2027)',
}) => {
  const [sliderPosition, setSliderPosition] = useState(52); // Percentage 0 - 100
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
    <div className="relative rounded-2xl overflow-hidden border border-blue-900/60 shadow-2xl bg-[#070E1C] select-none">
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
        className="relative w-full h-[420px] sm:h-[480px] cursor-ew-resize overflow-hidden"
      >
        {/* Right / Modern Image Layer (Base) */}
        <div className="absolute inset-0 w-full h-full bg-[#09152C] flex items-center justify-center overflow-hidden">
          {/* Stylized Modern Campus Architectural Visual */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#050C1A] via-[#0D2040] to-[#152E5E] opacity-90" />
          <img
            src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1600&q=80"
            alt="Modern Mount Uni Campus 2027"
            className="w-full h-full object-cover mix-blend-luminosity opacity-40 filter contrast-125 scale-105"
          />
          {/* Modern Blueprint & Lighting Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#3B82F6_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
          
          {/* Modern Campus Labels */}
          <div className="absolute bottom-6 right-6 text-right z-10 bg-black/60 backdrop-blur-md px-4 py-2.5 rounded-xl border border-blue-500/30">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 block">
              Present & Future
            </span>
            <span className="font-serif text-sm sm:text-base font-bold text-stone-100">
              {newImageLabel}
            </span>
            <p className="text-[11px] text-stone-300 mt-0.5">
              14 Smart Research Towers · 400 Gbps Quantum Core
            </p>
          </div>
        </div>

        {/* Left / Old Campus Layer (Clipped based on slider position) */}
        <div
          className="absolute inset-y-0 left-0 overflow-hidden bg-[#1A1815] transition-none"
          style={{ width: `${sliderPosition}%` }}
        >
          <div className="absolute inset-0 w-[100vw] max-w-[1280px] h-full flex items-center justify-center overflow-hidden">
            {/* Vintage Sepia & Historic Stone Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#201811] via-[#33251A] to-[#1C1611] opacity-95" />
            <img
              src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=80"
              alt="Historic Foundation Quadrangle 1984"
              className="w-full h-full object-cover filter sepia contrast-125 brightness-90 opacity-60"
            />
            {/* Vintage Film Grain effect */}
            <div className="absolute inset-0 bg-stone-900/30 backdrop-contrast-125" />
          </div>

          {/* Old Campus Labels */}
          <div className="absolute bottom-6 left-6 text-left z-10 bg-stone-950/70 backdrop-blur-md px-4 py-2.5 rounded-xl border border-amber-900/40">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-500 block">
              Historic Charter
            </span>
            <span className="font-serif text-sm sm:text-base font-bold text-stone-200">
              {oldImageLabel}
            </span>
            <p className="text-[11px] text-stone-400 mt-0.5">
              The First Stone Cloister · 128 Inaugural Scholars
            </p>
          </div>
        </div>

        {/* Draggable Divider Handle */}
        <div
          className="absolute inset-y-0 w-1 bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.8)] z-20 pointer-events-none flex items-center justify-center"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="w-9 h-9 rounded-full bg-stone-950 border-2 border-amber-400 shadow-xl flex items-center justify-center text-amber-400 text-xs font-mono font-bold">
            <span className="text-xs">⟷</span>
          </div>
        </div>
      </div>

      {/* Slider Bottom Caption & Interactive Hint */}
      <div className="p-4 bg-[#0B1528] border-t border-blue-950 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-400">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            Drag the handle horizontally to compare the 1984 collegiate heritage with our 2027 smart campus expansion.
          </span>
        </div>
        <div className="font-mono text-amber-400/90 text-[11px] font-semibold shrink-0">
          Split Position: {Math.round(sliderPosition)}%
        </div>
      </div>
    </div>
  );
};

export const CampusLife: React.FC<{ onOpenVirtualTour?: () => void }> = ({
  onOpenVirtualTour,
}) => {
  // Task 2: Interactive Parallax Campus Map using useScroll and useTransform
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Background facility images translate slower (slower delta: -60px to 60px)
  const bgFacilityTranslateY1 = useTransform(scrollYProgress, [0, 1], [-50, 70]);
  const bgFacilityTranslateY2 = useTransform(scrollYProgress, [0, 1], [-80, 50]);

  // Overlaying text descriptions translate faster (faster delta: 40px to -80px)
  const textTranslateY1 = useTransform(scrollYProgress, [0, 1], [40, -60]);
  const textTranslateY2 = useTransform(scrollYProgress, [0, 1], [60, -70]);

  const facilities = [
    {
      id: 'robotics-ai-lab',
      name: 'Alan Turing Robotics & Cognitive Systems Complex',
      category: 'STEM Innovation',
      specs: '18 Autonomous Robot Arenas · 4 Laser Cutters · Nvidia Supercomputer Node',
      description:
        'Equipped with advanced humanoid kinematics, drone flight testing cages, high-frequency oscilloscope benches, and dedicated AI model training clusters.',
      lead: 'Prof. Dr. Tariq Mansoor, Lab Regent',
      image:
        'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'sports-complex',
      name: 'Olympian Sports Pavilions & Aquatic Center',
      category: 'Athletics & Physical Well-being',
      specs: '50m Heated Olympic Pool · 8 Squash Courts · All-Weather Cricket Oval',
      description:
        'Managed by certified international coaches and resident sports physiotherapists, supporting 14 competitive inter-university varsity squads.',
      lead: 'Director of Athletics, Major (R) H. Daniyal',
      image:
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'bodleian-library',
      name: 'Chancellors Memorial Library & Rare Manuscripts Vault',
      category: 'Scholarly Archiving',
      specs: '280,000 Bound Volumes · JSTOR & Elsevier Terminal Hubs · 40 Silent Alcoves',
      description:
        'A sanctuary of silence and deep concentration with temperature-controlled archives housing 18th-century charters and rare cartographic maps.',
      lead: 'Chief Archivist, Lady Eleanor Vance',
      image:
        'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80',
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="campus-life"
      className="py-24 bg-[#070E1C] text-stone-100 border-b border-blue-950 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 pb-6 border-b border-blue-950/80 gap-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400 block mb-2">
              Campus Topography & Student Life
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-100">
              The Physical World of The Mount Uni
            </h2>
            <p className="mt-3 text-sm sm:text-base text-stone-300 font-light max-w-2xl leading-relaxed">
              120 verdant acres combining Gothic limestone cloisters with modern glass atrium laboratories. Experience our evolving infrastructure.
            </p>
          </div>

          {onOpenVirtualTour && (
            <button
              type="button"
              onClick={onOpenVirtualTour}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 transition-all shadow-lg shadow-amber-500/20 shrink-0"
            >
              <Compass className="w-4 h-4 text-stone-950" />
              Launch 360° Virtual Tour
            </button>
          )}
        </div>

        {/* Task 3: Then vs. Now Interactive Slider */}
        <div className="mb-24">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400 block mb-1">
                Campus Evolution Chronology
              </span>
              <h3 className="font-serif text-2xl font-bold text-stone-100">
                Then vs. Now: Draggable Heritage Comparison
              </h3>
            </div>
            <span className="hidden sm:inline-block text-xs text-stone-400">
              Interactive split comparison
            </span>
          </div>

          <ThenNowSlider />
        </div>

        {/* Task 2: Interactive Parallax Campus Map Section */}
        <div className="mt-16">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400 block mb-1">
              Parallax Spatial Exploration
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-100 mb-2">
              Precision Facilities & Research Spaces
            </h3>
            <p className="text-xs sm:text-sm text-stone-400 font-light leading-relaxed">
              As you scroll down the campus grounds, observe how our physical laboratories, athletic halls, and research libraries reveal themselves through dynamic perspective shifts.
            </p>
          </div>

          <div className="space-y-24">
            {/* Facility 1: Robotics Lab */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Background facility image moving slower */}
              <motion.div
                style={{ y: bgFacilityTranslateY1 }}
                className="lg:col-span-7 relative rounded-2xl overflow-hidden border border-blue-900/60 shadow-2xl bg-slate-900 h-80 sm:h-96 group"
              >
                <img
                  src={facilities[0].image}
                  alt={facilities[0].name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070E1C] via-transparent to-transparent opacity-80" />
                <div className="absolute top-4 left-4 bg-[#070E1C]/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-blue-500/30 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-mono font-semibold text-stone-200">
                    Robotics & Embedded Systems
                  </span>
                </div>
              </motion.div>

              {/* Overlaying text description moving faster */}
              <motion.div
                style={{ y: textTranslateY1 }}
                className="lg:col-span-5 p-6 sm:p-8 rounded-2xl bg-[#0B1528] border border-blue-950 shadow-xl"
              >
                <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider block mb-2">
                  {facilities[0].category}
                </span>
                <h4 className="font-serif text-2xl font-bold text-stone-100 mb-3">
                  {facilities[0].name}
                </h4>
                <p className="text-xs text-stone-300 font-light leading-relaxed mb-4">
                  {facilities[0].description}
                </p>
                <div className="p-3 rounded-xl bg-[#070E1C] border border-blue-950 mb-4 text-xs font-mono text-stone-300">
                  {facilities[0].specs}
                </div>
                <span className="text-[11px] text-amber-300 font-serif italic block">
                  {facilities[0].lead}
                </span>
              </motion.div>
            </div>

            {/* Facility 2: Sports Complex (Reversed layout) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Overlaying text description moving faster */}
              <motion.div
                style={{ y: textTranslateY2 }}
                className="lg:col-span-5 order-2 lg:order-1 p-6 sm:p-8 rounded-2xl bg-[#0B1528] border border-blue-950 shadow-xl"
              >
                <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider block mb-2">
                  {facilities[1].category}
                </span>
                <h4 className="font-serif text-2xl font-bold text-stone-100 mb-3">
                  {facilities[1].name}
                </h4>
                <p className="text-xs text-stone-300 font-light leading-relaxed mb-4">
                  {facilities[1].description}
                </p>
                <div className="p-3 rounded-xl bg-[#070E1C] border border-blue-950 mb-4 text-xs font-mono text-stone-300">
                  {facilities[1].specs}
                </div>
                <span className="text-[11px] text-amber-300 font-serif italic block">
                  {facilities[1].lead}
                </span>
              </motion.div>

              {/* Background facility image moving slower */}
              <motion.div
                style={{ y: bgFacilityTranslateY2 }}
                className="lg:col-span-7 order-1 lg:order-2 relative rounded-2xl overflow-hidden border border-blue-900/60 shadow-2xl bg-slate-900 h-80 sm:h-96 group"
              >
                <img
                  src={facilities[1].image}
                  alt={facilities[1].name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070E1C] via-transparent to-transparent opacity-80" />
                <div className="absolute top-4 left-4 bg-[#070E1C]/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-blue-500/30 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-mono font-semibold text-stone-200">
                    Aquatic & Varsity Sports
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
