export interface FeeCalculationInput {
  gradeFee: { admissionFee: number; securityDeposit: number; monthlyTuition: number };
  transportFee: number;
  facilityFees: number[];
}

export interface FeeCalculationResult {
  admissionFee: number;
  securityDeposit: number;
  monthlyTuition: number;
  transportFee: number;
  facilityTotal: number;
  regularMonthlyTotal: number;
  firstMonthTotal: number;
}

export function calculateInstitutionalFees(input: FeeCalculationInput): FeeCalculationResult {
  const { gradeFee, transportFee, facilityFees } = input;
  const facilityTotal = facilityFees.reduce((acc, curr) => acc + curr, 0);
  const regularMonthlyTotal = gradeFee.monthlyTuition + transportFee + facilityTotal;
  const firstMonthTotal = gradeFee.admissionFee + gradeFee.securityDeposit + regularMonthlyTotal;

  return {
    admissionFee: gradeFee.admissionFee,
    securityDeposit: gradeFee.securityDeposit,
    monthlyTuition: gradeFee.monthlyTuition,
    transportFee,
    facilityTotal,
    regularMonthlyTotal,
    firstMonthTotal,
  };
}

export function validateCandidateApplication(formData: {
  studentName: string;
  parentEmail: string;
  parentPhone: string;
  agreeToTerms: boolean;
}): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^(\+?[0-9\s\-]{9,18})$/;

  if (!formData.studentName.trim() || formData.studentName.trim().length < 3) {
    errors.studentName = 'Candidate name must be at least 3 characters.';
  }
  if (!emailRegex.test(formData.parentEmail)) {
    errors.parentEmail = 'Invalid parent email address.';
  }
  if (!phoneRegex.test(formData.parentPhone)) {
    errors.parentPhone = 'Invalid phone number format.';
  }
  if (!formData.agreeToTerms) {
    errors.agreeToTerms = 'Agreement to terms is required.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
