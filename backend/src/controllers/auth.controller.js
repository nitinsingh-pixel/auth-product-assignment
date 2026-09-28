import { validationResult } from "express-validator"
import userModel from "../models/user.model.js";
import bcrypt from 'bcryptjs'
import generateTokens from "../utils/generateToken.util.js";
import { verifyRefreshToken } from "../utils/verifyToken.util.js";

export const Register = async (req, res) => {
    
    try {
        
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() })
        }

        const { name, email, password } = req.body;

        const userExists = await userModel.findOne({ email })

        if (userExists) {
            return res.status(409).json({
                message: "User already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await userModel.create({
            name,
            email,
            password: hashedPassword,
        })

        const { accessToken, refreshToken } = generateTokens(newUser._id);

        res.cookie("refreshToken", refreshToken, { httpOnly: true })

        newUser.refreshToken = refreshToken;
        
        await newUser.save();

        return res.status(201).json({
            message: "User created successfully",
            newUser: {
                name,
                email,
            },
            accessToken
        })

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error
        })
    }

}

export const Login = async (req, res) => {

    try {
        
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array()
            })
        }

        const { email, password } = req.body;

        const user = await userModel.findOne({ email }).select("+password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid credentails"
            })
        }

        const { accessToken, refreshToken } = generateTokens(user._id);

        res.cookie("refreshToken", refreshToken, { httpOnly: true })

        user.refreshToken = refreshToken;
        await user.save();

        return res.status(200).json({
            message: "Logged in successfully",
            user: {
                email,
            },
            accessToken
        })

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        })
    }

}

export const Refresh = async (req, res) => {
    
    try {
        
        const token = req.cookies.refreshToken;

        if (!token) {
            return res.status(401).json({
                message: "Refresh Token not found."
            })
        }

        const decoded = verifyRefreshToken(token);

        const user = await userModel.findById(decoded.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        const tokenMatch = token === user.refreshToken;

        if (!tokenMatch) {

            user.refreshToken = null;
            await user.save();

            return res.status(409).json({
                message: "Token not authorized"
            })
        }

        const { accessToken, refreshToken } = generateTokens(user._id);

        res.cookie("refreshToken", refreshToken, { httpOnly: true });

        user.refreshToken = refreshToken;
        await user.save();

        return res.status(200).json({
            message: "Refresh successfull",
            user,
            accessToken
        })

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        })
    }
}

export const Logout = async (req, res) => {
    
    try {
        
        const Rtoken = req.cookies.refreshToken;

        if (!Rtoken) {
            return res.status(401).json({
                message: "Unauthorized access"
            })
        }
        const decoded = verifyRefreshToken(Rtoken);

        req.user = null

        const user = await userModel.findById(decoded.id);

        user.refreshToken = null

        await user.save();

        res.clearCookie("refreshToken")

        return res.status(200).json({
            message: "Logged out successfully",
            user
        })

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        })
    }

}

export const getMe = async (req, res) => {

    try {
        
        const user = req.user;

        if (!user) {

            return res.status(401).json({
                message: "Unauthorized access",
            })
        }

        return res.status(200).json({
            message: "Profile fetched successfully",
            user
        }
        )

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        })
    }
}