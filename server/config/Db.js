import mongoose from "mongoose";

let isConnected = false; // 🔥 Cache flag

const connectDB = async () => {
  if (isConnected) {
    // If already connected, skip new connection
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: "MyApp", // optional but recommended
    });

    isConnected = conn.connections[0].readyState;
    console.log("✅ MongoDB Connected:", conn.connection.host);
  } catch (error) {
    console.error("❌ DB Connection Error:", error.message);
  }
};

export default connectDB;
