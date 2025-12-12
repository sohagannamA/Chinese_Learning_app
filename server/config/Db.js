import mongoose from "mongoose";

const connectDB = async () => {
  const localHost = "mongodb://localhost:27017";
  const onlineConnect = process.env.MONGO_URI;
  try {
    await mongoose.connect(onlineConnect);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("DB Connection Error:", error);
  }
};

export default connectDB;
