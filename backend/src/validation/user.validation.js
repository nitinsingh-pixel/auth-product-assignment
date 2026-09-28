import { body } from "express-validator"

export const registerValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage("Name is Required.")
        .isLength({ min: 3, max: 50 }).withMessage("Name must between 3 and 50 characters."),
    
    body('email')
        .isEmail().withMessage("Please provide a valid email.")
        .normalizeEmail(),
    
    body('password')
        .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long.")
        .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter.")
        .matches(/[0-9]/).withMessage("Password must contain at least one number."),
    
    body('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('password do not match.');
            }
            return true
        })
];

export const loginValidation = [
    body('email')
        .isEmail().withMessage("Please enter a valid email.")
        .normalizeEmail(),
    
    body('password')
        .trim().notEmpty().withMessage("Password is required.")
]
