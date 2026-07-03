import { body, ValidationChain } from 'express-validator';

// Create Program Validation
export const createProgramValidation: ValidationChain[] = [
  body('name')
    .notEmpty()
    .withMessage('Program name is required')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Program name must be between 2 and 50 characters'),
  
  body('displayName.en')
    .notEmpty()
    .withMessage('English display name is required')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('English display name must be between 2 and 100 characters'),
  
  body('displayName.bn')
    .notEmpty()
    .withMessage('Bangla display name is required')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Bangla display name must be between 2 and 100 characters'),
  
  body('description.en')
    .notEmpty()
    .withMessage('English description is required')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('English description must be between 10 and 500 characters'),
  
  body('description.bn')
    .notEmpty()
    .withMessage('Bangla description is required')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Bangla description must be between 10 and 500 characters'),
  
  body('duration')
    .notEmpty()
    .withMessage('Duration is required')
    .isInt({ min: 1, max: 24 })
    .withMessage('Duration must be between 1 and 24 months'),
  
  body('fee')
    .notEmpty()
    .withMessage('Fee is required')
    .isFloat({ min: 0 })
    .withMessage('Fee must be a positive number'),
  
  body('teacherIds')
    .optional()
    .isArray()
    .withMessage('Teacher IDs must be an array'),
];

// Update Program Validation
export const updateProgramValidation: ValidationChain[] = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Program name must be between 2 and 50 characters'),
  
  body('displayName.en')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('English display name must be between 2 and 100 characters'),
  
  body('displayName.bn')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Bangla display name must be between 2 and 100 characters'),
  
  body('description.en')
    .optional()
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('English description must be between 10 and 500 characters'),
  
  body('description.bn')
    .optional()
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Bangla description must be between 10 and 500 characters'),
  
  body('duration')
    .optional()
    .isInt({ min: 1, max: 24 })
    .withMessage('Duration must be between 1 and 24 months'),
  
  body('fee')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Fee must be a positive number'),
  
  body('teacherIds')
    .optional()
    .isArray()
    .withMessage('Teacher IDs must be an array'),
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
];