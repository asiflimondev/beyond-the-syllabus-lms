import { Request, Response } from 'express';
import { MockTest } from '../models/MockTest.model.js';
import { Student } from '../models/Student.model.js';
import { Result } from '../models/Result.model.js';

// ============================================
// GET MOCK TESTS BY PROGRAM (Office)
// ============================================
export const getMockTestsByProgramOffice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { programId } = req.params;

    // Office has full read access
    const mockTests = await MockTest.find({ programId, isActive: true }).sort({ testNumber: 1 });
    res.status(200).json({ success: true, data: mockTests });
  } catch (error: any) {
    console.error('Get mock tests office error:', error);
    res.status(500).json({ success: false, message: 'Failed to get mock tests', error: error.message });
  }
};

// ============================================
// GET STUDENTS FOR MARK ENTRY (Office)
// ============================================
export const getMarkEntryDataOffice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { mockTestId } = req.params;

    const mockTest = await MockTest.findById(mockTestId);
    if (!mockTest) {
      res.status(404).json({ success: false, message: 'Mock test not found' });
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
    console.error('Get mark entry data office error:', error);
    res.status(500).json({ success: false, message: 'Failed to get mark entry data', error: error.message });
  }
};

// ============================================
// SAVE MARKS (Office)
// ============================================
export const saveMarksOffice = async (req: Request, res: Response): Promise<void> => {
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

    // Office can save marks
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
    console.error('Save marks office error:', error);
    res.status(500).json({ success: false, message: 'Failed to save marks', error: error.message });
  }
};