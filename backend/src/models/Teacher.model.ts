import mongoose, { Schema, Document } from 'mongoose';
import { ITeacher } from '../types/index.js';

export interface ITeacherDocument extends Document, ITeacher {}

const TeacherSchema = new Schema<ITeacherDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    employeeId: {
      type: String,
      required: [true, 'Employee ID is required'],
      unique: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    profileImage: {
      url: { type: String },
      publicId: { type: String },
    },
    programIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Program',
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

// Indexes
TeacherSchema.index({ employeeId: 1 }, { unique: true });
TeacherSchema.index({ userId: 1 }, { unique: true });
TeacherSchema.index({ programIds: 1 });
TeacherSchema.index({ isDeleted: 1 });

export const Teacher = mongoose.model<ITeacherDocument>('Teacher', TeacherSchema);