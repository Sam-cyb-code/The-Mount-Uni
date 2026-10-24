import { AcademicLevel, EmergencyNotice, NavTabConfig, PortalLink } from '../types/navigation';

export const EMERGENCY_NOTICES: EmergencyNotice[] = [
  {
    id: 'adm-2027',
    priority: 'admissions',
    badge: 'Admissions Open',
    text: 'Admissions Open for Classes 1 to 10 (Academic Year 2026–2027). Prospectus and registration forms are available online and at the school admissions office.',
    actionLabel: 'Apply for Classes 1–10',
    actionHref: '#admissions-apply',
  },
  {
    id: 'school-location',
    priority: 'announcement',
    badge: 'Campus Location',
    text: 'Visit our school campus — locate us easily via Yandex Maps or view our official location and directions.',
    actionLabel: 'Find Our Location',
    actionHref: '#location',
  },
  {
    id: 'library-notice',
    priority: 'urgent',
    badge: 'Academic Facilities',
    text: 'The B2 Reading Room & School Library is open for student study hours and book circulation.',
    actionLabel: 'Explore Facilities',
    actionHref: '#facilities',
  },
];

export const ACADEMIC_LEVELS: AcademicLevel[] = [
  {
    id: 'primary-school',
    title: 'Primary School',
    ageSpan: 'Classes 1 – 5 (Ages 5 – 10)',
    curriculumBadge: 'Primary Foundation',
    summary: 'Building solid foundations in English and Urdu literacy, arithmetic reasoning, general science, social studies, ethics, and interactive learning.',
    keyLinks: [
      { label: 'Class 1 to 5 Foundational Curriculum', href: '#academics-primary' },
      { label: 'English & Urdu Reading Literacy', href: '#academics-reading' },
      { label: 'Arithmetic & Mental Mathematics', href: '#academics-math' },
      { label: 'General Science & Activity Learning', href: '#academics-science' },
    ],
  },
  {
    id: 'middle-school',
    title: 'Middle School',
    ageSpan: 'Classes 6 – 8 (Ages 11 – 13)',
    curriculumBadge: 'Middle Stage',
    summary: 'Developing independent analytical thinking, core science disciplines, intermediate mathematics, computer skills, and social sciences.',
    keyLinks: [
      { label: 'Class 6 to 8 Core Curriculum', href: '#academics-middle' },
      { label: 'General Science Concepts', href: '#academics-middle-science' },
      { label: 'Computer Studies & Digital Literacy', href: '#academics-computer' },
      { label: 'Social Studies, History & Geography', href: '#academics-social' },
    ],
  },
  {
    id: 'secondary-school',
    title: 'Secondary School',
    ageSpan: 'Classes 9 – 10 (Ages 14 – 16)',
    curriculumBadge: 'Secondary Board (Classes 9–10)',
    summary: 'Rigorous preparation for secondary school board examinations across Science Group (Physics, Chemistry, Biology/Computer Science, Math) and Humanities Group.',
    keyLinks: [
      { label: 'Class 9 & 10 Science Group', href: '#academics-science-group', badge: 'Science' },
      { label: 'Class 9 & 10 Humanities Group', href: '#academics-humanities', badge: 'General' },
      { label: 'Science Laboratory Practicals', href: '#academics-labs' },
      { label: 'Secondary Examination Prep', href: '#academics-exams' },
    ],
  },
];

export const PORTAL_ITEMS: PortalLink[] = [
  {
    id: 'student-portal',
    name: 'Student Portal',
    description: 'Class timetables, homework assignments, exam schedules, and library reading room access.',
    audience: 'Enrolled Students (Classes 1–10)',
    href: '#portal-student',
    iconName: 'GraduationCap',
  },
  {
    id: 'parent-gateway',
    name: 'Parent Gateway',
    description: 'Student attendance, term report cards, fee vouchers, and parent-teacher meeting updates.',
    audience: 'Parents & Guardians',
    href: '#portal-parent',
    iconName: 'Users',
  },
  {
    id: 'faculty-intranet',
    name: 'Teacher & Staff Portal',
    description: 'Lesson plans, student attendance logs, gradebook entries, and academic circulars.',
    audience: 'School Teachers & Staff',
    href: '#portal-faculty',
    iconName: 'BookOpen',
  },
  {
    id: 'admissions-desk',
    name: 'Admissions Desk',
    description: 'Application tracking, document verification, fee schedules, and enrollment for Classes 1–10.',
    audience: 'Prospective Families',
    href: '#admissions-apply',
    iconName: 'Compass',
  },
];

export const NAV_TABS: NavTabConfig[] = [
  {
    id: 'about',
    label: 'About Our School',
    href: '#about-us',
    hasDropdown: true,
    sections: [
      {
        title: 'School Identity',
        items: [
          { label: 'Educational Philosophy', href: '#about-philosophy', description: 'Nurturing disciplined minds and strong moral character' },
          { label: 'Classes 1–10 Academic Scope', href: '#about-scope', description: 'Dedicated exclusively to Primary, Middle, and Secondary education' },
          { label: 'Faculty & Teaching Staff', href: '#about-faculty', description: 'Dedicated, caring teachers focused on student growth' },
        ],
      },
      {
        title: 'Campus & Location',
        items: [
          { label: 'Find Our School on Yandex Maps', href: '#location', description: 'Interactive directions and coordinates' },
          { label: 'School Building & Corridors', href: '#facilities-building', description: 'Sunlit classrooms and wide academic corridors' },
          { label: 'Library & B2 Reading Room', href: '#facilities-library', description: 'Quiet study spaces and student reading culture' },
        ],
      },
    ],
    featured: {
      tag: 'Our School',
      title: 'Dedicated to Classes 1 through 10',
      description: 'A welcoming, well-structured school providing quality primary, middle, and secondary education in an inspiring environment.',
      ctaText: 'Visit Our School',
      ctaHref: '#location',
    },
  },
  {
    id: 'academics',
    label: 'Academics',
    href: '#academics-overview',
    hasDropdown: true,
    featured: {
      tag: 'Classes 1–10 Curriculum',
      title: 'Structured Primary to Secondary Education',
      description: 'Focused academic progression from Class 1 foundations to Class 10 board preparation in Science and Humanities.',
      ctaText: 'View Curriculum Outline',
      ctaHref: '#academics-showcase',
      badge: 'Classes 1–10',
    },
  },
  {
    id: 'campus-life',
    label: 'Facilities & Gallery',
    href: '#campus-life',
    hasDropdown: true,
    sections: [
      {
        title: 'School Facilities',
        items: [
          { label: 'Spacious Classrooms', href: '#facilities-classrooms', description: 'Well-lit learning spaces with dedicated student desks' },
          { label: 'B2 Reading Room & Library', href: '#facilities-library', description: 'Quiet reading environment and study hall' },
          { label: 'Central Academic Corridors', href: '#facilities-corridors', description: 'Naturally ventilated hallways with brick architecture' },
          { label: 'Notice Board & Greenery', href: '#facilities-bulletin', description: 'Active academic communication and clean environment' },
        ],
      },
      {
        title: 'Visual Documentation',
        items: [
          { label: 'Actual Campus Photo Gallery', href: '#school-gallery', description: 'Authentic reference photographs of our school' },
          { label: 'School Architectural Monograph', href: '#monograph-gallery', description: 'Five documented campus landmarks and wings' },
        ],
      },
    ],
    featured: {
      tag: 'School Gallery',
      title: 'Authentic Campus Photographs',
      description: 'Explore genuine photographs of our classrooms, library reading room, corridors, and student areas.',
      ctaText: 'Open Photo Gallery',
      ctaHref: '#school-gallery',
    },
  },
  {
    id: 'admissions',
    label: 'Admissions',
    href: '#admissions',
    hasDropdown: true,
    sections: [
      {
        title: 'Enrollment for Classes 1–10',
        items: [
          { label: 'Admission Steps & Requirements', href: '#adm-process', description: 'Clear guidance for parents and guardians' },
          { label: 'Class Placement (Classes 1–10)', href: '#adm-classes', description: 'Primary, Middle, and Secondary entry criteria' },
          { label: 'Transparent Fee Calculator', href: '#adm-fees', description: 'Clear monthly tuition, admission, and lab fees' },
        ],
      },
      {
        title: 'Visit & Inquiries',
        items: [
          { label: 'School Location & Directions', href: '#location', description: 'Official Yandex Maps navigation and visiting hours' },
          { label: 'Required Documents Checklist', href: '#adm-docs', description: 'Birth certificate, previous school report & photos' },
          { label: 'Online Application Form', href: '#admissions-apply', description: 'Submit candidate details directly online' },
        ],
      },
    ],
    featured: {
      tag: 'Session 2026–2027',
      title: 'Admissions Open (Classes 1–10)',
      description: 'Seats are available for Classes 1 through 10. Complete the online admission form or visit the school office.',
      ctaText: 'Apply Online',
      ctaHref: '#admissions-apply',
      badge: 'Classes 1–10',
    },
  },
  {
    id: 'news',
    label: 'News & Notices',
    href: '#news-events',
    hasDropdown: true,
    sections: [
      {
        title: 'School Notices',
        items: [
          { label: 'Academic Term Calendar', href: '#news-calendar', description: 'Important term dates, exams, and holidays' },
          { label: 'Parent-Teacher Conferences', href: '#news-ptm', description: 'Scheduled progress discussions with teachers' },
          { label: 'Examination Circulars', href: '#news-exams', description: 'Class 1–10 assessment timetables and guidelines' },
        ],
      },
      {
        title: 'School Activities',
        items: [
          { label: 'Library Reading Hours', href: '#news-library', description: 'B2 Reading Room study schedules and book club' },
          { label: 'Science & Creative Projects', href: '#news-science', description: 'Hands-on learning and classroom presentations' },
        ],
      },
    ],
    featured: {
      tag: 'Notice Board',
      title: 'School Circulars & Updates',
      description: 'Stay updated with term examinations, school hours, and academic announcements on our bulletin.',
      ctaText: 'View School Notices',
      ctaHref: '#news-events',
    },
  },
  {
    id: 'portals',
    label: 'Portals & Location',
    href: '#location',
    hasDropdown: true,
    sections: [
      {
        title: 'Quick Access',
        items: [
          { label: 'Find Our School on Yandex Maps', href: '#location', description: 'Official location link: yandex.com/maps/-/CXVyNN8q' },
          { label: 'Parent Gateway Login', href: '#portal-parent', description: 'Attendance, fee vouchers, and report cards' },
          { label: 'Student Portal', href: '#portal-student', description: 'Timetables, classwork, and syllabus' },
          { label: 'Teacher & Staff Portal', href: '#portal-faculty', description: 'Class rosters and academic management' },
        ],
      },
    ],
    featured: {
      tag: 'Find Our School',
      title: 'Official School Location',
      description: 'Located conveniently with full road access. Open on Yandex Maps for one-click GPS directions.',
      ctaText: 'Get Directions',
      ctaHref: 'https://yandex.com/maps/-/CXVyNN8q',
    },
  },
];
