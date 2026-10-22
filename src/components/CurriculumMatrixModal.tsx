import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, BookOpen, Award, FileText, ExternalLink, Sparkles } from 'lucide-react';

interface CurriculumMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultStream?: 'cambridge' | 'matric' | 'fsc';
}

export const CurriculumMatrixModal: React.FC<CurriculumMatrixModalProps> = ({
  isOpen,
  onClose,
  defaultStream = 'cambridge',
}) => {
  const [activeStream, setActiveStream] = useState<'cambridge' | 'matric' | 'fsc'>(defaultStream);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="matrix-modal-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#0B1528] border border-blue-900/60 max-w-4xl w-full rounded-2xl shadow-2xl text-stone-100 overflow-hidden flex flex-col max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-blue-950 bg-[#070E1C]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-blue-400 block">
                  Senior School Dual-Track Syllabus & Criteria
                </span>
                <h3 id="matrix-modal-title" className="text-xl font-serif font-bold text-stone-100">
                  Curriculum & Subject Elective Matrix
                </h3>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close curriculum matrix"
              className="p-2 text-stone-400 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stream Selector Tabs */}
          <div className="px-6 pt-4 pb-2 bg-[#0B1528] border-b border-blue-950">
            <div className="flex items-center gap-2 p-1 bg-[#070E1C] rounded-xl border border-blue-950 max-w-xl">
              <button
                type="button"
                onClick={() => setActiveStream('cambridge')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                  activeStream === 'cambridge'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Cambridge O & A Levels
              </button>
              <button
                type="button"
                onClick={() => setActiveStream('matric')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                  activeStream === 'matric'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                BISE Matriculation (Grades 9–10)
              </button>
              <button
                type="button"
                onClick={() => setActiveStream('fsc')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                  activeStream === 'fsc'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                FSc Pre-Medical & Pre-Engineering
              </button>
            </div>
          </div>

          {/* Matrix Content Body */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
            {activeStream === 'cambridge' && (
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-900/50 flex items-start justify-between">
                  <div>
                    <span className="font-semibold text-stone-100 block text-sm mb-1">
                      Cambridge International Qualifications (IGCSE, O-Level & Advanced A-Level)
                    </span>
                    <p className="text-stone-300 leading-relaxed text-xs">
                      Awarded directly by Cambridge Assessment International Education (CAIE, UK). Universally recognized by Harvard, Oxford, Cambridge, and global Ivy League / Russell Group institutions.
                    </p>
                  </div>
                  <span className="shrink-0 px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold bg-blue-600/20 text-blue-300 border border-blue-500/40 ml-4">
                    CAIE Accredited
                  </span>
                </div>

                {/* Subject Matrix Table */}
                <div className="rounded-xl border border-blue-950 overflow-hidden bg-[#070E1C]">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-blue-950 bg-blue-950/30 text-stone-300 font-mono text-[11px] uppercase tracking-wider">
                        <th className="py-3 px-4">Subject Group</th>
                        <th className="py-3 px-4">Compulsory Courses</th>
                        <th className="py-3 px-4">Elective Specializations</th>
                        <th className="py-3 px-4">Grading & Assessment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-blue-950/60 text-stone-300">
                      <tr>
                        <td className="py-3 px-4 font-semibold text-stone-100">Sciences Stream</td>
                        <td className="py-3 px-4">English Language, Mathematics, Urdu, Islamiat, Pakistan Studies</td>
                        <td className="py-3 px-4">Physics, Chemistry, Biology, Further Maths, Computer Science</td>
                        <td className="py-3 px-4">Grades A* to E with Component Weighting (Papers 1, 2, 4 & Practical/Alternative to Practical)</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-semibold text-stone-100">Economics & Humanities</td>
                        <td className="py-3 px-4">English Literature, Global Perspectives, World History</td>
                        <td className="py-3 px-4">Economics, Accounting, Business Studies, Sociology, Psychology, Media Studies</td>
                        <td className="py-3 px-4">Rigorous essay critique, case analysis, statistical data interpretation, external CAIE grading</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-semibold text-stone-100">University Placement</td>
                        <td className="py-3 px-4">SAT / IELTS / UCAT Preparation Core</td>
                        <td className="py-3 px-4">Independent Research Project, EPQ (Extended Project Qualification), Model UN Fellowship</td>
                        <td className="py-3 px-4">Dedicated Ivy League & UCAS placement counseling with personalized letters of recommendation</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeStream === 'matric' && (
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-900/50 flex items-start justify-between">
                  <div>
                    <span className="font-semibold text-stone-100 block text-sm mb-1">
                      Secondary School Certificate (Matriculation · Grades 9 & 10)
                    </span>
                    <p className="text-stone-300 leading-relaxed text-xs">
                      Administered under the Board of Intermediate and Secondary Education (BISE). Tailored for solid national foundation, military colleges, and high-merit board standings.
                    </p>
                  </div>
                  <span className="shrink-0 px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 ml-4">
                    BISE Registered
                  </span>
                </div>

                <div className="rounded-xl border border-blue-950 overflow-hidden bg-[#070E1C]">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-blue-950 bg-blue-950/30 text-stone-300 font-mono text-[11px] uppercase tracking-wider">
                        <th className="py-3 px-4">Track</th>
                        <th className="py-3 px-4">Prescribed Subjects</th>
                        <th className="py-3 px-4">Laboratory Practicals</th>
                        <th className="py-3 px-4">Annual Board Exam</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-blue-950/60 text-stone-300">
                      <tr>
                        <td className="py-3 px-4 font-semibold text-stone-100">Science Group (Biology)</td>
                        <td className="py-3 px-4">English, Urdu, Islamiyat, Pak Studies, Mathematics, Physics, Chemistry, Biology</td>
                        <td className="py-3 px-4">Structured apparatus experiments: titration, optics, biological slides</td>
                        <td className="py-3 px-4">Part I (Grade 9) & Part II (Grade 10) total 1100 marks; Mount Uni students maintain 92%+ averages</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-semibold text-stone-100">Science Group (Computer)</td>
                        <td className="py-3 px-4">English, Urdu, Islamiyat, Pak Studies, Mathematics, Physics, Chemistry, Computer Science</td>
                        <td className="py-3 px-4">Coding in C/C++, database normalization, algorithmic flowcharting</td>
                        <td className="py-3 px-4">Total 1100 marks; gateway to ICS and software engineering degrees</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeStream === 'fsc' && (
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-900/50 flex items-start justify-between">
                  <div>
                    <span className="font-semibold text-stone-100 block text-sm mb-1">
                      Higher Secondary School Certificate (FSc Intermediate · Grades 11 & 12)
                    </span>
                    <p className="text-stone-300 leading-relaxed text-xs">
                      The benchmark qualification for national medical colleges (MDCAT/UHS/NUMS) and premier engineering institutes (NUST, GIKI, UET).
                    </p>
                  </div>
                  <span className="shrink-0 px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold bg-amber-600/20 text-amber-300 border border-amber-500/40 ml-4">
                    MDCAT & ECAT Core
                  </span>
                </div>

                <div className="rounded-xl border border-blue-950 overflow-hidden bg-[#070E1C]">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-blue-950 bg-blue-950/30 text-stone-300 font-mono text-[11px] uppercase tracking-wider">
                        <th className="py-3 px-4">Specialization</th>
                        <th className="py-3 px-4">Key Disciplines</th>
                        <th className="py-3 px-4">Entrance Test Alignment</th>
                        <th className="py-3 px-4">Laboratory Facilities</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-blue-950/60 text-stone-300">
                      <tr>
                        <td className="py-3 px-4 font-semibold text-stone-100">FSc Pre-Medical</td>
                        <td className="py-3 px-4">Biology, Chemistry, Physics, English, Urdu, Islamic/Pak Studies</td>
                        <td className="py-3 px-4">Integrated MDCAT drills, past-paper workshops, medical simulation clinic</td>
                        <td className="py-3 px-4">Advanced histology, molecular biology, organic synthesis benches</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-semibold text-stone-100">FSc Pre-Engineering</td>
                        <td className="py-3 px-4">Mathematics, Physics, Chemistry, English, Urdu, Islamic/Pak Studies</td>
                        <td className="py-3 px-4">ECAT, NET (NUST), and FAST entrance preparation cohorts</td>
                        <td className="py-3 px-4">Physics mechanics tracks, electronic breadboarding, chemical analysis</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 bg-[#070E1C] border-t border-blue-950 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-stone-400 text-xs">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Full equivalence certificates (IBCC) provided to all graduating students.</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-stone-300 hover:text-white bg-slate-900 border border-slate-800"
              >
                Close Matrix
              </button>
              <a
                href="#admissions-apply"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-xs font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 transition-colors shadow-md"
              >
                Apply for Senior Stream 2027
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
