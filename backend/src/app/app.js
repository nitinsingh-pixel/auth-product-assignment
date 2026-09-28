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
    origin: config.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}

app.use(cors(corsOptions))

app.use("/api/auth", authRouter)

app.use("/api/products", productRouter)

export default app;