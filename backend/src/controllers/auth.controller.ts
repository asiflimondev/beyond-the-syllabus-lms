import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { User } from '../models/index.js';
import { Student } from '../models/Student.model.js';
import { Teacher } from '../models/Teacher.model.js';
import { OfficeMember } from '../models/OfficeMember.model.js';
import { generateTokens, verifyRefreshToken } from '../utils/jwt.utils.js';
import { RegisterRequest, LoginRequest } from '../types/auth.types.js';
import { Types } from 'mongoose';

// ============================================
// REGISTER CONTROLLER
// ============================================
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
      return;
    }

    const { email, password, role = 'student' } = req.body as RegisterRequest;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({
        success: false,
        message: 'User already exists with this email',
      });
      return;
    }

    // Create user
    const user = await User.create({
      email,
      password,
      role,
      isActive: true,
    });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(
      user._id.toString(),
      user.email,
      user.role
    );

    // Create role-specific profile if needed
    // For student registration, we'll create the student profile later via admission
    // For now, we just create the user

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        accessToken,
        refreshToken,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
        },
      },
    });
  } catch (error: any) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register user',
      error: error.message,
    });
  }
};

// ============================================
// LOGIN CONTROLLER
// ============================================
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
      return;
    }

    const { email, password } = req.body as LoginRequest;

    // Find user with password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
      return;
    }

    // Check if user is active
    if (!user.isActive) {
      res.status(403).json({
        success: false,
        message: 'Account is deactivated. Please contact admin.',
      });
      return;
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
      return;
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(
      user._id.toString(),
      user.email,
      user.role
    );

    // Get role-specific profile data
    let profileData = null;
    switch (user.role) {
      case 'student':
        profileData = await Student.findOne({ userId: user._id });
        break;
      case 'teacher':
        profileData = await Teacher.findOne({ userId: user._id });
        break;
      case 'office':
        profileData = await OfficeMember.findOne({ userId: user._id });
        break;
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        accessToken,
        refreshToken,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          lastLogin: user.lastLogin,
          profile: profileData,
        },
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to login',
      error: error.message,
    });
  }
};

// ============================================
// REFRESH TOKEN CONTROLLER
// ============================================
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
      return;
    }

    const { refreshToken: token } = req.body;

    // Verify refresh token
    let decoded;
    try {
      decoded = verifyRefreshToken(token);
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token',
      });
      return;
    }

    // Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({
        success: false,
        message: 'Account is deactivated',
      });
      return;
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
      user._id.toString(),
      user.email,
      user.role
    );

    res.status(200).json({
      success: true,
      message: 'Tokens refreshed successfully',
      data: {
        accessToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error: any) {
    console.error('Refresh token error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to refresh token',
      error: error.message,
    });
  }
};

// ============================================
// LOGOUT CONTROLLER
// ============================================
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    // Since we're using stateless JWT, we just send a success response
    // The client should remove the tokens from storage
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error: any) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to logout',
      error: error.message,
    });
  }
};

// ============================================
// GET CURRENT USER CONTROLLER
// ============================================
export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // The user is attached by the auth middleware
    const userId = (req as any).user?.id;
    
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    // Get role-specific profile
    let profileData = null;
    switch (user.role) {
      case 'student':
        profileData = await Student.findOne({ userId: user._id });
        break;
      case 'teacher':
        profileData = await Teacher.findOne({ userId: user._id });
        break;
      case 'office':
        profileData = await OfficeMember.findOne({ userId: user._id });
        break;
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          lastLogin: user.lastLogin,
          profile: profileData,
        },
      },
    });
  } catch (error: any) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user data',
      error: error.message,
    });
  }
};