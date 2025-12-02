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

    // ✅ Use simple category instead
    category: { type: String, required: true }, // e.g., FOOD, DAY, STUDY

    sentences: {
      type: [sentenceSchema],
      validate: [arrayLimit, "At least one sentence is required"],
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    completedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

function arrayLimit(val) {
  return val.length > 0;
}

const Category = mongoose.model("Category", wordSchema);

export default Category;
