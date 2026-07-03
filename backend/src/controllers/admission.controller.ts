import { Request, Response } from 'express';
import { 
  admitStudent, 
  getAdmissionSettings, 
  updateAdmissionSettings, 
  getStudentByAdmissionId, 
  registerStudent,
  getStudents
} from '../services/admission.service.js';
import { Student } from '../models/Student.model.js';
import { User } from '../models/User.model.js';

// ============================================
// ADMIT STUDENT
// ============================================
export const admitStudentController = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      fullName,
      phone,
      parentPhone,
      email,
      programId,
      admissionId: manualAdmissionId,
      fatherName,
      motherName,
      dateOfBirth,
      gender,
      bloodGroup,
      address,
      schoolCollege,
    } = req.body;

    const userId = (req as any).user?.id;

    // Validate required fields
    if (!fullName || !phone || !email || !programId) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields: fullName, phone, email, programId are required',
      });
      return;
    }

    // Admit student
    const student = await admitStudent({
      fullName,
      phone,
      parentPhone,
      email,
      programId,
      admittedBy: userId,
      createdBy: userId,
      admissionId: manualAdmissionId,
      fatherName,
      motherName,
      dateOfBirth,
      gender,
      bloodGroup,
      address,
      schoolCollege,
    });

    const studentData = student as any;

    res.status(201).json({
      success: true,
      message: 'Student admitted successfully',
      data: {
        student: {
          id: studentData._id,
          fullName: student.fullName,
          admissionId: student.admissionId,
          email: student.email,
          phone: student.phone,
          programId: student.programId,
          status: student.status,
        },
        admissionId: student.admissionId,
        status: student.status,
      },
    });
  } catch (error: any) {
    console.error('Admit student error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to admit student',
    });
  }
};

// ============================================
// GET ADMISSION SETTINGS
// ============================================
export const getAdmissionSettingsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const settings = getAdmissionSettings();
    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error: any) {
    console.error('Get admission settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get admission settings',
    });
  }
};

// ============================================
// UPDATE ADMISSION SETTINGS
// ============================================
export const updateAdmissionSettingsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { mode, prefix, currentNumber } = req.body;

    // Validate
    if (mode && !['manual', 'automatic'].includes(mode)) {
      res.status(400).json({
        success: false,
        message: 'Invalid mode. Must be "manual" or "automatic"',
      });
      return;
    }

    if (mode === 'automatic') {
      if (!prefix || currentNumber === undefined || currentNumber === null) {
        res.status(400).json({
          success: false,
          message: 'Prefix and current number are required for automatic mode',
        });
        return;
      }
      if (typeof currentNumber !== 'number' || currentNumber < 0) {
        res.status(400).json({
          success: false,
          message: 'Current number must be a positive number',
        });
        return;
      }
    }

    const settings = updateAdmissionSettings({ mode, prefix, currentNumber });

    res.status(200).json({
      success: true,
      message: 'Admission settings updated successfully',
      data: settings,
    });
  } catch (error: any) {
    console.error('Update admission settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update admission settings',
    });
  }
};

// ============================================
// GET STUDENT BY ADMISSION ID
// ============================================
export const getStudentByAdmissionIdController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { admissionId } = req.params;

    if (!admissionId) {
      res.status(400).json({
        success: false,
        message: 'Admission ID is required',
      });
      return;
    }

    const student = await getStudentByAdmissionId(admissionId);

    if (!student) {
      res.status(404).json({
        success: false,
        message: 'Student not found with this admission ID',
      });
      return;
    }

    const studentData = student as any;

    res.status(200).json({
      success: true,
      data: {
        id: studentData._id,
        fullName: student.fullName,
        admissionId: student.admissionId,
        email: student.email,
        phone: student.phone,
        programId: student.programId,
        status: student.status,
        fatherName: student.fatherName,
        motherName: student.motherName,
        parentPhone: student.parentPhone,
        dateOfBirth: student.dateOfBirth,
        gender: student.gender,
        bloodGroup: student.bloodGroup,
        address: student.address,
        schoolCollege: student.schoolCollege,
        admissionDate: student.admissionDate,
      },
    });
  } catch (error: any) {
    console.error('Get student by admission ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get student',
    });
  }
};

// ============================================
// REGISTER STUDENT (Create Account)
// ============================================
export const registerStudentController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { admissionId, email, password, confirmPassword } = req.body;

    // Validate
    if (!admissionId || !email || !password || !confirmPassword) {
      res.status(400).json({
        success: false,
        message: 'All fields are required: admissionId, email, password, confirmPassword',
      });
      return;
    }

    if (password !== confirmPassword) {
      res.status(400).json({
        success: false,
        message: 'Passwords do not match',
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
      return;
    }

    // Register student
    const { user, student } = await registerStudent(admissionId, email, password);

    const studentData = student as any;

    res.status(201).json({
      success: true,
      message: 'Student registered successfully! Please login with your email and password.',
      data: {
        studentId: studentData._id,
        admissionId: student.admissionId,
        email: user.email,
        status: student.status,
      },
    });
  } catch (error: any) {
    console.error('Register student error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to register student',
    });
  }
};

// ============================================
// GET ALL STUDENTS (with pagination)
// ============================================
export const getAllStudentsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, search, status, programId } = req.query;

    const { students, total } = await getStudents({
      page: Number(page),
      limit: Number(limit),
      status: status as string,
      programId: programId as string,
      search: search as string,
    });

    const studentsData = students.map((s: any) => ({
      id: s._id,
      fullName: s.fullName,
      admissionId: s.admissionId,
      email: s.email,
      phone: s.phone,
      programId: s.programId,
      status: s.status,
      userId: s.userId,
      admissionDate: s.admissionDate,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    }));

    res.status(200).json({
      success: true,
      data: {
        students: studentsData,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error: any) {
    console.error('Get all students error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get students',
      error: error.message,
    });
  }
};

// ============================================
// CHECK STUDENT STATUS (DEBUG - Admin Only)
// ============================================
export const checkStudentStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { admissionId } = req.params;

    const student = await Student.findOne({ admissionId });
    if (!student) {
      res.status(404).json({
        success: false,
        message: 'Student not found',
      });
      return;
    }

    // Get user info if exists
    let userInfo = null;
    if (student.userId) {
      const user = await User.findById(student.userId);
      if (user) {
        userInfo = {
          id: user._id,
          email: user.email,
          isActive: user.isActive,
          createdAt: user.createdAt,
        };
      }
    }

    res.status(200).json({
      success: true,
      data: {
        id: student._id,
        admissionId: student.admissionId,
        fullName: student.fullName,
        email: student.email,
        phone: student.phone,
        status: student.status,
        hasUserId: !!student.userId,
        userId: student.userId,
        userInfo: userInfo,
        isDeleted: student.isDeleted,
        createdAt: student.createdAt,
        updatedAt: student.updatedAt,
      },
    });
  } catch (error: any) {
    console.error('Check student status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check student status',
      error: error.message,
    });
  }
};

// ============================================
// RESET STUDENT REGISTRATION (Admin Only)
// ============================================
export const resetStudentRegistration = async (req: Request, res: Response): Promise<void> => {
  try {
    const { admissionId } = req.params;

    const student = await Student.findOne({ admissionId });
    if (!student) {
      res.status(404).json({
        success: false,
        message: 'Student not found',
      });
      return;
    }

    // Store the userId for logging
    const oldUserId = student.userId;

    // Reset the student's registration status
    student.userId = null;
    student.status = 'pending_registration';
    await student.save();

    // If there was a user, delete it
    if (oldUserId) {
      await User.findByIdAndDelete(oldUserId);
    }

    res.status(200).json({
      success: true,
      message: 'Student registration reset successfully',
      data: {
        admissionId: student.admissionId,
        fullName: student.fullName,
        status: student.status,
        userId: student.userId,
        wasRegistered: !!oldUserId,
      },
    });
  } catch (error: any) {
    console.error('Reset student registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset student registration',
      error: error.message,
    });
  }
};