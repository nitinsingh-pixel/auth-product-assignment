import { Logout } from "../controllers/auth.controller.js";
import userModel from "../models/user.model.js";
import { verifyAcessToken } from "../utils/verifyToken.util.js";


const authenticateUser = async (req, res, next) => {

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {

        
        return res.status(401).json({
            message: "Unauthorized access"
        })
    }

    const decoded = verifyAcessToken(token);

    const user = await userModel.findById(decoded.id);

    if (!user) {
        return res.status(401).json({
            message: "User not found"
        })
    }

    req.user = user
    next();
}

export default authenticateUser