import React, { useState } from 'react';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Calendar,
  ChevronRight,
  Clock,
  Building,
  Phone,
  FileText,
  BookOpen,
  GraduationCap,
  Users,
  Compass,
  Cpu,
  Sparkles,
  ExternalLink,
  Send,
  MessageSquare,
  Award,
  Check,
  Maximize2,
  X,
} from 'lucide-react';
import { db, collection, addDoc } from '../lib/firebase';
import { MONOGRAPH_VIGNETTES, MonographVignette } from '../data/monographData';

interface HomeProps {
  onOpenApplyModal?: () => void;
  onOpenMatrixModal?: () => void;
  onOpenPortalModal?: () => void;
  onOpenManagementSystem?: () => void;
  onShowToast?: (msg: string) => void;
}

export const Home: React.FC<HomeProps> = ({
  onOpenApplyModal,
  onOpenMatrixModal,
  onOpenPortalModal,
  onOpenManagementSystem,
  onShowToast,
}) => {
  // Active photo modal state
  const [activePhoto, setActivePhoto] = useState<MonographVignette | null>(null);

  // Admissions Enquiry Form State
  const [studentFullName, setStudentFullName] = useState('');
  const [parentName, setParentName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [desiredClass, setDesiredClass] = useState('Class 1');
  const [enquiryMessage, setEnquiryMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const officialYandexMapUrl = 'https://yandex.com/maps/-/CXVyNN8q';

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!studentFullName.trim() || studentFullName.trim().length < 2) {
      setFormError('Please provide student / candidate full name.');
      return;
    }
    if (!parentName.trim() || parentName.trim().length < 2) {
      setFormError('Please provide parent or guardian full name.');
      return;
    }
    const cleanPhone = contactNumber.replace(/[\s\-()]/g, '');
    if (!cleanPhone || cleanPhone.length < 9) {
      setFormError('Please enter a valid Pakistani contact phone number (e.g. 0300 1234567 or +92 300 1234567).');
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'applications'), {
        studentName: studentFullName.trim(),
        parentName: parentName.trim(),
        parentPhone: contactNumber.trim(),
        gradeApplied: desiredClass,
        message: enquiryMessage.trim() || '',
        status: 'pending',
        createdAt: new Date().toISOString(),
      });
      setSubmissionSuccess(true);
      if (onShowToast) onShowToast('Admissions enquiry submitted successfully to The Mont Uni office.');
      setStudentFullName('');
      setParentName('');
      setContactNumber('');
      setEnquiryMessage('');
    } catch (err) {
      console.error('Admissions enquiry submission error:', err);
      setSubmissionSuccess(false);
      setFormError('Unable to submit enquiry right now. Please check your connection or contact our Chakwal admissions desk at +92 300 5551234.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[#F8FAF7] text-slate-800">
      {/* ========================================================================= */}
      {/* SECTION 2 — HERO SECTION                                                  */}
      {/* ========================================================================= */}
      <section
        id="home"
        className="relative bg-gradient-to-b from-white via-[#F8FAF7] to-[#EAF2EB]/40 border-b border-[#E2E8F0] py-14 sm:py-20 lg:py-24 overflow-hidden"
        aria-label="Welcome to The Mont Uni Pre Cadet Academy"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Official Welcome & Mission Headline */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Institution Identity Tag */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAF2EB] border border-[#0F5132]/20 text-[#0F5132] text-xs font-bold tracking-wide shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-[#0F5132] shrink-0" />
                <span>The Mont Uni Pre Cadet Academy · Chakwal, Punjab</span>
              </div>

              {/* Exact Approved Master Headline */}
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-[3.25rem] font-bold tracking-tight text-slate-900 leading-[1.18]">
                Building Knowledge. Shaping Character.{' '}
                <span className="text-[#0F5132] underline decoration-[#D4AF37] decoration-3 underline-offset-6">
                  Preparing for the Future.
                </span>
              </h1>

              {/* Exact Approved Master Supporting Text */}
              <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl">
                Welcome to <strong className="text-slate-900 font-semibold">The Mont Uni Pre Cadet Academy</strong>, where academic learning, confidence, discipline and character development support students as they prepare for the future.
              </p>

              {/* Verified Scope Indicators: Classes 1–10 */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-700 font-semibold pt-1">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0F5132] shrink-0" />
                  Primary Foundation (Classes 1–5)
                </span>
                <span className="text-slate-300" aria-hidden="true">·</span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0F5132] shrink-0" />
                  Middle & Pre-Cadet (Classes 6–8)
                </span>
                <span className="text-slate-300" aria-hidden="true">·</span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0F5132] shrink-0" />
                  Secondary Board Prep (Classes 9–10)
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-wrap items-center gap-3.5 sm:gap-4">
                {/* Primary Button */}
                <a
                  href="#about"
                  onClick={(e) => {
                    e.preventDefault();
                    document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#0F5132] hover:bg-[#0c4128] transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer border border-[#0c4128]"
                >
                  <span>Explore Our School</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                {/* Secondary Button */}
                <a
                  href="#admissions"
                  onClick={(e) => {
                    e.preventDefault();
                    document.querySelector('#admissions')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-5 py-3.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:text-[#0F5132] bg-white hover:bg-[#EAF2EB] border border-[#E2E8F0] shadow-2xs hover:shadow-xs transition-all flex items-center gap-2"
                >
                  <span>Enquire About Admissions</span>
                </a>

                {/* School Portal Preview Button */}
                <button
                  type="button"
                  onClick={onOpenManagementSystem}
                  className="px-4 py-3.5 rounded-xl text-xs sm:text-sm font-semibold text-[#1E40AF] hover:bg-[#EDF3FA] transition-colors flex items-center gap-1.5"
                >
                  <GraduationCap className="w-4 h-4 text-[#1E40AF]" />
                  <span>SMS Dashboard Preview</span>
                </button>
              </div>
            </div>

            {/* Right Column: Hero Real School Photograph Frame */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-[#E2E8F0] bg-white shadow-xl group">
                <img
                  src="/school-images/campus-corridor-colonnade.jpg"
                  alt="School Campus Corridor with Classic Brick Colonnade"
                  className="w-full h-[360px] sm:h-[430px] object-cover transition-transform duration-500 group-hover:scale-102"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent pointer-events-none" />

                {/* Photo Caption Tag */}
                <div className="absolute bottom-4 left-4 right-4 text-white text-left">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-sans font-bold uppercase tracking-wider bg-[#0F5132] text-white inline-block mb-1 border border-emerald-500/30">
                    Campus Infrastructure · Chakwal
                  </span>
                  <h3 className="font-serif text-base sm:text-lg font-bold text-white leading-snug">
                    Central Academic Corridor & Brick Colonnade
                  </h3>
                  <p className="text-xs text-slate-200 font-light mt-0.5 line-clamp-2">
                    Spacious, naturally ventilated hallways with classic red brick pillars and tactile walkways.
                  </p>
                </div>
              </div>

              {/* Location Badge */}
              <div className="absolute -bottom-4 left-2 sm:left-4 hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-[#E2E8F0] shadow-md text-xs font-semibold text-slate-800">
                <MapPin className="w-4 h-4 text-[#0F5132]" />
                <span>Chakwal Area, Punjab, Pakistan</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3 — ABOUT THE MONT UNI                                            */}
      {/* ========================================================================= */}
      <section id="about" className="py-20 sm:py-24 bg-white border-b border-[#E2E8F0] text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Visual Frame */}
            <div className="lg:col-span-5 relative order-2 lg:order-1">
              <div className="relative rounded-2xl overflow-hidden border border-[#E2E8F0] bg-[#F8FAF7] shadow-lg">
                <img
                  src="/school-images/classroom-daylight-desks.jpg"
                  alt="Classroom learning environment in The Mont Uni"
                  className="w-full h-80 sm:h-96 object-cover"
                />
                <div className="p-4 bg-white border-t border-[#E2E8F0]">
                  <span className="text-[11px] font-bold text-[#0F5132] uppercase tracking-wider block">
                    Learning Environment · Classes 1–10
                  </span>
                  <p className="text-xs text-slate-600 mt-1 font-medium">
                    Spacious seating with dual-bench desks, cross-ventilation, and natural tree canopy views.
                  </p>
                </div>
              </div>
            </div>

            {/* Content Column */}
            <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#0F5132] uppercase tracking-wider">
                <Building className="w-4 h-4 text-[#0F5132]" />
                <span>Educational Identity</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-slate-900 leading-tight">
                About The Mont Uni Pre Cadet Academy
              </h2>

              {/* Exact Approved Master Prompt Copy */}
              <div className="p-5 rounded-2xl bg-[#EAF2EB] border-l-4 border-[#0F5132] text-slate-800 text-sm sm:text-base leading-relaxed italic">
                “At The Mont Uni Pre Cadet Academy, education is about more than academic learning. We aim to support students in developing knowledge, confidence, discipline, responsibility and positive character in a supportive learning environment.”
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                Situated in the Chakwal region of Punjab, our academy is dedicated exclusively to students from <strong className="text-slate-900 font-semibold">Class 1 through Class 10</strong>. We integrate sound provincial academic curricula with rigorous pre-cadet physical and moral grooming, helping young minds mature into capable, confident, and disciplined citizens.
              </p>

              {/* Four Core Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAF7]">
                  <h4 className="font-serif font-bold text-sm text-[#0F5132] mb-1">
                    Structured Academic Mastery
                  </h4>
                  <p className="text-xs text-slate-600">
                    Comprehensive syllabus mastery in sciences, mathematics, English, and Urdu from Class 1 foundations to secondary board examinations.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAF7]">
                  <h4 className="font-serif font-bold text-sm text-[#0F5132] mb-1">
                    Pre-Cadet Discipline & Routine
                  </h4>
                  <p className="text-xs text-slate-600">
                    Punctuality, morning assembly drills, uniform inspections, and personal responsibility embedded in daily student life.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAF7]">
                  <h4 className="font-serif font-bold text-sm text-[#0F5132] mb-1">
                    Character Building & Moral Ethics
                  </h4>
                  <p className="text-xs text-slate-600">
                    Honesty, mutual respect, civic integrity, and wholesome community values nurtured under close teacher mentorship.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAF7]">
                  <h4 className="font-serif font-bold text-sm text-[#0F5132] mb-1">
                    Authentic Pakistani Heritage
                  </h4>
                  <p className="text-xs text-slate-600">
                    Deeply connected to the cultural ethos and families of Chakwal, Kot Raja, and surrounding Punjab communities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4 — ACADEMICS: CLASSES 1–10                                       */}
      {/* ========================================================================= */}
      <section id="academics" className="py-20 sm:py-24 bg-[#F8FAF7] border-b border-[#E2E8F0] text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-slate-200 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#0F5132] uppercase tracking-wider mb-2">
                <GraduationCap className="w-4 h-4 text-[#0F5132]" />
                <span>Academic Scope</span>
                <span>·</span>
                <span>Classes 1 to 10 Only</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-slate-900">
                Structured Learning for Classes 1–10
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md">
              Focused on clear educational progression, strong literacy foundations, analytical mathematics, core sciences, and board examination preparedness.
            </p>
          </div>

          {/* Two Prominent Academic Groups */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Card 1: Classes 1–5 (Primary Level) */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-xs hover:border-[#0F5132]/40 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#EAF2EB] text-[#0F5132] border border-[#0F5132]/20">
                    Primary Foundation Stage
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">Ages 5 – 10 Years</span>
                </div>

                <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 mb-3">
                  Classes 1 to 5 (Primary School)
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  Primary-level learning focused on foundational development. Young learners develop fundamental literacy in English and Urdu, arithmetic reasoning, basic general science, ethics, and clean handwriting habits in a caring and encouraging classroom environment.
                </p>

                <div className="space-y-2.5 text-xs text-slate-700 mb-6">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#0F5132] shrink-0" />
                    <span>English & Urdu alphabetics, phonics, and reading fluency</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#0F5132] shrink-0" />
                    <span>Mental arithmetic, addition, multiplication tables, and practical reasoning</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#0F5132] shrink-0" />
                    <span>General science and environmental curiosity</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#0F5132] shrink-0" />
                    <span>Islamiyat, moral etiquette, and cooperative classroom behavior</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">1:18 Teacher-Student Dynamic</span>
                <a
                  href="#admissions"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F5132] hover:underline"
                >
                  <span>Enquire for Primary</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Card 2: Classes 6–10 (Middle & Secondary Level) */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-xs hover:border-[#1E40AF]/40 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#EDF3FA] text-[#1E40AF] border border-[#1E40AF]/20">
                    Middle & Secondary Stage
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">Ages 11 – 16 Years</span>
                </div>

                <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 mb-3">
                  Classes 6 to 10 (Middle & Secondary School)
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  Continued academic progression and disciplined character cultivation. Classes 6–8 transition students into analytical scientific thinking, leading to Class 9 and 10 secondary board examination preparation across Science and Humanities streams with Pre-Cadet physical and leadership training.
                </p>

                <div className="space-y-2.5 text-xs text-slate-700 mb-6">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#1E40AF] shrink-0" />
                    <span>Class 9 & 10 Science Group (Physics, Chemistry, Biology, Mathematics)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#1E40AF] shrink-0" />
                    <span>Class 9 & 10 Humanities & General Science Tracks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#1E40AF] shrink-0" />
                    <span>Computer studies, digital literacy, and practical exercises</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#1E40AF] shrink-0" />
                    <span>Pre-Cadet morning physical drills, leadership and parade discipline</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">Board Examination Focus</span>
                <a
                  href="#admissions"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E40AF] hover:underline"
                >
                  <span>Enquire for Middle & Secondary</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5 — AI & DIGITAL LEARNING                                         */}
      {/* ========================================================================= */}
      <section id="digital-learning" className="py-20 sm:py-24 bg-white border-b border-[#E2E8F0] text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#0F5132] uppercase tracking-wider mb-2">
              <Cpu className="w-4 h-4 text-[#0F5132]" />
              <span>Modern Curriculum Component</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-slate-900 mb-3">
              Preparing Students for a Digital Future
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              At The Mont Uni Pre Cadet Academy, modern technology education complements our disciplined academic foundation. We introduce age-appropriate digital skills, computational problem-solving, and responsible use of technology to prepare students for tomorrow's world.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl border border-[#E2E8F0] bg-[#F8FAF7] hover:border-[#0F5132]/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#EAF2EB] text-[#0F5132] flex items-center justify-center font-bold text-sm mb-4">
                01
              </div>
              <h3 className="font-serif font-bold text-base text-slate-900 mb-2">
                Digital Literacy & Fundamentals
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Basic computer operations, keyboard confidence, document creation, and essential software navigation for academic homework and research.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-[#E2E8F0] bg-[#F8FAF7] hover:border-[#0F5132]/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#EAF2EB] text-[#0F5132] flex items-center justify-center font-bold text-sm mb-4">
                02
              </div>
              <h3 className="font-serif font-bold text-base text-slate-900 mb-2">
                Responsible Use of AI
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Teaching students to understand artificial intelligence as an educational assistant for research and learning, while avoiding plagiarism and maintaining independent critical thinking.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-[#E2E8F0] bg-[#F8FAF7] hover:border-[#0F5132]/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#EAF2EB] text-[#0F5132] flex items-center justify-center font-bold text-sm mb-4">
                03
              </div>
              <h3 className="font-serif font-bold text-base text-slate-900 mb-2">
                Online Safety & Ethics
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Educating young students about internet privacy, healthy screen time habits, cyber ethics, and safe digital citizenship in a connected world.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-[#E2E8F0] bg-[#F8FAF7] hover:border-[#0F5132]/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#EAF2EB] text-[#0F5132] flex items-center justify-center font-bold text-sm mb-4">
                04
              </div>
              <h3 className="font-serif font-bold text-base text-slate-900 mb-2">
                Creative Problem-Solving
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Step-by-step logic, pattern recognition, and age-appropriate computational thinking to strengthen mathematical and analytical skills.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 6 — SCHOOL LIFE AND CHARACTER BUILDING                            */}
      {/* ========================================================================= */}
      <section id="school-life" className="py-20 sm:py-24 bg-[#F8FAF7] border-b border-[#E2E8F0] text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-slate-200 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#0F5132] uppercase tracking-wider mb-2">
                <Users className="w-4 h-4 text-[#0F5132]" />
                <span>Authentic Campus Documentation</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-slate-900">
                School Life & Character Building
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md">
              Actual reference photographs of our campus corridors, classrooms, B2 library reading room, and academic bulletin in Chakwal.
            </p>
          </div>

          {/* Genuine School Photo Grid (4 Documented Campus Areas) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Photo 1: Classrooms */}
            <div
              className="bg-white rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-xs group cursor-pointer hover:border-[#0F5132]/40 transition-all"
              onClick={() => setActivePhoto(MONOGRAPH_VIGNETTES[1])}
            >
              <div className="relative h-56 bg-slate-100 overflow-hidden">
                <img
                  src="/school-images/classroom-daylight-desks.jpg"
                  alt="Classrooms for Classes 1 to 10"
                  className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-white/95 px-2 py-0.5 rounded text-[10px] font-bold text-slate-900 border border-slate-200">
                  #002 · Classrooms
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-serif font-bold text-sm text-slate-900 mb-1">
                  Spacious Sunlit Classrooms
                </h4>
                <p className="text-xs text-slate-600 line-clamp-2">
                  Durable dual-seater study desks and cross-ventilation looking out onto outdoor tree greenery.
                </p>
              </div>
            </div>

            {/* Photo 2: B2 Reading Room Entrance */}
            <div
              className="bg-white rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-xs group cursor-pointer hover:border-[#0F5132]/40 transition-all"
              onClick={() => setActivePhoto(MONOGRAPH_VIGNETTES[2])}
            >
              <div className="relative h-56 bg-slate-100 overflow-hidden">
                <img
                  src="/school-images/library-reading-room-entrance.jpg"
                  alt="B2 Reading Room & Library Entrance"
                  className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-white/95 px-2 py-0.5 rounded text-[10px] font-bold text-slate-900 border border-slate-200">
                  #003 · Library Entrance
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-serif font-bold text-sm text-slate-900 mb-1">
                  B2 Reading Room & Library
                </h4>
                <p className="text-xs text-slate-600 line-clamp-2">
                  Classic black and gold lacquered doorway signage marking the school library sanctuary.
                </p>
              </div>
            </div>

            {/* Photo 3: Reading Alcove Motto */}
            <div
              className="bg-white rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-xs group cursor-pointer hover:border-[#0F5132]/40 transition-all"
              onClick={() => setActivePhoto(MONOGRAPH_VIGNETTES[3])}
            >
              <div className="relative h-56 bg-slate-100 overflow-hidden">
                <img
                  src="/school-images/library-hospital-for-mind.jpg"
                  alt="A library is a hospital for the mind"
                  className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-white/95 px-2 py-0.5 rounded text-[10px] font-bold text-slate-900 border border-slate-200">
                  #004 · Library Motto
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-serif font-bold text-sm text-slate-900 mb-1">
                  Mind Sanctuary & Study Alcove
                </h4>
                <p className="text-xs text-slate-600 line-clamp-2">
                  Wall inscription: “A library is a hospital for the mind.” Dedicated space for quiet research and reflection.
                </p>
              </div>
            </div>

            {/* Photo 4: Hallway Bulletin & Greenery */}
            <div
              className="bg-white rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-xs group cursor-pointer hover:border-[#0F5132]/40 transition-all"
              onClick={() => setActivePhoto(MONOGRAPH_VIGNETTES[4])}
            >
              <div className="relative h-56 bg-slate-100 overflow-hidden">
                <img
                  src="/school-images/hallway-bulletin-greenery.jpg"
                  alt="Academic Notice Bulletin & Hallway Botanical Greenery"
                  className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-white/95 px-2 py-0.5 rounded text-[10px] font-bold text-slate-900 border border-slate-200">
                  #005 · Notice Board
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-serif font-bold text-sm text-slate-900 mb-1">
                  Notice Board & Greenery
                </h4>
                <p className="text-xs text-slate-600 line-clamp-2">
                  Academic timetables, notices, and fresh indoor potted tropical plants creating a vibrant environment.
                </p>
              </div>
            </div>
          </div>

          {/* Spoken English Supporting Highlight ("Speak with Confidence") */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] block">
                Communication Mastery
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
                Speak with Confidence · Spoken English & Expression
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Along with strong Urdu literacy, our teachers cultivate confident everyday conversational English, clear pronunciation, listening comprehension, and public speaking through morning assembly presentations and guided classroom dialogues.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="px-4 py-2.5 rounded-xl bg-[#EAF2EB] text-[#0F5132] text-xs font-bold border border-[#0F5132]/20">
                Daily Conversation Practice
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 7 — ADMISSIONS AND CONTACT                                        */}
      {/* ========================================================================= */}
      <section id="admissions" className="py-20 sm:py-24 bg-white border-b border-[#E2E8F0] text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column: Official Admissions Enquiry Form */}
            <div className="lg:col-span-7 bg-[#F8FAF7] p-6 sm:p-8 rounded-2xl border border-[#E2E8F0] shadow-xs">
              <div className="mb-6">
                <span className="text-xs font-bold text-[#0F5132] uppercase tracking-wider block mb-1">
                  Enrollment Academic Year 2026–2027
                </span>
                <h3 className="font-serif text-2xl font-bold text-slate-900">
                  Enquire About Admissions (Classes 1–10)
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Submit candidate details directly to The Mont Uni Pre Cadet Academy admissions office.
                </p>
              </div>

              {submissionSuccess ? (
                <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-3">
                  <div className="flex items-center gap-2 text-base font-bold text-emerald-800">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Admissions Enquiry Received</span>
                  </div>
                  <p className="text-xs text-emerald-700 leading-relaxed">
                    Thank you. Your enquiry has been securely logged in our admissions database. Our office administration in Chakwal will contact you by phone shortly regarding candidate admission and prospectus details.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmissionSuccess(false)}
                    className="mt-2 text-xs font-bold text-[#0F5132] underline"
                  >
                    Submit another enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleEnquirySubmit} className="space-y-4 text-xs">
                  {formError && (
                    <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                      {formError}
                    </div>
                  )}

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Candidate / Student Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Daniyal Ahmed"
                      value={studentFullName}
                      onChange={(e) => setStudentFullName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-[#0F5132] focus:ring-1 focus:ring-[#0F5132]"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Parent / Guardian Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tariq Mehmood"
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-[#0F5132] focus:ring-1 focus:ring-[#0F5132]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Contact Phone Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+92 300 1234567"
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-[#0F5132] focus:ring-1 focus:ring-[#0F5132]"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Desired Class for Admission <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={desiredClass}
                        onChange={(e) => setDesiredClass(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-[#0F5132] focus:ring-1 focus:ring-[#0F5132]"
                      >
                        {[...Array(10)].map((_, i) => (
                          <option key={i} value={`Class ${i + 1}`}>
                            Class {i + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Message / Candidate Previous School Details
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Mention student age, previous school, or any specific questions regarding hostel, uniform, or pre-cadet curriculum..."
                      value={enquiryMessage}
                      onChange={(e) => setEnquiryMessage(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-[#0F5132] focus:ring-1 focus:ring-[#0F5132]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-7 py-3 rounded-xl bg-[#0F5132] hover:bg-[#0c4128] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 border border-[#0c4128]"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Submitting to Admissions Office...' : 'Submit Admissions Enquiry'}</span>
                  </button>
                </form>
              )}
            </div>

            {/* Right Column: Verified Campus Contact & Location Info */}
            <div id="contact" className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-xs font-bold text-[#0F5132] uppercase tracking-wider block mb-1">
                  Contact & Campus Location
                </span>
                <h3 className="font-serif text-2xl font-bold text-slate-900">
                  Visit Our School
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Parents and guardians are warmly welcomed to visit during school office hours.
                </p>
              </div>

              {/* Location Card with Yandex Maps */}
              <div className="p-5 rounded-2xl border border-[#E2E8F0] bg-[#F8FAF7] space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <MapPin className="w-4 h-4 text-[#0F5132]" />
                  <span>Campus Location (Chakwal, Punjab)</span>
                </div>
                <p className="text-xs text-slate-600">
                  Conveniently situated in the Chakwal area with clear road access for day scholars and visiting guardians.
                </p>

                <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs font-mono">
                  <div className="text-[11px] text-slate-500">Official GPS Coordinates:</div>
                  <div className="text-slate-900 font-bold">32.834662° N, 72.999090° E</div>
                </div>

                <a
                  href={officialYandexMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-[#1E40AF] hover:bg-[#18348d] transition-all shadow-xs"
                >
                  <Compass className="w-4 h-4" />
                  <span>Open Directions on Yandex Maps</span>
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>

              {/* School Office Hours */}
              <div className="p-5 rounded-2xl border border-[#E2E8F0] bg-white space-y-2.5 text-xs">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <Clock className="w-4 h-4 text-[#0F5132]" />
                  <span>Official School Hours</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1 text-slate-600">
                  <span>Monday – Thursday:</span>
                  <span className="font-semibold text-slate-800">7:45 AM – 1:45 PM</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1 text-slate-600">
                  <span>Friday:</span>
                  <span className="font-semibold text-slate-800">7:45 AM – 12:15 PM</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1 text-slate-600">
                  <span>Saturday:</span>
                  <span className="font-semibold text-slate-800">Co-Curricular / Office</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Sunday:</span>
                  <span className="font-semibold text-amber-700">Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 8 — FOOTER                                                        */}
      {/* ========================================================================= */}
      <footer className="bg-[#0F5132] text-white border-t border-[#0c4128] py-14 text-xs text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-emerald-800/60">
            {/* Column 1: School Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src="/school-images/the-mount-uni-logo.png"
                  alt="Logo"
                  className="w-10 h-10 object-contain shrink-0"
                />
                <div>
                  <span className="font-serif font-bold text-white tracking-wide text-sm sm:text-base block">
                    The Mont Uni Pre Cadet Academy
                  </span>
                  <span className="text-[11px] text-[#D4AF37] font-semibold">
                    Classes 1 to 10 · Chakwal, Punjab
                  </span>
                </div>
              </div>
              <p className="text-emerald-100/80 text-xs leading-relaxed">
                Building knowledge, shaping character, and preparing students for the future with disciplined academic learning and moral values.
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div className="space-y-3">
              <h4 className="text-white font-serif font-bold text-sm tracking-wide">
                Quick Navigation
              </h4>
              <ul className="space-y-2 text-xs text-emerald-100/90">
                <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#academics" className="hover:text-white transition-colors">Classes 1–10 Academics</a></li>
                <li><a href="#digital-learning" className="hover:text-white transition-colors">AI & Digital Learning</a></li>
                <li><a href="#school-life" className="hover:text-white transition-colors">School Life & Facilities</a></li>
                <li><a href="#admissions" className="hover:text-white transition-colors">Admissions Enquiries</a></li>
              </ul>
            </div>

            {/* Column 3: Location Coordinates */}
            <div className="space-y-3">
              <h4 className="text-white font-serif font-bold text-sm tracking-wide flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#D4AF37]" />
                Official Location
              </h4>
              <p className="text-emerald-100/80 text-xs leading-relaxed">
                Chakwal area, Punjab, Pakistan.
              </p>
              <div className="p-3 rounded-xl bg-emerald-900/60 border border-emerald-700/50 text-xs font-mono space-y-1">
                <div className="text-[10px] text-[#D4AF37]">Coordinates:</div>
                <div className="text-emerald-100">32.834662° N, 72.999090° E</div>
              </div>
              <a
                href={officialYandexMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D4AF37] hover:underline"
              >
                <span>View on Yandex Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Column 4: School Management Portal */}
            <div className="space-y-3">
              <h4 className="text-white font-serif font-bold text-sm tracking-wide flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                School Portal
              </h4>
              <p className="text-emerald-100/80 text-xs leading-relaxed">
                Authorised access for Administrators, Teachers, and Parents to view attendance, gradebooks, and circulars.
              </p>
              <button
                type="button"
                onClick={onOpenManagementSystem}
                className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-slate-900 bg-[#D4AF37] hover:bg-amber-300 transition-all text-center block shadow-xs"
              >
                Launch School Management Portal
              </button>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-emerald-200/70">
            <p>© 2026–2027 The Mont Uni Pre Cadet Academy. Dedicated to Classes 1 to 10 in Chakwal, Punjab. All rights reserved.</p>
            <div className="flex items-center gap-3">
              <span className="text-emerald-300">Preserving verified school identity & authentic photography.</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Photo Lightbox Modal */}
      {activePhoto && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl relative text-left">
            <button
              type="button"
              onClick={() => setActivePhoto(null)}
              aria-label="Close"
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="relative h-72 sm:h-96 w-full bg-slate-100">
              <img
                src={activePhoto.image}
                alt={activePhoto.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EAF2EB] text-[#0F5132] uppercase">
                {activePhoto.serial} · {activePhoto.year}
              </span>
              <h3 className="font-serif text-xl font-bold text-slate-900 mt-1 mb-2">
                {activePhoto.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {activePhoto.summary}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
