import { Request, Response } from 'express';
import { Teacher } from '../models/Teacher.model.js';
import { Student } from '../models/Student.model.js';
import { Program } from '../models/Program.model.js';
import { MockTest } from '../models/MockTest.model.js';
import { Result } from '../models/Result.model.js';

// ============================================
// GET TEACHER PROFILE
// ============================================
export const getTeacherProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const teacher = await Teacher.findOne({ userId }).populate('programIds', 'name displayName duration fee');
    if (!teacher) {
      res.status(404).json({ success: false, message: 'Teacher profile not found' });
      return;
    }
    res.status(200).json({ success: true, data: teacher });
  } catch (error: any) {
    console.error('Get teacher profile error:', error);
    res.status(500).json({ success: false, message: 'Failed to get teacher profile', error: error.message });
  }
};

// ============================================
// UPDATE TEACHER PROFILE
// ============================================
export const updateTeacherProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const { fullName, phone, dateOfBirth, gender, bloodGroup, address } = req.body;
    const teacher = await Teacher.findOne({ userId });
    if (!teacher) {
      res.status(404).json({ success: false, message: 'Teacher profile not found' });
      return;
    }
    const updateData: any = {};
    if (fullName !== undefined) updateData.fullName = fullName;
    if (phone !== undefined) updateData.phone = phone;
    if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth;
    if (gender !== undefined) updateData.gender = gender;
    if (bloodGroup !== undefined) updateData.bloodGroup = bloodGroup;
    if (address !== undefined) updateData.address = address;
    const updatedTeacher = await Teacher.findOneAndUpdate({ userId }, updateData, { new: true, runValidators: true });
    res.status(200).json({ success: true, message: 'Profile updated successfully', data: updatedTeacher });
  } catch (error: any) {
    console.error('Update teacher profile error:', error);
    res.status(500).json({ success: false, message: 'Failed to update teacher profile', error: error.message });
  }
};

// ============================================
// GET TEACHER'S PROGRAMS
// ============================================
export const getTeacherPrograms = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const teacher = await Teacher.findOne({ userId }).populate('programIds');
    if (!teacher) {
      res.status(404).json({ success: false, message: 'Teacher profile not found' });
      return;
    }
    res.status(200).json({ success: true, data: teacher.programIds });
  } catch (error: any) {
    console.error('Get teacher programs error:', error);
    res.status(500).json({ success: false, message: 'Failed to get teacher programs', error: error.message });
  }
};

// ============================================
// GET STUDENTS BY PROGRAM
// ============================================
export const getStudentsByProgram = async (req: Request, res: Response): Promise<void> => {
  try {
    const { programId } = req.params;
    const { page = 1, limit = 10, search } = req.query;
    const userId = (req as any).user?.id;
    const teacher = await Teacher.findOne({ userId, programIds: programId });
    if (!teacher) {
      res.status(403).json({ success: false, message: 'You do not have access to this program' });
      return;
    }
    const filter: any = { programId, isDeleted: false };
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { admissionId: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    const skip = (Number(page) - 1) * Number(limit);
    const students = await Student.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).populate('userId', 'email isActive');
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
          userId: s.userId,
        })),
        pagination: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) },
      },
    });
  } catch (error: any) {
    console.error('Get students by program error:', error);
    res.status(500).json({ success: false, message: 'Failed to get students', error: error.message });
  }
};

// ============================================
// GET MOCK TESTS BY PROGRAM
// ============================================
export const getMockTestsByProgram = async (req: Request, res: Response): Promise<void> => {
  try {
    const { programId } = req.params;
    const userId = (req as any).user?.id;
    const teacher = await Teacher.findOne({ userId, programIds: programId });
    if (!teacher) {
      res.status(403).json({ success: false, message: 'You do not have access to this program' });
      return;
    }
    const mockTests = await MockTest.find({ programId, isActive: true }).sort({ testNumber: 1 });
    res.status(200).json({ success: true, data: mockTests });
  } catch (error: any) {
    console.error('Get mock tests error:', error);
    res.status(500).json({ success: false, message: 'Failed to get mock tests', error: error.message });
  }
};

// ============================================
// CREATE MOCK TEST - FIXED
// ============================================
export const createMockTest = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('📥 Received body:', JSON.stringify(req.body, null, 2));

    const { programId, title, description, testDate, reading, writing, listening, speaking, presentation } = req.body;
    const userId = (req as any).user?.id;

    // Validate required fields
    if (!programId) {
      res.status(400).json({ success: false, message: 'Program ID is required' });
      return;
    }
    if (!title) {
      res.status(400).json({ success: false, message: 'Test title is required' });
      return;
    }
    if (!testDate) {
      res.status(400).json({ success: false, message: 'Test date is required' });
      return;
    }

    // Verify teacher has access
    const teacher = await Teacher.findOne({ userId, programIds: programId });
    if (!teacher) {
      res.status(403).json({ success: false, message: 'You do not have access to this program' });
      return;
    }

    // Get next test number
    const lastTest = await MockTest.findOne({ programId }).sort({ testNumber: -1 });
    const testNumber = lastTest ? lastTest.testNumber + 1 : 1;

    // Build mock test data - start with required fields
    const mockTestData: any = {
      programId,
      title,
      description: description || '',
      testNumber,
      testDate,
      createdBy: userId,
      updatedBy: userId,
      isActive: true,
    };

    // ONLY add sections that exist in the request
    // We check if the key exists in the request body using hasOwnProperty
    if (req.body.hasOwnProperty('reading') && reading && reading.totalMarks && reading.totalMarks > 0) {
      mockTestData.reading = {
        totalMarks: reading.totalMarks,
        description: reading.description || 'Reading comprehension',
      };
      console.log('✅ Added Reading section');
    }

    if (req.body.hasOwnProperty('writing') && writing && writing.totalMarks && writing.totalMarks > 0) {
      mockTestData.writing = {
        totalMarks: writing.totalMarks,
        description: writing.description || 'Writing tasks',
      };
      console.log('✅ Added Writing section');
    }

    if (req.body.hasOwnProperty('listening') && listening && listening.totalMarks && listening.totalMarks > 0) {
      mockTestData.listening = {
        totalMarks: listening.totalMarks,
        description: listening.description || 'Listening comprehension',
      };
      console.log('✅ Added Listening section');
    }

    if (req.body.hasOwnProperty('speaking') && speaking && speaking.description) {
      mockTestData.speaking = {
        description: speaking.description || 'Speaking assessment',
      };
      console.log('✅ Added Speaking section');
    }

    if (req.body.hasOwnProperty('presentation') && presentation && presentation.totalMarks && presentation.totalMarks > 0) {
      mockTestData.presentation = {
        totalMarks: presentation.totalMarks,
        description: presentation.description || 'Presentation',
      };
      console.log('✅ Added Presentation section');
    }

    // Check if at least one section was added
    const hasSection =
      mockTestData.reading ||
      mockTestData.writing ||
      mockTestData.listening ||
      mockTestData.speaking ||
      mockTestData.presentation;

    if (!hasSection) {
      res.status(400).json({
        success: false,
        message: 'At least one section must be enabled with valid marks',
      });
      return;
    }

    console.log('✅ Creating mock test with:', JSON.stringify(mockTestData, null, 2));

    const mockTest = await MockTest.create(mockTestData);
    res.status(201).json({
      success: true,
      message: 'Mock test created successfully',
      data: mockTest,
    });
  } catch (error: any) {
    console.error('❌ Create mock test error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to create mock test',
      error: error.message,
    });
  }
};

// ============================================
// UPDATE MOCK TEST
// ============================================
export const updateMockTest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, testDate, reading, writing, listening, speaking, presentation } = req.body;
    const userId = (req as any).user?.id;
    const mockTest = await MockTest.findById(id);
    if (!mockTest) {
      res.status(404).json({ success: false, message: 'Mock test not found' });
      return;
    }
    const teacher = await Teacher.findOne({ userId, programIds: mockTest.programId });
    if (!teacher) {
      res.status(403).json({ success: false, message: 'You do not have access to this program' });
      return;
    }
    if (title) mockTest.title = title;
    if (description) mockTest.description = description;
    if (testDate) mockTest.testDate = testDate;
    if (reading) mockTest.reading = reading;
    if (writing) mockTest.writing = writing;
    if (listening) mockTest.listening = listening;
    if (speaking) mockTest.speaking = speaking;
    if (presentation) mockTest.presentation = presentation;
    mockTest.updatedBy = userId;
    await mockTest.save();
    res.status(200).json({ success: true, message: 'Mock test updated successfully', data: mockTest });
  } catch (error: any) {
    console.error('Update mock test error:', error);
    res.status(500).json({ success: false, message: 'Failed to update mock test', error: error.message });
  }
};

// ============================================
// GET STUDENT RESULTS FOR MOCK TEST
// ============================================
export const getMockTestResults = async (req: Request, res: Response): Promise<void> => {
  try {
    const { mockTestId } = req.params;
    const mockTest = await MockTest.findById(mockTestId);
    if (!mockTest) {
      res.status(404).json({ success: false, message: 'Mock test not found' });
      return;
    }
    const userId = (req as any).user?.id;
    const teacher = await Teacher.findOne({ userId, programIds: mockTest.programId });
    if (!teacher) {
      res.status(403).json({ success: false, message: 'You do not have access to this program' });
      return;
    }
    const results = await Result.find({ mockTestId }).populate('studentId', 'fullName admissionId email');
    res.status(200).json({ success: true, data: results });
  } catch (error: any) {
    console.error('Get mock test results error:', error);
    res.status(500).json({ success: false, message: 'Failed to get results', error: error.message });
  }
};

// ============================================
// GET STUDENTS FOR MARK ENTRY
// ============================================
export const getStudentsForMarkEntry = async (req: Request, res: Response): Promise<void> => {
  try {
    const { mockTestId } = req.params;
    const mockTest = await MockTest.findById(mockTestId);
    if (!mockTest) {
      res.status(404).json({ success: false, message: 'Mock test not found' });
      return;
    }
    const userId = (req as any).user?.id;
    const teacher = await Teacher.findOne({ userId, programIds: mockTest.programId });
    if (!teacher) {
      res.status(403).json({ success: false, message: 'You do not have access to this program' });
      return;
    }
    const students = await Student.find({
      programId: mockTest.programId,
      isDeleted: false,
      status: 'active',
    }).select('_id fullName admissionId email phone');
    const results = await Result.find({ mockTestId });
    const studentsWithResults = students.map((student) => {
      const existingResult = results.find((r) => r.studentId.toString() === student._id.toString());
      return {
        studentId: student._id,
        fullName: student.fullName,
        admissionId: student.admissionId,
        email: student.email,
        phone: student.phone,
        result: existingResult || null,
      };
    });
    res.status(200).json({
      success: true,
      data: {
        mockTest: {
          _id: mockTest._id,
          title: mockTest.title,
          testNumber: mockTest.testNumber,
          testDate: mockTest.testDate,
          reading: mockTest.reading,
          writing: mockTest.writing,
          listening: mockTest.listening,
          speaking: mockTest.speaking,
          presentation: mockTest.presentation,
        },
        students: studentsWithResults,
      },
    });
  } catch (error: any) {
    console.error('Get students for mark entry error:', error);
    res.status(500).json({ success: false, message: 'Failed to get students for mark entry', error: error.message });
  }
};

// ============================================
// SAVE MARKS
// ============================================
export const saveMarks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { mockTestId } = req.params;
    const { marks } = req.body;
    const userId = (req as any).user?.id;

    if (!marks || !Array.isArray(marks)) {
      res.status(400).json({ success: false, message: 'Marks data is required' });
      return;
    }

    const mockTest = await MockTest.findById(mockTestId);
    if (!mockTest) {
      res.status(404).json({ success: false, message: 'Mock test not found' });
      return;
    }

    const teacher = await Teacher.findOne({ userId, programIds: mockTest.programId });
    if (!teacher) {
      res.status(403).json({ success: false, message: 'You do not have access to this program' });
      return;
    }

    const results = [];
    for (const markData of marks) {
      const { studentId, reading, writing, listening, speaking, presentation } = markData;

      if (!studentId) continue;

      const totalReading = mockTest.reading?.totalMarks || 0;
      const totalWriting = mockTest.writing?.totalMarks || 0;
      const totalListening = mockTest.listening?.totalMarks || 0;
      const totalPresentation = mockTest.presentation?.totalMarks || 0;

      let totalMarks = 0;
      let totalPossible = 0;

      if (mockTest.reading) {
        totalMarks += reading?.obtained || 0;
        totalPossible += totalReading;
      }
      if (mockTest.writing) {
        totalMarks += writing?.obtained || 0;
        totalPossible += totalWriting;
      }
      if (mockTest.listening) {
        totalMarks += listening?.obtained || 0;
        totalPossible += totalListening;
      }
      if (mockTest.presentation) {
        totalMarks += presentation?.marks || 0;
        totalPossible += totalPresentation;
      }

      const percentage = totalPossible > 0 ? (totalMarks / totalPossible) * 100 : 0;

      let grade = 'F';
      if (percentage >= 90) grade = 'A+';
      else if (percentage >= 80) grade = 'A';
      else if (percentage >= 70) grade = 'A-';
      else if (percentage >= 60) grade = 'B+';
      else if (percentage >= 50) grade = 'B';
      else if (percentage >= 40) grade = 'B-';
      else if (percentage >= 33) grade = 'C+';
      else if (percentage >= 25) grade = 'C';
      else if (percentage >= 10) grade = 'D';

      const existingResult = await Result.findOne({ studentId, mockTestId });

      if (existingResult) {
        const updateData: any = {
          totalMarks,
          percentage,
          grade,
          updatedBy: userId,
        };

        if (mockTest.reading) {
          updateData.reading = { obtained: reading?.obtained || 0, total: totalReading };
        }
        if (mockTest.writing) {
          updateData.writing = { obtained: writing?.obtained || 0, total: totalWriting };
        }
        if (mockTest.listening) {
          updateData.listening = { obtained: listening?.obtained || 0, total: totalListening };
        }
        if (mockTest.speaking) {
          updateData.speaking = { 
            grade: speaking?.grade || 'F', 
            comment: speaking?.comment || '' 
          };
        }
        if (mockTest.presentation) {
          updateData.presentation = { 
            marks: presentation?.marks || 0, 
            total: totalPresentation, 
            comment: presentation?.comment || '' 
          };
        }

        const updated = await Result.findByIdAndUpdate(existingResult._id, updateData, { new: true });
        results.push(updated);
      } else {
        const resultData: any = {
          studentId,
          mockTestId,
          programId: mockTest.programId,
          totalMarks,
          percentage,
          grade,
          enteredBy: userId,
          updatedBy: userId,
        };

        if (mockTest.reading) {
          resultData.reading = { obtained: reading?.obtained || 0, total: totalReading };
        }
        if (mockTest.writing) {
          resultData.writing = { obtained: writing?.obtained || 0, total: totalWriting };
        }
        if (mockTest.listening) {
          resultData.listening = { obtained: listening?.obtained || 0, total: totalListening };
        }
        if (mockTest.speaking) {
          resultData.speaking = { 
            grade: speaking?.grade || 'F', 
            comment: speaking?.comment || '' 
          };
        }
        if (mockTest.presentation) {
          resultData.presentation = { 
            marks: presentation?.marks || 0, 
            total: totalPresentation, 
            comment: presentation?.comment || '' 
          };
        }

        const newResult = await Result.create(resultData);
        results.push(newResult);
      }
    }

    res.status(200).json({ success: true, message: 'Marks saved successfully', data: results });
  } catch (error: any) {
    console.error('Save marks error:', error);
    res.status(500).json({ success: false, message: 'Failed to save marks', error: error.message });
  }
};