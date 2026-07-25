import { Request, Response } from 'express';
import { OfficeMember } from '../models/OfficeMember.model.js';
import { Student } from '../models/Student.model.js';
import { Program } from '../models/Program.model.js';

// ============================================
// GET OFFICE MEMBER PROFILE
// ============================================
export const getOfficeMemberProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const officeMember = await OfficeMember.findOne({ userId });
    if (!officeMember) {
      res.status(404).json({ success: false, message: 'Office member profile not found' });
      return;
    }
    res.status(200).json({ success: true, data: officeMember });
  } catch (error: any) {
    console.error('Get office member profile error:', error);
    res.status(500).json({ success: false, message: 'Failed to get office member profile', error: error.message });
  }
};

// ============================================
// UPDATE OFFICE MEMBER PROFILE
// ============================================
export const updateOfficeMemberProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const { fullName, phone, dateOfBirth, gender, bloodGroup, address } = req.body;
    const officeMember = await OfficeMember.findOne({ userId });
    if (!officeMember) {
      res.status(404).json({ success: false, message: 'Office member profile not found' });
      return;
    }
    const updateData: any = {};
    if (fullName !== undefined) updateData.fullName = fullName;
    if (phone !== undefined) updateData.phone = phone;
    if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth;
    if (gender !== undefined) updateData.gender = gender;
    if (bloodGroup !== undefined) updateData.bloodGroup = bloodGroup;
    if (address !== undefined) updateData.address = address;
    const updatedOfficeMember = await OfficeMember.findOneAndUpdate(
      { userId }, 
      updateData, 
      { new: true, runValidators: true }
    );
    res.status(200).json({ success: true, message: 'Profile updated successfully', data: updatedOfficeMember });
  } catch (error: any) {
    console.error('Update office member profile error:', error);
    res.status(500).json({ success: false, message: 'Failed to update office member profile', error: error.message });
  }
};

// ============================================
// GET ALL PROGRAMS (Office Member View Only)
// ============================================
export const getPrograms = async (req: Request, res: Response): Promise<void> => {
  try {
    const programs = await Program.find({ isActive: true }).select('name displayName description duration fee');
    res.status(200).json({ success: true, data: programs });
  } catch (error: any) {
    console.error('Get programs error:', error);
    res.status(500).json({ success: false, message: 'Failed to get programs', error: error.message });
  }
};

// ============================================
// GET STUDENTS (Office Member View Only)
// ============================================
export const getStudents = async (req: Request, res: Response): Promise<void> => {
  try {
    const { programId, page = 1, limit = 10, search } = req.query;

    const filter: any = { isDeleted: false };
    if (programId) filter.programId = programId;
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { admissionId: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const students = await Student.find(filter)
      .populate('programId', 'name displayName')
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
    console.error('Get students error:', error);
    res.status(500).json({ success: false, message: 'Failed to get students', error: error.message });
  }
};