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

export const Program = mongoose.model<IProgramDocument>('Program', ProgramSchema);