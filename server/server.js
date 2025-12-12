import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/Db.js";

import authRoutes from "./routes/authRoutes.js";
import wordRoutes from "./routes/addWordRoutes.js";

dotenv.config();

const app = express();

// ⚡ FAST CORS (no heavy function)
app.use(
  cors({
    origin: [
      "https://mrschineselearning.netlify.app",
      "https://chinese-learning-app.onrender.com",
      "https://chinese-learning-app-1.onrender.com",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);

// ⚡ Fast Body Parser
app.use(express.json({ limit: "50kb" }));

// ⚡ DB Connection Only Once
connectDB();

// ⚡ Remove startup delay
app.get("/", (req, res) => {
  res.send("API Running...");
});

// ⚡ Routes
app.use("/api/auth", authRoutes);
app.use("/api/words", wordRoutes);

// ⚡ Fast Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
