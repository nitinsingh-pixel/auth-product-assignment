import express from "express"
import cookieParser from 'cookie-parser'
import authRouter from "../routes/auth.routes.js";
import productRouter from "../routes/product.routes.js";
import cors from 'cors'
import config from "../config/env.config.js";
const app = express();

app.use(express.json())

app.use(cookieParser())

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        const cleanOrigin = origin.replace(/\/$/, "");
        const configuredOrigin = config.FRONTEND_URL?.replace(/\/$/, "");

        if (
            cleanOrigin === configuredOrigin ||
            cleanOrigin === "http://localhost:5173" ||
            cleanOrigin === "http://localhost:3000" ||
            cleanOrigin.endsWith(".vercel.app")
        ) {
            return callback(null, true);
        }
        return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}

app.use(cors(corsOptions))

app.use("/api/auth", authRouter)

app.use("/api/products", productRouter)

export default app;