import { test } from 'node:test';
import assert from 'node:assert';
import {
  calculateGrade,
  computeAcademicSummary,
  generateChallanData,
  getHouseAssignment,
  SubjectScore,
} from './smsUtils';

test('calculateGrade returns A+ and distinction for scores >= 85%', () => {
  const result = calculateGrade(88.4);
  assert.strictEqual(result.grade, 'A+');
  assert.strictEqual(result.division, '1st Division (Distinction)');
  assert(result.remarks.includes('Outstanding pre-cadet performance'));
});

test('calculateGrade handles passing, average, and failing bounds', () => {
  assert.strictEqual(calculateGrade(76).grade, 'A');
  assert.strictEqual(calculateGrade(68).grade, 'B');
  assert.strictEqual(calculateGrade(52).grade, 'C');
  assert.strictEqual(calculateGrade(44).grade, 'D');
  assert.strictEqual(calculateGrade(35).grade, 'F');
});

test('computeAcademicSummary computes aggregate marks, percentage, and grade', () => {
  const scores: SubjectScore[] = [
    { name: 'English Language', maxMarks: 100, passingMarks: 40, obtainedMarks: 88 },
    { name: 'Urdu Adab', maxMarks: 100, passingMarks: 40, obtainedMarks: 84 },
    { name: 'Mathematics', maxMarks: 100, passingMarks: 40, obtainedMarks: 92 },
    { name: 'General Science', maxMarks: 100, passingMarks: 40, obtainedMarks: 86 },
    { name: 'Islamiyat', maxMarks: 50, passingMarks: 20, obtainedMarks: 46 },
    { name: 'Pakistan Studies', maxMarks: 50, passingMarks: 20, obtainedMarks: 43 },
    { name: 'Computer Studies', maxMarks: 50, passingMarks: 20, obtainedMarks: 47 },
  ];

  const summary = computeAcademicSummary(scores);
  assert.strictEqual(summary.totalMarks, 550);
  assert.strictEqual(summary.totalObtained, 486);
  assert.strictEqual(summary.percentage, 88.4);
  assert.strictEqual(summary.grade, 'A+');
  assert.strictEqual(summary.division, '1st Division (Distinction)');
});

test('generateChallanData calculates correct PKR fee structure and challan number', () => {
  const challan = generateChallanData('101', 'Muhammad Rayan', 'Tariq Mehmood', 'Class 8');
  assert.strictEqual(challan.challanNo, 'TMU-2026-CH-0101');
  assert.strictEqual(challan.tuitionFee, 4500);
  assert.strictEqual(challan.cadetFund, 1200);
  assert.strictEqual(challan.labFund, 600);
  assert.strictEqual(challan.examFee, 500);
  assert.strictEqual(challan.totalWithinDue, 6800);
  assert.strictEqual(challan.totalAfterDue, 7050);
});

test('getHouseAssignment assigns deterministic house by roll number', () => {
  const h101 = getHouseAssignment('101');
  const h102 = getHouseAssignment('102');
  assert(typeof h101.houseName === 'string');
  assert(h101.houseName.includes('House'));
  assert(typeof h102.houseName === 'string');
});
