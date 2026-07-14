import apiClient from './client';

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
  testDate: string;
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
  generatedDate: string;
  students: BatchReportStudent[];
  mockTests: BatchReportMockTest[];
}

export interface IndividualReportResult {
  mockTestId: string;
  mockTestTitle: string;
  mockTestNumber: number;
  testDate: string;
  reading: { obtained: number; total: number };
  writing: { obtained: number; total: number };
  listening: { obtained: number; total: number };
  speaking: { grade: string; comment: string };
  presentation: { marks: number; total: number; comment: string };
  totalMarks: number;
  percentage: number;
  grade: string;
}

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
  generatedDate: string;
  results: IndividualReportResult[];
}

export interface ReportFilters {
  programs: { id: string; name: string; displayName: { en: string; bn: string } }[];
  teachers: { id: string; fullName: string; email: string; programIds: string[] }[];
}

export const reportApi = {
  getFilters: () =>
    apiClient.get<{ success: boolean; data: ReportFilters }>('/reports/filters'),

  getBatchReport: (params: { programId: string; teacherId?: string }) =>
    apiClient.get<{ success: boolean; data: BatchReportData }>('/reports/batch', { params }),

  getIndividualReport: (studentId: string) =>
    apiClient.get<{ success: boolean; data: IndividualReportData }>(`/reports/individual/${studentId}`),
};