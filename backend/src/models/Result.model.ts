import mongoose, { Schema, Document } from 'mongoose';
import { IResult } from '../types/index.js';

export interface IResultDocument extends IResult, Document {}

const ResultSchema = new Schema<IResultDocument>(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student ID is required'],
    },
    mockTestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MockTest',
      required: [true, 'Mock Test ID is required'],
    },
    programId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Program',
      required: [true, 'Program ID is required'],
    },
    reading: {
      obtained: {
        type: Number,
        required: false,
        default: 0,
        min: [0, 'Marks cannot be negative'],
      },
      total: {
        type: Number,
        required: false,
        default: 0,
        min: [0, 'Total marks cannot be negative'],
      },
    },
    writing: {
      obtained: {
        type: Number,
        required: false,
        default: 0,
        min: [0, 'Marks cannot be negative'],
      },
      total: {
        type: Number,
        required: false,
        default: 0,
        min: [0, 'Total marks cannot be negative'],
      },
    },
    listening: {
      obtained: {
        type: Number,
        required: false,
        default: 0,
        min: [0, 'Marks cannot be negative'],
      },
      total: {
        type: Number,
        required: false,
        default: 0,
        min: [0, 'Total marks cannot be negative'],
      },
    },
    speaking: {
      grade: {
        type: String,
        required: false,
        default: 'F',
        enum: ['A', 'B', 'C', 'D', 'F'],
      },
      comment: {
        type: String,
        required: false,
        default: '',
        trim: true,
      },
    },
    presentation: {
      marks: {
        type: Number,
        required: false,
        default: 0,
        min: [0, 'Marks cannot be negative'],
      },
      total: {
        type: Number,
        required: false,
        default: 0,
        min: [0, 'Total marks cannot be negative'],
      },
      comment: {
        type: String,
        required: false,
        default: '',
        trim: true,
      },
    },
    totalMarks: {
      type: Number,
      required: [true, 'Total marks is required'],
      default: 0,
    },
    percentage: {
      type: Number,
      required: [true, 'Percentage is required'],
      default: 0,
    },
    grade: {
      type: String,
      required: [true, 'Grade is required'],
      default: 'F',
      enum: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'D', 'F'],
    },
    enteredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Entered by is required'],
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
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

// Compound unique index: One result per student per test
ResultSchema.index({ studentId: 1, mockTestId: 1 }, { unique: true });
ResultSchema.index({ studentId: 1 });
ResultSchema.index({ mockTestId: 1 });
ResultSchema.index({ programId: 1 });

export const Result = mongoose.model<IResultDocument>('Result', ResultSchema);