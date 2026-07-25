import { Request, Response } from 'express';
import { User } from '../models/User.model.js';
import { Student } from '../models/Student.model.js';
import { Teacher } from '../models/Teacher.model.js';
import { OfficeMember } from '../models/OfficeMember.model.js';

// ============================================
// GET PROFILE FOR CURRENT USER
// ============================================
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const userRole = (req as any).user?.role;

    const user = await User.findById(userId).select('-password');
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    let profileData: any = {
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        fullName: user.fullName || '',
        phone: user.phone || '',
      }
    };

    // Get role-specific profile
    if (userRole === 'student') {
      const student = await Student.findOne({ userId }).populate('programId', 'name displayName');
      profileData.profile = student;
      // If student has fullName/phone, use those as fallback if user doesn't have them
      if (student) {
        if (!user.fullName && student.fullName) profileData.user.fullName = student.fullName;
        if (!user.phone && student.phone) profileData.user.phone = student.phone;
      }
    } else if (userRole === 'teacher') {
      const teacher = await Teacher.findOne({ userId }).populate('programIds', 'name displayName');
      profileData.profile = teacher;
      if (teacher) {
        if (!user.fullName && teacher.fullName) profileData.user.fullName = teacher.fullName;
        if (!user.phone && teacher.phone) profileData.user.phone = teacher.phone;
      }
    } else if (userRole === 'office') {
      const office = await OfficeMember.findOne({ userId });
      profileData.profile = office;
      if (office) {
        if (!user.fullName && office.fullName) profileData.user.fullName = office.fullName;
        if (!user.phone && office.phone) profileData.user.phone = office.phone;
      }
    } else {
      // Admin or other roles - just use user data
      profileData.profile = {
        fullName: user.fullName || user.email?.split('@')[0] || 'User',
        phone: user.phone || 'N/A',
      };
    }

    console.log('✅ getProfile returning:', {
      email: profileData.user.email,
      fullName: profileData.user.fullName,
      phone: profileData.user.phone
    });

    res.status(200).json({
      success: true,
      data: profileData,
    });
  } catch (error: any) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile',
      error: error.message,
    });
  }
};

// ============================================
// UPDATE PROFILE (All Roles)
// ============================================
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const userRole = (req as any).user?.role;
    const { fullName, phone } = req.body;

    console.log('📝 Update profile request:', { userId, userRole, fullName, phone });

    if (!fullName || !phone) {
      res.status(400).json({
        success: false,
        message: 'Full name and phone are required',
      });
      return;
    }

    // ✅ ALWAYS update the User model first (for all roles)
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { fullName, phone },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    console.log('✅ Updated user in database:', {
      id: updatedUser._id,
      fullName: updatedUser.fullName,
      phone: updatedUser.phone
    });

    // Also update role-specific profile if it exists
    let updatedProfile: any = null;

    if (userRole === 'student') {
      const student = await Student.findOne({ userId });
      if (student) {
        updatedProfile = await Student.findOneAndUpdate(
          { userId },
          { fullName, phone },
          { new: true, runValidators: true }
        ).populate('programId', 'name displayName');
      }
    } else if (userRole === 'teacher') {
      const teacher = await Teacher.findOne({ userId });
      if (teacher) {
        updatedProfile = await Teacher.findOneAndUpdate(
          { userId },
          { fullName, phone },
          { new: true, runValidators: true }
        ).populate('programIds', 'name displayName');
      }
    } else if (userRole === 'office') {
      const office = await OfficeMember.findOne({ userId });
      if (office) {
        updatedProfile = await OfficeMember.findOneAndUpdate(
          { userId },
          { fullName, phone },
          { new: true, runValidators: true }
        );
      }
    }

    // ✅ Build response with updated user data
    const responseData = {
      user: {
        id: updatedUser._id,
        email: updatedUser.email,
        role: updatedUser.role,
        isActive: updatedUser.isActive,
        fullName: updatedUser.fullName || '',
        phone: updatedUser.phone || '',
      },
      profile: updatedProfile || { fullName, phone },
    };

    console.log('✅ updateProfile returning:', {
      email: responseData.user.email,
      fullName: responseData.user.fullName,
      phone: responseData.user.phone
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: responseData,
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message,
    });
  }
};

// ============================================
// CHANGE PASSWORD (All Roles)
// ============================================
export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const { currentPassword, newPassword } = req.body;

    console.log('🔑 Change password request:', { userId });

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

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
      return;
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error: any) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password',
      error: error.message,
    });
  }
};