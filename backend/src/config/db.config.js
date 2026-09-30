import mongoose from "mongoose"
import config from "./env.config.js"

export const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) {
        return;
    }
    try {
        await mongoose.connect(config.MONGO_URI)
        console.log("Database connected")
    } catch (error) {
        console.error("Database connection error:", error)
    }
}