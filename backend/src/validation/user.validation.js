import { body } from "express-validator"

export const registerValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage("Name is required.")
        .isLength({ min: 2, max: 50 }).withMessage("Name must be between 2 and 50 characters."),
    
    body('email')
        .isEmail().withMessage("Please provide a valid email.")
        .normalizeEmail(),
    
    body('password')
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long."),
    
    body('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match.');
            }
            return true;
        })
];

export const loginValidation = [
    body('email')
        .isEmail().withMessage("Please enter a valid email.")
        .normalizeEmail(),
    
    body('password')
        .trim().notEmpty().withMessage("Password is required.")
]
