import { Request, Response } from 'express';
import { Student } from '../../models/Student.model.js';
import { User } from '../../models/User.model.js';
import { Program } from '../../models/Program.model.js';

// ============================================
// GET ALL STUDENTS (Admin)
// ============================================
export const getAllStudents = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, search, status, programId, isDeleted } = req.query;

    const filter: any = {};
    if (status) filter.status = status;
    if (programId) filter.programId = programId;
    if (isDeleted === 'true') filter.isDeleted = true;
    else if (isDeleted === 'false') filter.isDeleted = false;
    else filter.isDeleted = false; // Default to showing active students

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
      .populate('userId', 'email isActive lastLogin')
      .populate('programId', 'name displayName')
      .populate('admittedBy', 'email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

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
          program: s.programId,
          user: s.userId,
          admissionDate: s.admissionDate,
          createdAt: s.createdAt,
          updatedAt: s.updatedAt,
          isDeleted: s.isDeleted,
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
    console.error('Get all students error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get students',
      error: error.message,
    });
  }
};

// ============================================
// GET STUDENT BY ID (Admin)
// ============================================
export const getStudentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const student = await Student.findById(id)
      .populate('userId', 'email isActive lastLogin')
      .populate('programId', 'name displayName description duration fee')
      .populate('admittedBy', 'email');

    if (!student) {
      res.status(404).json({
        success: false,
        message: 'Student not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error: any) {
    console.error('Get student error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get student',
      error: error.message,
    });
  }
};

// ============================================
// UPDATE STUDENT (Admin)
// ============================================
export const updateStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      fullName,
      phone,
      parentPhone,
      dateOfBirth,
      gender,
      bloodGroup,
      address,
      schoolCollege,
      programId,
      status,
    } = req.body;

    const adminId = (req as any).user?.id;

    const student = await Student.findById(id);
    if (!student) {
      res.status(404).json({
        success: false,
        message: 'Student not found',
      });
      return;
    }

    const updateData: any = { updatedBy: adminId };
    if (fullName !== undefined) updateData.fullName = fullName;
    if (phone !== undefined) updateData.phone = phone;
    if (parentPhone !== undefined) updateData.parentPhone = parentPhone;
    if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth;
    if (gender !== undefined) updateData.gender = gender;
    if (bloodGroup !== undefined) updateData.bloodGroup = bloodGroup;
    if (address !== undefined) updateData.address = address;
    if (schoolCollege !== undefined) updateData.schoolCollege = schoolCollege;
    if (programId !== undefined) updateData.programId = programId;
    if (status !== undefined) updateData.status = status;

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('userId', 'email isActive')
      .populate('programId', 'name displayName');

    res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      data: updatedStudent,
    });
  } catch (error: any) {
    console.error('Update student error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update student',
      error: error.message,
    });
  }
};

// ============================================
// DELETE STUDENT (Soft Delete - Admin)
// ============================================
export const deleteStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const adminId = (req as any).user?.id;

    const student = await Student.findById(id);
    if (!student) {
      res.status(404).json({
        success: false,
        message: 'Student not found',
      });
      return;
    }

    student.isDeleted = true;
    student.deletedAt = new Date();
    student.updatedBy = adminId;
    await student.save();

    // Deactivate user if exists
    if (student.userId) {
      await User.findByIdAndUpdate(student.userId, { isActive: false });
    }

    res.status(200).json({
      success: true,
      message: 'Student deleted successfully',
      data: {
        id: student._id,
        fullName: student.fullName,
        isDeleted: student.isDeleted,
      },
    });
  } catch (error: any) {
    console.error('Delete student error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete student',
      error: error.message,
    });
  }
};

// ============================================
// RESTORE STUDENT (Admin)
// ============================================
export const restoreStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const adminId = (req as any).user?.id;

    const student = await Student.findById(id);
    if (!student) {
      res.status(404).json({
        success: false,
        message: 'Student not found',
      });
      return;
    }

    student.isDeleted = false;
    student.deletedAt = undefined;
    student.updatedBy = adminId;
    await student.save();

    // Reactivate user if exists
    if (student.userId) {
      await User.findByIdAndUpdate(student.userId, { isActive: true });
    }

    res.status(200).json({
      success: true,
      message: 'Student restored successfully',
      data: {
        id: student._id,
        fullName: student.fullName,
        isDeleted: student.isDeleted,
      },
    });
  } catch (error: any) {
    console.error('Restore student error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to restore student',
      error: error.message,
    });
  }
};

// ============================================
// RESET STUDENT PASSWORD (Admin)
// ============================================
export const resetStudentPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters',
      });
      return;
    }

    const student = await Student.findById(id);
    if (!student) {
      res.status(404).json({
        success: false,
        message: 'Student not found',
      });
      return;
    }

    if (!student.userId) {
      res.status(400).json({
        success: false,
        message: 'Student has not registered yet. No user account exists.',
      });
      return;
    }

    const user = await User.findById(student.userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User account not found',
      });
      return;
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error: any) {
    console.error('Reset student password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset password',
      error: error.message,
    });
  }
};

// ============================================
// GET STUDENT STATS (Admin)
// ============================================
export const getStudentStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const total = await Student.countDocuments({ isDeleted: false });
    const pending = await Student.countDocuments({ 
      isDeleted: false, 
      status: 'pending_registration' 
    });
    const active = await Student.countDocuments({ 
      isDeleted: false, 
      status: 'active' 
    });
    const completed = await Student.countDocuments({ 
      isDeleted: false, 
      status: 'completed' 
    });
    const inactive = await Student.countDocuments({ 
      isDeleted: false, 
      status: 'inactive' 
    });

    res.status(200).json({
      success: true,
      data: {
        total,
        pending,
        active,
        completed,
        inactive,
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