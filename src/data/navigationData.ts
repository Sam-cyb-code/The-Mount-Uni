import { AcademicLevel, EmergencyNotice, NavTabConfig, PortalLink } from '../types/navigation';

export const EMERGENCY_NOTICES: EmergencyNotice[] = [
  {
    id: 'adm-2027',
    priority: 'admissions',
    badge: 'Admissions 2027',
    text: 'Admissions Open for Academic Year 2027 — Applications for Early Years, Primary, Middle & Senior Cambridge / Matric streams are now being received.',
    actionLabel: 'Apply Online',
    actionHref: '#admissions-apply',
  },
  {
    id: 'merit-schol',
    priority: 'urgent',
    badge: 'Merit Honors',
    text: 'Vice-Chancellor Merit Scholarships 2027: Register for the Cambridge O/A Levels & FSc Entrance Assessment by December 10.',
    actionLabel: 'Scholarship Criteria',
    actionHref: '#scholarships',
  },
  {
    id: 'campus-tour',
    priority: 'announcement',
    badge: 'Campus Open Day',
    text: 'Join our Winter Guided Campus Discovery Tour on Saturday, 10:00 AM at the Central Quadrangle.',
    actionLabel: 'Reserve Seat',
    actionHref: '#visit',
  },
];

export const ACADEMIC_LEVELS: AcademicLevel[] = [
  {
    id: 'early-years',
    title: 'Early Years',
    ageSpan: 'Ages 2.5 – 5 Years',
    curriculumBadge: 'EYFS & Reggio Blend',
    summary: 'Inquiry-led play, sensory literacy, bilingual foundations, and emotional resilience in purpose-built atelier spaces.',
    keyLinks: [
      { label: 'Foundation Stage 1 & 2', href: '#academics-eyfs' },
      { label: 'Montessori & Sensory Atelier', href: '#academics-atelier' },
      { label: 'Early Numeracy & Phonics', href: '#academics-phonics' },
      { label: 'Outdoor Forest Discovery', href: '#academics-forest' },
    ],
  },
  {
    id: 'primary-school',
    title: 'Primary School',
    ageSpan: 'Grades 1 – 5 (Ages 6 – 10)',
    curriculumBadge: 'Cambridge Primary + Core',
    summary: 'Rigor meets exploratory wonder. Core mastery in computational thinking, scientific discovery, literature, and global languages.',
    keyLinks: [
      { label: 'Cambridge Primary Curriculum', href: '#academics-cambridge-primary' },
      { label: 'STEAM Lab & Robotics', href: '#academics-steam' },
      { label: 'Bilingual Immersion Program', href: '#academics-languages' },
      { label: 'Visual Arts & Choir', href: '#academics-arts' },
    ],
  },
  {
    id: 'middle-school',
    title: 'Middle School',
    ageSpan: 'Grades 6 – 8 (Ages 11 – 13)',
    curriculumBadge: 'Cambridge Lower Secondary',
    summary: 'Fostering analytical independence, ethical debating, experimental science, and prep for Dual Track senior qualifications.',
    keyLinks: [
      { label: 'Cambridge Lower Secondary (Checkpoint)', href: '#academics-checkpoint' },
      { label: 'Integrated Science & Physics Labs', href: '#academics-science-labs' },
      { label: 'Model United Nations & Oratory', href: '#academics-mun' },
      { label: 'Computational Logic & AI Literacy', href: '#academics-cs' },
    ],
  },
  {
    id: 'senior-school',
    title: 'Senior School',
    ageSpan: 'Grades 9 – 12 (Ages 14 – 18)',
    curriculumBadge: 'Matric/FSc & O/A Levels',
    summary: 'Premier dual-track certification: Cambridge International O/A Levels alongside National Matriculation & FSc Pre-Med / Pre-Eng.',
    keyLinks: [
      { label: 'Cambridge IGCSE & O-Levels', href: '#academics-o-levels', badge: 'Cambridge' },
      { label: 'Cambridge Advanced A-Levels', href: '#academics-a-levels', badge: 'Pre-Uni' },
      { label: 'Matriculation (Science & Arts)', href: '#academics-matric', badge: 'BISE' },
      { label: 'FSc Pre-Medical & Pre-Engineering', href: '#academics-fsc', badge: 'BISE Pre-Med' },
      { label: 'Ivy League & Global Placement Cell', href: '#academics-college-counseling' },
    ],
  },
];

export const PORTAL_ITEMS: PortalLink[] = [
  {
    id: 'student-portal',
    name: 'Student Portal',
    description: 'Class timetables, LMS coursework, lecture notes, gradebooks & library digital archive.',
    audience: 'Current Students',
    href: '#portal-student',
    iconName: 'GraduationCap',
  },
  {
    id: 'parent-gateway',
    name: 'Parent Gateway',
    description: 'Attendance tracking, fee vouchers, teacher conference appointments & term progress reports.',
    audience: 'Parents & Guardians',
    href: '#portal-parent',
    iconName: 'Users',
  },
  {
    id: 'faculty-intranet',
    name: 'Faculty & Staff Intranet',
    description: 'Curriculum syllabi, research grants repository, grading portal & administrative desk.',
    audience: 'Faculty Members',
    href: '#portal-faculty',
    iconName: 'BookOpen',
  },
  {
    id: 'alumni-network',
    name: 'Alumni Network',
    description: 'Global chapter directory, mentorship exchange, honorary fellowships & annual gala.',
    audience: 'Graduates & Fellows',
    href: '#portal-alumni',
    iconName: 'Compass',
  },
];

export const NAV_TABS: NavTabConfig[] = [
  {
    id: 'about',
    label: 'About Us',
    href: '#about-us',
    hasDropdown: true,
    sections: [
      {
        title: 'Institutional Pedigree',
        items: [
          { label: 'Chancellor & Rector Welcome', href: '#about-chancellor', description: 'Vision for humane leadership & discovery' },
          { label: 'History, Crest & Motto', href: '#about-history', description: 'Established with classical rigor and progressive vision' },
          { label: 'Governance & Academic Council', href: '#about-governance', description: 'Distinguished trustees, scholars & regents' },
        ],
      },
      {
        title: 'Accreditation & Standards',
        items: [
          { label: 'Cambridge International Partner', href: '#about-cambridge', description: 'Certified Cambridge International School' },
          { label: 'Federal & Provincial Affiliations', href: '#about-bise', description: 'Registered with HEC & BISE Boards' },
          { label: 'Faculty Fellowship Directory', href: '#about-faculty', description: 'Over 85% doctoral & master degree holders' },
        ],
      },
    ],
    featured: {
      tag: 'Heritage & Legacy',
      title: 'A Tradition of Humane Inquiry',
      description: 'Ranked in the top echelon of independent academic foundations with state-of-the-art laboratory infrastructure.',
      ctaText: 'Explore Our Creed',
      ctaHref: '#about-creed',
    },
  },
  {
    id: 'academics',
    label: 'Academics',
    href: '#academics-overview',
    hasDropdown: true,
    featured: {
      tag: 'Academic Distinction',
      title: 'Cambridge O/A Levels & Matric/FSc Dual Streams',
      description: 'Ranked #1 for regional university placements. In 2026, 94% of senior candidates secured top distinctions with full merit admissions.',
      ctaText: 'Download Academic Prospectus',
      ctaHref: '#download-prospectus',
      badge: '2026/2027 Syllabus',
    },
  },
  {
    id: 'campus-life',
    label: 'Campus Life',
    href: '#campus-life',
    hasDropdown: true,
    sections: [
      {
        title: 'Societies & Co-Curriculars',
        items: [
          { label: 'Parliamentary Debating Union', href: '#life-debating', description: 'National and international trophy winners' },
          { label: 'Robotics & AI Guild', href: '#life-robotics', description: 'Hardware labs, hackathons & autonomous rovers' },
          { label: 'Performing Arts Conservatory', href: '#life-drama', description: 'Annual Shakespeare play & classical symphony' },
        ],
      },
      {
        title: 'Athletics & Pastoral Care',
        items: [
          { label: 'Aquatic Center & Olympic Turf', href: '#life-sports', description: 'Heated indoor pool, squash courts & cricket pavilion' },
          { label: 'Wellness & Student Advisory', href: '#life-wellness', description: 'Resident clinical counselors & peer tutoring' },
          { label: 'Residential House System', href: '#life-houses', description: 'Four historic houses with inter-house tournaments' },
        ],
      },
    ],
    featured: {
      tag: 'Vibrant Community',
      title: 'Beyond the Lecture Hall',
      description: '45 active societies, comprehensive athletics, and holistic pastoral care shaping empathetic global leaders.',
      ctaText: 'View Societies Calendar',
      ctaHref: '#societies',
    },
  },
  {
    id: 'admissions',
    label: 'Admissions',
    href: '#admissions',
    hasDropdown: true,
    sections: [
      {
        title: 'Entry Pathways 2027',
        items: [
          { label: 'Admission Process & Steps', href: '#adm-process', description: 'Step-by-step guidance from registration to orientation' },
          { label: 'Age Criteria & Grade Placement', href: '#adm-age', description: 'Standard cutoff dates and prerequisites' },
          { label: 'Fee Structure & Transparent Schedule', href: '#adm-fees', description: 'No hidden levies; semester breakups available' },
        ],
      },
      {
        title: 'Financial Aid & Visits',
        items: [
          { label: 'Need-Blind & Merit Scholarships', href: '#adm-scholarships', description: 'Up to 100% tuition waivers for top scholars' },
          { label: 'Book an In-Person Campus Tour', href: '#adm-tour', description: 'Meet grade heads and tour laboratory complexes' },
          { label: 'International Students Desk', href: '#adm-international', description: 'Visa facilitation & boarding assistance' },
        ],
      },
    ],
    featured: {
      tag: 'Cohort 2027',
      title: 'Admissions Now Active',
      description: 'Round 1 applications close soon. Submit early for priority scholarship evaluation and campus housing.',
      ctaText: 'Start Online Application',
      ctaHref: '#apply-online',
      badge: 'Applications Open',
    },
  },
  {
    id: 'news',
    label: 'News',
    href: '#news-events',
    hasDropdown: true,
    sections: [
      {
        title: 'Press & Research',
        items: [
          { label: 'University Gazette & Press', href: '#news-gazette', description: 'Quarterly institutional news and scholar op-eds' },
          { label: 'Faculty Research Breakthroughs', href: '#news-research', description: 'Peer-reviewed contributions and grant awards' },
          { label: 'Student Achievements & Laurels', href: '#news-honors', description: 'Olympiad medals and scholarship recipients' },
        ],
      },
      {
        title: 'Upcoming Events',
        items: [
          { label: 'Annual Science & Tech Symposium', href: '#events-symposium', description: 'Featuring keynote addresses by Nobel laureates' },
          { label: 'Winter Convocation Ceremony', href: '#events-convocation', description: 'Commencement address for graduating cohorts' },
          { label: 'Inter-Collegiate Sports Gala', href: '#events-gala', description: '12 universities competing in track & field' },
        ],
      },
    ],
    featured: {
      tag: 'Latest Headline',
      title: 'Mount Uni Scholars Win International Physics Olympiad',
      description: 'A 5-member student delegation brings home two Gold and three Silver medals from Zurich.',
      ctaText: 'Read Full Press Release',
      ctaHref: '#news-olympiad',
    },
  },
  {
    id: 'portals',
    label: 'Portals',
    href: '#portals',
    hasDropdown: true,
    sections: [
      {
        title: 'Authorized Gateways',
        items: [
          { label: 'Student Management Portal', href: '#portal-student', description: 'Coursework, grades, schedule, and fees' },
          { label: 'Parent Engagement Portal', href: '#portal-parent', description: 'Direct updates, fee receipts & report cards' },
          { label: 'Faculty Academic System', href: '#portal-faculty', description: 'Rosters, curriculum planning & grading' },
          { label: 'Alumni Global Registry', href: '#portal-alumni', description: 'Lifelong network, library access & events' },
        ],
      },
    ],
    featured: {
      tag: 'Unified Auth',
      title: 'Digital Campus Access',
      description: 'Secure SSO authentication with institutional credentials. Support available 24/7.',
      ctaText: 'Access IT Support Desk',
      ctaHref: '#it-helpdesk',
    },
  },
];
