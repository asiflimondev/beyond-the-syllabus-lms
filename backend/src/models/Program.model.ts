import mongoose, { Schema, Document } from 'mongoose';
import { IProgram } from '../types/index.js';

export interface IProgramDocument extends Document, IProgram {}

const ProgramSchema = new Schema<IProgramDocument>(
  {
    name: {
      type: String,
      required: [true, 'Program name is required'],
      unique: true,
      trim: true,
    },
    displayName: {
      en: {
        type: String,
        required: [true, 'English display name is required'],
      },
      bn: {
        type: String,
        required: [true, 'Bangla display name is required'],
      },
    },
    description: {
      en: {
        type: String,
        required: [true, 'English description is required'],
      },
      bn: {
        type: String,
        required: [true, 'Bangla description is required'],
      },
    },
    duration: {
      type: Number,
      required: [true, 'Duration is required'],
      min: [1, 'Duration must be at least 1 month'],
    },
    fee: {
      type: Number,
      required: [true, 'Fee is required'],
      min: [0, 'Fee cannot be negative'],
    },
    teacherIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Teacher',
      },
    ],
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
      default: undefined,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
ProgramSchema.index({ name: 1 }, { unique: true });
ProgramSchema.index({ isActive: 1 });
ProgramSchema.index({ teacherIds: 1 });

export const Program = mongoose.model<IProgramDocument>('Program', ProgramSchema);