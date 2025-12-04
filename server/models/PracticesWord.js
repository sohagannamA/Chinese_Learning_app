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

    // exactly two sentences
    sentences: {
      type: [sentenceSchema],
      validate: {
        validator: function (arr) {
          return arr.length === 3;
        },
        message: "Exactly two example sentences are required",
      },
      required: true,
    },

    // link word to user
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);
export default mongoose.model("PracticesWord", wordSchema);
