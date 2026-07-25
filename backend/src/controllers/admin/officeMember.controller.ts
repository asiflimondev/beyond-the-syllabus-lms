import { Request, Response } from 'express';
import { User } from '../../models/User.model.js';
import { OfficeMember } from '../../models/OfficeMember.model.js';

// ============================================
// CREATE OFFICE MEMBER (Admin Only)
// ============================================
export const createOfficeMember = async (req: Request, res: Response): Promise<void> => {
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
    } = req.body;

    const adminId = (req as any).user?.id;

    if (!email || !password || !fullName || !phone) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields: email, password, fullName, phone are required',
      });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({
        success: false,
        message: 'User already exists with this email',
      });
      return;
    }

    const user = await User.create({
      email,
      password,
      role: 'office',
      isActive: true,
      fullName,
      phone,
    });

    const employeeId = `OFF${Date.now().toString().slice(-4)}${Math.random().toString(36).substring(2, 5).toUpperCase()}`;

    const officeMember = await OfficeMember.create({
      userId: user._id,
      fullName,
      employeeId,
      phone,
      email,
      dateOfBirth: dateOfBirth || undefined,
      gender: gender || undefined,
      bloodGroup: bloodGroup || undefined,
      address: address || '',
      createdBy: adminId,
      updatedBy: adminId,
      isDeleted: false,
    });

    res.status(201).json({
      success: true,
      message: 'Office member created successfully',
      data: officeMember,
    });
  } catch (error: any) {
    console.error('Create office member error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create office member',
      error: error.message,
    });
  }
};

// ============================================
// GET ALL OFFICE MEMBERS (Admin Only)
// ============================================
export const getAllOfficeMembers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, search, isActive } = req.query;

    const filter: any = {};
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

    const officeMembers = await OfficeMember.find(filter)
      .populate('userId', 'email isActive lastLogin')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await OfficeMember.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        officeMembers: officeMembers.map((o: any) => ({
          id: o._id,
          userId: o.userId,
          fullName: o.fullName,
          employeeId: o.employeeId,
          phone: o.phone,
          email: o.email,
          dateOfBirth: o.dateOfBirth,
          gender: o.gender,
          bloodGroup: o.bloodGroup,
          address: o.address,
          isDeleted: o.isDeleted,
          createdAt: o.createdAt,
          updatedAt: o.updatedAt,
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
    console.error('Get all office members error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get office members',
      error: error.message,
    });
  }
};

// ============================================
// GET OFFICE MEMBER BY ID (Admin Only)
// ============================================
export const getOfficeMemberById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const officeMember = await OfficeMember.findById(id).populate('userId', 'email isActive lastLogin');
    if (!officeMember) {
      res.status(404).json({ success: false, message: 'Office member not found' });
      return;
    }
    res.status(200).json({ success: true, data: officeMember });
  } catch (error: any) {
    console.error('Get office member error:', error);
    res.status(500).json({ success: false, message: 'Failed to get office member', error: error.message });
  }
};

// ============================================
// UPDATE OFFICE MEMBER (Admin Only)
// ============================================
export const updateOfficeMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { fullName, phone, dateOfBirth, gender, bloodGroup, address, isActive } = req.body;
    const adminId = (req as any).user?.id;

    const officeMember = await OfficeMember.findById(id);
    if (!officeMember) {
      res.status(404).json({ success: false, message: 'Office member not found' });
      return;
    }

    const updateData: any = { updatedBy: adminId };
    if (fullName !== undefined) updateData.fullName = fullName;
    if (phone !== undefined) updateData.phone = phone;
    if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth;
    if (gender !== undefined) updateData.gender = gender;
    if (bloodGroup !== undefined) updateData.bloodGroup = bloodGroup;
    if (address !== undefined) updateData.address = address;

    if (isActive !== undefined) {
      await User.findByIdAndUpdate(officeMember.userId, { isActive });
    }

    const updatedOfficeMember = await OfficeMember.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('userId', 'email isActive');

    res.status(200).json({
      success: true,
      message: 'Office member updated successfully',
      data: updatedOfficeMember,
    });
  } catch (error: any) {
    console.error('Update office member error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update office member',
      error: error.message,
    });
  }
};

// ============================================
// DELETE OFFICE MEMBER (Admin Only)
// ============================================
export const deleteOfficeMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const adminId = (req as any).user?.id;

    const officeMember = await OfficeMember.findById(id);
    if (!officeMember) {
      res.status(404).json({ success: false, message: 'Office member not found' });
      return;
    }

    officeMember.isDeleted = true;
    officeMember.deletedAt = new Date();
    officeMember.updatedBy = adminId;
    await officeMember.save();

    await User.findByIdAndUpdate(officeMember.userId, { isActive: false });

    res.status(200).json({
      success: true,
      message: 'Office member deleted successfully',
      data: {
        id: officeMember._id,
        fullName: officeMember.fullName,
        isDeleted: officeMember.isDeleted,
      },
    });
  } catch (error: any) {
    console.error('Delete office member error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete office member',
      error: error.message,
    });
  }
};

// ============================================
// RESTORE OFFICE MEMBER (Admin Only)
// ============================================
export const restoreOfficeMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const adminId = (req as any).user?.id;

    const officeMember = await OfficeMember.findById(id);
    if (!officeMember) {
      res.status(404).json({ success: false, message: 'Office member not found' });
      return;
    }

    officeMember.isDeleted = false;
    officeMember.deletedAt = undefined;
    officeMember.updatedBy = adminId;
    await officeMember.save();

    await User.findByIdAndUpdate(officeMember.userId, { isActive: true });

    res.status(200).json({
      success: true,
      message: 'Office member restored successfully',
      data: {
        id: officeMember._id,
        fullName: officeMember.fullName,
        isDeleted: officeMember.isDeleted,
      },
    });
  } catch (error: any) {
    console.error('Restore office member error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to restore office member',
      error: error.message,
    });
  }
};

// ============================================
// GET OFFICE MEMBER STATS (Admin Only)
// ============================================
export const getOfficeMemberStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const total = await OfficeMember.countDocuments({ isDeleted: false });
    const active = await OfficeMember.countDocuments({ isDeleted: false });
    const inactive = await OfficeMember.countDocuments({ isDeleted: true });

    res.status(200).json({
      success: true,
      data: {
        total,
        active,
        inactive,
      },
    });
  } catch (error: any) {
    console.error('Get office member stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get office member stats',
      error: error.message,
    });
  }
};