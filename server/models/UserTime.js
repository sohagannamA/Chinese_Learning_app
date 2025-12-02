import mongoose from "mongoose";

const userTimeSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  duration: { type: Number, default: 0 }, // seconds
});

export default mongoose.model("UserTime", userTimeSchema);
