import { body, ValidationChain } from 'express-validator';

// Register validation
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

// Login validation
export const loginValidation: ValidationChain[] = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .trim(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

// Refresh token validation
export const refreshTokenValidation: ValidationChain[] = [
  body('refreshToken')
    .notEmpty()
    .withMessage('Refresh token is required'),
];