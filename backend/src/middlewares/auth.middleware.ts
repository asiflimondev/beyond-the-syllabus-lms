import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.utils.js';
import { User } from '../models/index.js';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

// ============================================
// AUTHENTICATION MIDDLEWARE
// ============================================
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'No token provided. Please login.',
      });
      return;
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired token. Please login again.',
      });
      return;
    }

    // Check if user exists and is active
    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'User not found. Please login again.',
      });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({
        success: false,
        message: 'Account is deactivated. Please contact admin.',
      });
      return;
    }

    // Attach user to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error: any) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication failed',
      error: error.message,
    });
  }
};

// ============================================
// ROLE-BASED ACCESS CONTROL MIDDLEWARE
// ============================================
export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user;

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      res.status(403).json({
        success: false,
        message: 'You do not have permission to access this resource',
      });
      return;
    }

    next();
  };
};

// ============================================
// SPECIFIC ROLE MIDDLEWARES
// ============================================
export const isAdmin = authorize('admin');

export const isTeacher = authorize('admin', 'teacher');

export const isOffice = authorize('admin', 'office');

export const isStudent = authorize('admin', 'student');

export const isTeacherOrOffice = authorize('admin', 'teacher', 'office');

export const isAuthenticated = authenticate;