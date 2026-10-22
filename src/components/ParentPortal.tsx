import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Users,
  GraduationCap,
  Calendar,
  Clock,
  Download,
  CheckCircle2,
  AlertCircle,
  FileText,
  Printer,
  Sparkles,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Building,
  Award,
  BookOpen,
} from 'lucide-react';

interface ParentPortalProps {
  onLogout: () => void;
  guardianName?: string;
  onShowToast?: (msg: string) => void;
}

export const ParentPortal: React.FC<ParentPortalProps> = ({
  onLogout,
  guardianName = 'Dr. Salman Hashmi',
  onShowToast,
}) => {
  const [showChallanModal, setShowChallanModal] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState<'term1' | 'term2'>('term1');

  const student = {
    name: 'Zayd Alexander Hashmi',
    rollNumber: 'MU-2027-4028',
    grade: 'Cambridge Advanced A-Levels (Year 12)',
    stream: 'CAIE Pre-Engineering & AI Track',
    house: 'Faraday House (Blue Crest)',
    attendancePercentage: 94.6,
    presentDays: 114,
    totalWorkingDays: 120,
    academicGpa: '3.94 / 4.0 (Grade Rank: 2nd of 94)',
  };

  const examSchedules = [
    {
      subject: 'Advanced Physics (Paper 4: Theory)',
      code: 'CAIE-9702',
      date: 'Monday, Nov 16, 2026',
      time: '09:00 AM – 11:00 AM',
      venue: 'Newton Examination Hall A',
      seat: 'A-42',
      status: 'Admit Card Issued',
    },
    {
      subject: 'Pure Mathematics 3 (Paper 3)',
      code: 'CAIE-9709',
      date: 'Thursday, Nov 19, 2026',
      time: '09:00 AM – 10:45 AM',
      venue: 'Ramanujan Memorial Hall',
      seat: 'B-18',
      status: 'Admit Card Issued',
    },
    {
      subject: 'Computer Science (Paper 3: Advanced Theory)',
      code: 'CAIE-9618',
      date: 'Monday, Nov 23, 2026',
      time: '01:30 PM – 03:00 PM',
      venue: 'Alan Turing Systems Suite',
      seat: 'T-09',
      status: 'Admit Card Issued',
    },
    {
      subject: 'Inorganic & Physical Chemistry (Paper 4)',
      code: 'CAIE-9701',
      date: 'Friday, Nov 27, 2026',
      time: '09:00 AM – 11:00 AM',
      venue: 'Faraday Main Hall',
      seat: 'F-31',
      status: 'Lab Clearance Done',
    },
  ];

  const handleDownloadChallan = () => {
    setShowChallanModal(true);
    if (onShowToast) {
      onShowToast('Official Fee Challan Voucher generated. Ready for print/PDF.');
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Top Banner & Guardian Profile */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-blue-950 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Verified Guardian Session
            </span>
            <span className="text-xs text-stone-400">The Mount Uni SIS Portal</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-100">
            Welcome, {guardianName}
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Monitoring Candidate Dossier for{' '}
            <strong className="text-amber-300">{student.name}</strong> ({student.rollNumber})
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleDownloadChallan}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 transition-all shadow-md shadow-amber-500/20"
          >
            <Download className="w-4 h-4 text-stone-950" />
            Download Fee Challan
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-stone-400 hover:text-white bg-[#0B1528] border border-blue-950 hover:border-rose-500/40"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Grid: Attendance & Quick Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Metric 1: Circular Attendance Percentage */}
        <div className="p-6 rounded-2xl bg-[#0B1528] border border-blue-950 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider block mb-1">
              Attendance Health
            </span>
            <h3 className="font-serif text-2xl font-bold text-stone-100">
              {student.attendancePercentage}%
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              {student.presentDays} Days Present / {student.totalWorkingDays} Working Days
            </p>
            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 mt-2 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Satisfies Cambridge Board 85% Mandate
            </span>
          </div>

          {/* Radial Ring Visual */}
          <div className="relative w-20 h-20 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.8"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-amber-400"
                strokeDasharray="94.6, 100"
                strokeWidth="3.8"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center font-mono font-bold text-xs text-stone-100">
              94%
            </div>
          </div>
        </div>

        {/* Metric 2: Academic GPA & Standing */}
        <div className="p-6 rounded-2xl bg-[#0B1528] border border-blue-950 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider block">
              Cumulative Merit Rank
            </span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-stone-100">
            {student.academicGpa.split('(')[0]}
          </h3>
          <p className="text-xs text-stone-300 mt-1">
            Standing: <strong className="text-amber-300">Dean's Honor Roll</strong>
          </p>
          <div className="flex items-center gap-1.5 mt-3 text-[11px] text-stone-400">
            <span className="px-2 py-0.5 rounded bg-[#070E1C] border border-blue-950">
              {student.house}
            </span>
          </div>
        </div>

        {/* Metric 3: Fee Status & Download Quick Trigger */}
        <div className="p-6 rounded-2xl bg-[#0B1528] border border-blue-950 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider block">
                Term Financial Standing
              </span>
              <FileText className="w-4 h-4 text-amber-400" />
            </div>
            <h3 className="font-serif text-xl font-bold text-stone-100">
              Challan Term 1 (2026/27)
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              Due Date: <span className="text-amber-300 font-mono">10 December 2026</span>
            </p>
          </div>

          <button
            type="button"
            onClick={handleDownloadChallan}
            className="w-full mt-4 py-2 px-3 rounded-xl bg-[#070E1C] border border-amber-500/30 text-amber-400 hover:bg-amber-400 hover:text-stone-950 font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            Generate Printable Challan
          </button>
        </div>
      </div>

      {/* Task 2: Upcoming Exam Schedules Section */}
      <div className="rounded-2xl bg-[#0B1528] border border-blue-950 p-6 sm:p-8 shadow-2xl mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-blue-950 gap-2">
          <div>
            <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider block mb-1">
              Mid-Term & Cambridge Mock Assessments
            </span>
            <h3 className="font-serif text-xl font-bold text-stone-100">
              Upcoming Examination Schedule (Term 1)
            </h3>
          </div>
          <span className="text-xs text-stone-400 font-mono">
            Candidate Seat Hall Matrix Verified
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-blue-950 text-stone-400 uppercase font-mono text-[10px]">
                <th className="py-3 px-3">Subject & Syllabus Paper</th>
                <th className="py-3 px-3">Paper Code</th>
                <th className="py-3 px-3">Scheduled Date</th>
                <th className="py-3 px-3">Session Time</th>
                <th className="py-3 px-3">Examination Venue</th>
                <th className="py-3 px-3">Seat Desk</th>
                <th className="py-3 px-3 text-right">Admit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-950/60 text-stone-300">
              {examSchedules.map((exam, idx) => (
                <tr key={idx} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3.5 px-3 font-semibold text-stone-100">
                    {exam.subject}
                  </td>
                  <td className="py-3.5 px-3 font-mono text-amber-400">
                    {exam.code}
                  </td>
                  <td className="py-3.5 px-3">{exam.date}</td>
                  <td className="py-3.5 px-3 font-mono text-stone-400">{exam.time}</td>
                  <td className="py-3.5 px-3">{exam.venue}</td>
                  <td className="py-3.5 px-3 font-mono font-bold text-stone-200">
                    {exam.seat}
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/60 border border-emerald-800 text-emerald-300">
                      {exam.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Task 2: Official Fee Challan Voucher Modal / Mock PDF */}
      {showChallanModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
          onClick={() => setShowChallanModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-stone-100 text-stone-900 rounded-2xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl max-h-[92vh] overflow-y-auto"
          >
            {/* Modal Controls */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-blue-900" />
                <div>
                  <h3 className="font-serif text-lg font-bold text-blue-950">
                    The Mount Uni — Official Fee Challan Voucher
                  </h3>
                  <span className="text-[11px] text-stone-600 font-mono">
                    Challan No: CH-2027-849201 · Barcode Encoded
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-900 text-white font-semibold text-xs hover:bg-blue-800 flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print / Save PDF
                </button>
                <button
                  type="button"
                  onClick={() => setShowChallanModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-stone-300 hover:bg-stone-400 text-stone-800 text-xs font-semibold"
                >
                  ✕ Close
                </button>
              </div>
            </div>

            {/* Simulated 3-Part Bank Challan: Bank Copy, Institute Copy, Student Copy */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[11px] font-sans">
              {['Bank Copy', 'Institution Copy', 'Guardian / Student Copy'].map((copyTitle) => (
                <div
                  key={copyTitle}
                  className="border-2 border-dashed border-stone-400 p-4 rounded-xl bg-white flex flex-col justify-between"
                >
                  <div>
                    <div className="text-center pb-2 mb-2 border-b border-stone-300">
                      <span className="font-bold text-xs font-serif uppercase tracking-wider block text-blue-950">
                        The Mount Uni
                      </span>
                      <span className="text-[10px] text-stone-500 font-mono uppercase">
                        {copyTitle}
                      </span>
                    </div>

                    <div className="space-y-1 mb-3 text-stone-700">
                      <div>
                        <strong>Roll No:</strong> {student.rollNumber}
                      </div>
                      <div>
                        <strong>Student:</strong> {student.name}
                      </div>
                      <div>
                        <strong>Class:</strong> {student.grade}
                      </div>
                      <div>
                        <strong>Issue Date:</strong> 01 Nov 2026
                      </div>
                      <div className="text-rose-700">
                        <strong>Due Date:</strong> 10 Dec 2026
                      </div>
                    </div>

                    <div className="border-t border-b border-stone-300 py-2 space-y-1 text-stone-800 mb-3">
                      <div className="flex justify-between">
                        <span>Tuition Fee (Q2):</span>
                        <span>PKR 78,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Laboratory & Science Levy:</span>
                        <span>PKR 12,500</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Executive Transport:</span>
                        <span>PKR 12,500</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Robotics Lab Guild:</span>
                        <span>PKR 6,500</span>
                      </div>
                      <div className="flex justify-between font-bold text-blue-950 border-t border-stone-300 pt-1">
                        <span>Net Payable:</span>
                        <span>PKR 109,500</span>
                      </div>
                    </div>

                    <p className="text-[9px] text-stone-500 leading-tight">
                      Payable at any HBL, Meezan, or Standard Chartered Bank branch nationwide, or via 1Link Bill ID 100849201.
                    </p>
                  </div>

                  <div className="mt-4 pt-2 border-t border-stone-300 flex justify-between text-[9px] text-stone-400 font-mono">
                    <span>Officer Stamp</span>
                    <span>Candidate Sign</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
