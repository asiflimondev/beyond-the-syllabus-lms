import mongoose, { Schema, Document } from 'mongoose';
import { IOfficeMember } from '../types/index.js';

export interface IOfficeMemberDocument extends Document, IOfficeMember {}

const OfficeMemberSchema = new Schema<IOfficeMemberDocument>(
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
    address: {
      type: String,
      trim: true,
    },
    profileImage: {
      url: { type: String },
      publicId: { type: String },
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
OfficeMemberSchema.index({ employeeId: 1 }, { unique: true });
OfficeMemberSchema.index({ userId: 1 }, { unique: true });
OfficeMemberSchema.index({ isDeleted: 1 });

export const OfficeMember = mongoose.model<IOfficeMemberDocument>(
  'OfficeMember',
  OfficeMemberSchema
);