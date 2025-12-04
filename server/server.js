import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/Db.js";
import authRoutes from "./routes/authRoutes.js";
import wordRoutes from "./routes/addWordRoutes.js";

dotenv.config();

const app = express();

// ✅ Allowed frontend origins
const allowedOrigins = [
  "http://localhost:5173", // local dev
  "https://mrschineselearning.netlify.app", // production frontend
];

// ✅ CORS options
const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like Postman or server-to-server)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("❌ Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // allow cookies
};

// Apply CORS BEFORE routes
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // handle preflight requests
app.use(express.json());


connectDB();


app.use("/api/auth", authRoutes);
app.use("/api/words", wordRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
