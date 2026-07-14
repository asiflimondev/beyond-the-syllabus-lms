import { Request, Response } from 'express';
import { Program } from '../models/Program.model.js';
import { Teacher } from '../models/Teacher.model.js';
import { Student } from '../models/Student.model.js';
import { generateBatchReport, generateIndividualReport } from '../services/report.service.js';

// ============================================
// GET BATCH REPORT
// ============================================
export const getBatchReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { programId, teacherId } = req.query;

    // Validate
    if (!programId) {
      res.status(400).json({
        success: false,
        message: 'Program ID is required',
      });
      return;
    }

    // Verify program exists
    const program = await Program.findById(programId);
    if (!program) {
      res.status(404).json({
        success: false,
        message: 'Program not found',
      });
      return;
    }

    // If teacherId is provided, verify teacher exists
    if (teacherId) {
      const teacher = await Teacher.findById(teacherId);
      if (!teacher) {
        res.status(404).json({
          success: false,
          message: 'Teacher not found',
        });
        return;
      }
    }

    // Generate report
    const reportData = await generateBatchReport(
      programId as string,
      teacherId as string | undefined
    );

    res.status(200).json({
      success: true,
      data: reportData,
    });
  } catch (error: any) {
    console.error('Get batch report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate batch report',
      error: error.message,
    });
  }
};

// ============================================
// GET INDIVIDUAL REPORT
// ============================================
export const getIndividualReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId } = req.params;

    if (!studentId) {
      res.status(400).json({
        success: false,
        message: 'Student ID is required',
      });
      return;
    }

    // Verify student exists
    const student = await Student.findById(studentId);
    if (!student) {
      res.status(404).json({
        success: false,
        message: 'Student not found',
      });
      return;
    }

    if (student.isDeleted) {
      res.status(400).json({
        success: false,
        message: 'Student has been deleted',
      });
      return;
    }

    // Generate report
    const reportData = await generateIndividualReport(studentId);

    res.status(200).json({
      success: true,
      data: reportData,
    });
  } catch (error: any) {
    console.error('Get individual report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate individual report',
      error: error.message,
    });
  }
};

// ============================================
// GET REPORT FILTERS DATA
// ============================================
export const getReportFilters = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get all active programs
    const programs = await Program.find({ isActive: true })
      .sort({ name: 1 })
      .select('_id name displayName');

    // Get all teachers (with their programs)
    const teachers = await Teacher.find({ isDeleted: false })
      .sort({ fullName: 1 })
      .select('_id fullName email programIds');

    res.status(200).json({
      success: true,
      data: {
        programs: programs.map((p: any) => ({
          id: p._id,
          name: p.name,
          displayName: p.displayName,
        })),
        teachers: teachers.map((t: any) => ({
          id: t._id,
          fullName: t.fullName,
          email: t.email,
          programIds: t.programIds,
        })),
      },
    });
  } catch (error: any) {
    console.error('Get report filters error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get report filters',
      error: error.message,
    });
  }
};