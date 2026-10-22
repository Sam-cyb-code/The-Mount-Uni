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
    title: 'Prospective & Current Parent',
    tagline: 'Nurturing Academic Excellence and Moral Fortitude',
    badge: 'Admissions 2027 & Parent Gateway',
    description:
      'Discover an environment where your child is known, challenged, and supported. Explore admissions pathways from Early Years to Senior School dual streams, tuition structures, and direct teacher advisory.',
    primaryAction: { label: 'Explore Admissions 2027', href: '#admissions-apply' },
    secondaryActions: [
      { label: 'Book Campus Tour', href: '#book-tour' },
      { label: 'Fee Schedule & Aid', href: '#fee-schedule' },
      { label: 'Parent Portal Login', href: '#portal-parent' },
    ],
    keyHighlights: [
      'Dual stream: Cambridge O/A Levels & BISE Matric/FSc',
      '1:8 Faculty to Student Mentorship Ratio',
      'Resident Clinical Counselors & Health Center',
    ],
  },
  student: {
    id: 'student',
    title: 'Current Scholar',
    tagline: 'Your Intellectual and Co-Curricular Command Center',
    badge: 'Scholar Life & Portals',
    description:
      'Access university preparation counseling, digital LMS lecture materials, society schedules, robotics labs, and athletic fixtures across our collegiate quadrangles.',
    primaryAction: { label: 'Launch Student LMS', href: '#portal-student' },
    secondaryActions: [
      { label: 'Exam Timetables', href: '#timetables' },
      { label: 'Societies Directory', href: '#societies' },
      { label: 'Library Catalog & JSTOR', href: '#library' },
    ],
    keyHighlights: [
      'Access to 45 Student Guilds & Debating Union',
      'Olympic-standard Aquatics & Sports Facilities',
      'Ivy League & Global Placement Advisory',
    ],
  },
  alumni: {
    id: 'alumni',
    title: 'Alumni & Fellow',
    tagline: 'A Lifelong Fellowship of Veritas and Leadership',
    badge: 'Global Registry & Giving',
    description:
      'Stay bound to your alma mater. Network across international chapters, mentor graduating seniors, access research archives, and participate in the annual Chancellor Gala.',
    primaryAction: { label: 'Join Alumni Registry', href: '#portal-alumni' },
    secondaryActions: [
      { label: 'Mentorship Exchange', href: '#mentorship' },
      { label: 'Transcript Requests', href: '#transcripts' },
      { label: 'Endowment & Giving', href: '#giving' },
    ],
    keyHighlights: [
      'Over 14,000 alumni across 38 countries',
      'Annual Distinguished Alumni Fellowship Awards',
      'Exclusive access to campus library & symposiums',
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
