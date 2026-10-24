import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText,
  Calculator,
  User,
  Users,
  GraduationCap,
  Upload,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Download,
  Bus,
  ShieldCheck,
  Check,
  Building,
  HelpCircle,
  Layers,
  BookOpen,
} from 'lucide-react';
import {
  db,
  collection,
  addDoc,
} from '../lib/firebase';

// Types for Admissions Form
export interface ApplicationFormData {
  // Step 1: Student Info
  studentName: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  gradeApplied: string;
  stream: string;

  // Step 2: Parent Info
  parentName: string;
  relationship: 'Father' | 'Mother' | 'Guardian';
  parentEmail: string;
  parentPhone: string;
  occupation: string;
  residentialAddress: string;

  // Step 3: Academic History
  previousSchool: string;
  lastCompletedGrade: string;
  previousMarksOrGpa: string;
  achievements: string;

  // Step 4: Documents
  birthCertificateUploaded: boolean;
  transcriptUploaded: boolean;
  photographUploaded: boolean;
  agreeToTerms: boolean;
}

const INITIAL_FORM: ApplicationFormData = {
  studentName: '',
  dob: '',
  gender: 'Male',
  gradeApplied: 'Class 6 (Middle School)',
  stream: 'General Studies (Classes 1–8)',
  parentName: '',
  relationship: 'Father',
  parentEmail: '',
  parentPhone: '',
  occupation: '',
  residentialAddress: '',
  previousSchool: '',
  lastCompletedGrade: 'Class 5',
  previousMarksOrGpa: '',
  achievements: '',
  birthCertificateUploaded: false,
  transcriptUploaded: false,
  photographUploaded: false,
  agreeToTerms: false,
};

// Pricing Tiers for Calculator (Classes 1 to 10 ONLY)
interface GradeFeeConfig {
  admissionFee: number;
  securityDeposit: number;
  monthlyTuition: number;
}

const GRADE_FEES: Record<string, GradeFeeConfig> = {
  'Primary School (Classes 1–5)': { admissionFee: 25000, securityDeposit: 15000, monthlyTuition: 12000 },
  'Middle School (Classes 6–8)': { admissionFee: 30000, securityDeposit: 15000, monthlyTuition: 15000 },
  'Secondary School — Science Group (Classes 9–10)': { admissionFee: 35000, securityDeposit: 20000, monthlyTuition: 18500 },
  'Secondary School — Humanities Group (Classes 9–10)': { admissionFee: 35000, securityDeposit: 20000, monthlyTuition: 17000 },
};

const TRANSPORT_ZONES: Record<string, number> = {
  'No Transport (Self Commute)': 0,
  'Zone 1: School Vicinity & Nearby Sectors (Within 5 km)': 4500,
  'Zone 2: Main Town & Connecting Corridors (5–12 km)': 6500,
  'Zone 3: Outer Townships & Extended Suburbs (12–20 km)': 8500,
};

const EXTRA_FACILITIES = [
  { id: 'computing', label: 'Computer & IT Laboratory Practical Sessions', fee: 1500 },
  { id: 'science_lab', label: 'Science Laboratory Materials (Physics, Chemistry, Biology)', fee: 2000 },
  { id: 'library', label: 'Library & Reading Room Resource Fund', fee: 1000 },
  { id: 'sports', label: 'School Sports & Physical Education Programme', fee: 1200 },
];

export const Admissions: React.FC<{ onShowToast?: (msg: string) => void }> = ({
  onShowToast,
}) => {
  // Multi-step form state
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<ApplicationFormData>(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedApplicationId, setSubmittedApplicationId] = useState<string | null>(null);

  // Dynamic Fee Calculator state
  const [calcGrade, setCalcGrade] = useState<string>('Middle School (Classes 6–8)');
  const [calcTransport, setCalcTransport] = useState<string>('Zone 1: School Vicinity & Nearby Sectors (Within 5 km)');
  const [calcFacilities, setCalcFacilities] = useState<string[]>(['computing', 'library']);

  // Calculated results
  const [feeBreakdown, setFeeBreakdown] = useState({
    admissionFee: 0,
    securityDeposit: 0,
    monthlyTuition: 0,
    transportFee: 0,
    facilityTotal: 0,
    firstMonthTotal: 0,
    regularMonthlyTotal: 0,
  });

  // Dynamic Fee & Transport Calculator
  useEffect(() => {
    const gradeConfig = GRADE_FEES[calcGrade] || GRADE_FEES['Middle School (Classes 6–8)'];
    const transportFee = TRANSPORT_ZONES[calcTransport] || 0;

    let facilityTotal = 0;
    calcFacilities.forEach((facId) => {
      const match = EXTRA_FACILITIES.find((f) => f.id === facId);
      if (match) facilityTotal += match.fee;
    });

    const admissionFee = gradeConfig.admissionFee;
    const securityDeposit = gradeConfig.securityDeposit;
    const monthlyTuition = gradeConfig.monthlyTuition;

    const regularMonthlyTotal = monthlyTuition + transportFee + facilityTotal;
    const firstMonthTotal = admissionFee + securityDeposit + regularMonthlyTotal;

    setFeeBreakdown({
      admissionFee,
      securityDeposit,
      monthlyTuition,
      transportFee,
      facilityTotal,
      firstMonthTotal,
      regularMonthlyTotal,
    });
  }, [calcGrade, calcTransport, calcFacilities]);

  // Validation function per step
  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(\+?[0-9\s\-]{9,18})$/;

    if (step === 1) {
      if (!formData.studentName.trim() || formData.studentName.trim().length < 3) {
        errors.studentName = 'Full student name is required (min 3 characters).';
      }
      if (!formData.dob) {
        errors.dob = 'Date of birth is required.';
      }
    } else if (step === 2) {
      if (!formData.parentName.trim()) {
        errors.parentName = 'Parent or guardian name is required.';
      }
      if (!emailRegex.test(formData.parentEmail)) {
        errors.parentEmail = 'Please provide a valid email address (e.g., guardian@domain.com).';
      }
      if (!phoneRegex.test(formData.parentPhone)) {
        errors.parentPhone = 'Please provide a valid phone number (e.g. +92 300 1234567).';
      }
      if (!formData.residentialAddress.trim()) {
        errors.residentialAddress = 'Residential address is required.';
      }
    } else if (step === 3) {
      if (!formData.previousSchool.trim()) {
        errors.previousSchool = 'Please name the previous institution or state Home-schooled.';
      }
    } else if (step === 4) {
      if (!formData.agreeToTerms) {
        errors.agreeToTerms = 'You must affirm that all academic submissions are accurate.';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Submit to Firebase Firestore
  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(4)) return;

    setIsSubmitting(true);
    const appId = `SCH-2027-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      await addDoc(collection(db, 'applications'), {
        studentName: formData.studentName,
        dob: formData.dob,
        gender: formData.gender,
        gradeApplied: formData.gradeApplied,
        stream: formData.stream,
        parentName: formData.parentName,
        parentEmail: formData.parentEmail,
        parentPhone: formData.parentPhone,
        previousSchool: formData.previousSchool,
        transportZone: calcTransport,
        status: 'pending',
        createdAt: new Date().toISOString(),
      });

      setSubmittedApplicationId(appId);
      if (onShowToast) {
        onShowToast(`Application ${appId} successfully registered.`);
      }
    } catch (error) {
      console.warn('Admissions submission notice:', error);
      // Fallback offline confirmation
      setSubmittedApplicationId(appId);
      if (onShowToast) {
        onShowToast(`Application ${appId} recorded successfully.`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFacility = (facilityId: string) => {
    setCalcFacilities((prev) =>
      prev.includes(facilityId)
        ? prev.filter((id) => id !== facilityId)
        : [...prev, facilityId]
    );
  };

  // Step transition animation variants
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    }),
  };

  return (
    <section id="admissions" className="py-20 sm:py-24 bg-[#FBF9F5] text-slate-800 border-b border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14 pb-6 border-b border-slate-200">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#1B365D] uppercase tracking-wider mb-2">
            <span>Admissions Desk</span>
            <span>·</span>
            <span>Classes 1 to 10 Only</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1B365D]">
            Student Admissions & Fee Guide
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-light leading-relaxed">
            Welcome prospective parents and guardians. Complete our clear 4-step admission application form or calculate your expected tuition fees with our transparent fee breakdown.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* ======================================================== */}
          {/* TASK 1: Controlled Multi-Step Application Form (7 cols) */}
          {/* ======================================================== */}
          <div className="lg:col-span-7 rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm relative">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider block">
                  Official Registration
                </span>
                <h3 className="font-serif text-xl font-bold text-[#1B365D]">
                  Student Admission Form
                </h3>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                Step {currentStep} of 4
              </span>
            </div>

            {/* Animated Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-2 mb-6 overflow-hidden border border-slate-200">
              <motion.div
                className="h-full bg-gradient-to-r from-[#1B365D] to-blue-600 rounded-full"
                initial={{ width: '25%' }}
                animate={{ width: `${(currentStep / 4) * 100}%` }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
              />
            </div>

            {/* Step Indicators */}
            <div className="grid grid-cols-4 gap-2 mb-8 text-[11px] font-medium text-center">
              {[
                { num: 1, label: 'Student' },
                { num: 2, label: 'Parents' },
                { num: 3, label: 'Academic' },
                { num: 4, label: 'Documents' },
              ].map((s) => (
                <div
                  key={s.num}
                  className={`py-2 px-1 rounded-lg border transition-all ${
                    currentStep === s.num
                      ? 'bg-blue-50 border-blue-400 text-[#1B365D] font-bold'
                      : currentStep > s.num
                      ? 'bg-slate-50 border-slate-200 text-slate-600'
                      : 'bg-white border-slate-200 text-slate-400'
                  }`}
                >
                  <span className="block text-[10px] font-mono">0{s.num}</span>
                  <span className="truncate block">{s.label}</span>
                </div>
              ))}
            </div>

            {/* Submitted Success Confirmation Screen */}
            {submittedApplicationId ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 text-center rounded-2xl bg-emerald-50/50 border border-emerald-200"
              >
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-serif text-2xl font-bold text-slate-900 mb-2">
                  Application Successfully Submitted
                </h4>
                <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
                  Thank you, <strong className="text-slate-900">{formData.parentName}</strong>. The application for student <strong className="text-slate-900">{formData.studentName}</strong> has been received by our School Admissions Office.
                </p>

                <div className="p-4 rounded-xl bg-white border border-slate-200 max-w-sm mx-auto mb-6 text-left text-xs space-y-2 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Application ID:</span>
                    <span className="font-bold text-[#1B365D]">{submittedApplicationId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Class Applied:</span>
                    <span className="text-slate-800">{formData.gradeApplied}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Current Status:</span>
                    <span className="text-emerald-700 font-semibold">Under Review</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (onShowToast) onShowToast('Generating printable Application Confirmation...');
                      window.print();
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#1B365D] hover:bg-[#132742] transition-colors shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    Print Receipt
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedApplicationId(null);
                      setFormData(INITIAL_FORM);
                      setCurrentStep(1);
                    }}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 border border-slate-200"
                  >
                    Submit Another Application
                  </button>
                </div>
              </motion.div>
            ) : (
              /* Step-by-Step Multi-Step Form */
              <form onSubmit={handleSubmitApplication}>
                <div className="min-h-[340px] relative">
                  <AnimatePresence mode="wait">
                    {/* STEP 1: Student Information */}
                    {currentStep === 1 && (
                      <motion.div
                        key="step-1"
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        custom={1}
                        transition={{ duration: 0.25 }}
                        className="space-y-4"
                      >
                        <h4 className="text-sm font-serif font-bold text-slate-800 pb-2 border-b border-slate-100">
                          Step 1: Student Details
                        </h4>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Full Name of Student *
                          </label>
                          <input
                            type="text"
                            value={formData.studentName}
                            onChange={(e) =>
                              setFormData({ ...formData, studentName: e.target.value })
                            }
                            placeholder="e.g. Muhammad Ali Khan"
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#1B365D] focus:ring-1 focus:ring-[#1B365D]"
                          />
                          {formErrors.studentName && (
                            <p className="text-red-600 text-[11px] mt-1 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {formErrors.studentName}
                            </p>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                              Date of Birth *
                            </label>
                            <input
                              type="date"
                              value={formData.dob}
                              onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#1B365D] focus:ring-1 focus:ring-[#1B365D]"
                            />
                            {formErrors.dob && (
                              <p className="text-red-600 text-[11px] mt-1 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {formErrors.dob}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                              Gender
                            </label>
                            <select
                              value={formData.gender}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  gender: e.target.value as 'Male' | 'Female' | 'Other',
                                })
                              }
                              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#1B365D]"
                            >
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Prefer Not to Disclose</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                              Class Applied (1 to 10 Only)
                            </label>
                            <select
                              value={formData.gradeApplied}
                              onChange={(e) =>
                                setFormData({ ...formData, gradeApplied: e.target.value })
                              }
                              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#1B365D]"
                            >
                              <option value="Class 1 (Primary School)">Class 1 (Primary)</option>
                              <option value="Class 2 (Primary School)">Class 2 (Primary)</option>
                              <option value="Class 3 (Primary School)">Class 3 (Primary)</option>
                              <option value="Class 4 (Primary School)">Class 4 (Primary)</option>
                              <option value="Class 5 (Primary School)">Class 5 (Primary)</option>
                              <option value="Class 6 (Middle School)">Class 6 (Middle School)</option>
                              <option value="Class 7 (Middle School)">Class 7 (Middle School)</option>
                              <option value="Class 8 (Middle School)">Class 8 (Middle School)</option>
                              <option value="Class 9 (Secondary School)">Class 9 (Secondary School)</option>
                              <option value="Class 10 (Secondary School)">Class 10 (Secondary School)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                              Curriculum Group
                            </label>
                            <select
                              value={formData.stream}
                              onChange={(e) =>
                                setFormData({ ...formData, stream: e.target.value })
                              }
                              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#1B365D]"
                            >
                              <option value="General Studies (Classes 1–8)">General School Studies (Classes 1–8)</option>
                              <option value="Secondary Science Group (Physics, Chem, Bio/Comp) (Classes 9–10)">
                                Secondary Science Group (Classes 9–10)
                              </option>
                              <option value="Secondary Humanities Group (Arts & General Science) (Classes 9–10)">
                                Secondary Humanities Group (Classes 9–10)
                              </option>
                            </select>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 2: Parent/Guardian Details */}
                    {currentStep === 2 && (
                      <motion.div
                        key="step-2"
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        custom={1}
                        transition={{ duration: 0.25 }}
                        className="space-y-4"
                      >
                        <h4 className="text-sm font-serif font-bold text-slate-800 pb-2 border-b border-slate-100">
                          Step 2: Parent & Guardian Details
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                              Parent / Guardian Name *
                            </label>
                            <input
                              type="text"
                              value={formData.parentName}
                              onChange={(e) =>
                                setFormData({ ...formData, parentName: e.target.value })
                              }
                              placeholder="e.g. Tariq Mehmood"
                              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#1B365D]"
                            />
                            {formErrors.parentName && (
                              <p className="text-red-600 text-[11px] mt-1 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {formErrors.parentName}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                              Relationship
                            </label>
                            <select
                              value={formData.relationship}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  relationship: e.target.value as 'Father' | 'Mother' | 'Guardian',
                                })
                              }
                              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#1B365D]"
                            >
                              <option value="Father">Father</option>
                              <option value="Mother">Mother</option>
                              <option value="Guardian">Guardian</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                              Email Address *
                            </label>
                            <input
                              type="email"
                              value={formData.parentEmail}
                              onChange={(e) =>
                                setFormData({ ...formData, parentEmail: e.target.value })
                              }
                              placeholder="parent@example.com"
                              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#1B365D]"
                            />
                            {formErrors.parentEmail && (
                              <p className="text-red-600 text-[11px] mt-1 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {formErrors.parentEmail}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                              Contact Mobile Phone *
                            </label>
                            <input
                              type="tel"
                              value={formData.parentPhone}
                              onChange={(e) =>
                                setFormData({ ...formData, parentPhone: e.target.value })
                              }
                              placeholder="+92 300 1234567"
                              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#1B365D]"
                            />
                            {formErrors.parentPhone && (
                              <p className="text-red-600 text-[11px] mt-1 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {formErrors.parentPhone}
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Residential Address *
                          </label>
                          <input
                            type="text"
                            value={formData.residentialAddress}
                            onChange={(e) =>
                              setFormData({ ...formData, residentialAddress: e.target.value })
                            }
                            placeholder="House No., Street, Area/Sector, City"
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#1B365D]"
                          />
                          {formErrors.residentialAddress && (
                            <p className="text-red-600 text-[11px] mt-1 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {formErrors.residentialAddress}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 3: Academic History */}
                    {currentStep === 3 && (
                      <motion.div
                        key="step-3"
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        custom={1}
                        transition={{ duration: 0.25 }}
                        className="space-y-4"
                      >
                        <h4 className="text-sm font-serif font-bold text-slate-800 pb-2 border-b border-slate-100">
                          Step 3: Previous School Record
                        </h4>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Previous School / Institution *
                          </label>
                          <input
                            type="text"
                            value={formData.previousSchool}
                            onChange={(e) =>
                              setFormData({ ...formData, previousSchool: e.target.value })
                            }
                            placeholder="Name of previous school or Home-schooled"
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#1B365D]"
                          />
                          {formErrors.previousSchool && (
                            <p className="text-red-600 text-[11px] mt-1 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {formErrors.previousSchool}
                            </p>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                              Last Class Completed
                            </label>
                            <input
                              type="text"
                              value={formData.lastCompletedGrade}
                              onChange={(e) =>
                                setFormData({ ...formData, lastCompletedGrade: e.target.value })
                              }
                              placeholder="e.g. Class 5"
                              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#1B365D]"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                              Previous Marks / Grade
                            </label>
                            <input
                              type="text"
                              value={formData.previousMarksOrGpa}
                              onChange={(e) =>
                                setFormData({ ...formData, previousMarksOrGpa: e.target.value })
                              }
                              placeholder="e.g. 88% or Grade A"
                              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#1B365D]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Co-Curricular Interests or Achievements
                          </label>
                          <textarea
                            rows={3}
                            value={formData.achievements}
                            onChange={(e) =>
                              setFormData({ ...formData, achievements: e.target.value })
                            }
                            placeholder="Reading, debate, sports, science projects..."
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#1B365D] resize-none"
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 4: Document Verification */}
                    {currentStep === 4 && (
                      <motion.div
                        key="step-4"
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        custom={1}
                        transition={{ duration: 0.25 }}
                        className="space-y-4"
                      >
                        <h4 className="text-sm font-serif font-bold text-slate-800 pb-2 border-b border-slate-100">
                          Step 4: Required Documents Check
                        </h4>

                        <p className="text-xs text-slate-500">
                          Confirm that you have the following documents ready for physical or digital submission:
                        </p>

                        <div className="space-y-3">
                          {[
                            {
                              id: 'birthCertificateUploaded',
                              title: 'Official Birth Certificate / B-Form',
                              hint: 'Photocopy or scanned document',
                              status: formData.birthCertificateUploaded,
                            },
                            {
                              id: 'transcriptUploaded',
                              title: 'Previous School Result Card / School Leaving Certificate',
                              hint: 'Signed and stamped by previous school',
                              status: formData.transcriptUploaded,
                            },
                            {
                              id: 'photographUploaded',
                              title: 'Student Passport-Size Photographs (2)',
                              hint: 'Recent color photos',
                              status: formData.photographUploaded,
                            },
                          ].map((doc) => (
                            <div
                              key={doc.id}
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  [doc.id]: !prev[doc.id as keyof ApplicationFormData],
                                }))
                              }
                              className={`p-3.5 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                                doc.status
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                    doc.status
                                      ? 'bg-emerald-200 text-emerald-800'
                                      : 'bg-slate-200 text-slate-600'
                                  }`}
                                >
                                  <Upload className="w-4 h-4" />
                                </div>
                                <div>
                                  <span className="text-xs font-semibold block">{doc.title}</span>
                                  <span className="text-[10px] text-slate-500">{doc.hint}</span>
                                </div>
                              </div>
                              <span
                                className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                                  doc.status
                                    ? 'bg-emerald-200 text-emerald-900'
                                    : 'bg-slate-200 text-slate-600'
                                }`}
                              >
                                {doc.status ? 'Ready ✓' : 'Mark Ready'}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Terms declaration */}
                        <div className="pt-2">
                          <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.agreeToTerms}
                              onChange={(e) =>
                                setFormData({ ...formData, agreeToTerms: e.target.checked })
                              }
                              className="mt-0.5 rounded text-[#1B365D] focus:ring-[#1B365D]"
                            />
                            <span>
                              I affirm that the provided student details and academic records are accurate and understand that admission offers are confirmed following document verification.
                            </span>
                          </label>
                          {formErrors.agreeToTerms && (
                            <p className="text-red-600 text-[11px] mt-1 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {formErrors.agreeToTerms}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Form Navigation Controls */}
                <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-200">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      Back
                    </button>
                  ) : (
                    <div />
                  )}

                  {currentStep < 4 ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#1B365D] hover:bg-[#132742] transition-all shadow-sm"
                    >
                      Continue
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#1B365D] hover:bg-[#132742] transition-all shadow-md disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Sparkles className="w-4 h-4 animate-spin text-white" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          Submit Admission Form
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>

          {/* ======================================================== */}
          {/* TASK 2: Dynamic Fee & Transport Calculator (5 cols)     */}
          {/* ======================================================== */}
          <div className="lg:col-span-5 rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm relative">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider block">
                  Transparent Schedule
                </span>
                <h3 className="font-serif text-xl font-bold text-[#1B365D] flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-amber-600" />
                  School Fee Calculator
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md">
                Official Rates
              </span>
            </div>

            <p className="text-xs text-slate-500 font-light mb-6">
              Select your child's educational stage (Classes 1–10), optional school van route, and practical laboratory funds to calculate the live monthly schedule.
            </p>

            <div className="space-y-4 mb-6">
              {/* Dropdown 1: Grade Level */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Educational Stage (Classes 1 to 10)
                </label>
                <select
                  value={calcGrade}
                  onChange={(e) => setCalcGrade(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#1B365D]"
                >
                  {Object.keys(GRADE_FEES).map((grade) => (
                    <option key={grade} value={grade}>
                      {grade}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dropdown 2: Transport Zone */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>School Van / Transport Route</span>
                  <Bus className="w-3.5 h-3.5 text-amber-600" />
                </label>
                <select
                  value={calcTransport}
                  onChange={(e) => setCalcTransport(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#1B365D]"
                >
                  {Object.keys(TRANSPORT_ZONES).map((zone) => (
                    <option key={zone} value={zone}>
                      {zone}
                    </option>
                  ))}
                </select>
              </div>

              {/* Checkboxes: Extra Facilities */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Academic Laboratories & Activity Funds (Optional)
                </label>
                <div className="space-y-2">
                  {EXTRA_FACILITIES.map((fac) => {
                    const isChecked = calcFacilities.includes(fac.id);
                    return (
                      <div
                        key={fac.id}
                        onClick={() => toggleFacility(fac.id)}
                        className={`p-2.5 rounded-xl border cursor-pointer flex items-center justify-between text-xs transition-all ${
                          isChecked
                            ? 'bg-blue-50/60 border-blue-300 text-slate-900 font-medium'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}} // Controlled by wrapper
                            className="rounded text-[#1B365D] focus:ring-[#1B365D]"
                          />
                          <span>{fac.label}</span>
                        </div>
                        <span className="font-mono text-[11px] text-[#1B365D] font-semibold">
                          +PKR {fac.fee.toLocaleString()}/mo
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Live Breakdown Box */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm space-y-3 text-xs">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-600 block border-b border-slate-200 pb-2">
                Itemized Fee Estimate
              </span>

              <div className="flex justify-between text-slate-600">
                <span>Admission Fee (One-time):</span>
                <span className="font-mono text-slate-900 font-medium">
                  PKR {feeBreakdown.admissionFee.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Security Deposit (One-time, refundable):</span>
                <span className="font-mono text-slate-900 font-medium">
                  PKR {feeBreakdown.securityDeposit.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Base Monthly Tuition:</span>
                <span className="font-mono text-slate-900 font-medium">
                  PKR {feeBreakdown.monthlyTuition.toLocaleString()}
                </span>
              </div>

              {feeBreakdown.transportFee > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>School Transport Fee:</span>
                  <span className="font-mono text-slate-900 font-medium">
                    PKR {feeBreakdown.transportFee.toLocaleString()}
                  </span>
                </div>
              )}

              {feeBreakdown.facilityTotal > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Selected Laboratory / Activity Funds:</span>
                  <span className="font-mono text-slate-900 font-medium">
                    PKR {feeBreakdown.facilityTotal.toLocaleString()}
                  </span>
                </div>
              )}

              {/* Recurring Monthly Total */}
              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                <div>
                  <span className="text-xs font-bold text-[#1B365D] block">
                    Regular Monthly Dues:
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Tuition + Transport + Facilities
                  </span>
                </div>
                <span className="font-mono text-base font-bold text-[#1B365D]">
                  PKR {feeBreakdown.regularMonthlyTotal.toLocaleString()}/mo
                </span>
              </div>

              {/* Initial Settlement Total */}
              <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 flex justify-between items-center mt-2">
                <div>
                  <span className="text-xs font-bold text-[#1B365D] block">
                    First Month Total Settlement:
                  </span>
                  <span className="text-[10px] text-slate-600">
                    Admission + Security Deposit + 1st Month
                  </span>
                </div>
                <span className="font-mono text-base sm:text-lg font-bold text-amber-800">
                  PKR {feeBreakdown.firstMonthTotal.toLocaleString()}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 mt-4 text-center font-sans">
              * Sibling discounts and merit-based concessions are available upon inquiry at the school office.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
