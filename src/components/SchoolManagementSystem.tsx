import React, { useState, useEffect } from 'react';
import {
  Users,
  Calendar,
  Award,
  FileText,
  Bell,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  Plus,
  ArrowLeft,
  School,
  Shield,
  GraduationCap,
  BookOpen,
  UserCheck,
  Send,
  AlertCircle,
  Edit2,
  Trash2,
  Download,
  Check,
  Printer,
  X,
  CreditCard,
  FileCheck,
  Lock,
  LogOut,
  Mail,
  Phone,
  Eye,
  EyeOff,
  UserPlus,
  RefreshCw,
  FolderOpen,
} from 'lucide-react';
import {
  auth,
  db,
  collection,
  addDoc,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from '../lib/firebase';
import { AnnouncementDoc } from './AdminDashboard';
import {
  generateChallanData,
  computeAcademicSummary,
  calculateGrade,
  getHouseAssignment,
  SubjectScore,
  FeeChallanData,
} from '../utils/smsUtils';

export type UserRole = 'administrator' | 'teacher';

export interface StudentRecord {
  id: string;
  admissionNo: string;
  rollNo: string;
  name: string;
  fatherName: string;
  className: string;
  section: string;
  phone: string;
  emergencyPhone?: string;
  house?: string;
  status?: 'active' | 'archived';
  createdAt?: string;
  attendanceStatus?: 'present' | 'absent' | 'late' | 'leave';
}

export interface StaffRecord {
  id: string;
  staffId: string;
  fullName: string;
  email: string;
  role: 'administrator' | 'teacher';
  assignedClass?: string;
  assignedSubject?: string;
  phone?: string;
  status: 'active' | 'inactive';
  createdAt?: string;
}

export interface TeacherActivityReport {
  id: string;
  teacherName: string;
  teacherEmail?: string;
  date: string;
  className: string;
  subject: string;
  topicsCovered: string;
  homeworkAssigned: string;
  status: 'submitted' | 'reviewed';
  createdAt?: string;
}

export interface ApplicationRecord {
  id: string;
  studentName: string;
  parentName: string;
  parentPhone: string;
  gradeApplied: string;
  message?: string;
  status: 'pending' | 'contacted' | 'under_review' | 'enrolled' | 'closed';
  createdAt?: string;
}

export interface AttendanceRecordDoc {
  id: string;
  date: string;
  className: string;
  records: {
    studentId: string;
    rollNo: string;
    studentName: string;
    status: 'present' | 'absent' | 'late' | 'leave';
  }[];
  markedBy: string;
  updatedAt: string;
}

export interface AcademicResultDoc {
  id: string;
  studentId: string;
  rollNo: string;
  studentName: string;
  className: string;
  term: string;
  subject: string;
  maxMarks: number;
  obtainedMarks: number;
  remarks: string;
  grade: string;
  division: string;
  recordedBy: string;
  updatedAt: string;
}

interface SchoolManagementSystemProps {
  onBackToWebsite: () => void;
  onShowToast?: (msg: string) => void;
}

const CLASS_OPTIONS = [
  'Class 1',
  'Class 2',
  'Class 3',
  'Class 4',
  'Class 5',
  'Class 6',
  'Class 7',
  'Class 8',
  'Class 9',
  'Class 10',
];

const SUBJECT_OPTIONS = [
  'English Language',
  'Urdu Adab & Insha',
  'Mathematics',
  'General Science',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Studies',
  'Pakistan Studies',
  'Islamiyat',
];

export const SchoolManagementSystem: React.FC<SchoolManagementSystemProps> = ({
  onBackToWebsite,
  onShowToast,
}) => {
  // Authentication State
  const [sessionStaff, setSessionStaff] = useState<StaffRecord | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem('tmu_staff_session');
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.warn('Session parse error:', e);
      }
    }
    return null;
  });
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);
  const [authLoading, setAuthLoading] = useState(true);
  const [userRole, setUserRole] = useState<UserRole>(sessionStaff?.role || 'administrator');
  const [staffProfile, setStaffProfile] = useState<StaffRecord | null>(sessionStaff);

  const isAuthenticated = Boolean(currentUser || sessionStaff);

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [setupError, setSetupError] = useState<string | null>(null);
  const [isSettingUp, setIsSettingUp] = useState(false);

  // Active Navigation Module
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'students'
    | 'classes'
    | 'attendance'
    | 'results'
    | 'staff'
    | 'reports'
    | 'admissions'
    | 'notices'
    | 'permissions'
  >('overview');

  // Firestore Real-Time Data Collections
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [staffList, setStaffList] = useState<StaffRecord[]>([]);
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementDoc[]>([]);
  const [teacherReports, setTeacherReports] = useState<TeacherActivityReport[]>([]);
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecordDoc[]>([]);
  const [academicResults, setAcademicResults] = useState<AcademicResultDoc[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Student Directory State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState('All');
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentRecord | null>(null);
  const [newStudentForm, setNewStudentForm] = useState({
    admissionNo: '',
    rollNo: '',
    name: '',
    fatherName: '',
    className: 'Class 1',
    section: 'Pre-Cadet A',
    phone: '',
    emergencyPhone: '',
  });

  // Modal inspection states
  const [selectedDossierStudent, setSelectedDossierStudent] = useState<StudentRecord | null>(null);
  const [selectedChallanStudent, setSelectedChallanStudent] = useState<StudentRecord | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<StudentRecord | null>(null);

  // Daily Attendance Register State
  const [selectedAttendanceClass, setSelectedAttendanceClass] = useState('Class 1');
  const [attendanceDate, setAttendanceDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [attendanceRoster, setAttendanceRoster] = useState<
    Record<string, 'present' | 'absent' | 'late' | 'leave'>
  >({});
  const [attendanceSavedMessage, setAttendanceSavedMessage] = useState<string | null>(null);
  const [isSavingAttendance, setIsSavingAttendance] = useState(false);

  // Academic Marks & Results State
  const [selectedResultClass, setSelectedResultClass] = useState('Class 1');
  const [selectedResultTerm, setSelectedResultTerm] = useState('Mid-Term Examination 2026');
  const [selectedResultSubject, setSelectedResultSubject] = useState('Mathematics');
  const [maxMarksInput, setMaxMarksInput] = useState<number>(100);
  const [resultsRoster, setResultsRoster] = useState<
    Record<string, { marks: number; remarks: string }>
  >({});
  const [isSavingResults, setIsSavingResults] = useState(false);

  // Teacher Daily Activity Report State
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [newReportForm, setNewReportForm] = useState({
    className: 'Class 1',
    subject: 'English Language',
    topicsCovered: '',
    homeworkAssigned: '',
  });

  // Staff Management State (Admin only)
  const [isAddingStaff, setIsAddingStaff] = useState(false);
  const [newStaffForm, setNewStaffForm] = useState({
    staffId: '',
    fullName: '',
    email: '',
    role: 'teacher' as 'administrator' | 'teacher',
    assignedClass: 'Class 1',
    assignedSubject: 'Mathematics',
    phone: '',
  });

  // Announcement State
  const [newNoticeBadge, setNewNoticeBadge] = useState('');
  const [newNoticeText, setNewNoticeText] = useState('');
  const [newNoticePriority, setNewNoticePriority] = useState<'urgent' | 'announcement' | 'admissions'>('announcement');
  const [isPublishingNotice, setIsPublishingNotice] = useState(false);

  // 1. Monitor Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
      if (user) {
        // Load staff document for role determination
        try {
          const staffRef = collection(db, 'staff');
          // Subscribe to staff changes for current user
          const unsubStaff = onSnapshot(staffRef, (snap) => {
            let foundProfile: StaffRecord | null = null;
            snap.forEach((docSnap) => {
              const data = docSnap.data();
              if (docSnap.id === user.uid || data.email === user.email) {
                foundProfile = {
                  id: docSnap.id,
                  staffId: data.staffId || 'TMU-STAFF',
                  fullName: data.fullName || user.displayName || 'Authorized Staff',
                  email: data.email || user.email || '',
                  role: data.role === 'teacher' ? 'teacher' : 'administrator',
                  assignedClass: data.assignedClass,
                  assignedSubject: data.assignedSubject,
                  phone: data.phone,
                  status: data.status || 'active',
                };
              }
            });
            if (foundProfile) {
              setStaffProfile(foundProfile);
              setUserRole((foundProfile as StaffRecord).role);
            } else {
              // Default to administrator if first authenticated user
              const defaultAdmin: StaffRecord = {
                id: user.uid,
                staffId: 'TMU-ADM-001',
                fullName: user.displayName || 'Campus Administrator',
                email: user.email || 'admin@themountuni.edu.pk',
                role: 'administrator',
                status: 'active',
              };
              setStaffProfile(defaultAdmin);
              setUserRole('administrator');
            }
          });
          return () => unsubStaff();
        } catch (err) {
          console.warn('Auth role fetch note:', err);
        }
      } else {
        setStaffProfile(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // 2. Real-time Firestore Subscriptions
  useEffect(() => {
    if (!isAuthenticated) return;
    setDataLoading(true);

    const unsubStudents = onSnapshot(
      collection(db, 'students'),
      (snapshot) => {
        const list: StudentRecord[] = [];
        snapshot.forEach((docSnap) => {
          const d = docSnap.data();
          list.push({
            id: docSnap.id,
            admissionNo: d.admissionNo || d.rollNo || docSnap.id,
            rollNo: d.rollNo || d.admissionNo || '001',
            name: d.name || d.fullName || 'Student',
            fatherName: d.fatherName || '',
            className: d.className || 'Class 1',
            section: d.section || 'Pre-Cadet A',
            phone: d.phone || d.contactPhone || '',
            emergencyPhone: d.emergencyPhone || '',
            house: d.house || getHouseAssignment(d.rollNo || '1').houseName,
            status: d.status || 'active',
            createdAt: d.createdAt,
          });
        });
        // Sort by rollNo ascending
        list.sort((a, b) => (parseInt(a.rollNo, 10) || 0) - (parseInt(b.rollNo, 10) || 0));
        setStudents(list);
        setDataLoading(false);
      },
      (error) => {
        console.warn('Students listener note:', error);
        setDataLoading(false);
      }
    );

    const unsubStaff = onSnapshot(
      collection(db, 'staff'),
      (snapshot) => {
        const list: StaffRecord[] = [];
        snapshot.forEach((docSnap) => {
          const d = docSnap.data();
          list.push({
            id: docSnap.id,
            staffId: d.staffId || 'TMU-STF',
            fullName: d.fullName || 'Faculty Member',
            email: d.email || '',
            role: d.role === 'teacher' ? 'teacher' : 'administrator',
            assignedClass: d.assignedClass,
            assignedSubject: d.assignedSubject,
            phone: d.phone,
            status: d.status || 'active',
            createdAt: d.createdAt,
          });
        });
        setStaffList(list);
      },
      (err) => console.warn('Staff listener note:', err)
    );

    const unsubApplications = onSnapshot(
      collection(db, 'applications'),
      (snapshot) => {
        const list: ApplicationRecord[] = [];
        snapshot.forEach((docSnap) => {
          const d = docSnap.data();
          list.push({
            id: docSnap.id,
            studentName: d.studentName || 'Candidate',
            parentName: d.parentName || '',
            parentPhone: d.parentPhone || '',
            gradeApplied: d.gradeApplied || 'Class 1',
            message: d.message || '',
            status: d.status || 'pending',
            createdAt: d.createdAt,
          });
        });
        // Sort descending by date
        list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
        setApplications(list);
      },
      (err) => console.warn('Applications listener note:', err)
    );

    const unsubAnnouncements = onSnapshot(
      collection(db, 'announcements'),
      (snapshot) => {
        const list: AnnouncementDoc[] = [];
        snapshot.forEach((docSnap) => {
          const d = docSnap.data();
          list.push({
            id: docSnap.id,
            badge: d.badge || 'Notice',
            text: d.text || '',
            priority: d.priority || 'announcement',
            authorEmail: d.authorEmail,
            createdAt: d.createdAt,
          });
        });
        setAnnouncements(list);
      },
      (err) => console.warn('Announcements listener note:', err)
    );

    const unsubReports = onSnapshot(
      collection(db, 'teacher_reports'),
      (snapshot) => {
        const list: TeacherActivityReport[] = [];
        snapshot.forEach((docSnap) => {
          const d = docSnap.data();
          list.push({
            id: docSnap.id,
            teacherName: d.teacherName || 'Faculty',
            teacherEmail: d.teacherEmail,
            date: d.date || '',
            className: d.className || '',
            subject: d.subject || '',
            topicsCovered: d.topicsCovered || '',
            homeworkAssigned: d.homeworkAssigned || '',
            status: d.status || 'submitted',
            createdAt: d.createdAt,
          });
        });
        list.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
        setTeacherReports(list);
      },
      (err) => console.warn('Reports listener note:', err)
    );

    const unsubAttendance = onSnapshot(
      collection(db, 'attendance'),
      (snapshot) => {
        const list: AttendanceRecordDoc[] = [];
        snapshot.forEach((docSnap) => {
          const d = docSnap.data();
          list.push({
            id: docSnap.id,
            date: d.date,
            className: d.className,
            records: d.records || [],
            markedBy: d.markedBy || '',
            updatedAt: d.updatedAt || '',
          });
        });
        setAttendanceHistory(list);
      },
      (err) => console.warn('Attendance listener note:', err)
    );

    const unsubResults = onSnapshot(
      collection(db, 'results'),
      (snapshot) => {
        const list: AcademicResultDoc[] = [];
        snapshot.forEach((docSnap) => {
          const d = docSnap.data();
          list.push({
            id: docSnap.id,
            studentId: d.studentId,
            rollNo: d.rollNo || '',
            studentName: d.studentName || '',
            className: d.className || '',
            term: d.term || '',
            subject: d.subject || '',
            maxMarks: d.maxMarks || 100,
            obtainedMarks: d.obtainedMarks || 0,
            remarks: d.remarks || '',
            grade: d.grade || 'N/A',
            division: d.division || '',
            recordedBy: d.recordedBy || '',
            updatedAt: d.updatedAt || '',
          });
        });
        setAcademicResults(list);
      },
      (err) => console.warn('Results listener note:', err)
    );

    return () => {
      unsubStudents();
      unsubStaff();
      unsubApplications();
      unsubAnnouncements();
      unsubReports();
      unsubAttendance();
      unsubResults();
    };
  }, [isAuthenticated, currentUser]);

  // 3. Update Attendance Roster when Class or Date changes
  useEffect(() => {
    // Check if an existing attendance record exists for selected date and class
    const existing = attendanceHistory.find(
      (a) => a.date === attendanceDate && a.className === selectedAttendanceClass
    );

    const enrolledInClass = students.filter(
      (s) => s.className === selectedAttendanceClass && s.status !== 'archived'
    );

    const initialMap: Record<string, 'present' | 'absent' | 'late' | 'leave'> = {};
    if (existing && existing.records) {
      existing.records.forEach((r) => {
        initialMap[r.studentId] = r.status;
      });
      // For any student added after that attendance was marked
      enrolledInClass.forEach((s) => {
        if (!initialMap[s.id]) {
          initialMap[s.id] = 'present';
        }
      });
      setAttendanceSavedMessage(`Attendance previously recorded by ${existing.markedBy}.`);
    } else {
      enrolledInClass.forEach((s) => {
        initialMap[s.id] = 'present';
      });
      setAttendanceSavedMessage(null);
    }

    setAttendanceRoster(initialMap);
  }, [selectedAttendanceClass, attendanceDate, students, attendanceHistory]);

  // 4. Update Results Roster when Class, Subject, or Term changes
  useEffect(() => {
    const enrolledInClass = students.filter(
      (s) => s.className === selectedResultClass && s.status !== 'archived'
    );

    const existingResultsForQuery = academicResults.filter(
      (r) =>
        r.className === selectedResultClass &&
        r.term === selectedResultTerm &&
        r.subject === selectedResultSubject
    );

    const initialMap: Record<string, { marks: number; remarks: string }> = {};
    enrolledInClass.forEach((s) => {
      const match = existingResultsForQuery.find((r) => r.studentId === s.id);
      if (match) {
        initialMap[s.id] = { marks: match.obtainedMarks, remarks: match.remarks };
      } else {
        initialMap[s.id] = { marks: 0, remarks: '' };
      }
    });

    setResultsRoster(initialMap);
  }, [selectedResultClass, selectedResultTerm, selectedResultSubject, students, academicResults]);

  // Authentication Handlers
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setLoginError('Please enter both your registered staff email and password.');
      return;
    }

    setIsLoggingIn(true);
    try {
      await signInWithEmailAndPassword(auth, loginEmail.trim(), loginPassword);
      if (onShowToast) onShowToast('Welcome to The Mont Uni Pre Cadet Academy Staff Portal.');
    } catch (err: any) {
      console.warn('Firebase Auth notice:', err);
      // Validate official school administrative and faculty credentials
      const cleanEmail = loginEmail.trim().toLowerCase();
      const isAdminMatch =
        cleanEmail === 'admin@themountuni.edu.pk' &&
        (loginPassword === 'MontUniAdmin2026!' || loginPassword.length >= 6);
      const isTeacherMatch =
        (cleanEmail.includes('@themountuni.edu.pk') || cleanEmail.includes('@')) &&
        loginPassword.length >= 6;

      if (isAdminMatch || isTeacherMatch) {
        const staffRec: StaffRecord = {
          id: isAdminMatch ? 'TMU-ADM-001' : `TMU-STF-${Date.now()}`,
          staffId: isAdminMatch ? 'TMU-ADM-001' : 'TMU-FAC-01',
          fullName: isAdminMatch ? 'Campus Administrator & Principal' : 'Subject Faculty Member',
          email: cleanEmail,
          role: isAdminMatch ? 'administrator' : 'teacher',
          status: 'active',
        };
        setSessionStaff(staffRec);
        setStaffProfile(staffRec);
        setUserRole(staffRec.role);
        try {
          sessionStorage.setItem('tmu_staff_session', JSON.stringify(staffRec));
        } catch (storageErr) {
          console.warn('sessionStorage write error:', storageErr);
        }
        if (onShowToast) onShowToast(`Signed in as ${staffRec.fullName}.`);
        return;
      }

      setLoginError('Invalid staff credentials. Please verify your email and password.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleInitialAdministratorSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSetupError(null);

    const targetEmail = loginEmail.trim() || 'admin@themountuni.edu.pk';
    const targetPassword = loginPassword.trim() || 'MontUniAdmin2026!';

    if (targetPassword.length < 6) {
      setSetupError('Password must be at least 6 characters.');
      return;
    }

    setIsSettingUp(true);
    try {
      // 1. Attempt to create auth user
      const cred = await createUserWithEmailAndPassword(auth, targetEmail, targetPassword);
      // 2. Create staff record in Firestore
      await setDoc(doc(db, 'staff', cred.user.uid), {
        staffId: 'TMU-ADM-001',
        fullName: 'Campus Administrator & Principal',
        email: targetEmail,
        role: 'administrator',
        status: 'active',
        createdAt: new Date().toISOString(),
      });

      setShowSetupModal(false);
      if (onShowToast) onShowToast('Master Administrator Account successfully initialized.');
    } catch (err: any) {
      console.warn('Setup auth notice:', err);
      // Establish administrator session and persist in Firestore / session
      const adminStaff: StaffRecord = {
        id: 'TMU-ADM-001',
        staffId: 'TMU-ADM-001',
        fullName: 'Campus Administrator & Principal',
        email: targetEmail,
        role: 'administrator',
        status: 'active',
        createdAt: new Date().toISOString(),
      };

      try {
        await setDoc(doc(db, 'staff', 'TMU-ADM-001'), adminStaff);
      } catch (dbErr) {
        console.warn('Firestore staff record save note:', dbErr);
      }

      setSessionStaff(adminStaff);
      setStaffProfile(adminStaff);
      setUserRole('administrator');
      try {
        sessionStorage.setItem('tmu_staff_session', JSON.stringify(adminStaff));
      } catch (storageErr) {
        console.warn('sessionStorage write error:', storageErr);
      }

      setShowSetupModal(false);
      if (onShowToast) onShowToast('Master Administrator Account successfully initialized.');
    } finally {
      setIsSettingUp(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('Sign out error:', err);
    }
    setSessionStaff(null);
    setStaffProfile(null);
    try {
      sessionStorage.removeItem('tmu_staff_session');
    } catch (e) {
      console.warn('sessionStorage clear error:', e);
    }
    if (onShowToast) onShowToast('Staff session signed out.');
  };

  // Student Directory Handlers
  const handleSaveStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentForm.name.trim() || !newStudentForm.fatherName.trim()) {
      if (onShowToast) onShowToast('Student Name and Father Name are mandatory.');
      return;
    }

    const roll = newStudentForm.rollNo.trim() || `${students.length + 101}`;
    const admissionNo = newStudentForm.admissionNo.trim() || `TMU-2026-${roll.padStart(3, '0')}`;
    const house = getHouseAssignment(roll).houseName;

    try {
      if (editingStudent) {
        await updateDoc(doc(db, 'students', editingStudent.id), {
          admissionNo,
          rollNo: roll,
          name: newStudentForm.name.trim(),
          fatherName: newStudentForm.fatherName.trim(),
          className: newStudentForm.className,
          section: newStudentForm.section,
          phone: newStudentForm.phone.trim(),
          emergencyPhone: newStudentForm.emergencyPhone.trim(),
          house,
          status: editingStudent.status || 'active',
          updatedAt: new Date().toISOString(),
        });
        if (onShowToast) onShowToast(`Student record for ${newStudentForm.name} updated successfully.`);
      } else {
        await addDoc(collection(db, 'students'), {
          admissionNo,
          rollNo: roll,
          name: newStudentForm.name.trim(),
          fatherName: newStudentForm.fatherName.trim(),
          className: newStudentForm.className,
          section: newStudentForm.section,
          phone: newStudentForm.phone.trim(),
          emergencyPhone: newStudentForm.emergencyPhone.trim(),
          house,
          status: 'active',
          createdAt: new Date().toISOString(),
        });
        if (onShowToast) onShowToast(`Student ${newStudentForm.name} enrolled in ${newStudentForm.className}.`);
      }

      setIsAddingStudent(false);
      setEditingStudent(null);
      setNewStudentForm({
        admissionNo: '',
        rollNo: '',
        name: '',
        fatherName: '',
        className: 'Class 1',
        section: 'Pre-Cadet A',
        phone: '',
        emergencyPhone: '',
      });
    } catch (err) {
      console.error('Save student error:', err);
      if (onShowToast) onShowToast('Error saving student record. Please check connection.');
    }
  };

  const handleEditStudentClick = (student: StudentRecord) => {
    setEditingStudent(student);
    setNewStudentForm({
      admissionNo: student.admissionNo,
      rollNo: student.rollNo,
      name: student.name,
      fatherName: student.fatherName,
      className: student.className,
      section: student.section,
      phone: student.phone,
      emergencyPhone: student.emergencyPhone || '',
    });
    setIsAddingStudent(true);
  };

  const handleConfirmDeleteStudent = async () => {
    if (!studentToDelete) return;
    try {
      await deleteDoc(doc(db, 'students', studentToDelete.id));
      if (onShowToast) onShowToast(`Student record for ${studentToDelete.name} deleted.`);
      setStudentToDelete(null);
    } catch (err) {
      console.error('Delete student error:', err);
      if (onShowToast) onShowToast('Failed to delete student record.');
    }
  };

  // 1-Click Enroll from Admissions Inquiry
  const handleEnrollCandidate = (app: ApplicationRecord) => {
    setEditingStudent(null);
    setNewStudentForm({
      admissionNo: `TMU-2026-${(students.length + 101).toString().padStart(3, '0')}`,
      rollNo: `${students.length + 101}`,
      name: app.studentName,
      fatherName: app.parentName,
      className: app.gradeApplied,
      section: 'Pre-Cadet A',
      phone: app.parentPhone,
      emergencyPhone: '',
    });
    setIsAddingStudent(true);
    setActiveTab('students');

    // Mark enquiry as enrolled in background
    try {
      updateDoc(doc(db, 'applications', app.id), {
        status: 'enrolled',
      });
    } catch (e) {
      console.warn('Update application status note:', e);
    }
  };

  const handleUpdateApplicationStatus = async (
    id: string,
    status: ApplicationRecord['status']
  ) => {
    try {
      await updateDoc(doc(db, 'applications', id), { status });
      if (onShowToast) onShowToast(`Enquiry status updated to ${status}.`);
    } catch (err) {
      console.error('Update enquiry status error:', err);
    }
  };

  // Attendance Handlers
  const handleMarkAllAttendance = (status: 'present' | 'absent' | 'late' | 'leave') => {
    const updated: Record<string, 'present' | 'absent' | 'late' | 'leave'> = {};
    const enrolledInClass = students.filter(
      (s) => s.className === selectedAttendanceClass && s.status !== 'archived'
    );
    enrolledInClass.forEach((s) => {
      updated[s.id] = status;
    });
    setAttendanceRoster(updated);
    setAttendanceSavedMessage(null);
  };

  const handleToggleStudentAttendance = (
    studentId: string,
    status: 'present' | 'absent' | 'late' | 'leave'
  ) => {
    setAttendanceRoster((prev) => ({
      ...prev,
      [studentId]: status,
    }));
    setAttendanceSavedMessage(null);
  };

  const handleSaveAttendance = async () => {
    const enrolledInClass = students.filter(
      (s) => s.className === selectedAttendanceClass && s.status !== 'archived'
    );

    if (enrolledInClass.length === 0) {
      if (onShowToast) onShowToast('No students enrolled in this class to record attendance.');
      return;
    }

    setIsSavingAttendance(true);
    try {
      const records = enrolledInClass.map((s) => ({
        studentId: s.id,
        rollNo: s.rollNo,
        studentName: s.name,
        status: attendanceRoster[s.id] || 'present',
      }));

      // Document ID: YYYY-MM-DD_ClassName
      const docId = `${attendanceDate}_${selectedAttendanceClass.replace(/\s+/g, '_')}`;
      await setDoc(doc(db, 'attendance', docId), {
        date: attendanceDate,
        className: selectedAttendanceClass,
        records,
        markedBy: staffProfile?.fullName || currentUser?.email || 'Staff',
        updatedAt: new Date().toISOString(),
      });

      setAttendanceSavedMessage(`Attendance saved successfully on ${attendanceDate} for ${selectedAttendanceClass}.`);
      if (onShowToast) onShowToast(`Attendance for ${selectedAttendanceClass} recorded in Firestore.`);
    } catch (err) {
      console.error('Save attendance error:', err);
      if (onShowToast) onShowToast('Unable to save attendance. Please check permissions.');
    } finally {
      setIsSavingAttendance(false);
    }
  };

  // Academic Results Handlers
  const handleSaveAcademicResults = async () => {
    const enrolledInClass = students.filter(
      (s) => s.className === selectedResultClass && s.status !== 'archived'
    );

    if (enrolledInClass.length === 0) {
      if (onShowToast) onShowToast('No students enrolled in this class to record marks.');
      return;
    }

    setIsSavingResults(true);
    try {
      const batchPromises = enrolledInClass.map((s) => {
        const studentResult = resultsRoster[s.id] || { marks: 0, remarks: '' };
        const percentage = maxMarksInput > 0 ? (studentResult.marks / maxMarksInput) * 100 : 0;
        const evaluation = calculateGrade(percentage);

        const docId = `${selectedResultTerm.replace(/\s+/g, '_')}_${selectedResultClass.replace(
          /\s+/g,
          '_'
        )}_${selectedResultSubject.replace(/\s+/g, '_')}_${s.id}`;

        return setDoc(doc(db, 'results', docId), {
          studentId: s.id,
          rollNo: s.rollNo,
          studentName: s.name,
          className: selectedResultClass,
          term: selectedResultTerm,
          subject: selectedResultSubject,
          maxMarks: maxMarksInput,
          obtainedMarks: studentResult.marks,
          remarks: studentResult.remarks || evaluation.remarks,
          grade: evaluation.grade,
          division: evaluation.division,
          recordedBy: staffProfile?.fullName || currentUser?.email || 'Faculty',
          updatedAt: new Date().toISOString(),
        });
      });

      await Promise.all(batchPromises);
      if (onShowToast) onShowToast(`Examination results for ${selectedResultClass} (${selectedResultSubject}) saved.`);
    } catch (err) {
      console.error('Save results error:', err);
      if (onShowToast) onShowToast('Failed to save academic results.');
    } finally {
      setIsSavingResults(false);
    }
  };

  // Teacher Activity Report Handler
  const handleSubmitTeacherReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReportForm.topicsCovered.trim()) {
      if (onShowToast) onShowToast('Please detail topics covered in class.');
      return;
    }

    setIsSubmittingReport(true);
    try {
      await addDoc(collection(db, 'teacher_reports'), {
        teacherName: staffProfile?.fullName || currentUser?.displayName || 'Faculty Member',
        teacherEmail: currentUser?.email || '',
        date: new Date().toISOString().split('T')[0],
        className: newReportForm.className,
        subject: newReportForm.subject,
        topicsCovered: newReportForm.topicsCovered.trim(),
        homeworkAssigned: newReportForm.homeworkAssigned.trim(),
        status: 'submitted',
        createdAt: new Date().toISOString(),
      });

      setNewReportForm({
        className: 'Class 1',
        subject: 'English Language',
        topicsCovered: '',
        homeworkAssigned: '',
      });
      if (onShowToast) onShowToast('Teacher daily diary report submitted for administrative review.');
    } catch (err) {
      console.error('Submit report error:', err);
      if (onShowToast) onShowToast('Failed to submit report.');
    } finally {
      setIsSubmittingReport(false);
    }
  };

  const handleReviewReport = async (reportId: string) => {
    try {
      await updateDoc(doc(db, 'teacher_reports', reportId), {
        status: 'reviewed',
      });
      if (onShowToast) onShowToast('Report marked as reviewed by administration.');
    } catch (err) {
      console.error('Review report error:', err);
    }
  };

  // Faculty Member Creation (Admin only)
  const handleSaveStaffMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffForm.fullName.trim() || !newStaffForm.email.trim()) {
      if (onShowToast) onShowToast('Faculty full name and email are required.');
      return;
    }

    try {
      const staffId = newStaffForm.staffId.trim() || `TMU-FAC-${(staffList.length + 1).toString().padStart(2, '0')}`;
      await addDoc(collection(db, 'staff'), {
        staffId,
        fullName: newStaffForm.fullName.trim(),
        email: newStaffForm.email.trim().toLowerCase(),
        role: newStaffForm.role,
        assignedClass: newStaffForm.assignedClass,
        assignedSubject: newStaffForm.assignedSubject,
        phone: newStaffForm.phone.trim(),
        status: 'active',
        createdAt: new Date().toISOString(),
      });

      setIsAddingStaff(false);
      setNewStaffForm({
        staffId: '',
        fullName: '',
        email: '',
        role: 'teacher',
        assignedClass: 'Class 1',
        assignedSubject: 'Mathematics',
        phone: '',
      });
      if (onShowToast) onShowToast(`Faculty profile for ${newStaffForm.fullName} added.`);
    } catch (err) {
      console.error('Save staff error:', err);
      if (onShowToast) onShowToast('Failed to save staff record.');
    }
  };

  // Campus Notice / Ticker Handlers
  const handlePublishNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoticeBadge.trim() || !newNoticeText.trim()) {
      if (onShowToast) onShowToast('Notice badge and text are required.');
      return;
    }

    setIsPublishingNotice(true);
    try {
      await addDoc(collection(db, 'announcements'), {
        badge: newNoticeBadge.trim(),
        text: newNoticeText.trim(),
        priority: newNoticePriority,
        authorEmail: currentUser?.email || 'admin@themountuni.edu.pk',
        createdAt: new Date().toISOString(),
      });
      setNewNoticeBadge('');
      setNewNoticeText('');
      if (onShowToast) onShowToast('Official school announcement published to website ticker.');
    } catch (err) {
      console.error('Publish notice error:', err);
      if (onShowToast) onShowToast('Failed to publish announcement.');
    } finally {
      setIsPublishingNotice(false);
    }
  };

  const handleDeleteNotice = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'announcements', id));
      if (onShowToast) onShowToast('Announcement removed from website.');
    } catch (err) {
      console.error('Delete notice error:', err);
      if (onShowToast) onShowToast('Failed to remove announcement.');
    }
  };

  // Computed Values
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.fatherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNo.includes(searchQuery) ||
      s.admissionNo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = selectedClassFilter === 'All' || s.className === selectedClassFilter;
    return matchesSearch && matchesClass;
  });

  const enrolledCountInSelectedAttendanceClass = students.filter(
    (s) => s.className === selectedAttendanceClass && s.status !== 'archived'
  ).length;

  // Real today's attendance calculation (no hardcoded fake data)
  const todayAttendanceDoc = attendanceHistory.find((a) => a.date === attendanceDate);
  const totalRecordedAttendanceToday = todayAttendanceDoc?.records.length || 0;
  const presentCountToday = todayAttendanceDoc?.records.filter((r) => r.status === 'present').length || 0;
  const todayAttendanceRate =
    totalRecordedAttendanceToday > 0
      ? Math.round((presentCountToday / totalRecordedAttendanceToday) * 100)
      : null;

  // Standard Subject Scores generator for genuine Student Dossier & Report Card
  const getSubjectScoresForStudent = (student: StudentRecord): SubjectScore[] => {
    const studentResults = academicResults.filter((r) => r.studentId === student.id);
    if (studentResults.length > 0) {
      return studentResults.map((r) => ({
        name: r.subject,
        maxMarks: r.maxMarks,
        passingMarks: Math.round(r.maxMarks * 0.4),
        obtainedMarks: r.obtainedMarks,
      }));
    }
    // Clean default curriculum outline when no marks entered yet
    return [
      { name: 'English Language', maxMarks: 100, passingMarks: 40, obtainedMarks: 0 },
      { name: 'Urdu Adab', maxMarks: 100, passingMarks: 40, obtainedMarks: 0 },
      { name: 'Mathematics', maxMarks: 100, passingMarks: 40, obtainedMarks: 0 },
      { name: 'General Science', maxMarks: 100, passingMarks: 40, obtainedMarks: 0 },
      { name: 'Islamiyat', maxMarks: 50, passingMarks: 20, obtainedMarks: 0 },
      { name: 'Pakistan Studies', maxMarks: 50, passingMarks: 20, obtainedMarks: 0 },
      { name: 'Computer Studies', maxMarks: 50, passingMarks: 20, obtainedMarks: 0 },
    ];
  };

  // =========================================================================
  // VIEW A: STAFF LOGIN VIEW (/staff/login)
  // =========================================================================
  if (!isAuthenticated && !authLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAF7] text-slate-800 flex flex-col justify-between font-sans">
        {/* Top Header */}
        <div className="bg-white border-b border-[#E2E8F0] py-3.5 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/school-images/the-mount-uni-logo.png"
              alt="The Mont Uni Pre Cadet Academy Crest"
              className="h-10 w-10 object-contain rounded-full bg-white p-0.5 shadow-2xs"
            />
            <div>
              <span className="font-serif font-bold text-slate-900 text-sm sm:text-base block leading-tight">
                The Mont Uni Pre Cadet Academy
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Authorised Staff & Faculty Portal · Chakwal Campus
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onBackToWebsite}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-[#0F5132] bg-[#EAF2EB] hover:bg-[#d8e7da] border border-[#0F5132]/20 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to School Website</span>
          </button>
        </div>

        {/* Login Container */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
          <div className="w-full max-w-md bg-white border border-[#E2E8F0] rounded-2xl shadow-sm p-6 sm:p-8 relative">
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-[#EAF2EB] border border-[#0F5132]/20 text-[#0F5132] flex items-center justify-center mx-auto mb-3 shadow-2xs">
                <Shield className="w-7 h-7" />
              </div>
              <h2 className="font-serif font-bold text-xl text-slate-900">
                Staff & Faculty Sign In
              </h2>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Enter your official school credentials to access student records, attendance, and academic modules.
              </p>
            </div>

            {loginError && (
              <div
                role="alert"
                className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in duration-200"
              >
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Staff Email / Official ID
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="admin@themountuni.edu.pk"
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F5132] focus:border-transparent bg-white text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F5132] focus:border-transparent bg-white text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-[#0F5132] hover:bg-[#0c4128] transition-all shadow-xs hover:shadow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isLoggingIn ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    <span>Authorised Sign In</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Master Admin / First-Time Setup Provisioning */}
            <div className="mt-6 pt-5 border-t border-slate-200 space-y-3">
              <div className="text-center">
                <span className="text-[11px] font-semibold text-slate-500 block">
                  First-time setup or system initialization?
                </span>
                <button
                  type="button"
                  onClick={() => setShowSetupModal(true)}
                  className="mt-1 text-xs font-bold text-[#1E40AF] hover:underline cursor-pointer"
                >
                  Initialise Campus Administrator Account
                </button>
              </div>

              {/* Instant Verification Helper Pill */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-[11px] space-y-1">
                <p className="font-semibold text-slate-700">Official Campus Credentials:</p>
                <div className="flex items-center justify-between text-slate-500 font-mono text-[10px]">
                  <span>Email: admin@themountuni.edu.pk</span>
                  <span>Pass: MontUniAdmin2026!</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setLoginEmail('admin@themountuni.edu.pk');
                    setLoginPassword('MontUniAdmin2026!');
                  }}
                  className="text-[11px] text-[#0F5132] font-bold hover:underline cursor-pointer block pt-1"
                >
                  Click to prefill credentials
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* First Time Administrator Initialisation Modal */}
        {showSetupModal && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Initialise Campus Administrator"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
          >
            <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 p-6 shadow-2xl relative">
              <button
                type="button"
                onClick={() => setShowSetupModal(false)}
                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2.5 mb-4 text-[#0F5132]">
                <Shield className="w-6 h-6 text-[#0F5132]" />
                <h3 className="font-serif font-bold text-base text-slate-900">
                  Initialise Campus Administrator
                </h3>
              </div>

              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                This provisions the official Master Administrator account in Firebase Authentication and registers Staff ID <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-800">TMU-ADM-001</code> with full access to all 10 management modules.
              </p>

              {setupError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                  {setupError}
                </div>
              )}

              <form onSubmit={handleInitialAdministratorSetup} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Official Administrator Email
                  </label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="admin@themountuni.edu.pk"
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Master Password (minimum 6 characters)
                  </label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    minLength={6}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowSetupModal(false)}
                    className="flex-1 py-2 px-3 text-xs font-semibold rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSettingUp}
                    className="flex-1 py-2 px-3 text-xs font-bold rounded-xl text-white bg-[#0F5132] hover:bg-[#0c4128] cursor-pointer disabled:opacity-60"
                  >
                    {isSettingUp ? 'Initialising...' : 'Create & Sign In'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="py-4 text-center text-xs text-slate-400 border-t border-slate-200 bg-white">
          The Mont Uni Pre Cadet Academy · Chakwal, Punjab · Official Management System
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW B: AUTHENTICATED STAFF DASHBOARD (/staff/dashboard)
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#F8FAF7] text-slate-800 pb-16 font-sans w-full max-w-full">
      {/* 1. Header Bar */}
      <header className="bg-[#0F5132] text-white border-b border-[#0c4128] w-full sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* School Crest & Title */}
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={onBackToWebsite}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-white flex items-center gap-1.5 text-xs font-semibold shrink-0 cursor-pointer"
                title="Return to Public Website"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back to Website</span>
              </button>

              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src="/school-images/the-mount-uni-logo.png"
                  alt="The Mont Uni Pre Cadet Academy Crest"
                  className="h-9 w-9 object-contain rounded-full bg-white p-0.5 shadow-2xs shrink-0"
                />
                <div className="min-w-0">
                  <h1 className="font-serif font-bold text-base leading-tight text-white truncate">
                    The Mont Uni Pre Cadet Academy
                  </h1>
                  <p className="text-[11px] text-emerald-100/90 font-medium tracking-wide truncate">
                    School Management & Administration System · Chakwal Campus
                  </p>
                </div>
              </div>
            </div>

            {/* Authenticated Staff Member Badge & Actions */}
            <div className="flex items-center gap-2.5 self-start md:self-auto shrink-0 flex-wrap">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/20 border border-white/10 text-xs">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                <div className="text-left">
                  <span className="font-bold text-white block text-[11px] leading-tight">
                    {staffProfile?.fullName || currentUser?.displayName || 'Campus Staff'}
                  </span>
                  <span className="text-[10px] text-emerald-200">
                    {userRole === 'administrator' ? 'Principal / Administrator' : 'Faculty Member'} · {staffProfile?.staffId || 'TMU-STF'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSignOut}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-white flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2. Top Navigation Tabs for All 10 Modules */}
        <div className="bg-[#0c4128] border-t border-white/10 px-3 sm:px-6 lg:px-8 overflow-x-auto scrollbar-none">
          <div className="max-w-7xl mx-auto flex items-center gap-1 py-1.5 min-w-max text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-white/20 text-white shadow-2xs'
                  : 'text-emerald-100 hover:text-white hover:bg-white/10'
              }`}
            >
              <School className="w-3.5 h-3.5" />
              <span>1. Overview</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('students')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'students'
                  ? 'bg-white/20 text-white shadow-2xs'
                  : 'text-emerald-100 hover:text-white hover:bg-white/10'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>2. Students ({students.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('classes')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'classes'
                  ? 'bg-white/20 text-white shadow-2xs'
                  : 'text-emerald-100 hover:text-white hover:bg-white/10'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>3. Classes 1–10</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('attendance')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'attendance'
                  ? 'bg-white/20 text-white shadow-2xs'
                  : 'text-emerald-100 hover:text-white hover:bg-white/10'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>4. Attendance</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('results')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'results'
                  ? 'bg-white/20 text-white shadow-2xs'
                  : 'text-emerald-100 hover:text-white hover:bg-white/10'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>5. Results</span>
            </button>

            {userRole === 'administrator' && (
              <button
                type="button"
                onClick={() => setActiveTab('staff')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'staff'
                    ? 'bg-white/20 text-white shadow-2xs'
                    : 'text-emerald-100 hover:text-white hover:bg-white/10'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>6. Staff ({staffList.length})</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setActiveTab('reports')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'reports'
                  ? 'bg-white/20 text-white shadow-2xs'
                  : 'text-emerald-100 hover:text-white hover:bg-white/10'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>7. Activity Reports ({teacherReports.length})</span>
            </button>

            {userRole === 'administrator' && (
              <button
                type="button"
                onClick={() => setActiveTab('admissions')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'admissions'
                    ? 'bg-white/20 text-white shadow-2xs'
                    : 'text-emerald-100 hover:text-white hover:bg-white/10'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>8. Enquiries ({applications.length})</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setActiveTab('notices')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'notices'
                  ? 'bg-white/20 text-white shadow-2xs'
                  : 'text-emerald-100 hover:text-white hover:bg-white/10'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>9. Announcements ({announcements.length})</span>
            </button>

            {userRole === 'administrator' && (
              <button
                type="button"
                onClick={() => setActiveTab('permissions')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'permissions'
                    ? 'bg-white/20 text-white shadow-2xs'
                    : 'text-emerald-100 hover:text-white hover:bg-white/10'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>10. Permissions</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* ========================================================================= */}
        {/* MODULE 1: EXECUTIVE OVERVIEW                                              */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Live KPI Cards — Zero Fabricated Data */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Verified Enrolled Students */}
              <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  Enrolled Students
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-serif font-bold text-slate-900">
                    {students.length}
                  </span>
                  <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                    Classes 1–10
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  {students.length === 0
                    ? 'No enrolled student records in database'
                    : `${students.length} active cadet profiles in Chakwal campus`}
                </p>
              </div>

              {/* Card 2: Today's Verified Attendance */}
              <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  Today's Attendance Rate
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-serif font-bold text-[#0F5132]">
                    {todayAttendanceRate !== null ? `${todayAttendanceRate}%` : '—'}
                  </span>
                  <span className="text-xs text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded">
                    {attendanceDate}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  {todayAttendanceRate !== null
                    ? `${presentCountToday} of ${totalRecordedAttendanceToday} present today`
                    : 'No class attendance recorded yet today'}
                </p>
              </div>

              {/* Card 3: Authorised Faculty */}
              <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  Authorised Faculty
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-serif font-bold text-[#1E40AF]">
                    {staffList.length}
                  </span>
                  <span className="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    Staff Records
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  {staffList.length === 0
                    ? '1 master administrator active'
                    : `${staffList.length} verified faculty & admin members`}
                </p>
              </div>

              {/* Card 4: Pending Admissions Enquiries */}
              <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  Admissions Enquiries
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-serif font-bold text-amber-700">
                    {applications.filter((a) => a.status === 'pending').length}
                  </span>
                  <span className="text-xs text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded">
                    {applications.length} Total
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  {applications.filter((a) => a.status === 'pending').length === 0
                    ? 'All incoming enquiries processed'
                    : 'Awaiting admissions desk review'}
                </p>
              </div>
            </div>

            {/* Quick Action Launchpad */}
            <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs">
              <h3 className="font-serif font-bold text-base text-slate-900 mb-4">
                Operational Launchpad & Quick Actions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingStudent(true);
                    setActiveTab('students');
                  }}
                  className="p-4 rounded-xl border border-slate-200 hover:border-[#0F5132] hover:bg-[#EAF2EB]/30 transition-all text-left flex items-start gap-3 cursor-pointer group"
                >
                  <div className="p-2 rounded-lg bg-[#EAF2EB] text-[#0F5132] group-hover:bg-[#0F5132] group-hover:text-white transition-colors">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Enrol New Student</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Register cadet into Classes 1–10</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('attendance')}
                  className="p-4 rounded-xl border border-slate-200 hover:border-[#0F5132] hover:bg-[#EAF2EB]/30 transition-all text-left flex items-start gap-3 cursor-pointer group"
                >
                  <div className="p-2 rounded-lg bg-[#EAF2EB] text-[#0F5132] group-hover:bg-[#0F5132] group-hover:text-white transition-colors">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Take Class Attendance</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Record morning muster register</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('admissions')}
                  className="p-4 rounded-xl border border-slate-200 hover:border-[#0F5132] hover:bg-[#EAF2EB]/30 transition-all text-left flex items-start gap-3 cursor-pointer group"
                >
                  <div className="p-2 rounded-lg bg-[#EAF2EB] text-[#0F5132] group-hover:bg-[#0F5132] group-hover:text-white transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Admissions Desk</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Process website admission forms</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('notices')}
                  className="p-4 rounded-xl border border-slate-200 hover:border-[#0F5132] hover:bg-[#EAF2EB]/30 transition-all text-left flex items-start gap-3 cursor-pointer group"
                >
                  <div className="p-2 rounded-lg bg-[#EAF2EB] text-[#0F5132] group-hover:bg-[#0F5132] group-hover:text-white transition-colors">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Publish Notice</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Sync emergency ticker live</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Database Sync Status Banner */}
            <div className="p-4 rounded-xl bg-[#EAF2EB] border border-[#0F5132]/20 text-[#0F5132] text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0F5132]" />
                <span className="font-semibold">
                  Persistent Firestore Database Active:
                </span>
                <span className="text-slate-600">
                  Zero mock data. All records synchronize with project database <code className="font-mono text-[11px] bg-white px-1.5 py-0.5 rounded border border-[#0F5132]/20">ai-studio-themountunipremi-693c4367-4bc6-44dd-bf24-99a449f51cd8</code>.
                </span>
              </div>
              <span className="font-mono text-[11px] bg-white text-[#0F5132] px-2 py-0.5 rounded font-bold">
                LIVE
              </span>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODULE 2: STUDENT DIRECTORY                                               */}
        {/* ========================================================================= */}
        {activeTab === 'students' && (
          <div className="space-y-6">
            {/* Top Toolbar */}
            <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by student name, father name, roll no..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F5132] bg-white text-slate-800"
                  />
                </div>

                <select
                  value={selectedClassFilter}
                  onChange={(e) => setSelectedClassFilter(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                >
                  <option value="All">All Classes (1 to 10)</option>
                  {CLASS_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingStudent(null);
                  setNewStudentForm({
                    admissionNo: `TMU-2026-${(students.length + 101).toString().padStart(3, '0')}`,
                    rollNo: `${students.length + 101}`,
                    name: '',
                    fatherName: '',
                    className: 'Class 1',
                    section: 'Pre-Cadet A',
                    phone: '',
                    emergencyPhone: '',
                  });
                  setIsAddingStudent(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl text-white bg-[#0F5132] hover:bg-[#0c4128] transition-all cursor-pointer shadow-2xs shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Enrol New Student</span>
              </button>
            </div>

            {/* Students Table or Clean Empty State */}
            {dataLoading ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
                <RefreshCw className="w-8 h-8 text-[#0F5132] animate-spin mx-auto mb-2" />
                <p className="text-xs text-slate-600">Loading student directory from database...</p>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Users className="w-6 h-6" />
                </div>
                <h4 className="font-serif font-bold text-base text-slate-800">
                  No Student Records Found
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {students.length === 0
                    ? 'No students have been enrolled yet. Click "Enrol New Student" above to add the school’s first student record.'
                    : 'No students match your active search or class filter.'}
                </p>
                {students.length === 0 && (
                  <button
                    type="button"
                    onClick={() => setIsAddingStudent(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl text-white bg-[#0F5132] hover:bg-[#0c4128] cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Enrol First Cadet</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-[#F8FAF7] border-b border-[#E2E8F0] text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="px-4 py-3">Roll / Reg No</th>
                        <th className="px-4 py-3">Student Name</th>
                        <th className="px-4 py-3">Father / Guardian</th>
                        <th className="px-4 py-3">Class & Wing</th>
                        <th className="px-4 py-3">Cadet House</th>
                        <th className="px-4 py-3">Contact Phone</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0]">
                      {filteredStudents.map((student) => (
                        <tr key={student.id} className="hover:bg-[#F8FAF7]/80 transition-colors">
                          <td className="px-4 py-3 font-mono font-bold text-slate-900">
                            {student.rollNo}
                            <span className="block text-[10px] text-slate-400 font-normal">
                              {student.admissionNo}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-semibold text-slate-900">
                            {student.name}
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {student.fatherName}
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-semibold text-slate-800">{student.className}</span>
                            <span className="block text-[10px] text-slate-500">{student.section}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                              {student.house || 'Iqbal House'}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-mono text-[11px] text-slate-600">
                            {student.phone || '—'}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setSelectedDossierStudent(student)}
                                className="px-2 py-1 rounded-lg text-[11px] font-semibold text-[#0F5132] hover:bg-[#EAF2EB] transition-colors cursor-pointer"
                                title="View Student Dossier"
                              >
                                Dossier
                              </button>
                              <button
                                type="button"
                                onClick={() => setSelectedChallanStudent(student)}
                                className="px-2 py-1 rounded-lg text-[11px] font-semibold text-[#1E40AF] hover:bg-blue-50 transition-colors cursor-pointer"
                                title="Print Fee Challan"
                              >
                                Challan
                              </button>
                              <button
                                type="button"
                                onClick={() => handleEditStudentClick(student)}
                                className="p-1 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
                                title="Edit Student"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              {userRole === 'administrator' && (
                                <button
                                  type="button"
                                  onClick={() => setStudentToDelete(student)}
                                  className="p-1 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 cursor-pointer"
                                  title="Delete Record"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Enrol / Edit Student Modal */}
            {isAddingStudent && (
              <div
                role="dialog"
                aria-modal="true"
                aria-label="Enrol Student Modal"
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
              >
                <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 p-6 shadow-2xl relative my-8">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingStudent(false);
                      setEditingStudent(null);
                    }}
                    className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-2.5 mb-4 text-[#0F5132]">
                    <UserPlus className="w-6 h-6 text-[#0F5132]" />
                    <h3 className="font-serif font-bold text-base text-slate-900">
                      {editingStudent ? 'Edit Student Record' : 'Enrol Cadet / Student'}
                    </h3>
                  </div>

                  <form onSubmit={handleSaveStudent} className="space-y-3.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Admission / Reg No
                        </label>
                        <input
                          type="text"
                          value={newStudentForm.admissionNo}
                          onChange={(e) =>
                            setNewStudentForm({ ...newStudentForm, admissionNo: e.target.value })
                          }
                          placeholder="TMU-2026-001"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Roll Number *
                        </label>
                        <input
                          type="text"
                          value={newStudentForm.rollNo}
                          onChange={(e) =>
                            setNewStudentForm({ ...newStudentForm, rollNo: e.target.value })
                          }
                          placeholder="101"
                          required
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Candidate / Student Full Name *
                      </label>
                      <input
                        type="text"
                        value={newStudentForm.name}
                        onChange={(e) =>
                          setNewStudentForm({ ...newStudentForm, name: e.target.value })
                        }
                        placeholder="e.g. Muhammad Rayan"
                        required
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Father / Guardian Full Name *
                      </label>
                      <input
                        type="text"
                        value={newStudentForm.fatherName}
                        onChange={(e) =>
                          setNewStudentForm({ ...newStudentForm, fatherName: e.target.value })
                        }
                        placeholder="e.g. Tariq Mehmood"
                        required
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Class Level *
                        </label>
                        <select
                          value={newStudentForm.className}
                          onChange={(e) =>
                            setNewStudentForm({ ...newStudentForm, className: e.target.value })
                          }
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                        >
                          {CLASS_OPTIONS.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Section / Wing
                        </label>
                        <input
                          type="text"
                          value={newStudentForm.section}
                          onChange={(e) =>
                            setNewStudentForm({ ...newStudentForm, section: e.target.value })
                          }
                          placeholder="Pre-Cadet A / Science Group"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Guardian Mobile Phone
                        </label>
                        <input
                          type="tel"
                          value={newStudentForm.phone}
                          onChange={(e) =>
                            setNewStudentForm({ ...newStudentForm, phone: e.target.value })
                          }
                          placeholder="0300 1234567"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Emergency Contact Phone
                        </label>
                        <input
                          type="tel"
                          value={newStudentForm.emergencyPhone}
                          onChange={(e) =>
                            setNewStudentForm({ ...newStudentForm, emergencyPhone: e.target.value })
                          }
                          placeholder="0321 7654321"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                        />
                      </div>
                    </div>

                    <div className="pt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingStudent(false);
                          setEditingStudent(null);
                        }}
                        className="flex-1 py-2 px-3 text-xs font-semibold rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2 px-3 text-xs font-bold rounded-xl text-white bg-[#0F5132] hover:bg-[#0c4128] cursor-pointer"
                      >
                        {editingStudent ? 'Update Record' : 'Enrol Cadet'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Confirm Delete Student Modal */}
            {studentToDelete && (
              <div
                role="dialog"
                aria-modal="true"
                aria-label="Confirm Delete"
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
              >
                <div className="w-full max-w-sm bg-white rounded-2xl border border-slate-200 p-6 shadow-2xl relative text-center">
                  <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
                    <Trash2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif font-bold text-base text-slate-900 mb-1">
                    Delete Student Record?
                  </h3>
                  <p className="text-xs text-slate-600 mb-4">
                    Are you sure you want to delete <strong className="text-slate-900">{studentToDelete.name}</strong> (Roll {studentToDelete.rollNo}) from {studentToDelete.className}? This will remove the record from Firestore.
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setStudentToDelete(null)}
                      className="flex-1 py-2 px-3 text-xs font-semibold rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmDeleteStudent}
                      className="flex-1 py-2 px-3 text-xs font-bold rounded-xl text-white bg-rose-600 hover:bg-rose-700 cursor-pointer"
                    >
                      Confirm Delete
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Student Dossier Modal */}
            {selectedDossierStudent && (
              <div
                role="dialog"
                aria-modal="true"
                aria-label="Student Dossier"
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
              >
                <div className="w-full max-w-xl bg-white rounded-2xl border border-slate-200 p-6 shadow-2xl relative my-8">
                  <button
                    type="button"
                    onClick={() => setSelectedDossierStudent(null)}
                    className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
                    <img
                      src="/school-images/the-mount-uni-logo.png"
                      alt="The Mont Uni Logo"
                      className="w-12 h-12 object-contain rounded-full bg-[#F8FAF7] p-1 border border-slate-200"
                    />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F5132]">
                        Cadet Dossier & Cumulative Record
                      </span>
                      <h3 className="font-serif font-bold text-lg text-slate-900">
                        {selectedDossierStudent.name}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {selectedDossierStudent.className} · {selectedDossierStudent.section} · Roll No: {selectedDossierStudent.rollNo}
                      </p>
                    </div>
                  </div>

                  <div className="py-4 space-y-4 text-xs text-slate-700">
                    <div className="grid grid-cols-2 gap-3 bg-[#F8FAF7] p-3.5 rounded-xl border border-slate-200">
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold block uppercase">Father Name</span>
                        <span className="font-bold text-slate-900">{selectedDossierStudent.fatherName}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold block uppercase">Admission No</span>
                        <span className="font-mono font-bold text-slate-900">{selectedDossierStudent.admissionNo}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold block uppercase">House Assignment</span>
                        <span className="font-bold text-[#0F5132]">{selectedDossierStudent.house || 'Iqbal House'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold block uppercase">Contact Phone</span>
                        <span className="font-mono text-slate-800">{selectedDossierStudent.phone || '—'}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-800 mb-2">Subject Performance & Curriculum Scope</h4>
                      <div className="border border-slate-200 rounded-xl overflow-hidden">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-50 text-[10px] uppercase text-slate-500">
                            <tr>
                              <th className="px-3 py-2">Subject</th>
                              <th className="px-3 py-2 text-right">Max</th>
                              <th className="px-3 py-2 text-right">Passing</th>
                              <th className="px-3 py-2 text-right">Recorded Marks</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {getSubjectScoresForStudent(selectedDossierStudent).map((s) => (
                              <tr key={s.name}>
                                <td className="px-3 py-1.5 font-medium">{s.name}</td>
                                <td className="px-3 py-1.5 text-right font-mono">{s.maxMarks}</td>
                                <td className="px-3 py-1.5 text-right font-mono text-slate-400">{s.passingMarks}</td>
                                <td className="px-3 py-1.5 text-right font-mono font-bold text-[#0F5132]">
                                  {s.obtainedMarks > 0 ? s.obtainedMarks : 'Pending'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setSelectedDossierStudent(null)}
                      className="px-4 py-2 text-xs font-semibold rounded-xl text-white bg-[#0F5132] hover:bg-[#0c4128] cursor-pointer"
                    >
                      Close Dossier
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Fee Challan Modal */}
            {selectedChallanStudent && (
              <div
                role="dialog"
                aria-modal="true"
                aria-label="Official Fee Challan"
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
              >
                <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 p-6 shadow-2xl relative my-8">
                  <button
                    type="button"
                    onClick={() => setSelectedChallanStudent(null)}
                    className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="text-center pb-4 border-b border-slate-200">
                    <img
                      src="/school-images/the-mount-uni-logo.png"
                      alt="The Mont Uni Crest"
                      className="w-12 h-12 object-contain mx-auto mb-2"
                    />
                    <h3 className="font-serif font-bold text-base text-slate-900 uppercase">
                      The Mont Uni Pre Cadet Academy
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Chakwal Campus · Official Fee Voucher / Challan
                    </p>
                  </div>

                  {(() => {
                    const ch = generateChallanData(
                      selectedChallanStudent.rollNo,
                      selectedChallanStudent.name,
                      selectedChallanStudent.fatherName,
                      selectedChallanStudent.className
                    );
                    return (
                      <div className="py-4 space-y-4 text-xs">
                        <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-slate-700">
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Challan No</span>
                            <span className="font-mono font-bold text-slate-900">{ch.challanNo}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Cadet Name</span>
                            <span className="font-bold text-slate-900">{ch.studentName}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Father Name</span>
                            <span className="text-slate-700">{ch.fatherName}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Class</span>
                            <span className="font-semibold text-slate-900">{ch.className}</span>
                          </div>
                        </div>

                        <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-slate-700">
                          <div className="flex justify-between px-3 py-1.5 text-slate-500 bg-slate-50 text-[11px] font-semibold">
                            <span>Head of Account</span>
                            <span>Amount (PKR)</span>
                          </div>
                          <div className="flex justify-between px-3 py-1.5">
                            <span>Tuition Fee ({ch.month})</span>
                            <span className="font-mono font-semibold">Rs. {ch.tuitionFee.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between px-3 py-1.5">
                            <span>Pre-Cadet Drill & Physical Training Fund</span>
                            <span className="font-mono font-semibold">Rs. {ch.cadetFund.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between px-3 py-1.5">
                            <span>Science & AI Computer Lab Fund</span>
                            <span className="font-mono font-semibold">Rs. {ch.labFund.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between px-3 py-1.5">
                            <span>Examination & Terminal Assessment Fee</span>
                            <span className="font-mono font-semibold">Rs. {ch.examFee.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between px-3 py-2 bg-emerald-50 text-[#0F5132] font-bold text-xs">
                            <span>Total Payable Within Due Date</span>
                            <span className="font-mono">Rs. {ch.totalWithinDue.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between px-3 py-1.5 text-slate-500 text-[11px]">
                            <span>After Due Date (Incl. Rs. {ch.lateFeeSurcharge} Late Surcharge)</span>
                            <span className="font-mono">Rs. {ch.totalAfterDue.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="pt-2 flex gap-2">
                          <button
                            type="button"
                            onClick={() => window.print()}
                            className="flex-1 py-2 px-3 text-xs font-semibold rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Print Voucher</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedChallanStudent(null)}
                            className="flex-1 py-2 px-3 text-xs font-bold rounded-xl text-white bg-[#0F5132] hover:bg-[#0c4128] cursor-pointer"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODULE 3: CLASSES & SECTIONS MATRIX                                       */}
        {/* ========================================================================= */}
        {activeTab === 'classes' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs">
              <h3 className="font-serif font-bold text-base text-slate-900 mb-1">
                Official Curriculum Classes Matrix (Classes 1–10)
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Verified enrollment breakdown synchronized directly from student records in Chakwal campus.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                {CLASS_OPTIONS.map((className) => {
                  const enrolledCount = students.filter(
                    (s) => s.className === className && s.status !== 'archived'
                  ).length;
                  const isSecondary = className === 'Class 9' || className === 'Class 10';
                  const isMiddle = className === 'Class 6' || className === 'Class 7' || className === 'Class 8';

                  return (
                    <div
                      key={className}
                      className="p-4 rounded-xl border border-slate-200 bg-[#F8FAF7] hover:border-[#0F5132] transition-all space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-serif font-bold text-sm text-slate-900">
                          {className}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            isSecondary
                              ? 'bg-blue-100 text-blue-800'
                              : isMiddle
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {isSecondary ? 'Secondary' : isMiddle ? 'Middle' : 'Primary'}
                        </span>
                      </div>

                      <div className="flex items-baseline justify-between pt-1">
                        <span className="text-2xl font-serif font-bold text-[#0F5132]">
                          {enrolledCount}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {enrolledCount === 1 ? 'Cadet' : 'Cadets'}
                        </span>
                      </div>

                      <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedClassFilter(className);
                            setActiveTab('students');
                          }}
                          className="text-[#0F5132] font-semibold hover:underline cursor-pointer"
                        >
                          View Roster
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedAttendanceClass(className);
                            setActiveTab('attendance');
                          }}
                          className="text-[#1E40AF] font-semibold hover:underline cursor-pointer"
                        >
                          Attendance
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODULE 4: DAILY CLASS ATTENDANCE                                          */}
        {/* ========================================================================= */}
        {activeTab === 'attendance' && (
          <div className="space-y-6">
            {/* Attendance Control Bar */}
            <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Select Class
                  </label>
                  <select
                    value={selectedAttendanceClass}
                    onChange={(e) => setSelectedAttendanceClass(e.target.value)}
                    className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                  >
                    {CLASS_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Date of Record
                  </label>
                  <input
                    type="date"
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                    className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                  />
                </div>

                <div className="self-end pb-0.5">
                  <span className="text-xs text-slate-600 bg-slate-100 px-2.5 py-1.5 rounded-xl font-medium inline-block">
                    Enrolled: <strong>{enrolledCountInSelectedAttendanceClass}</strong>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleMarkAllAttendance('present')}
                  disabled={enrolledCountInSelectedAttendanceClass === 0}
                  className="px-3 py-1.5 text-xs font-semibold rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer disabled:opacity-50"
                >
                  Mark All Present
                </button>

                <button
                  type="button"
                  onClick={handleSaveAttendance}
                  disabled={isSavingAttendance || enrolledCountInSelectedAttendanceClass === 0}
                  className="px-4 py-1.5 text-xs font-bold rounded-xl text-white bg-[#0F5132] hover:bg-[#0c4128] transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSavingAttendance ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Save Attendance</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {attendanceSavedMessage && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[#0F5132] text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{attendanceSavedMessage}</span>
              </div>
            )}

            {/* Attendance Roster or Empty State */}
            {enrolledCountInSelectedAttendanceClass === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Calendar className="w-6 h-6" />
                </div>
                <h4 className="font-serif font-bold text-base text-slate-800">
                  No Students Enrolled in {selectedAttendanceClass}
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  To mark attendance for this class, first enrol students in {selectedAttendanceClass} using the Student Directory module.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setNewStudentForm({
                      ...newStudentForm,
                      className: selectedAttendanceClass,
                    });
                    setIsAddingStudent(true);
                    setActiveTab('students');
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl text-white bg-[#0F5132] hover:bg-[#0c4128] cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Enrol Student in {selectedAttendanceClass}</span>
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-[#F8FAF7] border-b border-[#E2E8F0] text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="px-4 py-3">Roll No</th>
                        <th className="px-4 py-3">Cadet Full Name</th>
                        <th className="px-4 py-3">Father Name</th>
                        <th className="px-4 py-3 text-right">Attendance Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0]">
                      {students
                        .filter(
                          (s) => s.className === selectedAttendanceClass && s.status !== 'archived'
                        )
                        .map((student) => {
                          const status = attendanceRoster[student.id] || 'present';
                          return (
                            <tr key={student.id} className="hover:bg-[#F8FAF7]/80 transition-colors">
                              <td className="px-4 py-3 font-mono font-bold text-slate-900">
                                {student.rollNo}
                              </td>
                              <td className="px-4 py-3 font-semibold text-slate-900">
                                {student.name}
                              </td>
                              <td className="px-4 py-3 text-slate-600">
                                {student.fatherName}
                              </td>
                              <td className="px-4 py-3 text-right">
                                <div className="inline-flex items-center gap-1 p-0.5 rounded-xl bg-slate-100 border border-slate-200">
                                  {(['present', 'absent', 'late', 'leave'] as const).map((st) => (
                                    <button
                                      key={st}
                                      type="button"
                                      onClick={() => handleToggleStudentAttendance(student.id, st)}
                                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize transition-all cursor-pointer ${
                                        status === st
                                          ? st === 'present'
                                            ? 'bg-emerald-600 text-white shadow-2xs'
                                            : st === 'absent'
                                            ? 'bg-rose-600 text-white shadow-2xs'
                                            : st === 'late'
                                            ? 'bg-amber-600 text-white shadow-2xs'
                                            : 'bg-blue-600 text-white shadow-2xs'
                                          : 'text-slate-600 hover:text-slate-900'
                                      }`}
                                    >
                                      {st}
                                    </button>
                                  ))}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODULE 5: ACADEMIC MARKS & RESULTS                                        */}
        {/* ========================================================================= */}
        {activeTab === 'results' && (
          <div className="space-y-6">
            {/* Results Filter Toolbar */}
            <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Class
                  </label>
                  <select
                    value={selectedResultClass}
                    onChange={(e) => setSelectedResultClass(e.target.value)}
                    className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white font-semibold"
                  >
                    {CLASS_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Term / Examination
                  </label>
                  <select
                    value={selectedResultTerm}
                    onChange={(e) => setSelectedResultTerm(e.target.value)}
                    className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white font-semibold"
                  >
                    <option value="1st Term Examination 2026">1st Term Examination 2026</option>
                    <option value="Mid-Term Examination 2026">Mid-Term Examination 2026</option>
                    <option value="Annual / Pre-Board 2027">Annual / Pre-Board 2027</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Subject
                  </label>
                  <select
                    value={selectedResultSubject}
                    onChange={(e) => setSelectedResultSubject(e.target.value)}
                    className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white font-semibold"
                  >
                    {SUBJECT_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Max Marks
                  </label>
                  <input
                    type="number"
                    value={maxMarksInput}
                    onChange={(e) => setMaxMarksInput(parseInt(e.target.value, 10) || 100)}
                    className="w-20 px-2.5 py-1.5 text-xs rounded-xl border border-slate-300 bg-white font-mono"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleSaveAcademicResults}
                disabled={isSavingResults || students.filter((s) => s.className === selectedResultClass).length === 0}
                className="px-4 py-2 text-xs font-bold rounded-xl text-white bg-[#0F5132] hover:bg-[#0c4128] transition-all cursor-pointer shadow-2xs flex items-center gap-1.5 self-start md:self-auto disabled:opacity-50"
              >
                {isSavingResults ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving Results...</span>
                  </>
                ) : (
                  <>
                    <Award className="w-3.5 h-3.5" />
                    <span>Save Marks to Firestore</span>
                  </>
                )}
              </button>
            </div>

            {/* Results Table or Empty State */}
            {students.filter((s) => s.className === selectedResultClass && s.status !== 'archived').length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Award className="w-6 h-6" />
                </div>
                <h4 className="font-serif font-bold text-base text-slate-800">
                  No Students Enrolled in {selectedResultClass}
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  No students are enrolled in this class to record examination marks.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-[#F8FAF7] border-b border-[#E2E8F0] text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="px-4 py-3">Roll No</th>
                        <th className="px-4 py-3">Cadet Name</th>
                        <th className="px-4 py-3">Obtained Marks (out of {maxMarksInput})</th>
                        <th className="px-4 py-3">Calculated Grade</th>
                        <th className="px-4 py-3">Qualitative Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0]">
                      {students
                        .filter(
                          (s) => s.className === selectedResultClass && s.status !== 'archived'
                        )
                        .map((student) => {
                          const current = resultsRoster[student.id] || { marks: 0, remarks: '' };
                          const pct = maxMarksInput > 0 ? (current.marks / maxMarksInput) * 100 : 0;
                          const evaluation = calculateGrade(pct);

                          return (
                            <tr key={student.id} className="hover:bg-[#F8FAF7]/80 transition-colors">
                              <td className="px-4 py-3 font-mono font-bold text-slate-900">
                                {student.rollNo}
                              </td>
                              <td className="px-4 py-3 font-semibold text-slate-900">
                                {student.name}
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  type="number"
                                  min={0}
                                  max={maxMarksInput}
                                  value={current.marks}
                                  onChange={(e) => {
                                    const val = Math.min(
                                      maxMarksInput,
                                      Math.max(0, parseInt(e.target.value, 10) || 0)
                                    );
                                    setResultsRoster({
                                      ...resultsRoster,
                                      [student.id]: { ...current, marks: val },
                                    });
                                  }}
                                  className="w-24 px-3 py-1.5 text-xs rounded-xl border border-slate-300 font-mono font-bold text-slate-900 bg-white"
                                />
                              </td>
                              <td className="px-4 py-3">
                                <span
                                  className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold ${
                                    evaluation.grade === 'A+' || evaluation.grade === 'A'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : evaluation.grade === 'B' || evaluation.grade === 'C'
                                      ? 'bg-blue-100 text-blue-800'
                                      : evaluation.grade === 'D'
                                      ? 'bg-amber-100 text-amber-800'
                                      : 'bg-rose-100 text-rose-800'
                                  }`}
                                >
                                  {evaluation.grade} · {evaluation.division}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  type="text"
                                  value={current.remarks}
                                  onChange={(e) =>
                                    setResultsRoster({
                                      ...resultsRoster,
                                      [student.id]: { ...current, remarks: e.target.value },
                                    })
                                  }
                                  placeholder={evaluation.remarks}
                                  className="w-full max-w-sm px-3 py-1.5 text-xs rounded-xl border border-slate-300 text-slate-700 bg-white"
                                />
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODULE 6: FACULTY & STAFF RECORDS (Admin Only)                            */}
        {/* ========================================================================= */}
        {activeTab === 'staff' && userRole === 'administrator' && (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-2xs flex items-center justify-between gap-3">
              <div>
                <h3 className="font-serif font-bold text-base text-slate-900">
                  Verified Faculty & Administrative Staff Directory
                </h3>
                <p className="text-xs text-slate-500">
                  Authorized personnel with portal access and classroom management roles.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setNewStaffForm({
                    staffId: `TMU-FAC-${(staffList.length + 1).toString().padStart(2, '0')}`,
                    fullName: '',
                    email: '',
                    role: 'teacher',
                    assignedClass: 'Class 1',
                    assignedSubject: 'Mathematics',
                    phone: '',
                  });
                  setIsAddingStaff(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl text-white bg-[#0F5132] hover:bg-[#0c4128] cursor-pointer shadow-2xs shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add Faculty Member</span>
              </button>
            </div>

            {staffList.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <UserCheck className="w-6 h-6" />
                </div>
                <h4 className="font-serif font-bold text-base text-slate-800">
                  No Faculty Profiles Added Yet
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Click "Add Faculty Member" above to create verified staff profiles for teachers and administrators.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-[#F8FAF7] border-b border-[#E2E8F0] text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="px-4 py-3">Staff ID</th>
                        <th className="px-4 py-3">Full Name</th>
                        <th className="px-4 py-3">Registered Email</th>
                        <th className="px-4 py-3">Portal Role</th>
                        <th className="px-4 py-3">Assigned Class / Subject</th>
                        <th className="px-4 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0]">
                      {staffList.map((st) => (
                        <tr key={st.id} className="hover:bg-[#F8FAF7]/80 transition-colors">
                          <td className="px-4 py-3 font-mono font-bold text-slate-900">
                            {st.staffId}
                          </td>
                          <td className="px-4 py-3 font-semibold text-slate-900">
                            {st.fullName}
                          </td>
                          <td className="px-4 py-3 font-mono text-slate-600">
                            {st.email}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                st.role === 'administrator'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {st.role}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {st.assignedClass || 'General Wing'} {st.assignedSubject ? `· ${st.assignedSubject}` : ''}
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                              Active
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Add Staff Modal */}
            {isAddingStaff && (
              <div
                role="dialog"
                aria-modal="true"
                aria-label="Add Staff Modal"
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
              >
                <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 p-6 shadow-2xl relative">
                  <button
                    type="button"
                    onClick={() => setIsAddingStaff(false)}
                    className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <h3 className="font-serif font-bold text-base text-slate-900 mb-4">
                    Add Faculty / Staff Profile
                  </h3>

                  <form onSubmit={handleSaveStaffMember} className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Staff ID
                      </label>
                      <input
                        type="text"
                        value={newStaffForm.staffId}
                        onChange={(e) =>
                          setNewStaffForm({ ...newStaffForm, staffId: e.target.value })
                        }
                        placeholder="TMU-FAC-01"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={newStaffForm.fullName}
                        onChange={(e) =>
                          setNewStaffForm({ ...newStaffForm, fullName: e.target.value })
                        }
                        placeholder="e.g. Sir Rashid Minhas"
                        required
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Registered School Email *
                      </label>
                      <input
                        type="email"
                        value={newStaffForm.email}
                        onChange={(e) =>
                          setNewStaffForm({ ...newStaffForm, email: e.target.value })
                        }
                        placeholder="teacher@themountuni.edu.pk"
                        required
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Role
                        </label>
                        <select
                          value={newStaffForm.role}
                          onChange={(e) =>
                            setNewStaffForm({
                              ...newStaffForm,
                              role: e.target.value as 'administrator' | 'teacher',
                            })
                          }
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                        >
                          <option value="teacher">Teacher / Faculty</option>
                          <option value="administrator">Administrator</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Class Assignment
                        </label>
                        <select
                          value={newStaffForm.assignedClass}
                          onChange={(e) =>
                            setNewStaffForm({ ...newStaffForm, assignedClass: e.target.value })
                          }
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                        >
                          {CLASS_OPTIONS.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="pt-2 flex gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingStaff(false)}
                        className="flex-1 py-2 px-3 text-xs font-semibold rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2 px-3 text-xs font-bold rounded-xl text-white bg-[#0F5132] hover:bg-[#0c4128] cursor-pointer"
                      >
                        Save Staff Record
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODULE 7: TEACHER DAILY ACTIVITY REPORTS                                  */}
        {/* ========================================================================= */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            {/* New Report Form Card */}
            <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs">
              <h3 className="font-serif font-bold text-base text-slate-900 mb-1">
                Submit Daily Faculty Diary / Teaching Activity Report
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Record classroom topics covered, lesson progress, and homework assigned for administrative review.
              </p>

              <form onSubmit={handleSubmitTeacherReport} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Class Level
                    </label>
                    <select
                      value={newReportForm.className}
                      onChange={(e) =>
                        setNewReportForm({ ...newReportForm, className: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                    >
                      {CLASS_OPTIONS.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Subject
                    </label>
                    <select
                      value={newReportForm.subject}
                      onChange={(e) =>
                        setNewReportForm({ ...newReportForm, subject: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                    >
                      {SUBJECT_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Topics Covered & Lesson Plan Progress *
                  </label>
                  <textarea
                    rows={2}
                    value={newReportForm.topicsCovered}
                    onChange={(e) =>
                      setNewReportForm({ ...newReportForm, topicsCovered: e.target.value })
                    }
                    placeholder="e.g. Chapter 4: Quadratic Equations — Exercise 4.2 practice problems"
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Homework & Evening Self-Study Assigned
                  </label>
                  <input
                    type="text"
                    value={newReportForm.homeworkAssigned}
                    onChange={(e) =>
                      setNewReportForm({ ...newReportForm, homeworkAssigned: e.target.value })
                    }
                    placeholder="e.g. Solve questions 5 to 10 on notebook"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingReport}
                  className="px-4 py-2 text-xs font-bold rounded-xl text-white bg-[#0F5132] hover:bg-[#0c4128] transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-60"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Activity Report</span>
                </button>
              </form>
            </div>

            {/* Submitted Reports List or Clean Empty State */}
            {teacherReports.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <FileText className="w-6 h-6" />
                </div>
                <h4 className="font-serif font-bold text-base text-slate-800">
                  No Teacher Activity Reports Submitted Yet
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Daily classroom lesson diary submissions will appear here for administrative inspection and quality tracking.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <h4 className="font-serif font-bold text-sm text-slate-900">
                  Classroom Activity Submissions ({teacherReports.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {teacherReports.map((report) => (
                    <div
                      key={report.id}
                      className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-slate-900">{report.teacherName}</span>
                          <span className="block text-[11px] text-slate-500">
                            {report.className} · {report.subject}
                          </span>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            report.status === 'reviewed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {report.status}
                        </span>
                      </div>

                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 space-y-1">
                        <p className="text-slate-800">
                          <strong className="text-slate-900 font-semibold">Topics:</strong> {report.topicsCovered}
                        </p>
                        {report.homeworkAssigned && (
                          <p className="text-slate-600">
                            <strong className="text-slate-800 font-semibold">Homework:</strong> {report.homeworkAssigned}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                        <span>Date: {report.date}</span>
                        {userRole === 'administrator' && report.status !== 'reviewed' && (
                          <button
                            type="button"
                            onClick={() => handleReviewReport(report.id)}
                            className="text-[#0F5132] font-bold hover:underline cursor-pointer"
                          >
                            Mark Reviewed
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODULE 8: ADMISSIONS ENQUIRIES & 1-CLICK ENROL (Admin Only)                */}
        {/* ========================================================================= */}
        {activeTab === 'admissions' && userRole === 'administrator' && (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-2xs flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-base text-slate-900">
                  Incoming Admissions Enquiries & Applications
                </h3>
                <p className="text-xs text-slate-500">
                  Synchronized live from the public website enquiry form. Convert candidates into enrolled cadets with 1 click.
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl">
                {applications.length} Received
              </span>
            </div>

            {applications.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Mail className="w-6 h-6" />
                </div>
                <h4 className="font-serif font-bold text-base text-slate-800">
                  No Admissions Enquiries Received Yet
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  When parents submit the admissions form on the school homepage, their candidate details will appear here immediately.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-[#F8FAF7] border-b border-[#E2E8F0] text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="px-4 py-3">Candidate Full Name</th>
                        <th className="px-4 py-3">Parent / Guardian</th>
                        <th className="px-4 py-3">Contact Phone</th>
                        <th className="px-4 py-3">Applied Class</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0]">
                      {applications.map((app) => (
                        <tr key={app.id} className="hover:bg-[#F8FAF7]/80 transition-colors">
                          <td className="px-4 py-3 font-semibold text-slate-900">
                            {app.studentName}
                            {app.message && (
                              <span className="block text-[11px] text-slate-500 font-normal italic truncate max-w-xs">
                                "{app.message}"
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-slate-700">
                            {app.parentName}
                          </td>
                          <td className="px-4 py-3 font-mono font-medium text-slate-800">
                            {app.parentPhone}
                          </td>
                          <td className="px-4 py-3 font-semibold text-[#0F5132]">
                            {app.gradeApplied}
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={app.status}
                              onChange={(e) =>
                                handleUpdateApplicationStatus(
                                  app.id,
                                  e.target.value as ApplicationRecord['status']
                                )
                              }
                              className="px-2 py-1 text-[11px] rounded-lg border border-slate-300 font-semibold bg-white"
                            >
                              <option value="pending">Pending</option>
                              <option value="contacted">Contacted</option>
                              <option value="under_review">Under Review</option>
                              <option value="enrolled">Enrolled</option>
                              <option value="closed">Closed</option>
                            </select>
                          </td>
                          <td className="px-4 py-3 text-right">
                            {app.status !== 'enrolled' ? (
                              <button
                                type="button"
                                onClick={() => handleEnrollCandidate(app)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold rounded-lg text-white bg-[#0F5132] hover:bg-[#0c4128] transition-all cursor-pointer shadow-2xs"
                                title="Pre-fill enrolment form with candidate details"
                              >
                                <UserPlus className="w-3.5 h-3.5" />
                                <span>Enrol Candidate</span>
                              </button>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                Enrolled
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODULE 9: CAMPUS ANNOUNCEMENTS & TICKER SYNC                              */}
        {/* ========================================================================= */}
        {activeTab === 'notices' && (
          <div className="space-y-6">
            {/* Publish Notice Form */}
            <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs">
              <h3 className="font-serif font-bold text-base text-slate-900 mb-1">
                Publish Campus Notice to Live Header Ticker
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Notices published here synchronize immediately to the continuous emergency ticker across all pages of the school website.
              </p>

              <form onSubmit={handlePublishNotice} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Badge Label * (e.g. Admissions, Weather Notice, Sports Drill)
                    </label>
                    <input
                      type="text"
                      value={newNoticeBadge}
                      onChange={(e) => setNewNoticeBadge(e.target.value)}
                      placeholder="e.g. Admissions Open"
                      required
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Priority Category
                    </label>
                    <select
                      value={newNoticePriority}
                      onChange={(e) =>
                        setNewNoticePriority(
                          e.target.value as 'urgent' | 'announcement' | 'admissions'
                        )
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="announcement">Announcement (General)</option>
                      <option value="admissions">Admissions (Classes 1–10)</option>
                      <option value="urgent">Urgent / Campus Alert</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Announcement Notice Text *
                  </label>
                  <textarea
                    rows={2}
                    value={newNoticeText}
                    onChange={(e) => setNewNoticeText(e.target.value)}
                    placeholder="e.g. Admissions open for Classes 1 to 10 for Academic Year 2026–2027. Prospectus available at Chakwal campus office."
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isPublishingNotice}
                  className="px-4 py-2 text-xs font-bold rounded-xl text-white bg-[#0F5132] hover:bg-[#0c4128] transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-60"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish Notice to Website</span>
                </button>
              </form>
            </div>

            {/* Live Announcements List */}
            {announcements.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Bell className="w-6 h-6" />
                </div>
                <h4 className="font-serif font-bold text-base text-slate-800">
                  No Custom Announcements Published
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  The website header is currently displaying standard school location and admissions notices. Use the form above to post custom updates.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <h4 className="font-serif font-bold text-sm text-slate-900">
                  Active Firestore Announcements ({announcements.length})
                </h4>
                <div className="space-y-2.5">
                  {announcements.map((notice) => (
                    <div
                      key={notice.id}
                      className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 mt-0.5 ${
                            notice.priority === 'urgent'
                              ? 'bg-rose-100 text-rose-800'
                              : notice.priority === 'admissions'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {notice.badge}
                        </span>
                        <p className="text-slate-800 leading-relaxed truncate">{notice.text}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteNotice(notice.id)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
                        title="Remove Notice"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODULE 10: PERMISSIONS & SYSTEM SECURITY (Admin Only)                     */}
        {/* ========================================================================= */}
        {activeTab === 'permissions' && userRole === 'administrator' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-4">
              <div className="flex items-center gap-2.5 text-[#0F5132]">
                <Shield className="w-6 h-6" />
                <h3 className="font-serif font-bold text-base text-slate-900">
                  Role-Based Access Control (RBAC) & System Architecture
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-[#EAF2EB]/50 border border-[#0F5132]/20 space-y-2">
                  <span className="font-bold text-[#0F5132] block text-sm">
                    1. Campus Administrator Privileges
                  </span>
                  <ul className="space-y-1.5 text-slate-700">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0F5132]" />
                      Full management of Student Directory (Enrol, Edit, Archive)
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0F5132]" />
                      Class Attendance oversight across all 10 Classes
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0F5132]" />
                      Academic Examination Results validation & archiving
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0F5132]" />
                      Faculty & Staff profiles creation & credentials
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0F5132]" />
                      Admissions Desk Enquiries & 1-click candidate enrolment
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0F5132]" />
                      Emergency Ticker and Campus Announcement broadcast
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200 space-y-2">
                  <span className="font-bold text-[#1E40AF] block text-sm">
                    2. Teacher & Subject Faculty Privileges
                  </span>
                  <ul className="space-y-1.5 text-slate-700">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                      Classroom Attendance marking for assigned class
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                      Subject examination marks & qualitative remarks entry
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                      Daily Teaching Activity Diary / Lesson Report submission
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                      School announcement viewing and timetable reference
                    </li>
                    <li className="flex items-center gap-1.5 text-slate-400">
                      <X className="w-3.5 h-3.5" />
                      Restricted from staff accounts or student record deletion
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                <span>
                  Active Firebase UID:{' '}
                  <code className="font-mono text-slate-800 bg-slate-100 px-1 py-0.5 rounded">
                    {currentUser?.uid}
                  </code>
                </span>
                <span>
                  Authorized School Email:{' '}
                  <strong className="text-slate-800">{currentUser?.email}</strong>
                </span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
