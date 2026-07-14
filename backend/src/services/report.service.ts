import mongoose from 'mongoose';
import { Student } from '../models/Student.model.js';
import { Program } from '../models/Program.model.js';
import { Teacher } from '../models/Teacher.model.js';
import { MockTest } from '../models/MockTest.model.js';
import { Result } from '../models/Result.model.js';

// ============================================
// BATCH REPORT DATA
// ============================================
export interface BatchReportData {
  program: {
    id: string;
    name: string;
    displayName: { en: string; bn: string };
  };
  teacher: {
    id: string;
    fullName: string;
    email: string;
  } | null;
  totalStudents: number;
  totalMockTests: number;
  generatedDate: Date;
  students: BatchReportStudent[];
  mockTests: BatchReportMockTest[];
}

export interface BatchReportStudent {
  id: string;
  admissionId: string;
  fullName: string;
  phone: string;
  email: string;
  results: {
    mockTestId: string;
    mockTestTitle: string;
    mockTestNumber: number;
    reading: { obtained: number; total: number };
    writing: { obtained: number; total: number };
    listening: { obtained: number; total: number };
    speaking: { grade: string; comment: string };
    presentation: { marks: number; total: number; comment: string };
    totalMarks: number;
    percentage: number;
    grade: string;
  }[];
}

export interface BatchReportMockTest {
  id: string;
  title: string;
  testNumber: number;
  testDate: Date;
  hasReading: boolean;
  hasWriting: boolean;
  hasListening: boolean;
  hasSpeaking: boolean;
  hasPresentation: boolean;
  readingTotal: number;
  writingTotal: number;
  listeningTotal: number;
  presentationTotal: number;
}

// ============================================
// INDIVIDUAL REPORT DATA
// ============================================
export interface IndividualReportData {
  student: {
    id: string;
    fullName: string;
    admissionId: string;
    phone: string;
    email: string;
    programName: string;
    profileImage?: { url: string };
  };
  teacher: {
    id: string;
    fullName: string;
    email: string;
  } | null;
  totalTests: number;
  averagePercentage: number;
  generatedDate: Date;
  results: IndividualReportResult[];
}

export interface IndividualReportResult {
  mockTestId: string;
  mockTestTitle: string;
  mockTestNumber: number;
  testDate: Date;
  reading: { obtained: number; total: number };
  writing: { obtained: number; total: number };
  listening: { obtained: number; total: number };
  speaking: { grade: string; comment: string };
  presentation: { marks: number; total: number; comment: string };
  totalMarks: number;
  percentage: number;
  grade: string;
}

// ============================================
// GENERATE BATCH REPORT
// ============================================
export const generateBatchReport = async (
  programId: string,
  teacherId?: string
): Promise<BatchReportData> => {
  // 1. Get program
  const program = await Program.findById(programId);
  if (!program) {
    throw new Error('Program not found');
  }

  // 2. Get teacher (if specified)
  let teacher = null;
  if (teacherId) {
    teacher = await Teacher.findById(teacherId).populate('userId', 'email');
    if (!teacher) {
      throw new Error('Teacher not found');
    }
  }

  // 3. Get all students in the program (not deleted)
  const students = await Student.find({
    programId,
    isDeleted: false,
  }).sort({ fullName: 1 });

  // 4. Get all mock tests for the program (active)
  const mockTests = await MockTest.find({
    programId,
    isActive: true,
  }).sort({ testNumber: 1 });

  // 5. Get all results for these students and mock tests
  const studentIds = students.map((s) => s._id);
  const mockTestIds = mockTests.map((m) => m._id);

  const results = await Result.find({
    studentId: { $in: studentIds },
    mockTestId: { $in: mockTestIds },
    isDeleted: false,
  });

  // 6. Build the report data
  const reportStudents: BatchReportStudent[] = students.map((student) => {
    const studentResults = results.filter(
      (r) => r.studentId.toString() === student._id.toString()
    );

    return {
      id: student._id.toString(),
      admissionId: student.admissionId,
      fullName: student.fullName,
      phone: student.phone,
      email: student.email,
      results: studentResults.map((result) => {
        const mockTest = mockTests.find(
          (m) => m._id.toString() === result.mockTestId.toString()
        );
        return {
          mockTestId: result.mockTestId.toString(),
          mockTestTitle: mockTest?.title || 'Mock Test',
          mockTestNumber: mockTest?.testNumber || 0,
          reading: result.reading || { obtained: 0, total: 0 },
          writing: result.writing || { obtained: 0, total: 0 },
          listening: result.listening || { obtained: 0, total: 0 },
          speaking: result.speaking || { grade: 'F', comment: '' },
          presentation: result.presentation || { marks: 0, total: 0, comment: '' },
          totalMarks: result.totalMarks || 0,
          percentage: result.percentage || 0,
          grade: result.grade || 'F',
        };
      }),
    };
  });

  // 7. Build mock test summary
  const reportMockTests: BatchReportMockTest[] = mockTests.map((mt) => ({
    id: mt._id.toString(),
    title: mt.title,
    testNumber: mt.testNumber,
    testDate: mt.testDate,
    hasReading: !!mt.reading,
    hasWriting: !!mt.writing,
    hasListening: !!mt.listening,
    hasSpeaking: !!mt.speaking,
    hasPresentation: !!mt.presentation,
    readingTotal: mt.reading?.totalMarks || 0,
    writingTotal: mt.writing?.totalMarks || 0,
    listeningTotal: mt.listening?.totalMarks || 0,
    presentationTotal: mt.presentation?.totalMarks || 0,
  }));

  return {
    program: {
      id: program._id.toString(),
      name: program.name,
      displayName: program.displayName,
    },
    teacher: teacher
      ? {
          id: teacher._id.toString(),
          fullName: teacher.fullName,
          email: (teacher.userId as any)?.email || '',
        }
      : null,
    totalStudents: students.length,
    totalMockTests: mockTests.length,
    generatedDate: new Date(),
    students: reportStudents,
    mockTests: reportMockTests,
  };
};

// ============================================
// GENERATE INDIVIDUAL REPORT
// ============================================
export const generateIndividualReport = async (
  studentId: string
): Promise<IndividualReportData> => {
  // 1. Get student
  const student = await Student.findById(studentId).populate('programId');
  if (!student) {
    throw new Error('Student not found');
  }

  if (student.isDeleted) {
    throw new Error('Student has been deleted');
  }

  const program = student.programId as any;

  // 2. Get teacher for the program (first teacher)
  let teacher = null;
  if (program.teacherIds && program.teacherIds.length > 0) {
    const teacherId = program.teacherIds[0];
    teacher = await Teacher.findById(teacherId).populate('userId', 'email');
  }

  // 3. Get all mock tests for the program (active)
  const mockTests = await MockTest.find({
    programId: student.programId,
    isActive: true,
  }).sort({ testNumber: 1 });

  // 4. Get all results for this student
  const results = await Result.find({
    studentId: student._id,
    isDeleted: false,
  });

  // 5. Build the report data
  const reportResults: IndividualReportResult[] = mockTests.map((mockTest) => {
    const result = results.find(
      (r) => r.mockTestId.toString() === mockTest._id.toString()
    );

    return {
      mockTestId: mockTest._id.toString(),
      mockTestTitle: mockTest.title,
      mockTestNumber: mockTest.testNumber,
      testDate: mockTest.testDate,
      reading: result?.reading || { obtained: 0, total: mockTest.reading?.totalMarks || 0 },
      writing: result?.writing || { obtained: 0, total: mockTest.writing?.totalMarks || 0 },
      listening: result?.listening || { obtained: 0, total: mockTest.listening?.totalMarks || 0 },
      speaking: result?.speaking || { grade: 'F', comment: '' },
      presentation: result?.presentation || { marks: 0, total: mockTest.presentation?.totalMarks || 0, comment: '' },
      totalMarks: result?.totalMarks || 0,
      percentage: result?.percentage || 0,
      grade: result?.grade || 'F',
    };
  });

  // Calculate average percentage
  const completedResults = reportResults.filter((r) => r.percentage > 0);
  const averagePercentage =
    completedResults.length > 0
      ? completedResults.reduce((sum, r) => sum + r.percentage, 0) / completedResults.length
      : 0;

  return {
    student: {
      id: student._id.toString(),
      fullName: student.fullName,
      admissionId: student.admissionId,
      phone: student.phone,
      email: student.email,
      programName: program.displayName?.en || program.name || 'N/A',
      profileImage: student.profileImage,
    },
    teacher: teacher
      ? {
          id: teacher._id.toString(),
          fullName: teacher.fullName,
          email: (teacher.userId as any)?.email || '',
        }
      : null,
    totalTests: mockTests.length,
    averagePercentage: Math.round(averagePercentage),
    generatedDate: new Date(),
    results: reportResults,
  };
};