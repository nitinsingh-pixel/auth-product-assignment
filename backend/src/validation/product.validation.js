import { body, param } from 'express-validator'

export const productValidation = [
    body('name')
        .trim().notEmpty().withMessage("Name is required."),
    
    body('price')
        .isFloat({ gt: 0 }).withMessage("Price is not valid."),
    
    body('description')
        .trim().notEmpty().withMessage("Description is required.")
        .isLength({ min: 20 }).withMessage("Description must be minimum 20 characters long."),

    body('stock')
        .isInt({ gt: 0 }).withMessage("Stock must be greater than 0."),
    
    body('category')
        .trim().notEmpty().withMessage("Category is required.")
        .isString().withMessage("Invalid input"),

]

export const paramValidation = [
    param('id')
        .exists().withMessage("id is required")
        .isMongoId().withMessage("Invalid id")
]
