import mongoose from "mongoose";
import Word from "../models/Word.js";
import Category from "../models/Category.js";

/* ===============================
   1️⃣ Get HSK Summary (Optimized)
=============================== */
export const getHskSummary = async (req, res) => {
  try {
    const userIdStr = req.user._id.toString();

    // Fetch all words as lean() → faster
    const words = await Word.find().lean();

    if (!words.length)
      return res
        .status(200)
        .json({ message: "No words added yet", hskLevels: [] });

    const hskGroups = {};

    words.forEach((word) => {
      const level = word.hskLevel;
      if (!hskGroups[level])
        hskGroups[level] = {
          hskLevel: level,
          totalWords: 0,
          completedWords: 0,
          words: [],
        };

      hskGroups[level].totalWords++;
      if (word.completedBy?.some((id) => id.toString() === userIdStr))
        hskGroups[level].completedWords++;
      hskGroups[level].words.push(word);
    });

    res
      .status(200)
      .json({ success: true, hskLevels: Object.values(hskGroups) });
  } catch (err) {
    console.error("HSK Summary Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   2️⃣ Get Category Summary
=============================== */
export const getCategorySummary = async (req, res) => {
  try {
    const userIdStr = req.user._id.toString();

    // Use lean() for faster read
    const words = await Word.find().lean();

    if (!words.length)
      return res
        .status(200)
        .json({ message: "No words added yet", categories: [] });

    const categoryGroups = {};

    words.forEach((word) => {
      const cat = word.category || "UNCATEGORIZED";
      if (!categoryGroups[cat])
        categoryGroups[cat] = {
          category: cat,
          totalWords: 0,
          completedWords: 0,
          words: [],
        };

      categoryGroups[cat].totalWords++;
      if (word.completedBy?.some((id) => id.toString() === userIdStr))
        categoryGroups[cat].completedWords++;
      categoryGroups[cat].words.push(word);
    });

    res
      .status(200)
      .json({ success: true, categories: Object.values(categoryGroups) });
  } catch (err) {
    console.error("Category Summary Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   3️⃣ Get All Words by Category
=============================== */
export const getAllWordsInParts = async (req, res) => {
  try {
    const { categoryName } = req.params;
    if (!categoryName)
      return res
        .status(400)
        .json({ success: false, message: "Category is required" });

    const words = await Word.find({ category: categoryName }).lean();
    if (!words.length)
      return res.status(200).json({
        success: false,
        message: `No words found for category: ${categoryName}`,
        words: [],
      });

    res.status(200).json({
      success: true,
      category: categoryName,
      count: words.length,
      words,
    });
  } catch (err) {
    console.error("Get Category Words Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ===============================
   4️⃣ Toggle Word Completion
=============================== */
export const markWordCompletedCategory = async (req, res) => {
  try {
    const { wordId } = req.params;
    const userId = req.user?._id;
    if (!userId)
      return res.status(401).json({ success: false, msg: "Unauthorized" });

    const word = await Word.findById(wordId);
    if (!word)
      return res.status(404).json({ success: false, msg: "Word not found" });

    if (!Array.isArray(word.completedBy)) word.completedBy = [];

    const already = word.completedBy.some(
      (id) => id.toString() === userId.toString()
    );
    if (already)
      word.completedBy = word.completedBy.filter(
        (id) => id.toString() !== userId.toString()
      );
    else word.completedBy.push(userId);

    await word.save();
    res.json({
      success: true,
      isCompleted: !already,
      word,
      msg: "Word updated successfully",
    });
  } catch (err) {
    console.error("Toggle error:", err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

/* ===============================
   5️⃣ Get Word Completion Status
=============================== */
export const getWordCompletedCategory = async (req, res) => {
  try {
    const { wordId } = req.params;
    const userId = req.user?._id;
    if (!userId)
      return res.status(401).json({ success: false, msg: "Unauthorized" });

    const word = await Word.findById(wordId).lean();
    if (!word)
      return res.status(404).json({ success: false, msg: "Word not found" });

    const isCompleted =
      word.completedBy?.some((id) => id.toString() === userId.toString()) ||
      false;

    res.json({
      success: true,
      isCompleted,
      word,
      msg: "Word completion status fetched successfully",
    });
  } catch (err) {
    console.error("Get completion error:", err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

/* ===============================
   6️⃣ Reset User Learning Progress (All Words)
=============================== */
export const resetLearningProgress = async (req, res) => {
  try {
    const userId = req.user._id
    const { hskLevel } = req.params; // <-- get HSK-1 / HSK-2 etc

    if (!hskLevel) {
      return res.status(400).json({
        success: false,
        message: "HSK level is required.",
      });
    }

    await Word.updateMany(
      { hskLevel, completedBy: userId }, // <-- Filter by HSK level
      { $pull: { completedBy: userId } } // <-- Remove user from completed list
    );

    res.status(200).json({
      success: true,
      message: `${hskLevel} progress reset successfully.`,
    });
  } catch (err) {
    console.error("Reset Progress Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to reset progress.",
      error: err.message,
    });
  }
};

/* ===============================
   7️⃣ Reset Category Progress (Specific Words)
=============================== */
export const resetCategoryProgress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { wordIds } = req.body;
    if (!Array.isArray(wordIds) || wordIds.length === 0)
      return res.status(400).json({ message: "No word IDs provided" });

    const objectIds = wordIds.map((id) => new mongoose.Types.ObjectId(id));
    const result = await Word.updateMany(
      { _id: { $in: objectIds } },
      { $pull: { completedBy: userId } }
    );

    res
      .status(200)
      .json({ success: true, modifiedCount: result.modifiedCount });
  } catch (err) {
    console.error("Reset category error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
