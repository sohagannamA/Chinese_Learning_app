import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/Db.js";
import authRoutes from "./routes/authRoutes.js";
import wordRoutes from "./routes/addWordRoutes.js";


dotenv.config();

const app = express();
const allowedOrigins = [
  "https://mrschineselearning.netlify.app",    
  "https://chinese-learning-app.onrender.com",  
  "https://chinese-learning-app-1.onrender.com" 
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
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
