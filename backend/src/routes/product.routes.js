import Router from 'express'
import authenticateUser from '../middlewares/auth.middleware.js';
import upload from '../config/multer.config.js';
import { createProduct, deleteProduct, getAllProducts, getProduct, updateProduct } from '../controllers/product.controller.js';
import { paramValidation, productValidation } from '../validation/product.validation.js';

const productRouter = Router();

productRouter.post("/create", authenticateUser, upload.single('image'), productValidation, createProduct);
productRouter.get("/", getAllProducts);
productRouter.get("/:id", paramValidation, getProduct);
productRouter.put("/update/:id", paramValidation, authenticateUser, upload.single('image'), productValidation, updateProduct);
productRouter.delete("/delete/:id", paramValidation, authenticateUser, deleteProduct);

export default productRouter;