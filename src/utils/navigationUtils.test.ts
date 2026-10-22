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

test('searchNavigation returns matching academic levels and links for Cambridge and Matric', () => {
  const cambridgeResults = searchNavigation('Cambridge', NAV_TABS, ACADEMIC_LEVELS);
  assert.ok(cambridgeResults.length > 0);
  assert.ok(cambridgeResults.some((r) => r.title.includes('Cambridge') || r.category.includes('Cambridge')));

  const matricResults = searchNavigation('Matric', NAV_TABS, ACADEMIC_LEVELS);
  assert.ok(matricResults.length > 0);
  assert.ok(matricResults.some((r) => r.title.includes('Matric') || r.description?.includes('Matric') || r.category.includes('Senior School')));
});

test('resolveActiveTabFromHash identifies valid tabs', () => {
  assert.equal(resolveActiveTabFromHash('#academics-overview', NAV_TABS), 'academics');
  assert.equal(resolveActiveTabFromHash('#about-us', NAV_TABS), 'about');
  assert.equal(resolveActiveTabFromHash('#unknown-random', NAV_TABS), null);
});
