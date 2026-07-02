import mongoose, { Schema, Document } from 'mongoose';
import { IStudent } from '../types/index.js';

export interface IStudentDocument extends Document, IStudent {}

const StudentSchema = new Schema<IStudentDocument>(
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
    admissionId: {
      type: String,
      required: [true, 'Admission ID is required'],
      unique: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending_registration', 'active', 'completed', 'inactive'],
      default: 'pending_registration',
    },
    fatherName: {
      type: String,
      trim: true,
    },
    motherName: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    parentPhone: {
      type: String,
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
    schoolCollege: {
      type: String,
      trim: true,
    },
    programId: {
      type: Schema.Types.ObjectId,
      ref: 'Program',
      required: [true, 'Program ID is required'],
    },
    profileImage: {
      url: { type: String },
      publicId: { type: String },
    },
    admittedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Admitted by is required'],
    },
    admissionDate: {
      type: Date,
      default: Date.now,
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
StudentSchema.index({ admissionId: 1 }, { unique: true });
StudentSchema.index({ userId: 1 }, { unique: true });
StudentSchema.index({ programId: 1 });
StudentSchema.index({ status: 1 });
StudentSchema.index({ isDeleted: 1 });

export const Student = mongoose.model<IStudentDocument>('Student', StudentSchema);