import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true, // Faster queries
    },

    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// ⭐ Prevent model overwriting during hot reload or server restart
export default mongoose.models.User || mongoose.model("User", userSchema);
