import test from 'node:test';
import assert from 'node:assert/strict';
import {
  searchNavigation,
  hasActiveAdmissionsNotice,
  getPortalById,
  resolveActiveTabFromHash,
} from './navigationUtils';
import { ACADEMIC_LEVELS, EMERGENCY_NOTICES, NAV_TABS, PORTAL_ITEMS } from '../data/navigationData';

test('hasActiveAdmissionsNotice detects Admissions 2027 in notices', () => {
  const result = hasActiveAdmissionsNotice(EMERGENCY_NOTICES);
  assert.equal(result, true);

  const emptyResult = hasActiveAdmissionsNotice([]);
  assert.equal(emptyResult, false);
});

test('getPortalById returns the correct portal or undefined', () => {
  const studentPortal = getPortalById(PORTAL_ITEMS, 'student-portal');
  assert.ok(studentPortal);
  assert.equal(studentPortal.name, 'Student Portal');

  const invalid = getPortalById(PORTAL_ITEMS, 'non-existent');
  assert.equal(invalid, undefined);
});

test('searchNavigation returns matching academic levels and links for Primary and Secondary', () => {
  const primaryResults = searchNavigation('Primary', NAV_TABS, ACADEMIC_LEVELS);
  assert.ok(primaryResults.length > 0);
  assert.ok(primaryResults.some((r) => r.title.includes('Primary') || r.category.includes('Primary')));

  const secondaryResults = searchNavigation('Secondary', NAV_TABS, ACADEMIC_LEVELS);
  assert.ok(secondaryResults.length > 0);
  assert.ok(secondaryResults.some((r) => r.title.includes('Secondary') || r.description?.includes('Secondary') || r.category.includes('Secondary')));
});

test('resolveActiveTabFromHash identifies valid tabs', () => {
  assert.equal(resolveActiveTabFromHash('#academics-overview', NAV_TABS), 'academics');
  assert.equal(resolveActiveTabFromHash('#about-us', NAV_TABS), 'about');
  assert.equal(resolveActiveTabFromHash('#unknown-random', NAV_TABS), null);
});
