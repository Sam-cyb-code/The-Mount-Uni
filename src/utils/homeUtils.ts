export type PathwayRole = 'parent' | 'student' | 'alumni';

export interface PathwayDetails {
  id: PathwayRole;
  title: string;
  tagline: string;
  badge: string;
  description: string;
  primaryAction: { label: string; href: string };
  secondaryActions: Array<{ label: string; href: string }>;
  keyHighlights: string[];
}

export const PATHWAY_DATA: Record<PathwayRole, PathwayDetails> = {
  parent: {
    id: 'parent',
    title: 'Prospective & Current Parents',
    tagline: 'Nurturing Character, Discipline, and Academic Excellence',
    badge: 'Classes 1–10 Admissions',
    description:
      'We welcome parents seeking a disciplined, supportive school for Classes 1 through 10. Learn about our structured curriculum, transparent fee schedule, safe campus, and dedicated teachers.',
    primaryAction: { label: 'Apply for Classes 1–10', href: '#admissions-apply' },
    secondaryActions: [
      { label: 'View School Location', href: '#location' },
      { label: 'Fee Schedule Calculator', href: '#fee-schedule' },
      { label: 'Parent Portal Login', href: '#portal-parent' },
    ],
    keyHighlights: [
      'Comprehensive curriculum spanning Classes 1 through 10',
      'Focused attention with caring and experienced teachers',
      'Dedicated B2 Reading Room and school library for student study',
    ],
  },
  student: {
    id: 'student',
    title: 'Enrolled Students (Classes 1–10)',
    tagline: 'Your Daily Learning and Academic Hub',
    badge: 'Student Resources',
    description:
      'Access class timetables, examination schedules, homework updates, and discover quiet reading hours at our B2 Library Reading Room.',
    primaryAction: { label: 'Student Portal Access', href: '#portal-student' },
    secondaryActions: [
      { label: 'Exam Timetables', href: '#timetables' },
      { label: 'Subject Syllabus (Classes 1–10)', href: '#academics-showcase' },
      { label: 'B2 Reading Room Hours', href: '#facilities-library' },
    ],
    keyHighlights: [
      'Spacious, sunlit classrooms designed for focused study',
      'Active science experiments and computer studies',
      'Quiet library study alcove with inspiring reading culture',
    ],
  },
  alumni: {
    id: 'alumni',
    title: 'School Alumni & Graduates',
    tagline: 'Carrying Forward Integrity and Knowledge',
    badge: 'Graduates Circle',
    description:
      'Connecting our Matriculation graduates who completed Class 10 at our institution and are now pursuing successful careers across diverse fields.',
    primaryAction: { label: 'Alumni Network', href: '#portal-alumni' },
    secondaryActions: [
      { label: 'School Location & Visit', href: '#location' },
      { label: 'Transcript & Records', href: '#transcripts' },
      { label: 'Contact School Office', href: '#contact' },
    ],
    keyHighlights: [
      'Strong network of secondary school matriculation graduates',
      'Mentorship for junior students completing Class 9 and 10',
      'Lifelong bond with teachers and school community',
    ],
  },
};

export function getPathwayContent(role: PathwayRole): PathwayDetails {
  return PATHWAY_DATA[role] || PATHWAY_DATA.parent;
}

/**
 * Calculates horizontal scroll offset as a percentage for N cards.
 * @param progress Value between 0 and 1
 * @param totalCards Number of cards
 * @param maxScrollPercentage Maximum translation (typically between 60% and 75%)
 */
export function calculateHorizontalScroll(
  progress: number,
  totalCards: number = 4,
  maxScrollPercentage: number = 75
): number {
  const clampedProgress = Math.max(0, Math.min(1, progress));
  const val = -(clampedProgress * maxScrollPercentage);
  return val === 0 ? 0 : val;
}

/**
 * Determines which storytelling card is currently in focus based on scroll progress.
 */
export function getActiveStoryCardIndex(progress: number, totalCards: number = 4): number {
  const clamped = Math.max(0, Math.min(0.999, progress));
  return Math.floor(clamped * totalCards);
}
