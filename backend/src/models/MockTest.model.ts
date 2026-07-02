import mongoose, { Schema, Document } from 'mongoose';
import { IMockTest } from '../types/index.js';

export interface IMockTestDocument extends Document, IMockTest {}

const MockTestSchema = new Schema<IMockTestDocument>(
  {
    programId: {
      type: Schema.Types.ObjectId,
      ref: 'Program',
      required: [true, 'Program ID is required'],
    },
    title: {
      type: String,
      required: [true, 'Test title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    testNumber: {
      type: Number,
      required: [true, 'Test number is required'],
    },
    testDate: {
      type: Date,
      required: [true, 'Test date is required'],
      default: Date.now,
    },
    reading: {
      totalMarks: {
        type: Number,
        required: [true, 'Reading total marks is required'],
        min: [0, 'Total marks cannot be negative'],
      },
      description: {
        type: String,
        trim: true,
      },
    },
    writing: {
      totalMarks: {
        type: Number,
        required: [true, 'Writing total marks is required'],
        min: [0, 'Total marks cannot be negative'],
      },
      description: {
        type: String,
        trim: true,
      },
    },
    listening: {
      totalMarks: {
        type: Number,
        required: [true, 'Listening total marks is required'],
        min: [0, 'Total marks cannot be negative'],
      },
      description: {
        type: String,
        trim: true,
      },
    },
    speaking: {
      description: {
        type: String,
        trim: true,
      },
    },
    presentation: {
      totalMarks: {
        type: Number,
        required: [true, 'Presentation total marks is required'],
        min: [0, 'Total marks cannot be negative'],
      },
      description: {
        type: String,
        trim: true,
      },
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Created by is required'],
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Updated by is required'],
    },
    isActive: {
      type: Boolean,
      default: true,
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
MockTestSchema.index({ programId: 1, testNumber: 1 }, { unique: true });
MockTestSchema.index({ programId: 1 });
MockTestSchema.index({ isActive: 1 });

export const MockTest = mongoose.model<IMockTestDocument>('MockTest', MockTestSchema);