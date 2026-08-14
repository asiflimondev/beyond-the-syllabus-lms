import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import crypto from 'crypto';
import { User } from '../models/index.js';
import { Student } from '../models/Student.model.js';
import { Teacher } from '../models/Teacher.model.js';
import { OfficeMember } from '../models/OfficeMember.model.js';
import { PasswordResetToken } from '../models/PasswordResetToken.model.js';
import { generateTokens, verifyRefreshToken } from '../utils/jwt.utils.js';
import { sendEmail, generateResetEmail } from '../utils/email.js';

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
      fullName: '',  // Will be updated later via profile
      phone: '',     // Will be updated later via profile
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
          fullName: user.fullName || user.email.split('@')[0],
          phone: user.phone || '',
          profile: null,
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

    // ✅ FIX: Always use User model for fullName and phone
    const fullName = user.fullName || profileData?.fullName || user.email.split('@')[0];
    const phone = user.phone || profileData?.phone || '';

    console.log('✅ Login successful for:', user.email);
    console.log('✅ Returning fullName:', fullName);
    console.log('✅ Returning phone:', phone);
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
          fullName: fullName,
          phone: phone,
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

    // Get profile data for response
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

    const fullName = user.fullName || profileData?.fullName || user.email.split('@')[0];
    const phone = user.phone || profileData?.phone || '';

    res.status(200).json({
      success: true,
      message: 'Tokens refreshed successfully',
      data: {
        accessToken,
        refreshToken: newRefreshToken,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          lastLogin: user.lastLogin,
          fullName: fullName,
          phone: phone,
          profile: profileData,
        },
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

    // ✅ FIX: Always use User model for fullName and phone
    const fullName = user.fullName || profileData?.fullName || user.email.split('@')[0];
    const phone = user.phone || profileData?.phone || '';

    console.log('✅ getCurrentUser returning:', {
      email: user.email,
      fullName: fullName,
      phone: phone
    });

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          lastLogin: user.lastLogin,
          fullName: fullName,
          phone: phone,
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

// ============================================
// FORGOT PASSWORD
// ============================================
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier } = req.body; // email or phone

    if (!identifier) {
      res.status(400).json({
        success: false,
        message: 'Email or phone is required',
      });
      return;
    }

    // Find user by email or phone
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

    // Don't reveal if user exists - security best practice
    if (!user) {
      res.status(200).json({
        success: true,
        message: 'If an account exists, a password reset link has been sent.',
      });
      return;
    }

    // Check if user has an email
    if (!user.email) {
      res.status(400).json({
        success: false,
        message: 'No email associated with this account. Please contact the center for assistance.',
      });
      return;
    }

    // Generate secure token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour

    // Delete any existing tokens for this user
    await PasswordResetToken.deleteMany({ userId: user._id });

    // Save new token
    await PasswordResetToken.create({
      userId: user._id,
      token,
      expiresAt,
    });

    // Build reset link
    const frontendUrl = process.env.FRONTEND_URL || 'https://beyondthesyllabus.org';
    const resetLink = `${frontendUrl}/reset-password?token=${token}`;

    // Get user's full name
    let fullName = user.fullName || 'Student';
    
    // Try to get from profile if not in User
    if (!user.fullName) {
      const student = await Student.findOne({ userId: user._id });
      if (student) fullName = student.fullName;
    }

    // Send email
    try {
      const emailHtml = generateResetEmail(fullName, resetLink, frontendUrl);
      await sendEmail({
        to: user.email,
        subject: '🔐 Reset Your Password - Beyond the Syllabus',
        html: emailHtml,
      });
    } catch (emailError) {
      console.error('Failed to send reset email:', emailError);
      res.status(500).json({
        success: false,
        message: 'Failed to send reset email. Please try again later.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'If an account exists, a password reset link has been sent.',
    });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process password reset request',
      error: error.message,
    });
  }
};

// ============================================
// RESET PASSWORD
// ============================================
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    if (!token || !newPassword) {
      res.status(400).json({
        success: false,
        message: 'Token and new password are required',
      });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      res.status(400).json({
        success: false,
        message: 'Passwords do not match',
      });
      return;
    }

    // Find valid token
    const resetToken = await PasswordResetToken.findOne({
      token,
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (!resetToken) {
      res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token. Please request a new one.',
      });
      return;
    }

    // Update user password
    const user = await User.findById(resetToken.userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    // Hash password (will be handled by pre-save hook)
    user.password = newPassword;
    await user.save();

    // Mark token as used
    resetToken.used = true;
    await resetToken.save();

    // Delete all other tokens for this user
    await PasswordResetToken.deleteMany({
      userId: user._id,
      _id: { $ne: resetToken._id },
    });

    res.status(200).json({
      success: true,
      message: 'Password updated successfully. You can now login with your new password.',
    });
  } catch (error: any) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset password',
      error: error.message,
    });
  }
};

// ============================================
// VERIFY RESET TOKEN
// ============================================
export const verifyResetToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.params;

    if (!token) {
      res.status(400).json({
        success: false,
        message: 'Token is required',
      });
      return;
    }

    const resetToken = await PasswordResetToken.findOne({
      token,
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (!resetToken) {
      res.status(400).json({
        success: false,
        message: 'Invalid or expired token',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Token is valid',
    });
  } catch (error: any) {
    console.error('Verify token error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify token',
      error: error.message,
    });
  }
};