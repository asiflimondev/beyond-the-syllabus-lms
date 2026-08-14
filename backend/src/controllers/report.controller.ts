import { Request, Response } from 'express';
import { Program } from '../models/Program.model.js';
import { Teacher } from '../models/Teacher.model.js';
import { Student } from '../models/Student.model.js';
import { StudentEnrollment } from '../models/StudentEnrollment.model.js';
import { Result } from '../models/Result.model.js';
import { MockTest } from '../models/MockTest.model.js';

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

    // Get ALL students who have EVER been enrolled in this program
    const enrollments = await StudentEnrollment.find({
      programId: programId,
    }).populate('studentId', 'fullName admissionId email phone status');

    // Get student IDs from enrollments
    const studentIds = enrollments.map((e: any) => e.studentId?._id).filter(Boolean);

    // Get all students who are currently in this program (for those without enrollments)
    const currentStudents = await Student.find({
      programId: programId,
      isDeleted: false,
    }).select('_id fullName admissionId email phone status');

    // Combine both lists (remove duplicates)
    const allStudentIds = new Set();
    const studentsList: any[] = [];

    // Add from enrollments
    enrollments.forEach((e: any) => {
      if (e.studentId && !allStudentIds.has(e.studentId._id.toString())) {
        allStudentIds.add(e.studentId._id.toString());
        studentsList.push({
          ...e.studentId.toObject(),
          enrollmentStatus: e.status,
          enrolledAt: e.enrolledAt,
          completedAt: e.completedAt,
        });
      }
    });

    // Add from current students (if not already in list)
    currentStudents.forEach((s: any) => {
      if (!allStudentIds.has(s._id.toString())) {
        allStudentIds.add(s._id.toString());
        studentsList.push({
          ...s.toObject(),
          enrollmentStatus: 'active',
          enrolledAt: new Date(),
          completedAt: null,
        });
      }
    });

    // Get ALL mock tests for this program
    const mockTests = await MockTest.find({
      programId: programId,
      isActive: true,
    }).sort({ testNumber: 1 });

    // For each student, get their results for THIS program only
    const studentReports = await Promise.all(
      studentsList.map(async (student) => {
        // Get results for this student that belong to THIS program
        const programResults = await Result.find({
          studentId: student._id,
          programId: programId,
          isDeleted: false,
        })
          .populate('mockTestId', 'title testNumber testDate')
          .sort({ createdAt: 1 });

        const formattedResults = programResults.map((result: any) => ({
          mockTestId: result.mockTestId?._id,
          mockTestTitle: result.mockTestId?.title || `Mock Test ${result.mockTestId?.testNumber || ''}`,
          mockTestNumber: result.mockTestId?.testNumber,
          testDate: result.mockTestId?.testDate,
          reading: {
            obtained: result.reading?.obtained || 0,
            total: result.reading?.total || 0,
          },
          writing: {
            obtained: result.writing?.obtained || 0,
            total: result.writing?.total || 0,
          },
          listening: {
            obtained: result.listening?.obtained || 0,
            total: result.listening?.total || 0,
          },
          speaking: {
            grade: result.speaking?.grade || 'F',
            comment: result.speaking?.comment || '',
          },
          presentation: {
            marks: result.presentation?.marks || 0,
            total: result.presentation?.total || 0,
            comment: result.presentation?.comment || '',
          },
          totalMarks: result.totalMarks || 0,
          percentage: result.percentage || 0,
          grade: result.grade || 'F',
        }));

        // Calculate statistics for this program only
        const totalTests = formattedResults.length;
        const avgPercentage = totalTests > 0
          ? Math.round(formattedResults.reduce((sum, r) => sum + r.percentage, 0) / totalTests)
          : 0;

        // Get student's current program
        const currentStudent = await Student.findById(student._id).populate('programId', 'name displayName');
        const currentProgramObj = currentStudent?.programId as any;
        const currentProgramName = currentProgramObj?.displayName?.en || 
                                   currentProgramObj?.name || 
                                   'Same Program';
        const isCurrentProgram = currentStudent?.programId?._id?.toString() === programId;

        return {
          id: student._id,
          admissionId: student.admissionId,
          fullName: student.fullName,
          phone: student.phone,
          email: student.email,
          status: student.status,
          currentProgram: currentProgramName,
          isCurrentProgram: isCurrentProgram,
          enrollmentStatus: student.enrollmentStatus || 'active',
          totalTests,
          averagePercentage: avgPercentage,
          results: formattedResults,
        };
      })
    );

    // Sort students: first show those still in program, then those who moved on
    const sortedStudents = studentReports.sort((a, b) => {
      if (a.isCurrentProgram && !b.isCurrentProgram) return -1;
      if (!a.isCurrentProgram && b.isCurrentProgram) return 1;
      return a.fullName.localeCompare(b.fullName);
    });

    // Prepare mock tests info for the table headers
    const mockTestsInfo = mockTests.map((mt: any) => ({
      id: mt._id,
      title: mt.title || `Mock Test ${mt.testNumber}`,
      testNumber: mt.testNumber,
      testDate: mt.testDate,
      hasReading: !!mt.reading?.totalMarks,
      hasWriting: !!mt.writing?.totalMarks,
      hasListening: !!mt.listening?.totalMarks,
      hasSpeaking: !!mt.speaking,
      hasPresentation: !!mt.presentation?.totalMarks,
      readingTotal: mt.reading?.totalMarks || 0,
      writingTotal: mt.writing?.totalMarks || 0,
      listeningTotal: mt.listening?.totalMarks || 0,
      presentationTotal: mt.presentation?.totalMarks || 0,
    }));

    res.status(200).json({
      success: true,
      data: {
        program: {
          id: program._id,
          name: program.name,
          displayName: program.displayName,
        },
        teacher: null,
        totalStudents: sortedStudents.length,
        totalMockTests: mockTests.length,
        generatedDate: new Date().toISOString(),
        students: sortedStudents,
        mockTests: mockTestsInfo,
      },
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

    // Get student with program
    const student = await Student.findById(studentId)
      .populate('programId', 'name displayName');

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

    // Get ALL results for this student (from ALL programs)
    const results = await Result.find({
      studentId: studentId,
      isDeleted: false,
    })
      .populate({
        path: 'mockTestId',
        populate: {
          path: 'programId',
          select: 'name displayName',
        },
      })
      .sort({ createdAt: 1 });

    // Format results with program information
    const formattedResults = results.map((result: any) => {
      const mockTest = result.mockTestId;
      const program = mockTest?.programId;
      
      const programObj = program as any;
      const programName = programObj?.displayName?.en || programObj?.name || 'Unknown Program';
      const programId = programObj?._id?.toString() || 'unknown';
      
      return {
        mockTestId: result._id,
        mockTestTitle: mockTest?.title || `Mock Test ${mockTest?.testNumber || ''}`,
        mockTestNumber: mockTest?.testNumber,
        testDate: mockTest?.testDate,
        programId: programId,
        programName: programName,
        reading: {
          obtained: result.reading?.obtained || 0,
          total: result.reading?.total || 0,
        },
        writing: {
          obtained: result.writing?.obtained || 0,
          total: result.writing?.total || 0,
        },
        listening: {
          obtained: result.listening?.obtained || 0,
          total: result.listening?.total || 0,
        },
        speaking: {
          grade: result.speaking?.grade || 'F',
          comment: result.speaking?.comment || '',
        },
        presentation: {
          marks: result.presentation?.marks || 0,
          total: result.presentation?.total || 0,
          comment: result.presentation?.comment || '',
        },
        totalMarks: result.totalMarks || 0,
        percentage: result.percentage || 0,
        grade: result.grade || 'F',
        createdAt: result.createdAt,
      };
    });

    // Calculate statistics
    const totalTests = formattedResults.length;
    const averagePercentage = totalTests > 0
      ? Math.round(formattedResults.reduce((sum, r) => sum + r.percentage, 0) / totalTests)
      : 0;

    // Get unique programs
    const programMap = new Map();
    formattedResults.forEach((result: any) => {
      if (!programMap.has(result.programId)) {
        programMap.set(result.programId, {
          id: result.programId,
          name: result.programName,
          testCount: 0,
          totalPercentage: 0,
        });
      }
      const program = programMap.get(result.programId);
      program.testCount++;
      program.totalPercentage += result.percentage;
    });

    const uniquePrograms = Array.from(programMap.values()).map((program: any) => ({
      id: program.id,
      name: program.name,
      testCount: program.testCount,
      averagePercentage: Math.round(program.totalPercentage / program.testCount),
    }));

    const studentProgram = student.programId as any;
    const studentProgramName = studentProgram?.displayName?.en || studentProgram?.name || 'N/A';

    res.status(200).json({
      success: true,
      data: {
        student: {
          id: student._id,
          fullName: student.fullName,
          admissionId: student.admissionId,
          phone: student.phone,
          email: student.email,
          programName: studentProgramName,
          currentProgramId: student.programId?._id || student.programId,
        },
        results: formattedResults,
        totalTests,
        averagePercentage,
        programs: uniquePrograms,
      },
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