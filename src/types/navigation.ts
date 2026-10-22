export type TabKey = 'about' | 'academics' | 'campus-life' | 'admissions' | 'news' | 'portals';

export interface AcademicLevel {
  id: string;
  title: string;
  ageSpan: string;
  curriculumBadge: string;
  summary: string;
  keyLinks: Array<{ label: string; href: string; badge?: string }>;
}

export interface NavSection {
  title: string;
  description?: string;
  items: Array<{
    label: string;
    href: string;
    description?: string;
    isExternal?: boolean;
    badge?: string;
  }>;
}

export interface FeaturedSpotlight {
  tag: string;
  title: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  badge?: string;
}

export interface NavTabConfig {
  id: TabKey;
  label: string;
  href: string;
  hasDropdown?: boolean;
  featured?: FeaturedSpotlight;
  sections?: NavSection[];
}

export interface EmergencyNotice {
  id: string;
  priority: 'urgent' | 'announcement' | 'admissions';
  text: string;
  badge: string;
  actionLabel?: string;
  actionHref?: string;
}

export interface PortalLink {
  id: string;
  name: string;
  description: string;
  audience: string;
  href: string;
  iconName: 'GraduationCap' | 'Users' | 'BookOpen' | 'Key' | 'Compass';
}
