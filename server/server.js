import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/Db.js";
import authRoutes from "./routes/authRoutes.js";
import wordRoutes from "./routes/addWordRoutes.js";


dotenv.config();

const app = express();
app.use(cors({
  origin: "https://chinese-learning-app-1.onrender.com", 
  credentials: true
}));
app.use(express.json());

// DB Connection
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/words", wordRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
