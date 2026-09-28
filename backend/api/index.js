
import app from "../src/app/app.js";
import { connectDB } from "../src/config/db.config.js";


await connectDB();

export default app;