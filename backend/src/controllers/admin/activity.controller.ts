import { Request, Response } from 'express';
import { Student } from '../../models/Student.model.js';
import { Teacher } from '../../models/Teacher.model.js';
import { MockTest } from '../../models/MockTest.model.js';
import { Program } from '../../models/Program.model.js';

export const getRecentActivities = async (req: Request, res: Response): Promise<void> => {
  try {
    const { limit = 5 } = req.query; // Changed default to 5
    const activities: any[] = [];

    // 1. Get recent student admissions
    const recentStudents = await Student.find({ isDeleted: false })
      .populate('programId', 'name displayName')
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    recentStudents.forEach((student: any) => {
      const programName = student.programId?.displayName?.en || student.programId?.name || 'Program';
      activities.push({
        id: `student-${student._id}`,
        type: 'admission',
        user: student.fullName,
        action: `Admitted to ${programName}`,
        time: student.createdAt,
        timestamp: new Date(student.createdAt).getTime(),
        details: {
          studentId: student._id,
          admissionId: student.admissionId,
          programId: student.programId?._id,
        }
      });
    });

    // 2. Get recent mock test creations
    const recentMockTests = await MockTest.find({ isActive: true })
      .populate('programId', 'name displayName')
      .populate('createdBy', 'email')
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    recentMockTests.forEach((test: any) => {
      const programName = test.programId?.displayName?.en || test.programId?.name || 'Program';
      activities.push({
        id: `mocktest-${test._id}`,
        type: 'mocktest',
        user: 'System',
        action: `Created mock test "${test.title}" for ${programName}`,
        time: test.createdAt,
        timestamp: new Date(test.createdAt).getTime(),
        details: {
          testId: test._id,
          testNumber: test.testNumber,
          programId: test.programId?._id,
        }
      });
    });

    // 3. Get recent teacher additions
    const recentTeachers = await Teacher.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    recentTeachers.forEach((teacher: any) => {
      activities.push({
        id: `teacher-${teacher._id}`,
        type: 'teacher',
        user: teacher.fullName,
        action: `Joined as teacher`,
        time: teacher.createdAt,
        timestamp: new Date(teacher.createdAt).getTime(),
        details: {
          teacherId: teacher._id,
          employeeId: teacher.employeeId,
        }
      });
    });

    // Sort all activities by timestamp (newest first)
    activities.sort((a, b) => b.timestamp - a.timestamp);

    // Return only the most recent 5 activities
    const limitedActivities = activities.slice(0, 5); // Always return exactly 5

    res.status(200).json({
      success: true,
      data: limitedActivities,
    });
  } catch (error: any) {
    console.error('Get recent activities error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get recent activities',
      error: error.message,
    });
  }
};

// Get dashboard stats (combines all stats)
export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get student stats
    const totalStudents = await Student.countDocuments({ isDeleted: false });
    const activeStudents = await Student.countDocuments({ 
      isDeleted: false, 
      status: 'active' 
    });
    const pendingStudents = await Student.countDocuments({ 
      isDeleted: false, 
      status: 'pending_registration' 
    });

    // Get teacher stats
    const totalTeachers = await Teacher.countDocuments({ isDeleted: false });

    // Get mock test stats
    const totalMockTests = await MockTest.countDocuments({ isActive: true });

    // Get program stats
    const totalPrograms = await Program.countDocuments({ isActive: true });

    res.status(200).json({
      success: true,
      data: {
        students: {
          total: totalStudents,
          active: activeStudents,
          pending: pendingStudents,
        },
        teachers: {
          total: totalTeachers,
        },
        mockTests: {
          total: totalMockTests,
        },
        programs: {
          total: totalPrograms,
        },
      },
    });
  } catch (error: any) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard stats',
      error: error.message,
    });
  }
};