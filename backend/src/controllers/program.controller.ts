import { Request, Response } from 'express';
import { Program } from '../models/Program.model.js';

// ============================================
// CREATE PROGRAM
// ============================================
export const createProgram = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      displayName,
      description,
      duration,
      fee,
      teacherIds = [],
    } = req.body;

    const userId = (req as any).user?.id;

    // Validate required fields
    if (!name || !displayName?.en || !displayName?.bn || 
        !description?.en || !description?.bn || 
        !duration || fee === undefined || fee === null) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields: name, displayName (en, bn), description (en, bn), duration, fee',
      });
      return;
    }

    // Check if program already exists
    const existingProgram = await Program.findOne({ name });
    if (existingProgram) {
      res.status(409).json({
        success: false,
        message: 'Program with this name already exists',
      });
      return;
    }

    // Create program
    const program = await Program.create({
      name,
      displayName,
      description,
      duration,
      fee,
      teacherIds,
      createdBy: userId,
      updatedBy: userId,
      isActive: true,
    });

    const programData = program as any;

    res.status(201).json({
      success: true,
      message: 'Program created successfully',
      data: {
        id: programData._id,
        name: program.name,
        displayName: program.displayName,
        description: program.description,
        duration: program.duration,
        fee: program.fee,
        teacherIds: program.teacherIds,
        isActive: program.isActive,
        createdAt: program.createdAt,
        updatedAt: program.updatedAt,
      },
    });
  } catch (error: any) {
    console.error('Create program error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create program',
      error: error.message,
    });
  }
};

// ============================================
// GET ALL PROGRAMS
// ============================================
export const getPrograms = async (req: Request, res: Response): Promise<void> => {
  try {
    const { isActive, page = 1, limit = 10, search } = req.query;

    // Build filter
    const filter: any = {};
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { 'displayName.en': { $regex: search, $options: 'i' } },
        { 'displayName.bn': { $regex: search, $options: 'i' } },
      ];
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Get programs
    const programs = await Program.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('teacherIds', 'fullName email');

    const total = await Program.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        programs: programs.map((p: any) => ({
          id: p._id,
          name: p.name,
          displayName: p.displayName,
          description: p.description,
          duration: p.duration,
          fee: p.fee,
          teacherIds: p.teacherIds,
          isActive: p.isActive,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
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
    console.error('Get programs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get programs',
      error: error.message,
    });
  }
};

// ============================================
// GET SINGLE PROGRAM
// ============================================
export const getProgramById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const program = await Program.findById(id).populate('teacherIds', 'fullName email');

    if (!program) {
      res.status(404).json({
        success: false,
        message: 'Program not found',
      });
      return;
    }

    const programData = program as any;

    res.status(200).json({
      success: true,
      data: {
        id: programData._id,
        name: program.name,
        displayName: program.displayName,
        description: program.description,
        duration: program.duration,
        fee: program.fee,
        teacherIds: program.teacherIds,
        isActive: program.isActive,
        createdAt: program.createdAt,
        updatedAt: program.updatedAt,
      },
    });
  } catch (error: any) {
    console.error('Get program error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get program',
      error: error.message,
    });
  }
};

// ============================================
// UPDATE PROGRAM
// ============================================
export const updateProgram = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      name,
      displayName,
      description,
      duration,
      fee,
      teacherIds,
      isActive,
    } = req.body;

    const userId = (req as any).user?.id;

    // Find program
    const program = await Program.findById(id);
    if (!program) {
      res.status(404).json({
        success: false,
        message: 'Program not found',
      });
      return;
    }

    // Check if name conflicts (if changing name)
    if (name && name !== program.name) {
      const existingProgram = await Program.findOne({ name });
      if (existingProgram) {
        res.status(409).json({
          success: false,
          message: 'Program with this name already exists',
        });
        return;
      }
    }

    // Update fields
    const updateData: any = { updatedBy: userId };
    if (name) updateData.name = name;
    if (displayName) updateData.displayName = displayName;
    if (description) updateData.description = description;
    if (duration !== undefined) updateData.duration = duration;
    if (fee !== undefined) updateData.fee = fee;
    if (teacherIds) updateData.teacherIds = teacherIds;
    if (isActive !== undefined) updateData.isActive = isActive;

    // Update program
    const updatedProgram = await Program.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('teacherIds', 'fullName email');

    if (!updatedProgram) {
      res.status(404).json({
        success: false,
        message: 'Program not found after update',
      });
      return;
    }

    const programData = updatedProgram as any;

    res.status(200).json({
      success: true,
      message: 'Program updated successfully',
      data: {
        id: programData._id,
        name: updatedProgram.name,
        displayName: updatedProgram.displayName,
        description: updatedProgram.description,
        duration: updatedProgram.duration,
        fee: updatedProgram.fee,
        teacherIds: updatedProgram.teacherIds,
        isActive: updatedProgram.isActive,
        createdAt: updatedProgram.createdAt,
        updatedAt: updatedProgram.updatedAt,
      },
    });
  } catch (error: any) {
    console.error('Update program error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update program',
      error: error.message,
    });
  }
};

// ============================================
// DELETE PROGRAM (Soft Delete)
// ============================================
export const deleteProgram = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const program = await Program.findById(id);
    if (!program) {
      res.status(404).json({
        success: false,
        message: 'Program not found',
      });
      return;
    }

    // Soft delete - set isActive to false and set deletedAt
    program.isActive = false;
    program.deletedAt = new Date();
    await program.save();

    res.status(200).json({
      success: true,
      message: 'Program deleted successfully',
      data: {
        id: (program as any)._id,
        name: program.name,
        isActive: program.isActive,
        deletedAt: program.deletedAt,
      },
    });
  } catch (error: any) {
    console.error('Delete program error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete program',
      error: error.message,
    });
  }
};

// ============================================
// RESTORE PROGRAM
// ============================================
export const restoreProgram = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const program = await Program.findById(id);
    if (!program) {
      res.status(404).json({
        success: false,
        message: 'Program not found',
      });
      return;
    }

    // Restore - set isActive to true and remove deletedAt
    program.isActive = true;
    program.deletedAt = undefined;
    await program.save();

    res.status(200).json({
      success: true,
      message: 'Program restored successfully',
      data: {
        id: (program as any)._id,
        name: program.name,
        isActive: program.isActive,
      },
    });
  } catch (error: any) {
    console.error('Restore program error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to restore program',
      error: error.message,
    });
  }
};