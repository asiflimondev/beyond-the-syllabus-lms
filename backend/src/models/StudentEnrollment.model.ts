import mongoose, { Schema, Document } from 'mongoose';

export interface IStudentEnrollment extends Document {
  studentId: mongoose.Types.ObjectId;
  programId: mongoose.Types.ObjectId;
  enrolledAt: Date;
  completedAt?: Date;
  status: 'active' | 'completed' | 'dropped';
  createdAt: Date;
  updatedAt: Date;
}

const StudentEnrollmentSchema = new Schema<IStudentEnrollment>(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student ID is required'],
      index: true,
    },
    programId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Program',
      required: [true, 'Program ID is required'],
      index: true,
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'dropped'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index: One enrollment per student per program
StudentEnrollmentSchema.index({ studentId: 1, programId: 1 }, { unique: true });
StudentEnrollmentSchema.index({ programId: 1 });
StudentEnrollmentSchema.index({ studentId: 1 });

export const StudentEnrollment = mongoose.model<IStudentEnrollment>(
  'StudentEnrollment',
  StudentEnrollmentSchema
);