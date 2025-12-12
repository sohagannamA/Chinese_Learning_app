import mongoose from "mongoose";

const sentenceSchema = new mongoose.Schema(
  {
    chinese: { type: String, required: true, trim: true },
    english: { type: String, required: true, trim: true },
  },
  { _id: false } // 🔥 makes document lighter & faster
);

function arrayLimit(val) {
  return Array.isArray(val) && val.length > 0;
}

const wordSchema = new mongoose.Schema(
  {
    chinese: {
      type: String,
      required: true,
      trim: true,
      index: true, // 🔥 faster search
    },
    pinyin: { type: String, required: true, trim: true },
    english: {
      type: String,
      required: true,
      trim: true,
      index: true, // 🔥 fast English search
    },
    hskLevel: {
      type: String,
      enum: ["HSK-1", "HSK-2", "HSK-3", "HSK-4"],
      required: true,
      index: true, // fast filtering
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    sentences: {
      type: [sentenceSchema],
      validate: [arrayLimit, "At least one sentence is required"],
      required: true,
    },
    completedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        index: true, // faster lookup
      },
    ],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // 🔥 user wise fast search
    },
  },
  {
    timestamps: true,
    versionKey: false, // 🔥 removes __v → lighter model
  }
);

// Prevent model overwrite (🚀 for Render, Vercel, Hot Reload)
export default mongoose.models.Word || mongoose.model("Word", wordSchema);
