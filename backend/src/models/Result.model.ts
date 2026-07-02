import mongoose, { Schema, Document } from 'mongoose';
import { IResult } from '../types/index.js';

export interface IResultDocument extends Document, IResult {}

const ResultSchema = new Schema<IResultDocument>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student ID is required'],
    },
    mockTestId: {
      type: Schema.Types.ObjectId,
      ref: 'MockTest',
      required: [true, 'Mock Test ID is required'],
    },
    programId: {
      type: Schema.Types.ObjectId,
      ref: 'Program',
      required: [true, 'Program ID is required'],
    },
    reading: {
      obtained: {
        type: Number,
        required: [true, 'Reading obtained marks is required'],
        min: [0, 'Marks cannot be negative'],
      },
      total: {
        type: Number,
        required: [true, 'Reading total marks is required'],
        min: [0, 'Total marks cannot be negative'],
      },
    },
    writing: {
      obtained: {
        type: Number,
        required: [true, 'Writing obtained marks is required'],
        min: [0, 'Marks cannot be negative'],
      },
      total: {
        type: Number,
        required: [true, 'Writing total marks is required'],
        min: [0, 'Total marks cannot be negative'],
      },
    },
    listening: {
      obtained: {
        type: Number,
        required: [true, 'Listening obtained marks is required'],
        min: [0, 'Marks cannot be negative'],
      },
      total: {
        type: Number,
        required: [true, 'Listening total marks is required'],
        min: [0, 'Total marks cannot be negative'],
      },
    },
    speaking: {
      grade: {
        type: String,
        required: [true, 'Speaking grade is required'],
        enum: ['A', 'B', 'C', 'D', 'F'],
      },
      comment: {
        type: String,
        required: [true, 'Speaking comment is required'],
        trim: true,
      },
    },
    presentation: {
      marks: {
        type: Number,
        required: [true, 'Presentation marks is required'],
        min: [0, 'Marks cannot be negative'],
      },
      total: {
        type: Number,
        required: [true, 'Presentation total marks is required'],
        min: [0, 'Total marks cannot be negative'],
      },
      comment: {
        type: String,
        required: [true, 'Presentation comment is required'],
        trim: true,
      },
    },
    totalMarks: {
      type: Number,
      required: [true, 'Total marks is required'],
    },
    percentage: {
      type: Number,
      required: [true, 'Percentage is required'],
    },
    grade: {
      type: String,
      required: [true, 'Grade is required'],
      enum: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'D', 'F'],
    },
    enteredBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Entered by is required'],
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Updated by is required'],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index
ResultSchema.index({ studentId: 1, mockTestId: 1 }, { unique: true });
ResultSchema.index({ studentId: 1 });
ResultSchema.index({ mockTestId: 1 });
ResultSchema.index({ programId: 1 });

export const Result = mongoose.model<IResultDocument>('Result', ResultSchema);