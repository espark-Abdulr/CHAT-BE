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