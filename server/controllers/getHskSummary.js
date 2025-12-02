import mongoose from "mongoose";
import Word from "../models/Word.js";
import Category from "../models/Category.js";

export const getHskSummary = async (req, res) => {
  try {
    const userId = req.user._id.toString(); // convert to string

    // Fetch all words
    const words = await Word.find();

    if (words.length === 0) {
      return res.status(200).json({
        message: "No words added yet",
        hskLevels: [],
      });
    }

    // Group by HSK level
    const hskGroups = {};

    words.forEach((word) => {
      if (!hskGroups[word.hskLevel]) {
        hskGroups[word.hskLevel] = {
          hskLevel: word.hskLevel,
          totalWords: 0,
          completedWords: 0,
          words: [], // store word details
        };
      }

      hskGroups[word.hskLevel].totalWords++;

      // ✅ Correct ObjectId comparison
      if (
        word.completedBy &&
        word.completedBy.some((id) => id.toString() === userId)
      ) {
        hskGroups[word.hskLevel].completedWords++;
      }

      // Add word details if needed
      hskGroups[word.hskLevel].words.push(word);
    });

    // Convert object to array
    const result = Object.values(hskGroups);
    console.log(result);

    res.status(200).json({
      success: true,
      hskLevels: result,
    });
  } catch (error) {
    console.error("HSK Summary Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getCategorySummary = async (req, res) => {
  try {
    const userId = req.user._id.toString(); // convert to string

    // Fetch all words
    const words = await Category.find(); // Use Word model, not Category, to get word details

    if (words.length === 0) {
      return res.status(200).json({
        message: "No words added yet",
        categories: [],
      });
    }

    // Group by category
    const categoryGroups = {};

    words.forEach((word) => {
      const category = word.category || "UNCATEGORIZED";

      if (!categoryGroups[category]) {
        categoryGroups[category] = {
          category: category,
          totalWords: 0,
          completedWords: 0,
          words: [], // store word details
        };
      }

      categoryGroups[category].totalWords++;

      // ✅ Check if this user has completed the word
      if (
        word.completedBy &&
        word.completedBy.some((id) => id.toString() === userId)
      ) {
        categoryGroups[category].completedWords++;
      }

      categoryGroups[category].words.push(word);
    });

    // Convert object → array
    const result = Object.values(categoryGroups);

    res.status(200).json({
      success: true,
      categories: result,
    });
  } catch (error) {
    console.error("Category Summary Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllWordsInParts = async (req, res) => {
  try {
    const { categoryName } = req.params; // category from path

    if (!categoryName) {
      return res.status(400).json({
        success: false,
        message: "Category is required",
      });
    }

    // Fetch words for this user and category
    const words = await Category.find({ category: categoryName });

    if (!words || words.length === 0) {
      return res.status(200).json({
        success: false,
        message: `No words found for category: ${categoryName}`,
        words: [],
      });
    }

    res.status(200).json({
      success: true,
      category: categoryName,
      count: words.length,
      words,
    });
  } catch (error) {
    console.error("Get Category Words Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const markWordCompletedCategory = async (req, res) => {
  try {
    const { wordId } = req.params;
    const userId = req.user?._id; // optional chaining for safety
    if (!userId)
      return res.status(401).json({ success: false, msg: "Unauthorized" });

    const word = await Category.findById(wordId);
    if (!word) {
      return res.status(404).json({ success: false, msg: "Word not found" });
    }

    // Ensure completedBy is always an array
    if (!Array.isArray(word.completedBy)) word.completedBy = [];

    const alreadyCompleted = word.completedBy.some(
      (id) => id.toString() === userId.toString()
    );

    if (alreadyCompleted) {
      word.completedBy = word.completedBy.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      word.completedBy.push(userId);
    }

    await word.save();

    res.json({
      success: true,
      isCompleted: !alreadyCompleted,
      word, // full updated word
      msg: "Word updated successfully",
    });
  } catch (err) {
    console.error("Toggle error:", err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

export const getWordCompletedCategory = async (req, res) => {
  try {
    const { wordId } = req.params;
    const userId = req.user?._id; // logged-in user

    if (!userId) {
      return res.status(401).json({ success: false, msg: "Unauthorized" });
    }

    const word = await Category.findById(wordId);
    if (!word) {
      return res.status(404).json({ success: false, msg: "Word not found" });
    }

    // Ensure completedBy exists
    if (!Array.isArray(word.completedBy)) word.completedBy = [];

    const isCompleted = word.completedBy.some(
      (id) => id.toString() === userId.toString()
    );

    res.json({
      success: true,
      isCompleted,
      word, // full word object
      msg: "Word completion status fetched successfully",
    });
  } catch (err) {
    console.error("Get completion error:", err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};





export const resetLearningProgress = async (req, res) => {
  try {
    // JWT থেকে আসা userId (string)
    const userIdStr = req.user._id;

    // ObjectId type হিসেবে convert করুন
    const userId = new mongoose.Types.ObjectId(userIdStr);

    // সমস্ত word থেকে এই userId remove করুন completedBy array থেকে
    const updatedWord = await Word.updateMany(
      { completedBy: userId }, // match only words that contain user
      { $pull: { completedBy: userId } }
    );

    console.log("Update progressData", updatedWord);

    res.status(200).json({
      success: true,
      message: "Learning progress reset successfully.",
    });
  } catch (error) {
    console.error("Reset Progress Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reset progress.",
      error: error.message,
    });
  }
};

export const resetCategoryProgress = async (req, res) => {
  try {
    const user = req.user;
    if (!user?._id)
      return res.status(401).json({ message: "User not authenticated" });

    const userId = user._id;
    const { wordIds } = req.body;

    if (!wordIds || !Array.isArray(wordIds) || wordIds.length === 0) {
      return res.status(400).json({ message: "No word IDs provided" });
    }

    // Correctly convert IDs
    const objectIds = wordIds.map((id) => new mongoose.Types.ObjectId(id));

    const result = await Word.updateMany(
      { _id: { $in: objectIds } },
      { $pull: { completedBy: userId } }
    );

    res.status(200).json({
      success: true,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Reset category error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
