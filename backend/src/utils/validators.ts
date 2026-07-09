import { body, ValidationChain } from 'express-validator';

export const registerValidation: ValidationChain[] = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .trim(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)/)
    .withMessage('Password must contain at least one letter and one number'),
  
  body('confirmPassword')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords do not match'),
  
  body('role')
    .optional()
    .isIn(['admin', 'teacher', 'office', 'student'])
    .withMessage('Invalid role provided'),
];

// ✅ Updated: Supports both 'email' and 'identifier'
export const loginValidation: ValidationChain[] = [
  body('identifier')
    .optional()
    .notEmpty()
    .withMessage('Email or phone number is required')
    .trim(),
  body('email')
    .optional()
    .notEmpty()
    .withMessage('Email or phone number is required')
    .trim(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

export const refreshTokenValidation: ValidationChain[] = [
  body('refreshToken')
    .notEmpty()
    .withMessage('Refresh token is required'),
];