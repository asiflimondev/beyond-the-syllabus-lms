import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { User } from '../models/index.js';
import { Student } from '../models/Student.model.js';
import { Teacher } from '../models/Teacher.model.js';
import { OfficeMember } from '../models/OfficeMember.model.js';
import { generateTokens, verifyRefreshToken } from '../utils/jwt.utils.js';

// ============================================
// HELPER: Find user by email or phone
// ============================================
const findUserByIdentifier = async (identifier: string) => {
  console.log('🔍 Looking for identifier:', identifier);
  
  try {
    // Try to find by email first
    let user = await User.findOne({ email: identifier });
    if (user) {
      console.log('✅ Found by email:', user.email);
      return user;
    }

    // Try by phone in Student model
    console.log('📱 Checking Student model for phone:', identifier);
    const student = await Student.findOne({ phone: identifier });
    console.log('📱 Student found:', student ? 'Yes' : 'No');
    if (student && student.userId) {
      user = await User.findById(student.userId);
      if (user) {
        console.log('✅ Found by phone (Student):', user.email);
        return user;
      }
    }

    // Try by phone in Teacher model
    console.log('📱 Checking Teacher model for phone:', identifier);
    const teacher = await Teacher.findOne({ phone: identifier });
    console.log('📱 Teacher found:', teacher ? 'Yes' : 'No');
    if (teacher && teacher.userId) {
      user = await User.findById(teacher.userId);
      if (user) {
        console.log('✅ Found by phone (Teacher):', user.email);
        return user;
      }
    }

    // Try by phone in OfficeMember model
    console.log('📱 Checking OfficeMember model for phone:', identifier);
    const officeMember = await OfficeMember.findOne({ phone: identifier });
    console.log('📱 OfficeMember found:', officeMember ? 'Yes' : 'No');
    if (officeMember && officeMember.userId) {
      user = await User.findById(officeMember.userId);
      if (user) {
        console.log('✅ Found by phone (OfficeMember):', user.email);
        return user;
      }
    }

    console.log('❌ User not found');
    return null;
  } catch (error) {
    console.error('❌ Error in findUserByIdentifier:', error);
    throw error;
  }
};

// ============================================
// REGISTER CONTROLLER
// ============================================
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('📝 Register request received');
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
      return;
    }

    const { email, password, role = 'student' } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({
        success: false,
        message: 'User already exists with this email',
      });
      return;
    }

    const user = await User.create({
      email,
      password,
      role,
      isActive: true,
    });

    const { accessToken, refreshToken } = generateTokens(
      user._id.toString(),
      user.email,
      user.role
    );

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
    console.error('❌ Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register user',
      error: error.message,
    });
  }
};

// ============================================
// LOGIN CONTROLLER - WITH PHONE SUPPORT + DEBUG
// ============================================
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('========================================');
    console.log('📥 LOGIN REQUEST RECEIVED');
    console.log('📥 Request body:', JSON.stringify(req.body, null, 2));
    console.log('========================================');
    
    const identifier = req.body.identifier || req.body.email;
    const password = req.body.password;

    console.log('🔑 Identifier:', identifier);
    console.log('🔑 Password provided:', password ? 'Yes' : 'No');

    if (!identifier || !password) {
      res.status(400).json({
        success: false,
        message: 'Email/phone and password are required',
      });
      return;
    }

    // ✅ CRITICAL FIX: Use .select('+password') to include the password field
    let user = await User.findOne({ email: identifier }).select('+password');
    
    if (!user) {
      // Try by phone in Student model
      const student = await Student.findOne({ phone: identifier });
      if (student && student.userId) {
        user = await User.findById(student.userId).select('+password');
      }
    }

    if (!user) {
      // Try by phone in Teacher model
      const teacher = await Teacher.findOne({ phone: identifier });
      if (teacher && teacher.userId) {
        user = await User.findById(teacher.userId).select('+password');
      }
    }

    if (!user) {
      // Try by phone in OfficeMember model
      const officeMember = await OfficeMember.findOne({ phone: identifier });
      if (officeMember && officeMember.userId) {
        user = await User.findById(officeMember.userId).select('+password');
      }
    }

    if (!user) {
      console.log('❌ User not found');
      res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
      return;
    }

    console.log('👤 User found:', user.email);
    console.log('👤 User role:', user.role);
    console.log('👤 User active:', user.isActive);

    if (!user.isActive) {
      console.log('❌ User is inactive');
      res.status(403).json({
        success: false,
        message: 'Account is deactivated. Please contact admin.',
      });
      return;
    }

    // ✅ Now password will be available
    console.log('🔐 Checking password...');
    const isPasswordValid = await user.comparePassword(password);
    console.log('🔐 Password valid:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('❌ Invalid password');
      res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
      return;
    }

    user.lastLogin = new Date();
    await user.save();
    console.log('✅ Last login updated');

    const { accessToken, refreshToken } = generateTokens(
      user._id.toString(),
      user.email,
      user.role
    );
    console.log('✅ Tokens generated');

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

    console.log('✅ Login successful for:', user.email);
    console.log('========================================');

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
    console.error('❌ LOGIN ERROR:', error);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message,
    });
  }
};

// ============================================
// REFRESH TOKEN CONTROLLER
// ============================================
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      res.status(400).json({
        success: false,
        message: 'Refresh token is required',
      });
      return;
    }

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