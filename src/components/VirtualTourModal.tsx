import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Compass, MapPin, Sparkles, Eye, ArrowRight, Check, BookOpen, School, ExternalLink } from 'lucide-react';

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
  image: string;
}

const TOUR_LOCATIONS: TourLocation[] = [
  {
    id: 'corridor',
    name: 'Academic Corridors & Tactile Walkway',
    subtitle: 'Sheltered Arcades with Classic Red Brick Pillars',
    description:
      'The central circulation artery of our school grounds, featuring durable red brick columns, clean terrazzo flooring, and yellow textured tactile guide paths ensuring safe, orderly student movement between periods.',
    features: ['Classic red brick structural pillars', 'Textured tactile guide pathways', 'Natural cross-breeze ventilation'],
    image: '/school-images/campus-corridor-colonnade.jpg',
  },
  {
    id: 'classrooms',
    name: 'Classrooms for Classes 1 to 10',
    subtitle: 'Spacious Wooden Bench-Desks & Bright Daylight',
    description:
      'Carefully laid out student classrooms equipped with solid wood bench-desks, natural daylight windows, and ample board space to foster focused listening, neat penmanship, and daily teacher-student interaction.',
    features: ['Comfortable wooden study benches', 'Generous natural daylight & ceiling fans', 'Attentive 1:18 teacher-student dynamic'],
    image: '/school-images/classroom-daylight-desks.jpg',
  },
  {
    id: 'library-sign',
    name: 'B2 Reading Room & Library Entrance',
    subtitle: 'Formal Black & Gold Lettered Gateway',
    description:
      'The quiet gateway to the school’s knowledge sanctuary, marked by classic black-and-gold door signage that instills respect for scholarly silence and literary discovery.',
    features: ['Distinctive black & gold institutional signage', 'Designated silent study zone', 'Daily catalog checkout desk'],
    image: '/school-images/library-reading-room-entrance.jpg',
  },
  {
    id: 'reading-alcove',
    name: 'Library Interior & Study Alcove',
    subtitle: '"A Library is a Hospital for the Mind"',
    description:
      'A serene reading room featuring the celebrated wall inscription: "A LIBRARY IS A HOSPITAL FOR THE MIND." Fitted with individual wooden study carrels, curricular reference texts, and general knowledge volumes.',
    features: ['Inspirational motto wall feature', 'Reference books for Classes 1–10', 'Quiet independent study alcoves'],
    image: '/school-images/library-hospital-for-mind.jpg',
  },
  {
    id: 'greenery',
    name: 'Bulletin Board & Hallway Greenery',
    subtitle: 'Academic Circulars & Botanical Hallway',
    description:
      'Lined with fresh potted botanical greenery and the official student circular board, displaying academic schedules, student achievements, and school announcements.',
    features: ['Potted decorative palms & plants', 'Active student notices & timetables', 'Neat polished hallway finish'],
    image: '/school-images/hallway-bulletin-greenery.jpg',
  },
];

export const VirtualTourModal: React.FC<VirtualTourModalProps> = ({ isOpen, onClose }) => {
  const [activeLocationId, setActiveLocationId] = useState<string>('corridor');

  if (!isOpen) return null;

  const current = TOUR_LOCATIONS.find((l) => l.id === activeLocationId) || TOUR_LOCATIONS[0];

  return (
    <AnimatePresence>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-modal-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 8 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white border border-slate-200 max-w-4xl w-full rounded-2xl shadow-2xl text-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#FBF9F5]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1B365D]">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-700 block">
                  Campus Walkthrough · Classes 1 to 10
                </span>
                <h3 id="tour-modal-title" className="text-lg font-serif font-bold text-[#1B365D]">
                  The Mount School Campus Facilities
                </h3>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close virtual tour"
              className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Location Selector Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {TOUR_LOCATIONS.map((loc) => {
                const isActive = loc.id === activeLocationId;
                return (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => setActiveLocationId(loc.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isActive
                        ? 'bg-[#1B365D] border-[#1B365D] text-white shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="block text-[11px] font-bold line-clamp-1">{loc.name.split('&')[0].trim()}</span>
                    <span className={`block text-[10px] line-clamp-1 ${isActive ? 'text-blue-100' : 'text-slate-500'}`}>
                      {loc.subtitle.split('·')[0].trim()}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Showcase View */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Photo */}
              <div className="md:col-span-7 rounded-2xl overflow-hidden border border-slate-200 shadow-sm h-72 sm:h-80 relative bg-slate-100">
                <img
                  src={current.image}
                  alt={current.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-md text-[11px] font-semibold text-[#1B365D] border border-slate-200 shadow-xs">
                  {current.name}
                </div>
              </div>

              {/* Text Description */}
              <div className="md:col-span-5 space-y-4">
                <div>
                  <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider block mb-1">
                    Verified School Facility
                  </span>
                  <h4 className="font-serif text-xl font-bold text-[#1B365D] mb-1">
                    {current.name}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">
                    {current.subtitle}
                  </p>
                </div>

                <p className="text-xs text-slate-600 font-light leading-relaxed">
                  {current.description}
                </p>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-700 block">
                    Facility Highlights
                  </span>
                  <ul className="space-y-1.5 text-xs">
                    {current.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-2 text-slate-700">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-100 bg-[#FBF9F5] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <a
              href="https://yandex.com/maps/-/CXVyNN8q"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-[#1B365D] flex items-center gap-1.5 font-medium"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>Campus Map: 32.834662° N, 72.999090° E</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#1B365D] hover:bg-[#132742] transition-colors"
            >
              Close Walkthrough
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
