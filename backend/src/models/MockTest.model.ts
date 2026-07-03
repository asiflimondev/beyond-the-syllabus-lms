import mongoose, { Schema, Document } from 'mongoose';
import { IMockTest } from '../types/index.js';

export interface IMockTestDocument extends IMockTest, Document {}

const MockTestSchema = new Schema<IMockTestDocument>(
  {
    programId: {
      type: mongoose.Schema.Types.ObjectId,
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
      default: '',
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
      type: {
        totalMarks: {
          type: Number,
          required: false,
          default: 0,
          min: [0, 'Total marks cannot be negative'],
        },
        description: {
          type: String,
          trim: true,
          default: '',
        },
      },
      required: false,
      default: undefined,
    },
    writing: {
      type: {
        totalMarks: {
          type: Number,
          required: false,
          default: 0,
          min: [0, 'Total marks cannot be negative'],
        },
        description: {
          type: String,
          trim: true,
          default: '',
        },
      },
      required: false,
      default: undefined,
    },
    listening: {
      type: {
        totalMarks: {
          type: Number,
          required: false,
          default: 0,
          min: [0, 'Total marks cannot be negative'],
        },
        description: {
          type: String,
          trim: true,
          default: '',
        },
      },
      required: false,
      default: undefined,
    },
    speaking: {
      type: {
        description: {
          type: String,
          trim: true,
          default: '',
        },
      },
      required: false,
      default: undefined,
    },
    presentation: {
      type: {
        totalMarks: {
          type: Number,
          required: false,
          default: 0,
          min: [0, 'Total marks cannot be negative'],
        },
        description: {
          type: String,
          trim: true,
          default: '',
        },
      },
      required: false,
      default: undefined,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Created by is required'],
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
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

// Compound unique index: One test number per program
MockTestSchema.index({ programId: 1, testNumber: 1 }, { unique: true });
MockTestSchema.index({ programId: 1 });
MockTestSchema.index({ isActive: 1 });

export const MockTest = mongoose.model<IMockTestDocument>('MockTest', MockTestSchema);