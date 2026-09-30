import {validationResult} from "express-validator"
import imageKit from "../config/imagekit.config.js";
import productModel from "../models/product.model.js";

export const createProduct = async (req, res) => {
    
    try {
        
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: errors.array().map(e => e.msg).join(", "),
                errors: errors.array()
            });
        }

        const { name, price, description, category, stock } = req.body;

        let image = "";
        if (req.file) {
            try {
                const result = await imageKit.upload({
                    file: req.file.buffer.toString('base64'),
                    fileName: req.file.originalname,
                    folder: '/products'
                });
                image = result.url;
            } catch (imgErr) {
                console.error("ImageKit error, using fallback image:", imgErr.message);
                image = `https://picsum.photos/seed/${encodeURIComponent(name)}/600/400`;
            }
        } else {
            image = `https://picsum.photos/seed/${encodeURIComponent(name)}/600/400`;
        }

        const product = await productModel.create({
            name,
            price: Number(price),
            description,
            category,
            stock: Number(stock),
            image
        });

        return res.status(201).json({
            message: "Product created successfully",
            product
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        })
    }
}

export const getAllProducts = async (req, res) => {
    
    try {
        
        const products = await productModel.find();

        return res.status(200).json({
            message: "Products fetched successfully",
            products
        })

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        })
    }
}

export const getProduct = async (req, res) => {

    try {
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array()})
        }
        const { id } = req.params;

        const product = await productModel.findById(id);

        return res.status(200).json({
            message: "Product fetched successfully",
            product
        })

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        })
    }
}

export const updateProduct = async (req, res) => {

    try {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: errors.array().map(e => e.msg).join(", "),
                errors: errors.array()
            });
        }
        
        const { name, price, description, stock, category, removeImage } = req.body;
        const { id } = req.params;

        const existingProduct = await productModel.findById(id);
        if (!existingProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        let image = existingProduct.image;
        if (removeImage === 'true' || removeImage === true) {
            image = `https://picsum.photos/seed/${encodeURIComponent(name || existingProduct.name)}/600/400`;
        }

        if (req.file) {
            try {
                const result = await imageKit.upload({
                    file: req.file.buffer.toString('base64'),
                    fileName: req.file.originalname,
                    folder: '/products'
                });
                image = result.url;
            } catch (imgErr) {
                console.error("Image upload failed, fallback:", imgErr.message);
                image = `https://picsum.photos/seed/${encodeURIComponent(name || existingProduct.name)}/600/400`;
            }
        }

        const product = await productModel.findByIdAndUpdate(id, {
            name,
            price: Number(price),
            description,
            stock: Number(stock),
            category,
            image
        }, {
            new: true
        });

        return res.status(200).json({
            message: "Product updated successfully",
            product
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        })
    }
}

export const deleteProduct = async (req, res) => {

    try {
        
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() })
        }

        const { id } = req.params;

        const deletedProduct = await productModel.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({
                message: "Product not found"
            })
        }

        return res.status(200).json({
            message: "Product deleted successfully",
        })

    } catch (error) {
        return res.status(500).json({
            error: error.message
        })
    }
}