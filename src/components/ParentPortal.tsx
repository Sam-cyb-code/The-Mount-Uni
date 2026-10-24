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
  School,
  X,
} from 'lucide-react';

interface ParentPortalProps {
  onLogout: () => void;
  guardianName?: string;
  onShowToast?: (msg: string) => void;
}

export const ParentPortal: React.FC<ParentPortalProps> = ({
  onLogout,
  guardianName = 'Tariq Mehmood',
  onShowToast,
}) => {
  const [showChallanModal, setShowChallanModal] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState<'term1' | 'term2'>('term1');

  const student = {
    name: 'Muhammad Ali Khan',
    rollNumber: 'SCH-2027-4028',
    grade: 'Class 9 (Secondary School)',
    stream: 'Secondary Science Group (Physics, Chem, Bio/Comp)',
    section: 'Section 9-A',
    attendancePercentage: 96.2,
    presentDays: 115,
    totalWorkingDays: 120,
    academicGpa: '89.4% (Grade A+ · Class Rank: 3rd of 38)',
  };

  const examSchedules = [
    {
      subject: 'Secondary Physics (Theory & Practicals)',
      code: 'PHY-09',
      date: 'Monday, Nov 16, 2026',
      time: '08:30 AM – 11:30 AM',
      venue: 'Main Examination Hall',
      seat: 'Row 3, Seat 14',
      status: 'Admit Slip Ready',
    },
    {
      subject: 'Mathematics (General Algebra & Geometry)',
      code: 'MTH-09',
      date: 'Thursday, Nov 19, 2026',
      time: '08:30 AM – 11:30 AM',
      venue: 'Main Examination Hall',
      seat: 'Row 3, Seat 14',
      status: 'Admit Slip Ready',
    },
    {
      subject: 'Chemistry (Organic & Practical Demonstration)',
      code: 'CHM-09',
      date: 'Monday, Nov 23, 2026',
      time: '08:30 AM – 11:30 AM',
      venue: 'Chemistry Science Laboratory',
      seat: 'Lab Bench 4',
      status: 'Admit Slip Ready',
    },
    {
      subject: 'Biology / Computer Science',
      code: 'BIO-09',
      date: 'Friday, Nov 27, 2026',
      time: '08:30 AM – 11:30 AM',
      venue: 'Computer & Science Wing',
      seat: 'Terminal 12',
      status: 'Lab Clearance Verified',
    },
  ];

  const handleDownloadChallan = () => {
    setShowChallanModal(true);
    if (onShowToast) {
      onShowToast('Fee Challan Voucher generated. Ready for printing.');
    }
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Top Banner & Guardian Profile */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold uppercase bg-blue-50 text-[#1B365D] border border-blue-200">
              Parent Portal · Classes 1 to 10
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Academic Session 2026–2027
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1B365D]">
            Welcome, {guardianName}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor attendance, term exam dates, and monthly fee challans for your child.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleDownloadChallan}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#1B365D] hover:bg-[#132742] transition-colors shadow-xs"
          >
            <Download className="w-4 h-4 text-amber-400" />
            Monthly Fee Voucher
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200"
          >
            <LogOut className="w-4 h-4 text-slate-500" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Student Profile Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        <div className="lg:col-span-8 p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1B365D] text-xl font-serif font-bold">
                MA
              </div>
              <div>
                <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider block">
                  Enrolled Student
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1B365D]">
                  {student.name}
                </h3>
                <span className="text-xs text-slate-500 font-mono">
                  Roll No: {student.rollNumber} · {student.section}
                </span>
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold self-start sm:self-auto">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Active Enrollment
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 text-xs">
            <div>
              <span className="text-slate-500 block text-[11px] mb-0.5">Current Class:</span>
              <span className="font-bold text-slate-900">{student.grade}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px] mb-0.5">Curriculum Group:</span>
              <span className="font-bold text-slate-900">Secondary Science</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px] mb-0.5">Term Attendance:</span>
              <span className="font-bold text-emerald-700 font-mono">{student.attendancePercentage}% ({student.presentDays}/{student.totalWorkingDays} days)</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px] mb-0.5">Term Cumulative:</span>
              <span className="font-bold text-[#1B365D] font-mono">{student.academicGpa}</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider block mb-1">
              Important Dates
            </span>
            <h4 className="font-serif text-base font-bold text-[#1B365D] mb-3">
              Upcoming School Events
            </h4>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-semibold text-slate-900 block">Parent-Teacher Meeting (PTM)</span>
                <span className="text-slate-500 text-[11px]">Saturday, Nov 14, 2026 · 09:00 AM – 01:00 PM</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-semibold text-slate-900 block">Annual Sports Day (Classes 1–10)</span>
                <span className="text-slate-500 text-[11px]">Thursday, Dec 10, 2026 · School Grounds</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>School Inquiries:</span>
            <span className="font-semibold text-[#1B365D]">Office Helpdesk</span>
          </div>
        </div>
      </div>

      {/* Examination Schedule Matrix */}
      <div className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-6 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider block">
              Mid-Term Assessments
            </span>
            <h3 className="font-serif text-lg font-bold text-[#1B365D]">
              Class 9 Mid-Term Examination Datesheet
            </h3>
          </div>

          <span className="text-xs text-slate-500">
            Reporting Time: 08:00 AM in Full Uniform
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Subject & Paper</th>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4">Hall / Venue</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {examSchedules.map((exam, i) => (
                <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900">{exam.subject}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-500">{exam.code}</td>
                  <td className="py-3.5 px-4 text-slate-700">{exam.date}</td>
                  <td className="py-3.5 px-4 text-slate-600">{exam.time}</td>
                  <td className="py-3.5 px-4 text-slate-600">{exam.venue} ({exam.seat})</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" />
                      {exam.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Challan Modal */}
      {showChallanModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowChallanModal(false)}
        >
          <div
            className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative text-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-2">
                <School className="w-5 h-5 text-[#1B365D]" />
                <h4 className="font-serif text-lg font-bold text-[#1B365D]">
                  Student Fee Challan Voucher
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowChallanModal(false)}
                className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2 mb-6">
              <div className="flex justify-between">
                <span className="text-slate-500">Student Name:</span>
                <span className="font-bold text-slate-900">{student.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Class & Roll No:</span>
                <span className="font-mono text-slate-900">{student.grade} ({student.rollNumber})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Billing Month:</span>
                <span className="text-slate-900 font-medium">November 2026</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Monthly Tuition:</span>
                <span className="font-mono text-slate-900">PKR 18,500</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Laboratory & Computer Fund:</span>
                <span className="font-mono text-slate-900">PKR 2,500</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-slate-900 text-sm">
                <span>Total Payable:</span>
                <span className="text-[#1B365D]">PKR 21,000</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#1B365D] hover:bg-[#132742] transition-colors shadow-sm"
              >
                <Printer className="w-4 h-4" />
                Print Voucher
              </button>
              <button
                type="button"
                onClick={() => setShowChallanModal(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
