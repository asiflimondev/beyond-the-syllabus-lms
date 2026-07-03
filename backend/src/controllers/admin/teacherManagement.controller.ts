import { Request, Response } from 'express';
import { User } from '../../models/User.model.js';
import { Teacher } from '../../models/Teacher.model.js';
import { Program } from '../../models/Program.model.js';
import { Types } from 'mongoose';

// ============================================
// CREATE TEACHER (Admin Only)
// ============================================
export const createTeacher = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      email,
      password,
      fullName,
      phone,
      dateOfBirth,
      gender,
      bloodGroup,
      address,
      programIds = [],
    } = req.body;

    const adminId = (req as any).user?.id;

    // Validate required fields
    if (!email || !password || !fullName || !phone) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields: email, password, fullName, phone are required',
      });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({
        success: false,
        message: 'User already exists with this email',
      });
      return;
    }

    // Create user account
    const user = await User.create({
      email,
      password,
      role: 'teacher',
      isActive: true,
    });

    // Generate employee ID
    const employeeId = `TCH${Date.now().toString().slice(-4)}${Math.random().toString(36).substring(2, 5).toUpperCase()}`;

    // Create teacher profile
    const teacher = await Teacher.create({
      userId: user._id,
      fullName,
      employeeId,
      phone,
      email,
      dateOfBirth: dateOfBirth || undefined,
      gender: gender || undefined,
      bloodGroup: bloodGroup || undefined,
      address: address || '',
      programIds: programIds || [],
      createdBy: adminId,
      updatedBy: adminId,
      isDeleted: false,
    });

    // Populate program data for response
    const populatedTeacher = await Teacher.findById(teacher._id)
      .populate('programIds', 'name displayName');

    res.status(201).json({
      success: true,
      message: 'Teacher created successfully',
      data: populatedTeacher,
    });
  } catch (error: any) {
    console.error('Create teacher error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create teacher',
      error: error.message,
    });
  }
};

// ============================================
// GET ALL TEACHERS
// ============================================
export const getAllTeachers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, search, isActive } = req.query;

    const filter: any = {};
    
    // Only show non-deleted unless specified
    if (isActive === 'true') filter.isDeleted = false;
    if (isActive === 'false') filter.isDeleted = true;
    
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const teachers = await Teacher.find(filter)
      .populate('userId', 'email isActive lastLogin')
      .populate('programIds', 'name displayName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Teacher.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        teachers: teachers.map((t: any) => ({
          id: t._id,
          userId: t.userId,
          fullName: t.fullName,
          employeeId: t.employeeId,
          phone: t.phone,
          email: t.email,
          dateOfBirth: t.dateOfBirth,
          gender: t.gender,
          bloodGroup: t.bloodGroup,
          address: t.address,
          programIds: t.programIds,
          isDeleted: t.isDeleted,
          createdAt: t.createdAt,
          updatedAt: t.updatedAt,
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
    console.error('Get all teachers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get teachers',
      error: error.message,
    });
  }
};

// ============================================
// GET TEACHER BY ID
// ============================================
export const getTeacherById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const teacher = await Teacher.findById(id)
      .populate('userId', 'email isActive lastLogin')
      .populate('programIds', 'name displayName');

    if (!teacher) {
      res.status(404).json({
        success: false,
        message: 'Teacher not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: teacher,
    });
  } catch (error: any) {
    console.error('Get teacher error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get teacher',
      error: error.message,
    });
  }
};

// ============================================
// UPDATE TEACHER
// ============================================
export const updateTeacher = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      fullName,
      phone,
      dateOfBirth,
      gender,
      bloodGroup,
      address,
      programIds,
      isActive,
    } = req.body;

    const adminId = (req as any).user?.id;

    const teacher = await Teacher.findById(id);
    if (!teacher) {
      res.status(404).json({
        success: false,
        message: 'Teacher not found',
      });
      return;
    }

    // Build update data
    const updateData: any = { updatedBy: adminId };
    if (fullName !== undefined) updateData.fullName = fullName;
    if (phone !== undefined) updateData.phone = phone;
    if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth;
    if (gender !== undefined) updateData.gender = gender;
    if (bloodGroup !== undefined) updateData.bloodGroup = bloodGroup;
    if (address !== undefined) updateData.address = address;
    if (programIds !== undefined) updateData.programIds = programIds;

    // Handle user status
    if (isActive !== undefined) {
      await User.findByIdAndUpdate(teacher.userId, { isActive });
    }

    const updatedTeacher = await Teacher.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('programIds', 'name displayName')
      .populate('userId', 'email isActive');

    res.status(200).json({
      success: true,
      message: 'Teacher updated successfully',
      data: updatedTeacher,
    });
  } catch (error: any) {
    console.error('Update teacher error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update teacher',
      error: error.message,
    });
  }
};

// ============================================
// DELETE TEACHER (Soft Delete)
// ============================================
export const deleteTeacher = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const adminId = (req as any).user?.id;

    const teacher = await Teacher.findById(id);
    if (!teacher) {
      res.status(404).json({
        success: false,
        message: 'Teacher not found',
      });
      return;
    }

    // Soft delete teacher
    teacher.isDeleted = true;
    teacher.deletedAt = new Date();
    teacher.updatedBy = adminId;
    await teacher.save();

    // Deactivate user account
    await User.findByIdAndUpdate(teacher.userId, { isActive: false });

    res.status(200).json({
      success: true,
      message: 'Teacher deleted successfully',
      data: {
        id: teacher._id,
        fullName: teacher.fullName,
        isDeleted: teacher.isDeleted,
        deletedAt: teacher.deletedAt,
      },
    });
  } catch (error: any) {
    console.error('Delete teacher error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete teacher',
      error: error.message,
    });
  }
};

// ============================================
// RESTORE TEACHER
// ============================================
export const restoreTeacher = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const adminId = (req as any).user?.id;

    const teacher = await Teacher.findById(id);
    if (!teacher) {
      res.status(404).json({
        success: false,
        message: 'Teacher not found',
      });
      return;
    }

    // Restore teacher
    teacher.isDeleted = false;
    teacher.deletedAt = undefined;
    teacher.updatedBy = adminId;
    await teacher.save();

    // Reactivate user account
    await User.findByIdAndUpdate(teacher.userId, { isActive: true });

    res.status(200).json({
      success: true,
      message: 'Teacher restored successfully',
      data: {
        id: teacher._id,
        fullName: teacher.fullName,
        isDeleted: teacher.isDeleted,
      },
    });
  } catch (error: any) {
    console.error('Restore teacher error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to restore teacher',
      error: error.message,
    });
  }
};

// ============================================
// GET TEACHER STATISTICS
// ============================================
export const getTeacherStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const total = await Teacher.countDocuments({ isDeleted: false });
    const active = await Teacher.countDocuments({ isDeleted: false });
    const inactive = await Teacher.countDocuments({ isDeleted: true });

    res.status(200).json({
      success: true,
      data: {
        total,
        active,
        inactive,
      },
    });
  } catch (error: any) {
    console.error('Get teacher stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get teacher stats',
      error: error.message,
    });
  }
};