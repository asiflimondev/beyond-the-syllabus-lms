import { Request, Response } from 'express';
import { Student } from '../models/Student.model.js';
import { Program } from '../models/Program.model.js';
import { MockTest } from '../models/MockTest.model.js';
import { Result } from '../models/Result.model.js';
import { User } from '../models/User.model.js';

// ============================================
// GET STUDENT PROFILE
// ============================================
export const getStudentProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;

    const student = await Student.findOne({ userId })
      .populate('programId', 'name displayName description duration fee');

    if (!student) {
      res.status(404).json({
        success: false,
        message: 'Student profile not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error: any) {
    console.error('Get student profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get student profile',
      error: error.message,
    });
  }
};

// ============================================
// UPDATE STUDENT PROFILE
// ============================================
export const updateStudentProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const {
      fullName,
      phone,
      fatherName,
      motherName,
      parentPhone,
      dateOfBirth,
      gender,
      bloodGroup,
      address,
      schoolCollege,
    } = req.body;

    const student = await Student.findOne({ userId });
    if (!student) {
      res.status(404).json({
        success: false,
        message: 'Student profile not found',
      });
      return;
    }

    // Build update object with all fields
    const updateData: any = {};
    if (fullName !== undefined) updateData.fullName = fullName;
    if (phone !== undefined) updateData.phone = phone;
    if (fatherName !== undefined) updateData.fatherName = fatherName;
    if (motherName !== undefined) updateData.motherName = motherName;
    if (parentPhone !== undefined) updateData.parentPhone = parentPhone;
    if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth;
    if (gender !== undefined) updateData.gender = gender;
    if (bloodGroup !== undefined) updateData.bloodGroup = bloodGroup;
    if (address !== undefined) updateData.address = address;
    if (schoolCollege !== undefined) updateData.schoolCollege = schoolCollege;

    const updatedStudent = await Student.findOneAndUpdate(
      { userId },
      updateData,
      { new: true, runValidators: true }
    ).populate('programId', 'name displayName description duration fee');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedStudent,
    });
  } catch (error: any) {
    console.error('Update student profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update student profile',
      error: error.message,
    });
  }
};

// ============================================
// GET STUDENT'S CURRENT PROGRAM
// ============================================
export const getStudentProgram = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;

    const student = await Student.findOne({ userId })
      .populate('programId', 'name displayName description duration fee');

    if (!student) {
      res.status(404).json({
        success: false,
        message: 'Student not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: student.programId,
    });
  } catch (error: any) {
    console.error('Get student program error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get student program',
      error: error.message,
    });
  }
};

// ============================================
// GET STUDENT'S MOCK TESTS WITH RESULTS (ALL PROGRAMS)
// ============================================
export const getStudentMockTests = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;

    const student = await Student.findOne({ userId });
    if (!student) {
      res.status(404).json({
        success: false,
        message: 'Student not found',
      });
      return;
    }

    // Get ALL results for this student (from all programs)
    const allResults = await Result.find({
      studentId: student._id,
      isDeleted: false,
    })
      .populate({
        path: 'mockTestId',
        populate: {
          path: 'programId',
          select: 'name displayName',
        },
      })
      .sort({ createdAt: -1 });

    // Group results by program
    const resultsByProgram = allResults.reduce((acc: any, result: any) => {
      const program = result.mockTestId?.programId;
      const programId = program?._id?.toString() || 'unknown';
      
      if (!acc[programId]) {
        acc[programId] = {
          programName: program?.displayName?.en || program?.name || 'Unknown Program',
          programId: program?._id,
          results: [],
        };
      }
      
      // Get the mock test details
      const mockTest = result.mockTestId;
      acc[programId].results.push({
        resultId: result._id,
        mockTestId: mockTest?._id,
        title: mockTest?.title || `Mock Test ${mockTest?.testNumber || ''}`,
        testNumber: mockTest?.testNumber,
        testDate: mockTest?.testDate,
        reading: result.reading,
        writing: result.writing,
        listening: result.listening,
        speaking: result.speaking,
        presentation: result.presentation,
        totalMarks: result.totalMarks,
        percentage: result.percentage,
        grade: result.grade,
        createdAt: result.createdAt,
      });
      
      return acc;
    }, {});

    // Convert to array and sort by program order
    const programsWithResults = Object.values(resultsByProgram);

    // Also get current program mock tests that don't have results yet
    const currentProgramMockTests = await MockTest.find({
      programId: student.programId,
      isActive: true,
    }).sort({ testNumber: 1 });

    // Get IDs of mock tests that already have results
    const resultMockTestIds = allResults.map((r: any) => r.mockTestId?._id?.toString());

    // Filter out mock tests that already have results
    const pendingMockTests = currentProgramMockTests.filter(
      (test: any) => !resultMockTestIds.includes(test._id.toString())
    );

    res.status(200).json({
      success: true,
      data: {
        programs: programsWithResults,
        currentProgram: student.programId,
        pendingTests: pendingMockTests,
      },
    });
  } catch (error: any) {
    console.error('Get student mock tests error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get mock tests',
      error: error.message,
    });
  }
};

// ============================================
// GET STUDENT'S RESULT FOR A MOCK TEST
// ============================================
export const getStudentResult = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const { mockTestId } = req.params;

    const student = await Student.findOne({ userId });
    if (!student) {
      res.status(404).json({
        success: false,
        message: 'Student not found',
      });
      return;
    }

    // First, find the result for this mock test
    const result = await Result.findOne({
      studentId: student._id,
      mockTestId: mockTestId, // This is the mock test ID
      isDeleted: false,
    }).populate('mockTestId', 'title testNumber testDate');

    if (!result) {
      res.status(404).json({
        success: false,
        message: 'Result not found for this mock test',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('Get student result error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get result',
      error: error.message,
    });
  }
};

// ============================================
// GET STUDENT STATISTICS (UPDATED)
// ============================================
export const getStudentStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;

    const student = await Student.findOne({ userId });
    if (!student) {
      res.status(404).json({
        success: false,
        message: 'Student not found',
      });
      return;
    }

    // Get ALL results for this student (from all programs)
    const allResults = await Result.find({
      studentId: student._id,
      isDeleted: false,
    });

    // Get current program mock tests (for pending count)
    const currentProgramMockTests = await MockTest.countDocuments({
      programId: student.programId,
      isActive: true,
    });

    const completedTests = allResults.length;
    const pendingTests = Math.max(0, currentProgramMockTests - completedTests);

    // Calculate average percentage from ALL results
    let averagePercentage = 0;
    if (allResults.length > 0) {
      const totalPercentage = allResults.reduce((sum, r) => sum + r.percentage, 0);
      averagePercentage = totalPercentage / allResults.length;
    }

    // Get latest result from ALL programs
    const latestResult = await Result.findOne({
      studentId: student._id,
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .populate('mockTestId', 'title testNumber programId');

    // Get total mock tests across all programs (completed only)
    const totalMockTests = allResults.length;

    // Get results by program (for stats breakdown)
    const resultsByProgram = allResults.reduce((acc: any, result: any) => {
      const programId = result.programId?.toString() || 'unknown';
      if (!acc[programId]) {
        acc[programId] = {
          count: 0,
          totalPercentage: 0,
        };
      }
      acc[programId].count++;
      acc[programId].totalPercentage += result.percentage;
      return acc;
    }, {});

    // Calculate average per program
    const programStats = Object.entries(resultsByProgram).map(([programId, data]: [string, any]) => ({
      programId,
      testCount: data.count,
      averagePercentage: Math.round(data.totalPercentage / data.count),
    }));

    res.status(200).json({
      success: true,
      data: {
        totalMockTests,
        completedTests,
        pendingTests,
        averagePercentage: Math.round(averagePercentage),
        latestResult: latestResult || null,
        programStats,
      },
    });
  } catch (error: any) {
    console.error('Get student stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get student statistics',
      error: error.message,
    });
  }
};

// ============================================
// CHANGE STUDENT PASSWORD
// ============================================
export const changeStudentPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({
        success: false,
        message: 'Current password and new password are required',
      });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters',
      });
      return;
    }

    const user = await User.findById(userId).select('+password');
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
      return;
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error: any) {
    console.error('Change student password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password',
      error: error.message,
    });
  }
};