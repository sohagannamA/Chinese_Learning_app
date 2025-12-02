import mongoose from "mongoose";

const sentenceSchema = new mongoose.Schema({
  chinese: { type: String, required: true },
  english: { type: String, required: true },
});

const wordSchema = new mongoose.Schema(
  {
    chinese: { type: String, required: true },
    pinyin: { type: String, required: true },
    english: { type: String, required: true },
    hskLevel: {
      type: String,
      enum: ["HSK-1", "HSK-2", "HSK-3", "HSK-4"],
      required: true,
    },
    category: {
      type: String,
      required: true,
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
      },
    ],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Custom validator for sentences array
function arrayLimit(val) {
  return val.length > 0;
}

const Word = mongoose.model("Word", wordSchema);

export default Word;
