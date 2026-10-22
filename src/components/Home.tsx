import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import {
  ArrowRight,
  Compass,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Users,
  GraduationCap,
  Award,
  Sparkles,
  BookOpen,
  ShieldCheck,
  Trophy,
  Cpu,
  CheckCircle2,
  MapPin,
  Calendar,
  Layers,
  ChevronRight,
  Clock,
  Building,
  Zap,
} from 'lucide-react';
import { PATHWAY_DATA, PathwayRole } from '../utils/homeUtils';
import { VirtualTourModal } from './VirtualTourModal';
import { LaserFlow } from './LaserFlow';
import { GradientText } from './GradientText';
import { GlassIcons, GlassIconItem } from './GlassIcons';

interface HomeProps {
  onOpenApplyModal?: () => void;
  onOpenMatrixModal?: () => void;
  onOpenPortalModal?: (portalId?: string) => void;
  onShowToast?: (msg: string) => void;
}

interface StoryCard {
  id: string;
  step: string;
  title: string;
  pillar: string;
  subtitle: string;
  description: string;
  metrics: { value: string; label: string };
  highlights: string[];
  gradient: string;
  accentColor: string;
  icon: 'BookOpen' | 'ShieldCheck' | 'Trophy' | 'Cpu';
}

const STORY_CARDS: StoryCard[] = [
  {
    id: 'academics',
    step: '01 / ACADEMICS',
    pillar: 'Scholarly Rigor & Dual Streams',
    title: 'Cambridge & National Matric Dual Architecture',
    subtitle: 'Where traditional classical inquiry meets modern laboratory experimentation.',
    description:
      'Candidates choose between Cambridge International (IGCSE, O-Levels, A-Levels) and the National Board (BISE Matriculation & FSc Pre-Med / Pre-Eng), supported by 1:8 faculty mentorship and 12 dedicated STEM research laboratories.',
    metrics: { value: '94.8%', label: 'Top-tier university placements worldwide' },
    highlights: [
      'Dual CAIE & BISE accredited faculties',
      'Ivy League & Russell Group college counseling cell',
      'Advanced physics, molecular biology & robotics hubs',
    ],
    gradient: 'from-blue-950/80 via-[#0B1528] to-[#070E1C]',
    accentColor: 'text-blue-400',
    icon: 'BookOpen',
  },
  {
    id: 'character',
    step: '02 / CHARACTER',
    pillar: 'Moral Pedigree & Ethical Leadership',
    title: 'Honor Code, Debate & Civic Stewardship',
    subtitle: 'Intellect without moral grounding is hollow. We cultivate courageous ethical leaders.',
    description:
      'Rooted in our four historic residential houses, scholars participate in student-governed honor courts, world-championship parliamentary debating, and 120 annual hours of public civic stewardship across community outreach clinics.',
    metrics: { value: '100%', label: 'Student community stewardship engagement' },
    highlights: [
      'Four residential houses fostering collegiate brotherhood & sisterhood',
      'National Champion Parliamentary Debating Union',
      'Chancellor Fellowship for public interest projects',
    ],
    gradient: 'from-amber-950/70 via-[#0B1528] to-[#070E1C]',
    accentColor: 'text-amber-400',
    icon: 'ShieldCheck',
  },
  {
    id: 'sports',
    step: '03 / SPORTS',
    pillar: 'Champions of Field & Turf',
    title: 'Olympic-Standard Athletics & Team Ethos',
    subtitle: 'Physical endurance forged on manicured ovals, heated pools, and squash courts.',
    description:
      'Our 40-acre athletic estate features an Olympic-standard 8-lane heated competition pool, international glass-back squash arenas, FIFA-grade turf, and historic cricket pavilions coached by former national olympians.',
    metrics: { value: '32', label: 'Inter-Collegiate championship trophies won' },
    highlights: [
      'Heated 50-meter Olympic aquatic pavilion',
      'Turf athletics track & floodlit football arenas',
      'Sports physiology, nutrition & recovery clinic',
    ],
    gradient: 'from-emerald-950/70 via-[#0B1528] to-[#070E1C]',
    accentColor: 'text-emerald-400',
    icon: 'Trophy',
  },
  {
    id: 'innovation',
    step: '04 / INNOVATION',
    pillar: 'The Frontier of Discovery',
    title: 'Autonomous AI, Robotics & Venture Seed Hub',
    subtitle: 'Transforming theoretical wonder into patents, hardware, and sustainable systems.',
    description:
      'From building autonomous rovers and satellite ground stations to testing microbial fuel cells, Mount Uni scholars collaborate directly with industry researchers and access a dedicated student seed venture fund.',
    metrics: { value: '18+', label: 'Student filed technological patents & ventures' },
    highlights: [
      'Class-100 Cleanroom & AI Supercomputing cluster',
      'Astrophysics rooftop observatory & telescope dome',
      'Annual $100K Chancellor Student Venture Seed Grant',
    ],
    gradient: 'from-indigo-950/70 via-[#0B1528] to-[#070E1C]',
    accentColor: 'text-indigo-400',
    icon: 'Cpu',
  },
];

export const Home: React.FC<HomeProps> = ({
  onOpenApplyModal,
  onOpenMatrixModal,
  onOpenPortalModal,
  onShowToast,
}) => {
  const [selectedRole, setSelectedRole] = useState<PathwayRole>('parent');
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isTourModalOpen, setIsTourModalOpen] = useState(false);
  const [isLaserEnabled, setIsLaserEnabled] = useState(true);
  const [laserColor, setLaserColor] = useState<string>('#2563EB');
  const [glassPlate, setGlassPlate] = useState<'tilt' | 'offset' | 'circle' | 'none'>('tilt');
  const [glassHover, setGlassHover] = useState<'lift' | 'float' | 'press'>('lift');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const heroSurfaceRef = useRef<HTMLDivElement | null>(null);

  const portalGlassItems: GlassIconItem[] = [
    {
      id: 'parent',
      label: 'Parent Gateway',
      icon: <Users className="w-8 h-8 text-amber-300" />,
      color: 'orange',
      onClick: () => {
        if (onOpenPortalModal) onOpenPortalModal('parent');
        else if (onShowToast) onShowToast('Parent Portal Gateway accessed');
      },
    },
    {
      id: 'student',
      label: 'Student SIS & LMS',
      icon: <GraduationCap className="w-8 h-8 text-blue-300" />,
      color: 'blue',
      onClick: () => {
        if (onOpenPortalModal) onOpenPortalModal('student');
        else if (onShowToast) onShowToast('Student SIS & LMS accessed');
      },
    },
    {
      id: 'faculty',
      label: 'Faculty & Regent',
      icon: <BookOpen className="w-8 h-8 text-purple-300" />,
      color: 'purple',
      onClick: () => {
        if (onOpenPortalModal) onOpenPortalModal('staff');
        else if (onShowToast) onShowToast('Faculty & Regent Terminal accessed');
      },
    },
    {
      id: 'admissions',
      label: 'Admissions 2027',
      icon: <Award className="w-8 h-8 text-emerald-300" />,
      color: 'teal',
      onClick: () => {
        if (onOpenApplyModal) onOpenApplyModal();
        else {
          const el = document.querySelector('#admissions-apply');
          el?.scrollIntoView({ behavior: 'smooth' });
        }
      },
    },
    {
      id: 'alumni',
      label: 'Alumni Network',
      icon: <Compass className="w-8 h-8 text-indigo-300" />,
      color: 'indigo',
      onClick: () => {
        setSelectedRole('alumni');
        const el = document.querySelector('#pathways');
        el?.scrollIntoView({ behavior: 'smooth' });
      },
    },
  ];

  // Horizontal Storytelling Scroll binding
  const horizontalSectionRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: horizontalSectionRef,
    offset: ['start start', 'end end'],
  });

  // Translate container horizontally across screen (from 0% to -72%)
  const xTransform = useTransform(scrollYProgress, [0, 1], ['0%', '-68%']);
  const progressPercent = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  const toggleVideoPlayback = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  const currentPathway = PATHWAY_DATA[selectedRole];

  return (
    <div className="w-full bg-[#070E1C] text-stone-100 selection:bg-blue-600/40">
      {/* ========================================================================= */}
      {/* TASK 1: CINEMATIC HERO SECTION                                            */}
      {/* ========================================================================= */}
      <section
        className="relative min-h-[92vh] lg:min-h-screen w-full flex items-center justify-center overflow-hidden border-b border-blue-950 bg-black"
        aria-label="Cinematic Campus Hero"
      >
        {/* Looping Background Video with Resilient Fallback Overlay */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            poster="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080' viewBox='0 0 1920 1080'><rect width='1920' height='1080' fill='%23070E1C'/></svg>"
            className="w-full h-full object-cover scale-105 filter brightness-[0.40] contrast-[1.15]"
          >
            {/* HTML5 sample loop with open educational video */}
            <source
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
              type="video/mp4"
            />
          </video>

          {/* Deep Cinematic Contrast Scrims */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#070E1C] via-[#070E1C]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#070E1C]/90 via-transparent to-[#070E1C]/90" />
          
          {/* Subtle animated optical atmospheric grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] [background-size:32px_32px] opacity-20" />
        </div>

        {/* WebGL2 LaserFlow Quantum Light Animation Layer */}
        {isLaserEnabled && (
          <div className="absolute inset-0 w-full h-full z-[5] pointer-events-auto">
            <LaserFlow
              surfaceRef={heroSurfaceRef}
              color={laserColor}
              beamPosition={0.5}
              surfaceLevel={0.34}
              intensity={1.8}
              beamWidth={1.5}
              flare={1.6}
              spread={1.5}
              spill={1.2}
              fog={0.25}
              dust={1.6}
              streaks={1.5}
              dots={1.0}
              pulse={1.4}
              speed={1.3}
              mouseInteraction={true}
              theme="dark"
              className="w-full h-full"
            />
          </div>
        )}

        {/* LaserFlow Controls (Bottom-Left) */}
        <div className="absolute bottom-6 left-6 z-20 hidden md:flex items-center gap-2.5 bg-[#070E1C]/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-blue-900/40 text-stone-300 text-xs shadow-xl">
          <button
            type="button"
            onClick={() => {
              setIsLaserEnabled(!isLaserEnabled);
              if (onShowToast) onShowToast(isLaserEnabled ? 'Laser Flow Shader disabled' : 'Laser Flow Shader activated');
            }}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
            title={isLaserEnabled ? 'Disable Laser Flow Animation' : 'Enable Laser Flow Animation'}
          >
            <Zap className={`w-3.5 h-3.5 ${isLaserEnabled ? 'text-amber-400' : 'text-stone-500'}`} />
            <span className="text-[11px] font-mono">
              {isLaserEnabled ? 'Laser Flow: Active' : 'Laser Flow: Off'}
            </span>
          </button>

          {isLaserEnabled && (
            <>
              <span className="text-stone-600">│</span>
              <div className="flex items-center gap-1.5">
                {[
                  { color: '#2563EB', label: 'Sapphire Lapis' },
                  { color: '#D97706', label: 'Crest Amber' },
                  { color: '#059669', label: 'Verdant Emerald' },
                  { color: '#7C3AED', label: 'Imperial Violet' },
                ].map((c) => (
                  <button
                    key={c.color}
                    type="button"
                    onClick={() => {
                      setLaserColor(c.color);
                      if (onShowToast) onShowToast(`Laser Tint set to ${c.label}`);
                    }}
                    aria-label={c.label}
                    title={c.label}
                    className={`w-3 h-3 rounded-full transition-transform ${
                      laserColor === c.color
                        ? 'scale-125 ring-2 ring-white ring-offset-1 ring-offset-[#070E1C]'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: c.color }}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Video Playback & Accessibility Controls (Bottom-Right) */}
        <div className="absolute bottom-6 right-6 z-20 hidden sm:flex items-center gap-2 bg-[#070E1C]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-blue-900/40 text-stone-300 text-xs">
          <button
            type="button"
            onClick={toggleVideoPlayback}
            aria-label={isVideoPlaying ? 'Pause background video' : 'Play background video'}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            {isVideoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="text-[11px] font-mono">{isVideoPlaying ? 'Pause Ambience' : 'Play Ambience'}</span>
          </button>
        </div>

        {/* Hero Mission Statement Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center">
          {/* Institution Motto Kicker (Tracked by LaserFlow surfaceRef) */}
          <motion.div
            ref={heroSurfaceRef}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/70 border border-blue-500/30 text-blue-300 text-xs font-mono uppercase tracking-widest mb-6 backdrop-blur-md shadow-lg"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Veritas · Disciplina · Lux · Est. 1984</span>
          </motion.div>

          {/* Bold Mission Statement Headline with Dynamic Gradient Ripple */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-100 leading-[1.14] text-balance max-w-4xl"
          >
            Educating Minds of Rigor.{' '}
            <GradientText
              colors={['#F59E0B', '#FDE047', '#60A5FA', '#3B82F6']}
              variant="flow"
              animationSpeed={6}
              glow={0.5}
              followPointer={true}
              className="font-serif italic drop-shadow-sm inline-block"
            >
              Cultivating Characters of Honor.
            </GradientText>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 text-sm sm:text-base lg:text-lg text-stone-300 max-w-2xl font-light leading-relaxed"
          >
            A premier independent seat of discovery where scholars thrive across dual Cambridge O/A Levels and National Matric/FSc streams, empowered for transformative global leadership.
          </motion.p>

          {/* Primary Action Buttons with Framer Motion Hover Scale Effects */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-6"
          >
            {/* CTA 1: Apply for 2027 */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 350, damping: 20 }}
              onClick={() => {
                if (onOpenApplyModal) onOpenApplyModal();
                else if (onShowToast) onShowToast('Admissions Application for 2027 initiated.');
                const target = document.querySelector('#admissions-apply');
                target?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-7 py-4 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider text-stone-950 bg-amber-400 hover:bg-amber-300 transition-all shadow-xl shadow-amber-500/25 flex items-center gap-2.5 cursor-pointer"
            >
              <span>Apply for 2027</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>

            {/* CTA 2: Virtual Tour */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 350, damping: 20 }}
              onClick={() => setIsTourModalOpen(true)}
              className="px-7 py-4 rounded-xl text-xs sm:text-sm font-semibold tracking-wide text-blue-200 hover:text-white bg-blue-950/80 hover:bg-blue-900/80 border border-blue-500/40 backdrop-blur-md transition-all shadow-xl shadow-blue-950/50 flex items-center gap-2.5 cursor-pointer"
            >
              <Compass className="w-4 h-4 text-blue-400" />
              <span>Virtual Tour</span>
            </motion.button>
          </motion.div>

          {/* Micro Trust Indicators Strip */}
          <div className="mt-14 pt-8 border-t border-blue-950/70 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs text-stone-400">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
              Cambridge Assessment International Partner
            </span>
            <span className="hidden sm:inline text-blue-900">·</span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
              BISE & HEC Registered Charter
            </span>
            <span className="hidden sm:inline text-blue-900">·</span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              $2.4M Annual Merit & Need Scholarships
            </span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* EXECUTIVE INSTITUTIONAL GATEWAYS (POWERED BY GLASS ICONS)                 */}
      {/* ========================================================================= */}
      <section
        className="relative py-20 px-4 sm:px-6 lg:px-8 border-b border-blue-950 bg-gradient-to-b from-[#070E1C] via-[#091428] to-[#070E1C] overflow-hidden"
        aria-label="Institutional Gateways"
      >
        {/* Ambient atmospheric backdrop glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-500/30 text-amber-400 text-xs font-mono uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Encrypted Single Sign-On Infrastructure</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-stone-100 tracking-tight mb-3">
            Institutional Portals &{' '}
            <GradientText
              colors={['#60A5FA', '#93C5FD', '#F59E0B', '#FCD34D']}
              variant="conic"
              animationSpeed={7}
              glow={0.3}
              className="font-serif italic"
            >
              Academic Terminals
            </GradientText>
          </h2>

          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-stone-300 font-light leading-relaxed mb-10">
            Interactive, liquid-refraction glass gateways granting instant access to student records, guardian accounts, regent administration, and the 2027 admissions cycle.
          </p>

          {/* Interactive Physics Controls for GlassIcons */}
          <div className="mb-10 flex flex-wrap items-center justify-center gap-3 text-xs">
            <div className="inline-flex items-center gap-1.5 bg-[#070E1C]/80 border border-blue-900/60 rounded-xl px-3 py-1.5 backdrop-blur-md">
              <span className="text-stone-400 font-mono text-[11px]">Plate Physics:</span>
              {(['tilt', 'offset', 'circle', 'none'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setGlassPlate(mode)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono capitalize transition-colors cursor-pointer ${
                    glassPlate === mode
                      ? 'bg-amber-400 text-stone-950 font-bold shadow-md'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            <div className="inline-flex items-center gap-1.5 bg-[#070E1C]/80 border border-blue-900/60 rounded-xl px-3 py-1.5 backdrop-blur-md">
              <span className="text-stone-400 font-mono text-[11px]">Surface Response:</span>
              {(['lift', 'float', 'press'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setGlassHover(mode)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono capitalize transition-colors cursor-pointer ${
                    glassHover === mode
                      ? 'bg-blue-500 text-white font-bold shadow-md'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* GlassIcons Interactive Component Grid */}
          <div className="py-4">
            <GlassIcons
              items={portalGlassItems}
              size={84}
              gap={48}
              columns={5}
              roundness={0.65}
              refraction={0.85}
              bevel={0.6}
              dispersion={0.4}
              frost={0.25}
              shine={0.9}
              tint="#070E1C"
              tintOpacity={0.25}
              plate={glassPlate}
              hover={glassHover}
              tilt={28}
              spread={0.55}
              parallax={0.9}
              labels="always"
              theme="dark"
              intro={true}
              className="my-2"
            />
          </div>

          <p className="mt-8 text-[11px] font-mono text-stone-400">
            Hover, tilt, and press over glass plates to engage real-time liquid dispersion and 3D normal refraction.
          </p>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* TASK 2: PERSONALIZED PATHWAY SECTION                                      */}
      {/* ========================================================================= */}
      <section
        id="pathways"
        className="py-24 border-b border-blue-950 bg-[#070E1C] relative"
        aria-label="Personalized Pathways"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Kicker & Heading */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400 block mb-2">
              Personalized Orientation
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-100 tracking-tight">
              Where do you want to start?
            </h2>
            <p className="mt-3 text-sm text-stone-300 font-light leading-relaxed">
              Every member of our community walks a distinctive journey. Select your role to tailor admission guides, student tools, or alumni fellowship resources.
            </p>
          </div>

          {/* Three Interactive Pathway Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Card 1: Prospective Parent */}
            <div
              onClick={() => setSelectedRole('parent')}
              className={`cursor-pointer rounded-2xl border p-7 transition-all duration-300 relative flex flex-col justify-between group ${
                selectedRole === 'parent'
                  ? 'bg-blue-950/50 border-amber-400/80 shadow-2xl ring-1 ring-amber-400/30'
                  : 'bg-[#0B1528] border-blue-950 hover:border-blue-800 hover:bg-[#0E1A33]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                    <Users className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-900">
                    Cohort 2027
                  </span>
                </div>
                <h3 className="font-serif text-xl font-bold text-stone-100 mb-1 group-hover:text-amber-300 transition-colors">
                  Prospective Parent
                </h3>
                <span className="text-xs text-amber-400/90 font-medium block mb-3">
                  Early Years through Senior Dual Streams
                </span>
                <p className="text-xs text-stone-400 leading-relaxed mb-6 font-light">
                  Explore academic rigor, campus safety, tuition transparency, and how our dual Cambridge & Matric tracks prepare your child for world-class universities.
                </p>
              </div>

              <div className="pt-4 border-t border-blue-950 flex items-center justify-between text-xs font-semibold">
                <span className={selectedRole === 'parent' ? 'text-amber-300' : 'text-stone-400'}>
                  {selectedRole === 'parent' ? 'Active Pathway' : 'Select Pathway'}
                </span>
                <ArrowRight
                  className={`w-4 h-4 transition-transform ${
                    selectedRole === 'parent'
                      ? 'translate-x-1 text-amber-400'
                      : 'text-stone-500 group-hover:translate-x-1 group-hover:text-amber-400'
                  }`}
                />
              </div>
            </div>

            {/* Card 2: Current Student */}
            <div
              onClick={() => setSelectedRole('student')}
              className={`cursor-pointer rounded-2xl border p-7 transition-all duration-300 relative flex flex-col justify-between group ${
                selectedRole === 'student'
                  ? 'bg-blue-950/50 border-blue-400/80 shadow-2xl ring-1 ring-blue-400/30'
                  : 'bg-[#0B1528] border-blue-950 hover:border-blue-800 hover:bg-[#0E1A33]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-900">
                    LMS & Guilds
                  </span>
                </div>
                <h3 className="font-serif text-xl font-bold text-stone-100 mb-1 group-hover:text-blue-300 transition-colors">
                  Current Student
                </h3>
                <span className="text-xs text-blue-400/90 font-medium block mb-3">
                  Academic Command & Campus Life
                </span>
                <p className="text-xs text-stone-400 leading-relaxed mb-6 font-light">
                  Quick access to course syllabi, library archives, robotics hackathons, athletic schedules, and university counseling appointments.
                </p>
              </div>

              <div className="pt-4 border-t border-blue-950 flex items-center justify-between text-xs font-semibold">
                <span className={selectedRole === 'student' ? 'text-blue-300' : 'text-stone-400'}>
                  {selectedRole === 'student' ? 'Active Pathway' : 'Select Pathway'}
                </span>
                <ArrowRight
                  className={`w-4 h-4 transition-transform ${
                    selectedRole === 'student'
                      ? 'translate-x-1 text-blue-400'
                      : 'text-stone-500 group-hover:translate-x-1 group-hover:text-blue-400'
                  }`}
                />
              </div>
            </div>

            {/* Card 3: Alumni */}
            <div
              onClick={() => setSelectedRole('alumni')}
              className={`cursor-pointer rounded-2xl border p-7 transition-all duration-300 relative flex flex-col justify-between group ${
                selectedRole === 'alumni'
                  ? 'bg-blue-950/50 border-emerald-400/80 shadow-2xl ring-1 ring-emerald-400/30'
                  : 'bg-[#0B1528] border-blue-950 hover:border-blue-800 hover:bg-[#0E1A33]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                    <Award className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-900">
                    Fellowship
                  </span>
                </div>
                <h3 className="font-serif text-xl font-bold text-stone-100 mb-1 group-hover:text-emerald-300 transition-colors">
                  Alumni & Fellow
                </h3>
                <span className="text-xs text-emerald-400/90 font-medium block mb-3">
                  Lifelong Global Network
                </span>
                <p className="text-xs text-stone-400 leading-relaxed mb-6 font-light">
                  Stay connected with fellow graduates across 38 countries, mentor current scholars, attend reunions, and support university endowments.
                </p>
              </div>

              <div className="pt-4 border-t border-blue-950 flex items-center justify-between text-xs font-semibold">
                <span className={selectedRole === 'alumni' ? 'text-emerald-300' : 'text-stone-400'}>
                  {selectedRole === 'alumni' ? 'Active Pathway' : 'Select Pathway'}
                </span>
                <ArrowRight
                  className={`w-4 h-4 transition-transform ${
                    selectedRole === 'alumni'
                      ? 'translate-x-1 text-emerald-400'
                      : 'text-stone-500 group-hover:translate-x-1 group-hover:text-emerald-400'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Dynamic Pathway Showcase Tray */}
          <div className="p-8 rounded-2xl border border-blue-900/60 bg-[#0B1528] shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-blue-600/20 text-blue-300 border border-blue-500/30">
                    {currentPathway.badge}
                  </span>
                  <span className="text-xs text-stone-400 font-serif italic">
                    {currentPathway.tagline}
                  </span>
                </div>
                <h4 className="font-serif text-2xl font-bold text-stone-100">
                  {currentPathway.title}
                </h4>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
                  {currentPathway.description}
                </p>

                {/* Key Highlights */}
                <div className="pt-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 block mb-2">
                    Key Features for this Role
                  </span>
                  <ul className="space-y-2">
                    {currentPathway.keyHighlights.map((hl, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-stone-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons Tray */}
              <div className="lg:col-span-5 p-6 rounded-xl bg-[#070E1C] border border-blue-950 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-[11px] font-mono text-stone-400 uppercase tracking-wider block mb-1">
                    Recommended Next Steps
                  </span>
                  <h5 className="text-sm font-semibold text-stone-100 mb-3">
                    Fast-Track Gateway
                  </h5>
                </div>

                <div className="space-y-2.5">
                  <a
                    href={currentPathway.primaryAction.href}
                    onClick={(e) => {
                      if (currentPathway.primaryAction.href.startsWith('#portal')) {
                        e.preventDefault();
                        if (onOpenPortalModal) onOpenPortalModal();
                      } else if (currentPathway.primaryAction.href === '#admissions-apply') {
                        e.preventDefault();
                        if (onOpenApplyModal) onOpenApplyModal();
                        else if (onShowToast) onShowToast('Admissions Application opened.');
                      }
                    }}
                    className="w-full py-3 px-4 rounded-xl text-xs font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 transition-colors shadow-md flex items-center justify-center gap-2"
                  >
                    <span>{currentPathway.primaryAction.label}</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  {currentPathway.secondaryActions.map((sec, idx) => (
                    <a
                      key={idx}
                      href={sec.href}
                      onClick={(e) => {
                        if (sec.href === '#fee-schedule' || sec.href === '#book-tour') {
                          e.preventDefault();
                          setIsTourModalOpen(true);
                        } else if (sec.href.includes('portal')) {
                          e.preventDefault();
                          if (onOpenPortalModal) onOpenPortalModal();
                        } else if (onShowToast) {
                          e.preventDefault();
                          onShowToast(`Navigating to ${sec.label}...`);
                        }
                      }}
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-stone-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors flex items-center justify-between"
                    >
                      <span>{sec.label}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-stone-500" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* TASK 3: HORIZONTAL STORYTELLING BLOCK (SCROLL-LINKED ANIMATION)            */}
      {/* ========================================================================= */}
      <section
        ref={horizontalSectionRef}
        className="relative h-[300vh] bg-[#070E1C] border-b border-blue-950"
        aria-label="Campus Walkthrough Storytelling"
      >
        {/* Sticky Viewport Container */}
        <div className="sticky top-20 h-[88vh] overflow-hidden flex flex-col justify-between py-6">
          {/* Header Bar within Sticky Viewport */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-blue-950 shrink-0">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-widest text-blue-400">
                  Interactive Campus Walkthrough
                </span>
                <span className="text-stone-600">·</span>
                <span className="text-xs text-amber-400 font-mono">Scroll Down to Traverse</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-100 mt-1">
                A Physical Journey Through The Mount Uni
              </h2>
            </div>

            {/* Horizontal Scroll Progress Bar */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-stone-400 whitespace-nowrap">Campus Depth:</span>
              <div className="w-36 h-2 rounded-full bg-slate-900 border border-blue-950 overflow-hidden">
                <motion.div
                  style={{ width: progressPercent }}
                  className="h-full bg-amber-400 rounded-full"
                />
              </div>
            </div>
          </div>

          {/* Horizontally Translating Container of 4 Large Cards */}
          <div className="w-full overflow-hidden flex items-center flex-1 my-auto">
            <motion.div
              style={{ x: xTransform }}
              className="flex gap-8 pl-6 sm:pl-16 pr-16 w-max"
            >
              {STORY_CARDS.map((card) => (
                <div
                  key={card.id}
                  className={`w-[85vw] sm:w-[540px] lg:w-[620px] rounded-3xl border border-blue-900/60 bg-gradient-to-br ${card.gradient} p-8 sm:p-10 shadow-2xl flex flex-col justify-between shrink-0 relative overflow-hidden group`}
                >
                  {/* Subtle Background Icon Watermark */}
                  <div className="absolute -right-8 -bottom-8 opacity-5 text-white pointer-events-none transform rotate-12">
                    {card.icon === 'BookOpen' && <BookOpen className="w-64 h-64" />}
                    {card.icon === 'ShieldCheck' && <ShieldCheck className="w-64 h-64" />}
                    {card.icon === 'Trophy' && <Trophy className="w-64 h-64" />}
                    {card.icon === 'Cpu' && <Cpu className="w-64 h-64" />}
                  </div>

                  <div>
                    {/* Card Header */}
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-xs font-mono font-bold tracking-widest ${card.accentColor}`}>
                        {card.step}
                      </span>
                      <span className="text-[11px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-[#070E1C] border border-blue-950 text-stone-400">
                        {card.pillar}
                      </span>
                    </div>

                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-100 mb-2 leading-tight">
                      {card.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed mb-6">
                      {card.description}
                    </p>

                    {/* Metric Spotlight */}
                    <div className="p-4 rounded-xl bg-[#070E1C]/80 border border-blue-950 mb-6 flex items-center gap-4">
                      <span className="font-serif text-3xl sm:text-4xl font-bold text-amber-400 tabular-nums">
                        {card.metrics.value}
                      </span>
                      <span className="text-xs text-stone-300 font-medium leading-snug">
                        {card.metrics.label}
                      </span>
                    </div>

                    {/* Highlights */}
                    <ul className="space-y-2">
                      {card.highlights.map((h, i) => (
                        <li key={i} className="flex items-center gap-2.5 text-xs text-stone-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Card Action Link */}
                  <div className="pt-6 mt-6 border-t border-blue-950 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        if (card.id === 'academics' && onOpenMatrixModal) {
                          onOpenMatrixModal();
                        } else {
                          setIsTourModalOpen(true);
                        }
                      }}
                      className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                    >
                      <span>Explore {card.pillar.split('&')[0].trim()} Facilities</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[11px] font-mono text-stone-500">
                      The Mount Uni Quad
                    </span>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Bottom Milestone Stepper */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full shrink-0 pt-3 border-t border-blue-950 flex flex-wrap items-center justify-between text-xs text-stone-400">
            <div className="flex items-center gap-6 overflow-x-auto py-1">
              {STORY_CARDS.map((c, idx) => (
                <div key={c.id} className="flex items-center gap-2 whitespace-nowrap">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="font-mono text-[11px] text-stone-300 font-medium">
                    {c.pillar.split('&')[0].trim()}
                  </span>
                </div>
              ))}
            </div>
            <div className="hidden sm:block text-[11px] text-stone-500 font-mono">
              Continuous Campus Panorama
            </div>
          </div>
        </div>
      </section>

      {/* Virtual Tour Modal */}
      <VirtualTourModal
        isOpen={isTourModalOpen}
        onClose={() => setIsTourModalOpen(false)}
      />
    </div>
  );
};
