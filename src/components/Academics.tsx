import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  Cpu,
  Palette,
  Globe,
  Sparkles,
  Layers,
  ChevronRight,
  Clock,
  Award,
  Users,
  Search,
  CheckCircle2,
  FileText,
  FlaskConical,
} from 'lucide-react';
import { GradientText } from './GradientText';

export type CourseCategory = 'All' | 'STEM' | 'Arts' | 'Humanities';

export interface Course {
  id: string;
  code: string;
  title: string;
  category: CourseCategory;
  track: 'Cambridge O/A Level' | 'BISE Matric/FSc' | 'Dual Core' | 'Honors';
  department: string;
  leadFaculty: string;
  credits: number;
  prerequisites: string;
  description: string;
  topics: string[];
  labHours: string;
  featured?: boolean;
}

export const COURSES_CATALOG: Course[] = [
  {
    id: 'stem-ai-robotics',
    code: 'CS-401',
    title: 'Autonomous Robotics & Applied Machine Learning',
    category: 'STEM',
    track: 'Honors',
    department: 'Department of Computing & Advanced Systems',
    leadFaculty: 'Dr. Tariq Mansoor, PhD (Imperial)',
    credits: 4,
    prerequisites: 'Differential Calculus & Python Fundamentals',
    description: 'Hands-on embedded kinematics, neural network perception, ROS2 framework, and sensor fusion for robotic navigation.',
    topics: ['Computer Vision with OpenCV', 'Kinematics & Microcontrollers', 'Deep Learning Perception', 'Autonomous Rover Trials'],
    labHours: '6 hrs/week (Turing Systems Lab)',
    featured: true,
  },
  {
    id: 'stem-quantum-physics',
    code: 'PHY-350',
    title: 'Quantum Mechanics & Modern Laboratory Physics',
    category: 'STEM',
    track: 'Cambridge O/A Level',
    department: 'Institute of Physical Sciences',
    leadFaculty: 'Prof. Alistair Sterling, FRS',
    credits: 4,
    prerequisites: 'Advanced Level Physics & Pure Mathematics',
    description: 'Comprehensive study of wave-particle duality, Schrödinger formulations, atomic spectroscopy, and precision laser interferometry.',
    topics: ['Wave Packets & Operators', 'Zeeman Effect & Spectroscopy', 'Laser Optics Lab', 'Quantum Computing Foundations'],
    labHours: '4 hrs/week (Faraday Lab)',
  },
  {
    id: 'stem-molecular-bio',
    code: 'BIO-320',
    title: 'Cellular Biochemistry & Genetic Engineering',
    category: 'STEM',
    track: 'BISE Matric/FSc',
    department: 'Faculty of Life Sciences & Pre-Medicine',
    leadFaculty: 'Dr. Sophia Jahangir, FCPS',
    credits: 4,
    prerequisites: 'Biochemistry I & Organic Chemistry Lab',
    description: 'CRISPR-Cas9 gene editing simulations, recombinant DNA techniques, enzyme kinetics, and clinical pathology preparation for MDCAT aspirants.',
    topics: ['CRISPR & Gene Cloning', 'Protein Electrophoresis', 'Metabolic Pathways', 'Microbial Genetics'],
    labHours: '5 hrs/week (Pasteur Bio-Suite)',
    featured: true,
  },
  {
    id: 'stem-pure-math',
    code: 'MTH-410',
    title: 'Multivariable Calculus & Differential Manifolds',
    category: 'STEM',
    track: 'Dual Core',
    department: 'Department of Pure & Applied Mathematics',
    leadFaculty: 'Dr. Edward Vance, Cambridge',
    credits: 3,
    prerequisites: 'Single Variable Calculus & Linear Algebra',
    description: 'Rigorous vector analysis, Green and Stokes theorems, tensor introductions, and mathematical physics simulations.',
    topics: ['Differential Forms', 'Surface Integrals & Flux', 'Eigenvalue Theory', 'Boundary Value Problems'],
    labHours: '2 hrs/week (Wolfram Math Lab)',
  },
  {
    id: 'arts-digital-arch',
    code: 'ART-210',
    title: 'Architectural Design & Parametric Spatial Forms',
    category: 'Arts',
    track: 'Honors',
    department: 'School of Design & Spatial Arts',
    leadFaculty: 'Ar. Marianne Delacroix, Harvard GSD',
    credits: 3,
    prerequisites: 'Freehand Drafting or Portfolio Review',
    description: 'BIM modeling, computational generative structures, biomimicry in campus architecture, and physical laser-cut scale fabrication.',
    topics: ['Parametric Modeling (Rhino/Grasshopper)', 'Structural Tectonics', 'Materiality & Light', 'Urban Ecology'],
    labHours: '4 hrs/week (Zaha Hadid Studio)',
    featured: true,
  },
  {
    id: 'arts-symphonic',
    code: 'MUS-180',
    title: 'Symphonic Composition & Orchestral Conduct',
    category: 'Arts',
    track: 'Cambridge O/A Level',
    department: 'Conservatory of Music & Sonic Arts',
    leadFaculty: 'Maestro Julian Ross, Royal Academy',
    credits: 3,
    prerequisites: 'Grade 5 Theory or Instrumental Audition',
    description: 'Classical counterpoint, orchestration for 60-piece brass and string ensembles, contemporary film scoring, and choir direction.',
    topics: ['Four-Part Harmony', 'Orchestral Scoring', 'Logic Pro Audio Engineering', 'Live Conductor Rehearsals'],
    labHours: '3 hrs/week (Elgar Concert Hall)',
  },
  {
    id: 'arts-visual-media',
    code: 'ART-305',
    title: 'Documentary Cinematography & Visual Narrative',
    category: 'Arts',
    track: 'Dual Core',
    department: 'Media Studies & Screen Arts',
    leadFaculty: 'Kiran Raza, BAFTA Fellow',
    credits: 3,
    prerequisites: 'Visual Storytelling or Photography portfolio',
    description: 'Anamorphic lens optics, cinematic lighting design, non-linear editing in DaVinci Resolve, and investigative documentary fieldwork.',
    topics: ['Color Grading & ACES Color', 'Microphone Boom & Spatial Audio', 'Archival Research', 'Film Festival Submission'],
    labHours: '4 hrs/week (Mount Media Pavilion)',
  },
  {
    id: 'hum-diplomatic-law',
    code: 'LAW-315',
    title: 'Public International Law & Global Treaties',
    category: 'Humanities',
    track: 'Cambridge O/A Level',
    department: 'Department of Jurisprudence & Legal Studies',
    leadFaculty: 'Barrister Sarah H. Siddiqui, Lincoln’s Inn',
    credits: 4,
    prerequisites: 'Constitutional History or Introduction to Law',
    description: 'Maritime boundary disputes, Geneva conventions, international arbitration tribunals, and Moot Court simulation at The Hague standards.',
    topics: ['State Sovereignty & Jurisdiction', 'Human Rights Treaties', 'International Court of Justice Moots', 'Extradition Norms'],
    labHours: '2 hrs/week (Blackstone Moot Court)',
    featured: true,
  },
  {
    id: 'hum-world-lit',
    code: 'LIT-420',
    title: 'Comparative Post-Colonial Rhetoric & World Literature',
    category: 'Humanities',
    track: 'Honors',
    department: 'Faculty of Classical & World Literatures',
    leadFaculty: 'Dr. Raymond Thorne, Oxford',
    credits: 3,
    prerequisites: 'English Literature Grade B+ or higher',
    description: 'Textual analysis of South Asian, Francophone African, and Caribbean narratives, translation theory, and seminar defense papers.',
    topics: ['Subaltern Studies', 'Modernist Poetics', 'Dialectical Discourse', 'Archival Manuscripts'],
    labHours: 'Seminar Series (Bodleian Reading Room)',
  },
  {
    id: 'hum-political-econ',
    code: 'ECO-340',
    title: 'Macroeconomic Policy & Behavioral Game Theory',
    category: 'Humanities',
    track: 'BISE Matric/FSc',
    department: 'School of Economics & Public Policy',
    leadFaculty: 'Dr. Hamza Khurshid, LSE',
    credits: 4,
    prerequisites: 'Principles of Economics & Statistics',
    description: 'Nash equilibrium dynamics, sovereign debt restructuring, central banking monetary mechanisms, and econometric forecasting in Stata.',
    topics: ['Bayesian Game Formulations', 'Central Bank Open Market Ops', 'Poverty Alleviation Econometrics', 'Fiscal Policy Debates'],
    labHours: '3 hrs/week (Keynes Analytics Suite)',
  },
];

interface AcademicsProps {
  onOpenCurriculumMatrix?: () => void;
  onOpenApplication?: () => void;
}

export const Academics: React.FC<AcademicsProps> = ({
  onOpenCurriculumMatrix,
  onOpenApplication,
}) => {
  const [activeCategory, setActiveCategory] = useState<CourseCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const categories: CourseCategory[] = ['All', 'STEM', 'Arts', 'Humanities'];

  const filteredCourses = COURSES_CATALOG.filter((course) => {
    const matchesCategory =
      activeCategory === 'All' || course.category === activeCategory;
    const matchesSearch =
      searchQuery === '' ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.topics.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="academics-showcase" className="py-24 bg-[#070E1C] text-stone-100 border-b border-blue-950 relative overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 pb-6 border-b border-blue-950/80 gap-6">
          <div className="max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400 block mb-2">
              Curriculum Catalog & Departmental Modules
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-100">
              Academics of{' '}
              <GradientText
                colors={['#F59E0B', '#FDE047', '#60A5FA', '#3B82F6']}
                variant="flow"
                animationSpeed={6}
                glow={0.3}
                className="font-serif italic"
              >
                Uncompromising Rigor
              </GradientText>
            </h2>
            <p className="mt-3 text-sm sm:text-base text-stone-300 font-light leading-relaxed">
              Explore our interdisciplinary catalog bridging Cambridge International examinations, national BISE syllabi, and pre-university research labs. Filter by scholarly division below.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {onOpenCurriculumMatrix && (
              <button
                type="button"
                onClick={onOpenCurriculumMatrix}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-amber-300 bg-[#0B1528] border border-amber-500/30 hover:border-amber-400 hover:bg-amber-500/10 transition-all shadow-md"
              >
                <Layers className="w-4 h-4 text-amber-400" />
                Dual-Track Matrix (Matric / O-Level)
              </button>
            )}
            {onOpenApplication && (
              <button
                type="button"
                onClick={onOpenApplication}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 transition-all shadow-md shadow-amber-500/20"
              >
                Apply for 2027
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Task 1: Filter Chips & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-10">
          {/* Filter Chips with Animated Background */}
          <div
            role="tablist"
            aria-label="Course Category Filters"
            className="flex items-center p-1.5 rounded-2xl bg-[#0B1528] border border-blue-950 overflow-x-auto max-w-full"
          >
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveCategory(cat)}
                  className={`relative px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors shrink-0 z-10 ${
                    isActive ? 'text-stone-950 font-bold' : 'text-stone-400 hover:text-stone-100'
                  }`}
                >
                  {/* Framer Motion layoutId highlight pill */}
                  {isActive && (
                    <motion.div
                      layoutId="activeFilterChip"
                      className="absolute inset-0 bg-amber-400 rounded-xl -z-10 shadow-lg"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  {cat === 'All' && 'All Divisions'}
                  {cat === 'STEM' && 'STEM & Labs'}
                  {cat === 'Arts' && 'Fine & Spatial Arts'}
                  {cat === 'Humanities' && 'Humanities & Law'}
                </button>
              );
            })}
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search code, module, faculty..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0B1528] border border-blue-950 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white text-xs"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Task 1: Filterable Course Catalog with Framer Motion layout and layoutId */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredCourses.map((course) => (
              <motion.div
                key={course.id}
                layout
                layoutId={course.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25 }}
                className="group relative flex flex-col justify-between p-6 rounded-2xl bg-[#0B1528]/80 border border-blue-950 hover:border-amber-500/40 hover:bg-[#0D1930] transition-all duration-300 shadow-xl"
              >
                <div>
                  {/* Top Meta Header */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="font-mono text-xs font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">
                      {course.code}
                    </span>
                    <span className="text-[11px] font-medium text-stone-400 px-2 py-0.5 rounded bg-blue-950/60 border border-blue-900/40">
                      {course.track}
                    </span>
                  </div>

                  {/* Title & Department */}
                  <h3 className="font-serif text-lg font-bold text-stone-100 group-hover:text-amber-200 transition-colors mb-2 leading-snug">
                    {course.title}
                  </h3>
                  <p className="text-xs text-stone-400 font-mono mb-4">
                    {course.department}
                  </p>

                  {/* Body Overview */}
                  <p className="text-xs text-stone-300 font-light leading-relaxed mb-5">
                    {course.description}
                  </p>

                  {/* Key Topics Badges */}
                  <div className="mb-5">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-stone-400 block mb-2">
                      Syllabus Competencies
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {course.topics.map((topic) => (
                        <span
                          key={topic}
                          className="text-[11px] px-2 py-1 rounded-md bg-[#070E1C] border border-blue-950 text-stone-300"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Meta & Interaction */}
                <div className="pt-4 border-t border-blue-950/80 flex items-center justify-between text-xs text-stone-400">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400/80" />
                    <span>{course.labHours}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedCourse(course)}
                    className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 font-semibold group-hover:translate-x-0.5 transition-all"
                  >
                    Details
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredCourses.length === 0 && (
          <div className="p-12 text-center rounded-2xl bg-[#0B1528] border border-blue-950">
            <BookOpen className="w-8 h-8 text-stone-500 mx-auto mb-3" />
            <h4 className="text-base font-serif font-bold text-stone-200 mb-1">
              No matching modules found
            </h4>
            <p className="text-xs text-stone-400 mb-4">
              Try adjusting your search terms or select "All Divisions".
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveCategory('All');
                setSearchQuery('');
              }}
              className="px-4 py-2 text-xs font-semibold text-stone-950 bg-amber-400 rounded-lg hover:bg-amber-300"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Course Detail Modal */}
      {selectedCourse && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
          onClick={() => setSelectedCourse(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0B1528] border border-blue-850 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl text-stone-100 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-blue-950">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">
                  {selectedCourse.code}
                </span>
                <span className="text-xs font-semibold text-stone-300">
                  {selectedCourse.department}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCourse(null)}
                className="text-stone-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <h3 className="font-serif text-2xl font-bold text-stone-100 mb-2">
              {selectedCourse.title}
            </h3>
            <p className="text-xs text-amber-300 font-mono mb-4">
              Lead Academic: {selectedCourse.leadFaculty}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-[#070E1C] border border-blue-950 mb-6 text-xs">
              <div>
                <span className="text-[10px] font-mono text-stone-500 uppercase block">Curriculum Stream</span>
                <span className="font-semibold text-stone-200">{selectedCourse.track}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-stone-500 uppercase block">Modular Credits</span>
                <span className="font-semibold text-stone-200">{selectedCourse.credits} Credit Hours</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-stone-500 uppercase block">Laboratory Schedule</span>
                <span className="font-semibold text-stone-200">{selectedCourse.labHours}</span>
              </div>
            </div>

            <div className="space-y-4 text-xs text-stone-300 leading-relaxed mb-6 font-light">
              <div>
                <h4 className="font-semibold text-stone-100 mb-1">Prerequisites & Entry Standards:</h4>
                <p className="text-stone-400">{selectedCourse.prerequisites}</p>
              </div>
              <div>
                <h4 className="font-semibold text-stone-100 mb-1">Module Overview:</h4>
                <p>{selectedCourse.description}</p>
              </div>
              <div>
                <h4 className="font-semibold text-stone-100 mb-2">Core Topics & Benchmark Deliverables:</h4>
                <ul className="space-y-1.5 list-disc list-inside text-stone-300">
                  {selectedCourse.topics.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-blue-950">
              <button
                type="button"
                onClick={() => setSelectedCourse(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-300 hover:text-white bg-[#070E1C] border border-blue-950 rounded-lg"
              >
                Close
              </button>
              {onOpenCurriculumMatrix && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCourse(null);
                    onOpenCurriculumMatrix();
                  }}
                  className="px-4 py-2 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors"
                >
                  View Dual-Track Matrix
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
};
