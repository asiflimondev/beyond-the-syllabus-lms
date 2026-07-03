import { Request, Response } from 'express';
import { Teacher } from '../models/Teacher.model.js';
import { Student } from '../models/Student.model.js';
import { Program } from '../models/Program.model.js';
import { MockTest } from '../models/MockTest.model.js';
import { Result } from '../models/Result.model.js';

// ============================================
// GET TEACHER PROFILE
// ============================================
export const getTeacherProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;

    const teacher = await Teacher.findOne({ userId })
      .populate('programIds', 'name displayName duration fee');

    if (!teacher) {
      res.status(404).json({
        success: false,
        message: 'Teacher profile not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: teacher,
    });
  } catch (error: any) {
    console.error('Get teacher profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get teacher profile',
      error: error.message,
    });
  }
};

// ============================================
// UPDATE TEACHER PROFILE
// ============================================
export const updateTeacherProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const { fullName, phone, dateOfBirth, gender, bloodGroup, address } = req.body;

    const teacher = await Teacher.findOne({ userId });
    if (!teacher) {
      res.status(404).json({
        success: false,
        message: 'Teacher profile not found',
      });
      return;
    }

    // Update fields
    if (fullName) teacher.fullName = fullName;
    if (phone) teacher.phone = phone;
    if (dateOfBirth) teacher.dateOfBirth = dateOfBirth;
    if (gender) teacher.gender = gender;
    if (bloodGroup) teacher.bloodGroup = bloodGroup;
    if (address) teacher.address = address;

    await teacher.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: teacher,
    });
  } catch (error: any) {
    console.error('Update teacher profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update teacher profile',
      error: error.message,
    });
  }
};

// ============================================
// GET TEACHER'S PROGRAMS
// ============================================
export const getTeacherPrograms = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;

    const teacher = await Teacher.findOne({ userId }).populate('programIds');
    if (!teacher) {
      res.status(404).json({
        success: false,
        message: 'Teacher profile not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: teacher.programIds,
    });
  } catch (error: any) {
    console.error('Get teacher programs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get teacher programs',
      error: error.message,
    });
  }
};

// ============================================
// GET STUDENTS BY PROGRAM
// ============================================
export const getStudentsByProgram = async (req: Request, res: Response): Promise<void> => {
  try {
    const { programId } = req.params;
    const { page = 1, limit = 10, search } = req.query;

    // Verify teacher has access to this program
    const userId = (req as any).user?.id;
    const teacher = await Teacher.findOne({ 
      userId,
      programIds: programId,
    });

    if (!teacher) {
      res.status(403).json({
        success: false,
        message: 'You do not have access to this program',
      });
      return;
    }

    // Build filter
    const filter: any = { 
      programId,
      isDeleted: false,
    };
    
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { admissionId: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const students = await Student.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('userId', 'email isActive');

    const total = await Student.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        students: students.map((s: any) => ({
          id: s._id,
          fullName: s.fullName,
          admissionId: s.admissionId,
          email: s.email,
          phone: s.phone,
          status: s.status,
          userId: s.userId,
        })),
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error: any) {
    console.error('Get students by program error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get students',
      error: error.message,
    });
  }
};

// ============================================
// GET MOCK TESTS BY PROGRAM
// ============================================
export const getMockTestsByProgram = async (req: Request, res: Response): Promise<void> => {
  try {
    const { programId } = req.params;

    // Verify teacher has access
    const userId = (req as any).user?.id;
    const teacher = await Teacher.findOne({ 
      userId,
      programIds: programId,
    });

    if (!teacher) {
      res.status(403).json({
        success: false,
        message: 'You do not have access to this program',
      });
      return;
    }

    const mockTests = await MockTest.find({ 
      programId,
      isActive: true,
    }).sort({ testNumber: 1 });

    res.status(200).json({
      success: true,
      data: mockTests,
    });
  } catch (error: any) {
    console.error('Get mock tests error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get mock tests',
      error: error.message,
    });
  }
};

// ============================================
// CREATE MOCK TEST
// ============================================
export const createMockTest = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      programId,
      title,
      description,
      testDate,
      reading,
      writing,
      listening,
      speaking,
      presentation,
    } = req.body;

    const userId = (req as any).user?.id;

    // Verify teacher has access
    const teacher = await Teacher.findOne({ 
      userId,
      programIds: programId,
    });

    if (!teacher) {
      res.status(403).json({
        success: false,
        message: 'You do not have access to this program',
      });
      return;
    }

    // Get the next test number
    const lastTest = await MockTest.findOne({ programId })
      .sort({ testNumber: -1 });
    const testNumber = lastTest ? lastTest.testNumber + 1 : 1;

    const mockTest = await MockTest.create({
      programId,
      title,
      description,
      testNumber,
      testDate: testDate || new Date(),
      reading,
      writing,
      listening,
      speaking,
      presentation,
      createdBy: userId,
      updatedBy: userId,
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: 'Mock test created successfully',
      data: mockTest,
    });
  } catch (error: any) {
    console.error('Create mock test error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create mock test',
      error: error.message,
    });
  }
};

// ============================================
// UPDATE MOCK TEST
// ============================================
export const updateMockTest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      testDate,
      reading,
      writing,
      listening,
      speaking,
      presentation,
    } = req.body;

    const userId = (req as any).user?.id;

    const mockTest = await MockTest.findById(id);
    if (!mockTest) {
      res.status(404).json({
        success: false,
        message: 'Mock test not found',
      });
      return;
    }

    // Verify teacher has access to the program
    const teacher = await Teacher.findOne({ 
      userId,
      programIds: mockTest.programId,
    });

    if (!teacher) {
      res.status(403).json({
        success: false,
        message: 'You do not have access to this program',
      });
      return;
    }

    // Update fields
    if (title) mockTest.title = title;
    if (description) mockTest.description = description;
    if (testDate) mockTest.testDate = testDate;
    if (reading) mockTest.reading = reading;
    if (writing) mockTest.writing = writing;
    if (listening) mockTest.listening = listening;
    if (speaking) mockTest.speaking = speaking;
    if (presentation) mockTest.presentation = presentation;
    mockTest.updatedBy = userId;

    await mockTest.save();

    res.status(200).json({
      success: true,
      message: 'Mock test updated successfully',
      data: mockTest,
    });
  } catch (error: any) {
    console.error('Update mock test error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update mock test',
      error: error.message,
    });
  }
};

// ============================================
// GET STUDENT RESULTS FOR MOCK TEST
// ============================================
export const getMockTestResults = async (req: Request, res: Response): Promise<void> => {
  try {
    const { mockTestId } = req.params;

    const mockTest = await MockTest.findById(mockTestId);
    if (!mockTest) {
      res.status(404).json({
        success: false,
        message: 'Mock test not found',
      });
      return;
    }

    // Verify teacher has access
    const userId = (req as any).user?.id;
    const teacher = await Teacher.findOne({ 
      userId,
      programIds: mockTest.programId,
    });

    if (!teacher) {
      res.status(403).json({
        success: false,
        message: 'You do not have access to this program',
      });
      return;
    }

    const results = await Result.find({ mockTestId })
      .populate('studentId', 'fullName admissionId email');

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error: any) {
    console.error('Get mock test results error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get results',
      error: error.message,
    });
  }
};