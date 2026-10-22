import { AcademicLevel, EmergencyNotice, NavTabConfig, PortalLink, TabKey } from '../types/navigation';

/**
 * Searches across all navigation items and academic levels for matching keywords.
 */
export function searchNavigation(
  query: string,
  tabs: NavTabConfig[],
  academicLevels: AcademicLevel[]
): Array<{ title: string; href: string; category: string; description?: string }> {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) return [];

  const results: Array<{ title: string; href: string; category: string; description?: string }> = [];

  // Search in tabs & dropdown items
  for (const tab of tabs) {
    if (tab.label.toLowerCase().includes(cleanQuery)) {
      results.push({
        title: tab.label,
        href: tab.href,
        category: 'Main Menu',
        description: `Navigate to ${tab.label}`,
      });
    }

    if (tab.sections) {
      for (const section of tab.sections) {
        for (const item of section.items) {
          if (
            item.label.toLowerCase().includes(cleanQuery) ||
            (item.description && item.description.toLowerCase().includes(cleanQuery))
          ) {
            results.push({
              title: item.label,
              href: item.href,
              category: `${tab.label} / ${section.title}`,
              description: item.description,
            });
          }
        }
      }
    }
  }

  // Search academic levels specifically
  for (const lvl of academicLevels) {
    if (
      lvl.title.toLowerCase().includes(cleanQuery) ||
      lvl.summary.toLowerCase().includes(cleanQuery) ||
      lvl.curriculumBadge.toLowerCase().includes(cleanQuery)
    ) {
      results.push({
        title: `${lvl.title} (${lvl.curriculumBadge})`,
        href: `#academics-${lvl.id}`,
        category: 'Academics Programs',
        description: lvl.summary,
      });
    }

    for (const link of lvl.keyLinks) {
      if (link.label.toLowerCase().includes(cleanQuery)) {
        results.push({
          title: link.label,
          href: link.href,
          category: `Academics / ${lvl.title}`,
          description: link.badge ? `Track: ${link.badge}` : undefined,
        });
      }
    }
  }

  return results;
}

/**
 * Checks whether an admissions announcement is active in the emergency notice feed.
 */
export function hasActiveAdmissionsNotice(notices: EmergencyNotice[]): boolean {
  return notices.some(
    (n) => n.priority === 'admissions' || n.text.toLowerCase().includes('admissions open')
  );
}

/**
 * Finds a portal by identifier.
 */
export function getPortalById(portals: PortalLink[], id: string): PortalLink | undefined {
  return portals.find((p) => p.id === id);
}

/**
 * Maps a hash or path to a TabKey.
 */
export function resolveActiveTabFromHash(hash: string, tabs: NavTabConfig[]): TabKey | null {
  if (!hash) return null;
  const cleanHash = hash.replace(/^#/, '').toLowerCase();
  for (const tab of tabs) {
    if (tab.id === cleanHash || tab.href.replace(/^#/, '').toLowerCase() === cleanHash) {
      return tab.id;
    }
  }
  return null;
}
