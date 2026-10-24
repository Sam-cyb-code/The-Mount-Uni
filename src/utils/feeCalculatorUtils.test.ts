import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateInstitutionalFees,
  validateCandidateApplication,
} from './feeCalculatorUtils.ts';

test('calculateInstitutionalFees computes exact breakdown for Classes 9-10 Secondary School', () => {
  const result = calculateInstitutionalFees({
    gradeFee: {
      admissionFee: 25000,
      securityDeposit: 10000,
      monthlyTuition: 15000,
    },
    transportFee: 4500, // School Bus Service
    facilityFees: [2000, 1500], // Science Lab + Computer Lab
  });

  assert.equal(result.admissionFee, 25000);
  assert.equal(result.securityDeposit, 10000);
  assert.equal(result.monthlyTuition, 15000);
  assert.equal(result.facilityTotal, 3500);
  assert.equal(result.regularMonthlyTotal, 15000 + 4500 + 3500); // 23,000
  assert.equal(result.firstMonthTotal, 25000 + 10000 + 23000); // 58,000
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
