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

    const updateData: any = {};
    if (fullName !== undefined) updateData.fullName = fullName;
    if (phone !== undefined) updateData.phone = phone;
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
// GET STUDENT'S MOCK TESTS WITH RESULTS
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

    // Get all mock tests for the student's program
    const mockTests = await MockTest.find({
      programId: student.programId,
      isActive: true,
    }).sort({ testNumber: 1 });

    // Get results for each mock test
    const mockTestsWithResults = await Promise.all(
      mockTests.map(async (mockTest) => {
        const result = await Result.findOne({
          studentId: student._id,
          mockTestId: mockTest._id,
          isDeleted: false,
        });

        return {
          ...mockTest.toObject(),
          result: result || null,
          hasResult: !!result,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: mockTestsWithResults,
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

    const result = await Result.findOne({
      studentId: student._id,
      mockTestId,
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
// GET STUDENT STATISTICS
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

    // Get total mock tests
    const totalMockTests = await MockTest.countDocuments({
      programId: student.programId,
      isActive: true,
    });

    // Get completed mock tests
    const completedResults = await Result.countDocuments({
      studentId: student._id,
      isDeleted: false,
    });

    // Get average percentage
    const results = await Result.find({
      studentId: student._id,
      isDeleted: false,
    });

    let averagePercentage = 0;
    if (results.length > 0) {
      const totalPercentage = results.reduce((sum, r) => sum + r.percentage, 0);
      averagePercentage = totalPercentage / results.length;
    }

    // Get latest result
    const latestResult = await Result.findOne({
      studentId: student._id,
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .populate('mockTestId', 'title testNumber');

    res.status(200).json({
      success: true,
      data: {
        totalMockTests,
        completedTests: completedResults,
        pendingTests: totalMockTests - completedResults,
        averagePercentage: Math.round(averagePercentage),
        latestResult: latestResult || null,
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