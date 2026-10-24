import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import {
  Compass,
  MapPin,
  Calendar,
  Layers,
  Sparkles,
  Volume2,
  VolumeX,
  X,
  ChevronDown,
  Info,
  Maximize2,
  Minimize2,
  CheckCircle2,
  Building,
} from 'lucide-react';
import './CampusParallaxGallery.css';
import { MonographVignette, MONOGRAPH_VIGNETTES } from '../data/monographData';
export type { MonographVignette };
export { MONOGRAPH_VIGNETTES };

interface VignetteSectionProps {
  vignette: MonographVignette;
  index: number;
  onInspect: (vignette: MonographVignette) => void;
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

const VignetteSection: React.FC<VignetteSectionProps> = ({
  vignette,
  index,
  onInspect,
  containerRef,
}) => {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  // Scroll tracking exactly as prescribed by user's snippet
  // Target: section, interpolates h2 header translation y: [-400, 400]
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    ...(containerRef ? { container: containerRef } : {}),
    offset: ['start end', 'end start'],
  });

  // User's exact animation: y moves from -400 to +400 as section travels through viewport
  const headerY = useTransform(scrollYProgress, [0, 1], [-400, 400]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.94, 1.05, 0.94]);
  const cardRotate = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [index % 2 === 0 ? -1.5 : 1.5, 0, index % 2 === 0 ? 1.5 : -1.5]
  );
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.4, 1, 1, 0.4]);

  return (
    <section
      ref={sectionRef}
      id={`vignette-${vignette.rawIndex}`}
      className="img-container relative group"
    >
      {/* Background Subtle Watermark */}
      <span className="monograph-watermark">{vignette.rawIndex}</span>

      {/* Main Photographic Card Wrapper */}
      <motion.div
        style={{ scale: imageScale, rotate: cardRotate, opacity }}
        className="card-wrapper relative flex flex-col justify-between"
      >
        {/* Top Photographic Region */}
        <div className="relative w-full h-[68%] overflow-hidden bg-slate-950">
          <img
            src={vignette.image}
            alt={vignette.title}
            className="img-media"
            loading="lazy"
          />

          {/* Vignette Gradient & Subtle Blueprint Grain */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1528] via-transparent to-black/40 pointer-events-none" />

          {/* Top Metadata Badges */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
            <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold tracking-wider bg-black/60 backdrop-blur-md text-amber-400 border border-amber-500/30">
              {vignette.year}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono text-stone-300 bg-blue-950/70 backdrop-blur-md border border-blue-500/20">
              Folio 2027
            </span>
          </div>

          {/* Coordinates Tag */}
          <div className="absolute bottom-3 left-4 z-10 flex items-center gap-1.5 text-[10px] font-mono text-stone-300/90 pointer-events-none">
            <MapPin className="w-3 h-3 text-amber-400" />
            <span className="truncate max-w-[240px]">{vignette.coordinates}</span>
          </div>
        </div>

        {/* User's Exact Animated Header: y [-400, 400] */}
        <motion.h2
          style={{ y: headerY }}
          className="serial-number"
          aria-label={vignette.serial}
        >
          {vignette.serial}
        </motion.h2>

        {/* Bottom Editorial Caption Region */}
        <div className="p-5 sm:p-6 bg-white border-t border-slate-200 flex flex-col justify-between flex-1">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-700 block mb-1 font-semibold">
              {vignette.classification}
            </span>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1B365D] line-clamp-1 group-hover:text-blue-700 transition-colors">
              {vignette.title}
            </h3>
            <p className="mt-1.5 text-xs text-slate-600 font-light line-clamp-2 leading-relaxed">
              {vignette.summary}
            </p>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-[11px] text-slate-500 font-mono italic">
              {vignette.leadArch}
            </span>
            <button
              type="button"
              onClick={() => onInspect(vignette)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-all cursor-pointer"
            >
              <Info className="w-3.5 h-3.5 text-amber-700" />
              <span>Details</span>
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

interface CampusParallaxGalleryProps {
  mode?: 'embedded' | 'fullscreen';
  isOpen?: boolean;
  onClose?: () => void;
}

const CampusParallaxGalleryContent: React.FC<CampusParallaxGalleryProps> = ({
  mode = 'embedded',
  isOpen = true,
  onClose,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeVignette, setActiveVignette] = useState<MonographVignette | null>(null);
  const [isSnapEnabled, setIsSnapEnabled] = useState(mode === 'fullscreen');
  const [isAudioActive, setIsAudioActive] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Motion useScroll for overall gallery scroll progress bar (scaleX: [0, 1])
  // When in fullscreen modal, listen to containerRef scroll; in embedded mode, listen to window scroll
  const { scrollYProgress } = useScroll(
    mode === 'fullscreen' ? { container: containerRef } : {}
  );

  // Soundscape Chime Synthesizer (Westminster Collegiate Chime) using Web Audio API
  const playCollegiateChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Bell frequencies (F#4, D4, E4, A3 harmonic progression)
      const notes = [370, 293.66, 329.63, 220];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.35);

        gain.gain.setValueAtTime(0.001, ctx.currentTime + i * 0.35);
        gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + i * 0.35 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.35 + 1.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + i * 0.35);
        osc.stop(ctx.currentTime + i * 0.35 + 2.0);
      });
    } catch {
      // AudioContext unavailable
    }
  };

  const toggleAudio = () => {
    if (!isAudioActive) {
      playCollegiateChime();
      setIsAudioActive(true);
    } else {
      setIsAudioActive(false);
    }
  };

  const scrollToVignette = (rawIndex: string) => {
    const el = document.getElementById(`vignette-${rawIndex}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const content = (
    <div
      ref={containerRef}
      className={`relative ${
        isSnapEnabled ? 'gallery-snap-root' : 'gallery-embedded-root'
      } ${mode === 'fullscreen' ? 'fixed inset-0 z-50 overflow-y-auto' : ''}`}
    >
      {/* Top Floating Folio Command Strip */}
      <div className="sticky top-0 z-40 w-full bg-[#070E1C]/90 backdrop-blur-md border-b border-blue-950/80 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold font-serif text-sm">
            M
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-sm sm:text-base text-stone-100 tracking-tight">
                Architectural Monograph
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-blue-950 text-blue-300 border border-blue-900">
                Five Curated Landmarks
              </span>
            </div>
            <p className="text-[11px] text-stone-400 font-mono hidden md:block">
              Scroll down to witness scroll-linked parallax kinetics (#001 → #005)
            </p>
          </div>
        </div>

        {/* Mid Controls: Jump to Slides (#001 - #005) */}
        <div className="hidden lg:flex items-center gap-1.5 bg-[#0B1528] p-1 rounded-xl border border-blue-900/50">
          {MONOGRAPH_VIGNETTES.map((v) => (
            <button
              key={v.rawIndex}
              type="button"
              onClick={() => scrollToVignette(v.rawIndex)}
              className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold text-stone-300 hover:text-amber-400 hover:bg-blue-950/80 transition-all cursor-pointer"
            >
              {v.serial}
            </button>
          ))}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Audio Chime Trigger */}
          <button
            type="button"
            onClick={toggleAudio}
            title={isAudioActive ? 'Chime sound activated' : 'Ring collegiate bell'}
            className="p-2 rounded-xl bg-[#0B1528] border border-blue-900/60 text-stone-300 hover:text-amber-400 transition-colors cursor-pointer"
          >
            {isAudioActive ? (
              <Volume2 className="w-4 h-4 text-amber-400" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>

          {/* Toggle Snap Mode */}
          <button
            type="button"
            onClick={() => setIsSnapEnabled(!isSnapEnabled)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono bg-[#0B1528] border border-blue-900/60 text-stone-300 hover:text-stone-100 hover:border-amber-500/40 transition-all cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>{isSnapEnabled ? 'Snap: Active' : 'Free Scroll'}</span>
          </button>

          {/* Close button if full-screen modal */}
          {mode === 'fullscreen' && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-amber-400 text-stone-950 font-bold hover:bg-amber-300 transition-colors shadow-lg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Five Viewport Sections matching user structure */}
      <div className="relative">
        {MONOGRAPH_VIGNETTES.map((vignette, idx) => (
          <VignetteSection
            key={vignette.rawIndex}
            vignette={vignette}
            index={idx}
            onInspect={(v) => setActiveVignette(v)}
            containerRef={mode === 'fullscreen' ? containerRef : undefined}
          />
        ))}
      </div>

      {/* Exact User Spec: Fixed progress bar with scaleX [0, 1] */}
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="progress"
        aria-hidden="true"
      />

      {/* Floating Bottom Navigation Badge */}
      <div className="fixed bottom-3 right-6 z-40 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200 shadow-md text-[11px] font-medium text-slate-700 flex items-center gap-2 pointer-events-none">
        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
        <span>The Mount School Photographic Folio</span>
      </div>

      {/* Architectural Dossier Modal */}
      {activeVignette && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActiveVignette(null)}
        >
          <div
            className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden text-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-mono font-bold text-amber-700">
                  {activeVignette.serial}
                </span>
                <div>
                  <h4 className="font-serif text-xl font-bold text-[#1B365D]">
                    {activeVignette.title}
                  </h4>
                  <span className="text-xs text-amber-700 font-medium">
                    {activeVignette.classification}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveVignette(null)}
                className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600">
              <p className="leading-relaxed font-light">
                {activeVignette.summary}
              </p>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#1B365D]">
                  Facility Highlights
                </div>
                <ul className="space-y-1.5">
                  {activeVignette.specifications.map((spec, i) => (
                    <li key={i} className="flex items-center gap-2 text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">Campus Location:</span>
                  <span className="text-slate-800 font-medium">{activeVignette.leadArch}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">Official Map Coordinates:</span>
                  <span className="text-slate-800 font-mono">{activeVignette.coordinates}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-serif italic">
                "{activeVignette.historicalNote}"
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveVignette(null)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#1B365D] hover:bg-[#132742] text-white transition-colors cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return content;
};

export const CampusParallaxGallery: React.FC<CampusParallaxGalleryProps> = (props) => {
  if (props.mode === 'fullscreen' && !props.isOpen) {
    return null;
  }
  return <CampusParallaxGalleryContent {...props} />;
};

export default CampusParallaxGallery;
