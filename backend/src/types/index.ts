import { Types } from 'mongoose';

// ============================================
// USER TYPES
// ============================================
export interface IUser {
  email: string;
  password: string;
  role: 'admin' | 'teacher' | 'office' | 'student';
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// STUDENT TYPES
// ============================================
export interface IStudent {
  userId: Types.ObjectId;
  fullName: string;
  admissionId: string;
  status: 'pending_registration' | 'active' | 'completed' | 'inactive';
  fatherName?: string;
  motherName?: string;
  phone: string;
  parentPhone?: string;
  email: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  bloodGroup?: string;
  address?: string;
  schoolCollege?: string;
  programId: Types.ObjectId;
  profileImage?: {
    url: string;
    publicId: string;
  };
  admittedBy: Types.ObjectId;
  admissionDate: Date;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  deletedAt?: Date;
}

// ============================================
// TEACHER TYPES
// ============================================
export interface ITeacher {
  userId: Types.ObjectId;
  fullName: string;
  employeeId: string;
  phone: string;
  email: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  bloodGroup?: string;
  profileImage?: {
    url: string;
    publicId: string;
  };
  programIds: Types.ObjectId[];
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  deletedAt?: Date;
}

// ============================================
// OFFICE MEMBER TYPES
// ============================================
export interface IOfficeMember {
  userId: Types.ObjectId;
  fullName: string;
  employeeId: string;
  phone: string;
  email: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  bloodGroup?: string;
  profileImage?: {
    url: string;
    publicId: string;
  };
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  deletedAt?: Date;
}

// ============================================
// PROGRAM TYPES
// ============================================
export interface IProgram {
  name: string;
  displayName: {
    en: string;
    bn: string;
  };
  description: {
    en: string;
    bn: string;
  };
  duration: number;
  fee: number;
  teacherIds: Types.ObjectId[];
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  deletedAt?: Date;
}

// ============================================
// MOCK TEST TYPES
// ============================================
export interface IMockTest {
  programId: Types.ObjectId;
  title: string;
  description?: string;
  testNumber: number;
  testDate: Date;
  reading: {
    totalMarks: number;
    description?: string;
  };
  writing: {
    totalMarks: number;
    description?: string;
  };
  listening: {
    totalMarks: number;
    description?: string;
  };
  speaking: {
    description?: string;
  };
  presentation: {
    totalMarks: number;
    description?: string;
  };
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  deletedAt?: Date;
}

// ============================================
// RESULT TYPES
// ============================================
export interface IResult {
  studentId: Types.ObjectId;
  mockTestId: Types.ObjectId;
  programId: Types.ObjectId;
  reading: {
    obtained: number;
    total: number;
  };
  writing: {
    obtained: number;
    total: number;
  };
  listening: {
    obtained: number;
    total: number;
  };
  speaking: {
    grade: string;
    comment: string;
  };
  presentation: {
    marks: number;
    total: number;
    comment: string;
  };
  totalMarks: number;
  percentage: number;
  grade: string;
  enteredBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  deletedAt?: Date;
}

// ============================================
// API RESPONSE TYPES
// ============================================
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}