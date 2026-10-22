import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateInstitutionalFees,
  validateCandidateApplication,
} from './feeCalculatorUtils.ts';

test('calculateInstitutionalFees computes exact breakdown for Cambridge A-Levels', () => {
  const result = calculateInstitutionalFees({
    gradeFee: {
      admissionFee: 110000,
      securityDeposit: 50000,
      monthlyTuition: 78000,
    },
    transportFee: 12500, // Zone 2
    facilityFees: [6500, 8000], // Robotics + Olympiad
  });

  assert.equal(result.admissionFee, 110000);
  assert.equal(result.securityDeposit, 50000);
  assert.equal(result.monthlyTuition, 78000);
  assert.equal(result.facilityTotal, 14500);
  assert.equal(result.regularMonthlyTotal, 78000 + 12500 + 14500); // 105,000
  assert.equal(result.firstMonthTotal, 110000 + 50000 + 105000); // 265,000
});

test('validateCandidateApplication detects invalid emails and missing phone numbers', () => {
  const invalid = validateCandidateApplication({
    studentName: 'Al',
    parentEmail: 'bad-email-format',
    parentPhone: 'abc',
    agreeToTerms: false,
  });

  assert.equal(invalid.isValid, false);
  assert.ok(invalid.errors.studentName);
  assert.ok(invalid.errors.parentEmail);
  assert.ok(invalid.errors.parentPhone);
  assert.ok(invalid.errors.agreeToTerms);

  const valid = validateCandidateApplication({
    studentName: 'Zayd Alexander Hashmi',
    parentEmail: 'guardian@themountuni.org',
    parentPhone: '+92 300 1234567',
    agreeToTerms: true,
  });

  assert.equal(valid.isValid, true);
  assert.equal(Object.keys(valid.errors).length, 0);
});
