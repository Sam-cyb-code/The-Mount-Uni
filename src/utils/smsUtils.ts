export interface SubjectScore {
  name: string;
  maxMarks: number;
  passingMarks: number;
  obtainedMarks: number;
}

export interface StudentAcademicSummary {
  totalMarks: number;
  totalObtained: number;
  percentage: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  division: '1st Division (Distinction)' | '1st Division' | '2nd Division' | '3rd Division' | 'Fail';
  remarks: string;
}

export function calculateGrade(percentage: number): {
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  division: '1st Division (Distinction)' | '1st Division' | '2nd Division' | '3rd Division' | 'Fail';
  remarks: string;
} {
  if (percentage >= 85) {
    return {
      grade: 'A+',
      division: '1st Division (Distinction)',
      remarks: 'Outstanding pre-cadet performance. Exemplary discipline, spoken English fluency, and academic consistency.',
    };
  }
  if (percentage >= 75) {
    return {
      grade: 'A',
      division: '1st Division',
      remarks: 'Very good academic performance with consistent conduct during morning drill and classroom exercises.',
    };
  }
  if (percentage >= 65) {
    return {
      grade: 'B',
      division: '1st Division',
      remarks: 'Satisfactory progress. Encouraged to allocate additional evening study hours to Mathematics and Sciences.',
    };
  }
  if (percentage >= 50) {
    return {
      grade: 'C',
      division: '2nd Division',
      remarks: 'Average performance. Needs targeted teacher mentoring in core subjects.',
    };
  }
  if (percentage >= 40) {
    return {
      grade: 'D',
      division: '3rd Division',
      remarks: 'Below acceptable cadet standards. Parent-teacher conference required.',
    };
  }
  return {
    grade: 'F',
    division: 'Fail',
    remarks: 'Unsatisfactory. Mandatory remedial sessions scheduled.',
  };
}

export function computeAcademicSummary(scores: SubjectScore[]): StudentAcademicSummary {
  const totalMarks = scores.reduce((sum, s) => sum + s.maxMarks, 0);
  const totalObtained = scores.reduce((sum, s) => sum + s.obtainedMarks, 0);
  const percentage = totalMarks > 0 ? Math.round((totalObtained / totalMarks) * 1000) / 10 : 0;
  const { grade, division, remarks } = calculateGrade(percentage);

  return {
    totalMarks,
    totalObtained,
    percentage,
    grade,
    division,
    remarks,
  };
}

export interface FeeChallanData {
  challanNo: string;
  rollNo: string;
  studentName: string;
  fatherName: string;
  className: string;
  month: string;
  tuitionFee: number;
  cadetFund: number;
  labFund: number;
  examFee: number;
  lateFeeSurcharge: number;
  totalWithinDue: number;
  totalAfterDue: number;
}

export function generateChallanData(
  rollNo: string,
  studentName: string,
  fatherName: string,
  className: string,
  month = 'October 2026'
): FeeChallanData {
  // Base rates in PKR
  const isSecondary = className.includes('9') || className.includes('10');
  const isMiddle = className.includes('6') || className.includes('7') || className.includes('8');
  
  const tuitionFee = isSecondary ? 5000 : isMiddle ? 4500 : 3800;
  const cadetFund = isMiddle || isSecondary ? 1200 : 800;
  const labFund = isSecondary ? 1000 : 600;
  const examFee = 500;
  const lateFeeSurcharge = 250;

  const totalWithinDue = tuitionFee + cadetFund + labFund + examFee;
  const totalAfterDue = totalWithinDue + lateFeeSurcharge;

  return {
    challanNo: `TMU-2026-CH-${rollNo.padStart(4, '0')}`,
    rollNo,
    studentName,
    fatherName,
    className,
    month,
    tuitionFee,
    cadetFund,
    labFund,
    examFee,
    lateFeeSurcharge,
    totalWithinDue,
    totalAfterDue,
  };
}

export function getHouseAssignment(rollNo: string): { houseName: string; houseColor: string } {
  const num = parseInt(rollNo, 10) || 101;
  const houses = [
    { houseName: 'Iqbal House', houseColor: '#0F5132' },
    { houseName: 'Jinnah House', houseColor: '#1E40AF' },
    { houseName: 'Sir Syed House', houseColor: '#B45309' },
    { houseName: 'Johar House', houseColor: '#7C3AED' },
  ];
  return houses[num % houses.length];
}
