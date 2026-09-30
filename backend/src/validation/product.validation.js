import { body, param } from 'express-validator'

export const productValidation = [
    body('name')
        .trim().notEmpty().withMessage("Name is required."),
    
    body('price')
        .isFloat({ gt: 0 }).withMessage("Price must be a positive number."),
    
    body('description')
        .trim().notEmpty().withMessage("Description is required."),

    body('stock')
        .isInt({ min: 0 }).withMessage("Stock must be 0 or greater."),
    
    body('category')
        .trim().notEmpty().withMessage("Category is required.")
        .isString().withMessage("Invalid category"),
]

export const paramValidation = [
    param('id')
        .exists().withMessage("id is required")
        .isMongoId().withMessage("Invalid id")
]
