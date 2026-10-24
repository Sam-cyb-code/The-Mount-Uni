import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  Cpu,
  Layers,
  ChevronRight,
  Clock,
  Award,
  Users,
  Search,
  CheckCircle2,
  FileText,
  FlaskConical,
  GraduationCap,
} from 'lucide-react';

export type SubjectCategory = 'All' | 'Primary (1–5)' | 'Middle (6–8)' | 'Secondary (9–10)';

export interface SchoolSubject {
  id: string;
  code: string;
  title: string;
  category: 'Primary (1–5)' | 'Middle (6–8)' | 'Secondary (9–10)';
  stream: string;
  gradeLevel: string;
  description: string;
  topics: string[];
  schedule: string;
  featured?: boolean;
}

export const SCHOOL_SUBJECTS: SchoolSubject[] = [
  // Primary Stage
  {
    id: 'primary-english',
    code: 'ENG-PRI',
    title: 'English Language & Reading Literacy',
    category: 'Primary (1–5)',
    stream: 'Core Primary Curriculum',
    gradeLevel: 'Classes 1 to 5',
    description: 'Developing phonics, vocabulary, guided reading comprehension, spelling rules, and expressive sentence construction.',
    topics: ['Phonics & Pronunciation', 'Guided Story Reading', 'Basic Sentence Grammar', 'Creative Handwriting'],
    schedule: '6 Periods / Week',
    featured: true,
  },
  {
    id: 'primary-math',
    code: 'MTH-PRI',
    title: 'Foundational Mathematics & Arithmetic',
    category: 'Primary (1–5)',
    stream: 'Core Primary Curriculum',
    gradeLevel: 'Classes 1 to 5',
    description: 'Building numerical confidence, place value, multiplication tables, mental arithmetic, fractions, and everyday word problems.',
    topics: ['Four Operations (+, -, ×, ÷)', 'Fractions & Decimals Basics', 'Measurement & Time', 'Introductory Shapes & Geometry'],
    schedule: '6 Periods / Week',
    featured: true,
  },
  {
    id: 'primary-science',
    code: 'SCI-PRI',
    title: 'General Science & Nature Discovery',
    category: 'Primary (1–5)',
    stream: 'Core Primary Curriculum',
    gradeLevel: 'Classes 1 to 5',
    description: 'Observation-based science introducing living things, plant lifecycles, states of matter, weather, and environmental care.',
    topics: ['Plants & Animal Habitats', 'Solids, Liquids & Air', 'The Solar System & Seasons', 'Health, Hygiene & Nutrition'],
    schedule: '4 Periods / Week',
  },
  {
    id: 'primary-urdu',
    code: 'URD-PRI',
    title: 'Urdu Language & Penmanship (اردو)',
    category: 'Primary (1–5)',
    stream: 'National Languages',
    gradeLevel: 'Classes 1 to 5',
    description: 'Mastery in Urdu alphabet letters (حروف تہجی), word formation, reading fluency, and polite conversational etiquette.',
    topics: ['حروف شناسی اور ملاوٹ', 'جملہ سازی اور املا', 'مختصر کہانیاں اور نظمیں', 'خوشخطی مشق'],
    schedule: '5 Periods / Week',
  },

  // Middle Stage
  {
    id: 'middle-general-science',
    code: 'SCI-MID',
    title: 'Integrated Science & Laboratory Concepts',
    category: 'Middle (6–8)',
    stream: 'Middle School Sciences',
    gradeLevel: 'Classes 6 to 8',
    description: 'Bridging general science into core fundamentals of Physics (motion, forces, energy), Chemistry (elements, compounds), and Biology (human systems).',
    topics: ['Cell Structure & Human Anatomy', 'Atoms, Molecules & Chemical Changes', 'Forces, Energy & Electric Circuits', 'Ecosystems & Water Cycle'],
    schedule: '5 Periods / Week (Includes Science Demos)',
    featured: true,
  },
  {
    id: 'middle-math',
    code: 'MTH-MID',
    title: 'Intermediate Mathematics & Algebra',
    category: 'Middle (6–8)',
    stream: 'Middle School Curriculum',
    gradeLevel: 'Classes 6 to 8',
    description: 'Transitioning from arithmetic to algebraic equations, ratios, percentages, commercial arithmetic, and geometrical proofs.',
    topics: ['Linear Equations & Algebraic Expressions', 'Ratio, Proportion & Percentage', 'Practical Geometry & Angles', 'Perimeter, Area & Volume'],
    schedule: '6 Periods / Week',
  },
  {
    id: 'middle-computer',
    code: 'CS-MID',
    title: 'Computer Studies & Digital Skills',
    category: 'Middle (6–8)',
    stream: 'Information Technology',
    gradeLevel: 'Classes 6 to 8',
    description: 'Computer hardware architecture, operating system navigation, typing speed, productivity software (Docs, Sheets), and basic logic.',
    topics: ['Hardware Components & Storage', 'Typing Skills & Word Processing', 'Internet Safety & Research Ethics', 'Algorithms & Flowcharts'],
    schedule: '3 Periods / Week (Computer Lab)',
  },
  {
    id: 'middle-social',
    code: 'SOC-MID',
    title: 'History, Geography & Social Studies',
    category: 'Middle (6–8)',
    stream: 'Social Sciences',
    gradeLevel: 'Classes 6 to 8',
    description: 'Study of historical civilizations, regional geography, natural resources, landforms, and civic responsibilities.',
    topics: ['Early Civilizations & Heritage', 'Physical Landscapes & Climate Zones', 'Natural Resources & Agriculture', 'Civics & Community Rights'],
    schedule: '4 Periods / Week',
  },

  // Secondary Stage (Classes 9–10)
  {
    id: 'sec-physics',
    code: 'PHY-SEC',
    title: 'Secondary Physics (Theory & Practicals)',
    category: 'Secondary (9–10)',
    stream: 'Science Group (Matriculation)',
    gradeLevel: 'Classes 9 & 10',
    description: 'Comprehensive preparation for secondary board examinations covering mechanics, thermal physics, sound, light optics, and electricity.',
    topics: ['Kinematics & Newton’s Laws', 'Work, Energy & Power', 'Reflection & Refraction of Light', 'Current Electricity & Magnetism'],
    schedule: '5 Periods / Week + Lab Practicals',
    featured: true,
  },
  {
    id: 'sec-chemistry',
    code: 'CHM-SEC',
    title: 'Secondary Chemistry (Theory & Practicals)',
    category: 'Secondary (9–10)',
    stream: 'Science Group (Matriculation)',
    gradeLevel: 'Classes 9 & 10',
    description: 'Fundamental chemical principles, atomic structure, periodic table classification, chemical bonding, acids/bases, and laboratory tests.',
    topics: ['Atomic Models & Electronic Configuration', 'Chemical Bonds & Formulas', 'Acids, Bases & Salts', 'Electrochemistry & Solutions'],
    schedule: '5 Periods / Week + Lab Practicals',
  },
  {
    id: 'sec-biology',
    code: 'BIO-SEC',
    title: 'Secondary Biology',
    category: 'Secondary (9–10)',
    stream: 'Science Group (Bio Option)',
    gradeLevel: 'Classes 9 & 10',
    description: 'Cell biology, human physiology, respiration, transport mechanisms, genetics introduction, and dissection/microscopy practicals.',
    topics: ['Cellular Organization & Tissues', 'Enzymes & Bioenergetics', 'Human Circulation & Respiratory System', 'Reproduction & Inheritance Basics'],
    schedule: '5 Periods / Week + Lab Practicals',
  },
  {
    id: 'sec-computer',
    code: 'CS-SEC',
    title: 'Secondary Computer Science',
    category: 'Secondary (9–10)',
    stream: 'Science Group (CS Option)',
    gradeLevel: 'Classes 9 & 10',
    description: 'Computer fundamentals, binary data representation, logic gates, operating systems, and beginner programming logic.',
    topics: ['Data Representation & Number Systems', 'Boolean Logic & Truth Tables', 'Computer Software & Network Basics', 'Introductory Programming Constructs'],
    schedule: '5 Periods / Week + Practical Lab',
  },
  {
    id: 'sec-math',
    code: 'MTH-SEC',
    title: 'Secondary Mathematics (Science & General)',
    category: 'Secondary (9–10)',
    stream: 'Core Secondary Requirement',
    gradeLevel: 'Classes 9 & 10',
    description: 'Matrices, logarithms, algebraic manipulation, quadratic equations, trigonometry, and circle geometry theorems for board examinations.',
    topics: ['Matrices & Determinants', 'Logarithms & Scientific Notation', 'Algebraic Formulas & Factorization', 'Geometry Theorems & Trigonometry'],
    schedule: '6 Periods / Week',
    featured: true,
  },
  {
    id: 'sec-humanities',
    code: 'HUM-SEC',
    title: 'Humanities & General Subjects',
    category: 'Secondary (9–10)',
    stream: 'Humanities Group',
    gradeLevel: 'Classes 9 & 10',
    description: 'General Science, General Mathematics, Civics, Education, English, Urdu, Islamiat, and Pakistan Studies.',
    topics: ['Everyday Science & Technology', 'Practical Arithmetic & Business Math', 'Constitution & Civic Duties', 'Pakistan Studies & History'],
    schedule: 'Full Weekly Curriculum',
  },
];

export interface AcademicsProps {
  onOpenCurriculumMatrix?: () => void;
  onOpenApplication?: () => void;
}

export const Academics: React.FC<AcademicsProps> = ({
  onOpenCurriculumMatrix,
  onOpenApplication,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<SubjectCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubject, setActiveSubject] = useState<SchoolSubject | null>(null);

  const filteredSubjects = SCHOOL_SUBJECTS.filter((subject) => {
    const matchesCategory =
      selectedCategory === 'All' || subject.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      subject.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.gradeLevel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="academics-catalog" className="w-full bg-[#FBF9F5] py-16 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-bold uppercase tracking-wider mb-3">
            <GraduationCap className="w-4 h-4 text-blue-700" />
            <span>Academic Curriculum · Classes 1 to 10</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Comprehensive Subject Offerings
          </h2>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            From early literacy and numbers in Class 1 to secondary board examination preparation in Class 10, our curriculum ensures thorough understanding and steady academic progress.
          </p>
        </div>

        {/* Filter Controls (Segmented Buttons) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200">
            {(['All', 'Primary (1–5)', 'Middle (6–8)', 'Secondary (9–10)'] as SubjectCategory[]).map(
              (cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-white text-blue-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search subjects or grade..."
              className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-2xs"
            />
          </div>
        </div>

        {/* Grid of School Subjects */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjects.map((subject) => (
            <div
              key={subject.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between text-left group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                    {subject.code}
                  </span>
                  <span className="text-xs text-blue-900 font-bold">
                    {subject.gradeLevel}
                  </span>
                </div>

                <h3 className="font-serif text-lg font-bold text-slate-900 group-hover:text-blue-900 transition-colors mb-2">
                  {subject.title}
                </h3>

                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                  {subject.stream}
                </span>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {subject.description}
                </p>

                {/* Topics List */}
                <div className="pt-3 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-2">
                    Key Topics Covered:
                  </span>
                  <ul className="space-y-1 text-xs text-slate-600">
                    {subject.topics.map((t, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                        <span className="truncate">{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500 font-medium">
                  {subject.schedule}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveSubject(subject)}
                  className="font-bold text-blue-900 hover:text-blue-700 underline underline-offset-2 cursor-pointer"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredSubjects.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <p className="text-sm text-slate-500">
              No subjects found matching "{searchQuery}".
            </p>
          </div>
        )}

        {/* Detailed Subject Modal */}
        {activeSubject && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setActiveSubject(null)}
          >
            <div
              className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl text-left"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
                <div>
                  <span className="text-xs font-bold text-blue-900 font-mono">
                    {activeSubject.code} · {activeSubject.gradeLevel}
                  </span>
                  <h4 className="font-serif text-xl font-bold text-slate-900 mt-1">
                    {activeSubject.title}
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveSubject(null)}
                  className="text-slate-400 hover:text-slate-700 text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {activeSubject.description}
              </p>

              <div className="mb-4">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
                  Complete Topic Outline:
                </span>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {activeSubject.topics.map((t, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 mb-6">
                <span className="font-semibold text-slate-800 block">Class Schedule:</span>
                <span>{activeSubject.schedule} with regular assessment tests and term exams.</span>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveSubject(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
