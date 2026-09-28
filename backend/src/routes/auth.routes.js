import Router from 'express'
import { loginValidation, registerValidation } from '../validation/user.validation.js';
import { getMe, Login, Logout, Refresh, Register } from '../controllers/auth.controller.js';
import authenticateUser from '../middlewares/auth.middleware.js';

const authRouter = Router();

authRouter.post("/register", registerValidation, Register)
authRouter.post("/login", loginValidation, Login)
authRouter.post("/refresh", Refresh)
authRouter.post("/logout", authenticateUser, Logout)
authRouter.get("/getMe", authenticateUser, getMe )

export default authRouter;