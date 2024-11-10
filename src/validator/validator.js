import { body } from "express-validator";

export const validateLogin = [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email address'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{5,}$/)
        .withMessage("Password must be of atleast 5 characters and contain at least one uppercase letter, one number, and one special character")
];

export const validateProfile = [
    body('firstName')
        .notEmpty()
        .withMessage('Please provide your first name')
        .isAlpha()
        .withMessage("Name can't contain numbers or special characters")
        .isLength({ min: 3 })
        .withMessage('First name must be at least 3 characters long'),
    body('lastName')
        .notEmpty()
        .withMessage('Please provide your last name')
        .isAlpha()
        .withMessage("Name can't contain numbers or special characters")
        .isLength({ min: 3 })
        .withMessage('Last name must be at least 3 characters long'),
    body('color')
        .notEmpty()
        .withMessage('Please provide color')
        .isInt()
        .withMessage("Color must contain a numeric value")
        .isInt({ min: 0, max: 3 })
        .withMessage('Color value must be between range 0 and 3'),
];
