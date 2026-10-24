import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, BookOpen, Award, FileText, Layers } from 'lucide-react';

interface CurriculumMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultStream?: 'primary' | 'middle' | 'secondary';
}

export const CurriculumMatrixModal: React.FC<CurriculumMatrixModalProps> = ({
  isOpen,
  onClose,
  defaultStream = 'secondary',
}) => {
  const [activeStage, setActiveStage] = useState<'primary' | 'middle' | 'secondary'>(defaultStream);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="matrix-modal-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 8 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white border border-slate-200 max-w-4xl w-full rounded-2xl shadow-2xl text-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-900">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800 block">
                  Academic Stages & Subject Matrix (Classes 1–10)
                </span>
                <h3 id="matrix-modal-title" className="text-xl font-serif font-bold text-slate-900">
                  School Curriculum Outline
                </h3>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close curriculum matrix"
              className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-200/50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Selector */}
          <div className="px-6 py-3 border-b border-slate-200 bg-white flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveStage('primary')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeStage === 'primary'
                  ? 'bg-blue-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Primary School (Classes 1–5)
            </button>
            <button
              type="button"
              onClick={() => setActiveStage('middle')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeStage === 'middle'
                  ? 'bg-blue-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Middle School (Classes 6–8)
            </button>
            <button
              type="button"
              onClick={() => setActiveStage('secondary')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeStage === 'secondary'
                  ? 'bg-blue-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Secondary School (Classes 9–10)
            </button>
          </div>

          {/* Matrix Content Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {activeStage === 'primary' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200">
                  <h4 className="font-serif font-bold text-slate-900 text-sm mb-1">
                    Primary Stage (Classes 1 to 5) Overview
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Designed to instill foundational literacy, love for reading, number sense, observational science, and polite social values in young learners.
                  </p>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3">Subject</th>
                        <th className="p-3">Grade Range</th>
                        <th className="p-3">Periods / Week</th>
                        <th className="p-3">Learning Objectives</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="p-3 font-semibold text-slate-900">English Language</td>
                        <td className="p-3 text-slate-600">Classes 1–5</td>
                        <td className="p-3 text-slate-600">6</td>
                        <td className="p-3 text-slate-600">Phonics, vocabulary, story comprehension & sentence writing</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-slate-900">Urdu (اردو)</td>
                        <td className="p-3 text-slate-600">Classes 1–5</td>
                        <td className="p-3 text-slate-600">5</td>
                        <td className="p-3 text-slate-600">Reading fluency, spelling, short essays & handwriting</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-slate-900">Mathematics</td>
                        <td className="p-3 text-slate-600">Classes 1–5</td>
                        <td className="p-3 text-slate-600">6</td>
                        <td className="p-3 text-slate-600">Four operations, fractions, measurement & mental math</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-slate-900">General Science</td>
                        <td className="p-3 text-slate-600">Classes 1–5</td>
                        <td className="p-3 text-slate-600">4</td>
                        <td className="p-3 text-slate-600">Living things, matter, senses, weather & nature observations</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-slate-900">Social Studies & Ethics</td>
                        <td className="p-3 text-slate-600">Classes 1–5</td>
                        <td className="p-3 text-slate-600">3</td>
                        <td className="p-3 text-slate-600">Community, moral duties, cleanliness & environmental care</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeStage === 'middle' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
                  <h4 className="font-serif font-bold text-slate-900 text-sm mb-1">
                    Middle Stage (Classes 6 to 8) Overview
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Bridging foundational skills into disciplined academic thinking, structured sciences, algebra, geometry, computer skills, and history.
                  </p>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3">Subject</th>
                        <th className="p-3">Grade Range</th>
                        <th className="p-3">Periods / Week</th>
                        <th className="p-3">Learning Objectives</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="p-3 font-semibold text-slate-900">General Science</td>
                        <td className="p-3 text-slate-600">Classes 6–8</td>
                        <td className="p-3 text-slate-600">5</td>
                        <td className="p-3 text-slate-600">Physics, Chemistry & Biology foundational concepts & experiments</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-slate-900">Mathematics</td>
                        <td className="p-3 text-slate-600">Classes 6–8</td>
                        <td className="p-3 text-slate-600">6</td>
                        <td className="p-3 text-slate-600">Algebra, linear equations, geometry, ratios & percentages</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-slate-900">Computer Studies</td>
                        <td className="p-3 text-slate-600">Classes 6–8</td>
                        <td className="p-3 text-slate-600">3</td>
                        <td className="p-3 text-slate-600">Hardware, software, typing, internet safety & office tools</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-slate-900">English & Urdu</td>
                        <td className="p-3 text-slate-600">Classes 6–8</td>
                        <td className="p-3 text-slate-600">8 total</td>
                        <td className="p-3 text-slate-600">Grammar mastery, comprehension, letter writing & literature</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-slate-900">History & Geography</td>
                        <td className="p-3 text-slate-600">Classes 6–8</td>
                        <td className="p-3 text-slate-600">4</td>
                        <td className="p-3 text-slate-600">Regional history, physical geography, maps & civic systems</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeStage === 'secondary' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200">
                  <h4 className="font-serif font-bold text-slate-900 text-sm mb-1">
                    Secondary Stage (Classes 9 and 10) Overview
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Focused curriculum leading to Secondary School Certificate (SSC) Matriculation examinations. Students choose either Science Group or Humanities Group.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Science Group */}
                  <div className="p-4 rounded-xl border border-blue-200 bg-white shadow-2xs">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-900 uppercase">
                      Option A
                    </span>
                    <h5 className="font-serif font-bold text-slate-900 text-sm mt-1 mb-2">
                      Secondary Science Group
                    </h5>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                        <span>Physics (Theory + Practical Lab)</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                        <span>Chemistry (Theory + Practical Lab)</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                        <span>Biology OR Computer Science</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                        <span>Mathematics (Science Stream)</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                        <span>English, Urdu, Islamiat & Pak Studies</span>
                      </li>
                    </ul>
                  </div>

                  {/* Humanities Group */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 uppercase">
                      Option B
                    </span>
                    <h5 className="font-serif font-bold text-slate-900 text-sm mt-1 mb-2">
                      Secondary Humanities Group
                    </h5>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                        <span>General Science</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                        <span>General Mathematics</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                        <span>Civics & Educational Studies</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                        <span>English & Urdu Literature</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                        <span>Islamiat & Pakistan Studies</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Classes 1 through 10 · Academic Session 2026–2027
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg shadow-2xs transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
