import { Types } from 'mongoose';
import { Student } from '../models/Student.model.js';
import { Program } from '../models/Program.model.js';
import { User } from '../models/User.model.js';
import { IStudent } from '../types/index.js';
import { generateReceipt } from './receipt.service.js';

// ============================================
// ADMISSION SETTINGS TYPE
// ============================================
interface AdmissionSettings {
  mode: 'manual' | 'automatic';
  prefix?: string;
  currentNumber?: number;
}

// In-memory cache for settings
let admissionSettings: AdmissionSettings = {
  mode: 'automatic',
  prefix: 'BTS',
  currentNumber: 100,
};

// ============================================
// GENERATE ADMISSION ID - FIXED for Automatic Mode
// ============================================
export const generateAdmissionId = async (): Promise<string> => {
  const settings = admissionSettings;

  if (settings.mode === 'manual') {
    throw new Error('Manual mode: Admission ID must be provided manually');
  }

  // Use default prefix if not set
  const prefix = settings.prefix || 'BTS';
  
  // Find the highest existing Admission ID from the database
  const allStudents = await Student.find({ 
    isDeleted: false,
    admissionId: { $regex: `^${prefix}` }
  }).select('admissionId').lean();

  let maxNumber = 0;

  // Extract the numeric part from each admissionId and find the max
  for (const student of allStudents) {
    const match = student.admissionId.match(new RegExp(`^${prefix}(\\d+)$`));
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNumber) {
        maxNumber = num;
      }
    }
  }

  // Use max from DB, or fallback to settings.currentNumber
  const nextNumber = Math.max(maxNumber + 1, (settings.currentNumber || 100) + 1);
  
  // Update the in-memory settings
  settings.currentNumber = nextNumber;
  
  const paddedNumber = String(nextNumber).padStart(3, '0');
  return `${prefix}${paddedNumber}`;
};

// ============================================
// ADMIT STUDENT
// ============================================
export const admitStudent = async (data: {
  fullName: string;
  phone: string;
  parentPhone?: string;
  email: string;
  programId: string | Types.ObjectId;
  admittedBy: string | Types.ObjectId;
  createdBy: string | Types.ObjectId;
  admissionId?: string;
  paymentAmount: number;
  paymentMethod?: 'Cash' | 'bKash' | 'Nagad' | 'Card' | 'Bank Transfer';
  fatherName?: string;
  motherName?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  bloodGroup?: string;
  address?: string;
  schoolCollege?: string;
}): Promise<{ student: IStudent; receiptId: Types.ObjectId; receiptNumber: string }> => {
  try {
    // Validate program exists
    const program = await Program.findById(data.programId);
    if (!program) {
      throw new Error('Program not found');
    }

    // Validate payment amount
    if (data.paymentAmount === undefined || data.paymentAmount === null) {
      throw new Error('Payment amount is required');
    }
    if (data.paymentAmount < 0) {
      throw new Error('Payment amount cannot be negative');
    }

    // Check if email already exists in Student collection
    const existingStudent = await Student.findOne({ email: data.email });
    if (existingStudent) {
      throw new Error('Student with this email already exists');
    }

    // Check if email already exists in User collection (already registered)
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw new Error('This email is already registered. Please use a different email.');
    }

    // Generate or validate admission ID
    let admissionId: string;

    if (admissionSettings.mode === 'manual') {
      // ============================================
      // MANUAL MODE - Simply validate the entered ID
      // ============================================
      if (!data.admissionId || data.admissionId.trim() === '') {
        throw new Error('Admission ID is required in manual mode');
      }

      const enteredId = data.admissionId.trim();

      // Check if admission ID already exists - ONE SIMPLE QUERY
      const existing = await Student.findOne({ 
        admissionId: enteredId,
        isDeleted: false 
      });
      
      if (existing) {
        throw new Error(`Admission ID "${enteredId}" already exists. Please use a different ID.`);
      }

      admissionId = enteredId;
    } else {
      // ============================================
      // AUTOMATIC MODE - Generate the next ID
      // ============================================
      admissionId = await generateAdmissionId();
    }

    // Create student - NO userId during admission
    const student = await Student.create({
      fullName: data.fullName,
      admissionId,
      status: 'pending_registration',
      fatherName: data.fatherName || '',
      motherName: data.motherName || '',
      phone: data.phone,
      parentPhone: data.parentPhone || '',
      email: data.email,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      bloodGroup: data.bloodGroup,
      address: data.address || '',
      schoolCollege: data.schoolCollege || '',
      programId: data.programId,
      admittedBy: data.admittedBy,
      admissionDate: new Date(),
      createdBy: data.createdBy,
      updatedBy: data.createdBy,
      isDeleted: false,
    });

    // Generate receipt
    const receipt = await generateReceipt({
      studentId: student._id as Types.ObjectId,
      studentName: student.fullName,
      studentAdmissionId: student.admissionId,
      studentPhone: student.phone,
      studentEmail: student.email,
      programId: data.programId as Types.ObjectId,
      programName: program.name,
      paymentAmount: data.paymentAmount,
      paymentMethod: data.paymentMethod || 'Cash',
      generatedBy: data.admittedBy as Types.ObjectId,
    });

    // Cast receipt to any to access _id
    const receiptDoc = receipt as any;

    return {
      student,
      receiptId: receiptDoc._id as Types.ObjectId,
      receiptNumber: receipt.receiptNumber,
    };
  } catch (error: any) {
    console.error('Admission error:', error);
    throw new Error(`Failed to admit student: ${error.message}`);
  }
};

// ============================================
// GET ADMISSION SETTINGS
// ============================================
export const getAdmissionSettings = (): AdmissionSettings => {
  return { ...admissionSettings };
};

// ============================================
// UPDATE ADMISSION SETTINGS
// ============================================
export const updateAdmissionSettings = (
  settings: Partial<AdmissionSettings>
): AdmissionSettings => {
  // Keep existing values if not provided
  admissionSettings = { 
    ...admissionSettings, 
    ...settings 
  };
  return { ...admissionSettings };
};

// ============================================
// GET STUDENT BY ADMISSION ID
// ============================================
export const getStudentByAdmissionId = async (
  admissionId: string
): Promise<IStudent | null> => {
  const student = await Student.findOne({ 
    admissionId,
    isDeleted: false,
  });
  return student;
};

// ============================================
// REGISTER STUDENT (Create User Account)
// ============================================
export const registerStudent = async (
  admissionId: string,
  email: string,
  password: string
): Promise<{ user: any; student: IStudent }> => {
  try {
    // 1. Find student by Admission ID
    const student = await Student.findOne({ 
      admissionId, 
      isDeleted: false 
    });
    
    if (!student) {
      throw new Error('Student not found with this admission ID');
    }

    // 2. Check if already registered
    if (student.status !== 'pending_registration') {
      throw new Error('This student is already registered');
    }

    // 3. Check if email matches the admission record
    if (student.email !== email) {
      throw new Error('Email does not match the admission record');
    }

    // 4. Check if user already exists with this email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // 5. Check if student already has a userId (shouldn't happen, but just in case)
    if (student.userId) {
      throw new Error('This student already has a user account. Please contact admin.');
    }

    // 6. Create user account
    const user = await User.create({
      email: student.email,
      password,
      role: 'student',
      isActive: true,
    });

    // 7. Link userId to student and update status
    student.userId = user._id as any;
    student.status = 'active';
    await student.save();

    return { user, student };
  } catch (error: any) {
    console.error('Student registration error:', error);
    throw new Error(`Failed to register student: ${error.message}`);
  }
};

// ============================================
// GET STUDENT BY USER ID
// ============================================
export const getStudentByUserId = async (
  userId: string | Types.ObjectId
): Promise<IStudent | null> => {
  const student = await Student.findOne({ 
    userId,
    isDeleted: false 
  }).populate('programId', 'name displayName duration fee');
  
  return student;
};

// ============================================
// GET ALL STUDENTS (with pagination)
// ============================================
export const getStudents = async (options: {
  page?: number;
  limit?: number;
  status?: string;
  programId?: string;
  search?: string;
}): Promise<{ students: IStudent[]; total: number }> => {
  const { page = 1, limit = 10, status, programId, search } = options;

  const filter: any = { isDeleted: false };
  if (status) filter.status = status;
  if (programId) filter.programId = programId;
  if (search) {
    filter.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { admissionId: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);

  const students = await Student.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit))
    .populate('programId', 'name displayName')
    .populate('admittedBy', 'email')
    .populate('userId', 'email isActive');

  const total = await Student.countDocuments(filter);

  return { students, total };
};

// ============================================
// UPDATE STUDENT
// ============================================
export const updateStudent = async (
  studentId: string,
  data: Partial<IStudent>,
  updatedBy: string | Types.ObjectId
): Promise<IStudent | null> => {
  try {
    const student = await Student.findById(studentId);
    if (!student) {
      throw new Error('Student not found');
    }

    const updateData: any = {
      ...data,
      updatedBy,
    };

    delete updateData._id;
    delete updateData.admissionId;
    delete updateData.userId;
    delete updateData.createdAt;
    delete updateData.createdBy;

    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      updateData,
      { new: true, runValidators: true }
    );

    return updatedStudent;
  } catch (error: any) {
    console.error('Update student error:', error);
    throw new Error(`Failed to update student: ${error.message}`);
  }
};

// ============================================
// DELETE STUDENT (Soft Delete)
// ============================================
export const deleteStudent = async (
  studentId: string,
  deletedBy: string | Types.ObjectId
): Promise<IStudent | null> => {
  try {
    const student = await Student.findById(studentId);
    if (!student) {
      throw new Error('Student not found');
    }

    student.isDeleted = true;
    student.deletedAt = new Date();
    student.updatedBy = deletedBy as any;
    await student.save();

    return student;
  } catch (error: any) {
    console.error('Delete student error:', error);
    throw new Error(`Failed to delete student: ${error.message}`);
  }
};