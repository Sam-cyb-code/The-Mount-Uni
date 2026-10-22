import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Compass, MapPin, Sparkles, Eye, ArrowRight, Check } from 'lucide-react';

interface VirtualTourModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TourLocation {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  features: string[];
  gradient: string;
}

const TOUR_LOCATIONS: TourLocation[] = [
  {
    id: 'quadrangle',
    name: 'The Central Senate Quadrangle',
    subtitle: 'Heart of Academic Ceremonies & Classical Clocktower',
    description:
      'Spanning 8 acres of historic limestone walkways and manicured lawns, the Quadrangle is the daily gathering space for convocation, faculty processions, and open-air symposia.',
    features: ['Neoclassical Clock Tower (1984)', 'Outdoor Reading Cloisters', 'Statue of the Founder Regents'],
    gradient: 'from-amber-950/40 via-slate-900 to-slate-950',
  },
  {
    id: 'library',
    name: 'The Atrium Heritage Library',
    subtitle: '4 Floors of Archival Repositories & Rare Manuscripts',
    description:
      'Home to over 180,000 physical volumes, climate-controlled rare book vaults, and 400 silent study carrels flooded with natural north skylight.',
    features: ['Rare Cambridge & BISE Archives', 'Individual Postgraduate Carrels', 'JSTOR & ScienceDirect Terminals'],
    gradient: 'from-blue-950/50 via-slate-900 to-slate-950',
  },
  {
    id: 'steam',
    name: 'The Sir Isaac Newton STEM & AI Hub',
    subtitle: '12 Advanced Research & Robotic Benches',
    description:
      'Where theory converges with fabrication. Equipped with clean-room workstations, industrial 3D laser cutters, and supercomputing clusters for student machine learning projects.',
    features: ['Autonomous Rover Testing Arena', 'Spectroscopy & Chemistry Benches', 'Class-100 Clean Hoods'],
    gradient: 'from-emerald-950/40 via-slate-900 to-slate-950',
  },
  {
    id: 'aquatics',
    name: 'The Olympic Aquatics & Sports Complex',
    subtitle: 'Heated 50m Pool, Turf Grounds & Squash Arenas',
    description:
      'Designed to Olympic standards with electronic touch timing, temperature control, glass-back international squash courts, and pavilion seating for 2,000 spectators.',
    features: ['50-meter 8-Lane Competition Pool', 'FIFA-grade All-Weather Pitch', 'Biomechanics Physiology Lab'],
    gradient: 'from-cyan-950/40 via-slate-900 to-slate-950',
  },
];

export const VirtualTourModal: React.FC<VirtualTourModalProps> = ({ isOpen, onClose }) => {
  const [activeLocationId, setActiveLocationId] = useState<string>('quadrangle');

  if (!isOpen) return null;

  const current = TOUR_LOCATIONS.find((l) => l.id === activeLocationId) || TOUR_LOCATIONS[0];

  return (
    <AnimatePresence>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-modal-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 8 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#0B1528] border border-blue-900/60 max-w-4xl w-full rounded-2xl shadow-2xl text-stone-100 overflow-hidden flex flex-col max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-blue-950 bg-[#070E1C]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 block">
                  360° Interactive Campus Discovery
                </span>
                <h3 id="tour-modal-title" className="text-lg font-serif font-bold text-stone-100">
                  The Mount Uni Virtual Campus Experience
                </h3>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close virtual tour"
              className="p-1.5 text-stone-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Location Selector Tabs */}
          <div className="px-6 py-3 bg-[#0B1528] border-b border-blue-950 overflow-x-auto">
            <div className="flex items-center gap-2">
              {TOUR_LOCATIONS.map((loc) => {
                const isSelected = loc.id === activeLocationId;
                return (
                  <button
                    key={loc.id}
                    onClick={() => setActiveLocationId(loc.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-stone-400 hover:text-white bg-[#070E1C] border border-blue-950'
                    }`}
                  >
                    {loc.name.split('The ')[1] || loc.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive 360 Viewport */}
          <div className="p-6 overflow-y-auto space-y-6">
            <div className={`relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden border border-blue-900/50 bg-gradient-to-br ${current.gradient} flex items-center justify-center p-6 text-center shadow-inner`}>
              {/* Atmospheric Compass Grid */}
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="w-full h-full bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
              </div>

              <div className="relative z-10 max-w-lg">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-600/20 text-blue-300 border border-blue-500/30 mb-3">
                  <Eye className="w-3.5 h-3.5" /> 360° High-Definition Panorama
                </span>
                <h4 className="text-xl sm:text-2xl font-serif font-bold text-stone-100 mb-2">
                  {current.name}
                </h4>
                <p className="text-xs text-stone-300 leading-relaxed font-light mb-4">
                  {current.subtitle}
                </p>
                <div className="inline-flex items-center gap-2 text-[11px] text-amber-300 font-mono bg-stone-900/80 px-3 py-1 rounded-md border border-stone-800">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>Main Campus · Quadrangle Coordinates: 31.5204° N, 74.3587° E</span>
                </div>
              </div>
            </div>

            {/* Location Details & Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start text-xs">
              <div className="md:col-span-7 space-y-2">
                <h5 className="text-xs font-semibold uppercase tracking-wider text-amber-400 font-mono">
                  About This Landmark
                </h5>
                <p className="text-stone-300 leading-relaxed">
                  {current.description}
                </p>
              </div>

              <div className="md:col-span-5 p-4 rounded-xl bg-[#070E1C] border border-blue-950 space-y-2">
                <h5 className="text-[11px] font-semibold uppercase tracking-wider text-blue-400 font-mono">
                  Campus Facilities
                </h5>
                <ul className="space-y-1.5">
                  {current.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-stone-300">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-[#070E1C] border-t border-blue-950 flex flex-wrap items-center justify-between gap-4 text-xs">
            <span className="text-stone-400">
              Want to visit in person? Our admissions ambassadors offer guided walking tours every Saturday.
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-stone-300 hover:text-white bg-slate-900 border border-slate-800"
              >
                Close Preview
              </button>
              <a
                href="#book-tour"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-xs font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 transition-colors shadow-md flex items-center gap-1.5"
              >
                Book Guided Campus Tour
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
