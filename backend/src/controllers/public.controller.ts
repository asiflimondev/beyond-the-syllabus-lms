import { Request, Response } from 'express';
import { Program } from '../models/Program.model.js';

// ============================================
// GET PUBLIC PROGRAMS (No authentication required)
// ============================================
export const getPublicPrograms = async (req: Request, res: Response): Promise<void> => {
  try {
    const { limit = 100 } = req.query;

    // Only fetch active programs
    const programs = await Program.find({ 
      isActive: true 
    })
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .select('name displayName description duration fee isActive');

    res.status(200).json({
      success: true,
      data: {
        programs,
        total: programs.length,
      },
    });
  } catch (error: any) {
    console.error('Get public programs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load programs',
      error: error.message,
    });
  }
};