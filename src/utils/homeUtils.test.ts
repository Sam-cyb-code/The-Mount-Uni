import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getPathwayContent,
  calculateHorizontalScroll,
  getActiveStoryCardIndex,
  PATHWAY_DATA,
} from './homeUtils';

test('getPathwayContent returns correct data for parent, student, and alumni', () => {
  const parent = getPathwayContent('parent');
  assert.equal(parent.id, 'parent');
  assert.ok(parent.title.includes('Parent'));
  assert.ok(parent.keyHighlights.length >= 3);

  const student = getPathwayContent('student');
  assert.equal(student.id, 'student');
  assert.ok(student.title.includes('Scholar'));

  const alumni = getPathwayContent('alumni');
  assert.equal(alumni.id, 'alumni');
  assert.ok(alumni.keyHighlights.some((h) => h.includes('14,000')));
});

test('calculateHorizontalScroll clamps progress between 0% and maxScrollPercentage', () => {
  assert.equal(calculateHorizontalScroll(0, 4, 75), 0);
  assert.equal(calculateHorizontalScroll(0.5, 4, 75), -37.5);
  assert.equal(calculateHorizontalScroll(1, 4, 75), -75);
  assert.equal(calculateHorizontalScroll(1.5, 4, 75), -75); // clamped
  assert.equal(calculateHorizontalScroll(-0.5, 4, 75), 0); // clamped
});

test('getActiveStoryCardIndex returns correct index across 4 cards', () => {
  assert.equal(getActiveStoryCardIndex(0, 4), 0);
  assert.equal(getActiveStoryCardIndex(0.24, 4), 0);
  assert.equal(getActiveStoryCardIndex(0.26, 4), 1);
  assert.equal(getActiveStoryCardIndex(0.51, 4), 2);
  assert.equal(getActiveStoryCardIndex(0.76, 4), 3);
  assert.equal(getActiveStoryCardIndex(0.99, 4), 3);
  assert.equal(getActiveStoryCardIndex(1, 4), 3);
});
