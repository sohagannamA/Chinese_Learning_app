import Word from "../models/Word.js";
import Category from "../models/Category.js";

// Add new word
export const addWord = async (req, res) => {
  try {
    const { chinese, pinyin, english, hskLevel, category, sentences } =
      req.body;
    console.log(category);

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Check if word already exists for this user with the same HSK level
    const existingWord = await Word.findOne({
      chinese: chinese.trim(),
      english: english.trim(),
      hskLevel,
      userId: req.user._id,
    });

    if (existingWord) {
      return res.status(400).json({
        message: "This word already exists for the selected HSK level!",
      });
    }

    const newWord = new Word({
      chinese: chinese.trim(),
      pinyin: pinyin.trim(),
      english: english.trim(),
      hskLevel,
      category,
      sentences,
      userId: req.user._id, // attach logged-in userId
    });

    await newWord.save();

    res.status(201).json({ message: "Word added successfully", word: newWord });
  } catch (error) {
    console.error("Add Word Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getWordsByUser = async (req, res) => {
  try {
    const words = await Word.find();

    // If no words found
    if (!words || words.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No words found for this user",
        words: [],
      });
    }

    // If words found
    res.status(200).json({
      success: true,
      count: words.length,
      words,
    });
  } catch (error) {
    console.error("Get Words Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const markWordCompleted = async (req, res) => {
  try {
    const { wordId } = req.params;
    const userId = req.user._id;

    const word = await Word.findById(wordId);
    if (!word) {
      return res.status(404).json({ success: false, msg: "Word not found" });
    }

    const already = word.completedBy.includes(userId);

    if (already) {
      // remove user
      word.completedBy = word.completedBy.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      // add user
      word.completedBy.push(userId);
    }

    await word.save();

    const isCompleted = !already;

    res.json({
      success: true,
      isCompleted,
      word, // 👈 return full updated word
      msg: "Word updated success",
    });
  } catch (err) {
    console.error("Toggle error:", err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

export const getWordCompleted = async (req, res) => {
  try {
    const { wordId } = req.params;
    const userId = req.user._id;

    const word = await Word.findById(wordId);
    if (!word) {
      return res.status(404).json({ success: false, msg: "Word not found" });
    }

    const isCompleted = word.completedBy.includes(userId);

    res.json({
      success: true,
      isCompleted,
      word, // 👈 also return full word here
    });
  } catch (err) {
    console.error("Get completion error:", err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

export const getAllWord = async (req, res) => {
  try {
    const userId = req.user._id;
    // 1️⃣ Fetch Word & Category data for this user
    const wordData = await Word.find().lean();
    const categoryData = await Category.find().lean();

    // 2️⃣ Merge both arrays into one
    const allWords = [...wordData, ...categoryData];

    // 3️⃣ Check if merged array is empty
    if (allWords.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No data found for this user",
      });
    }

    // 4️⃣ Return merged array
    return res.status(200).json({
      success: true,
      data: allWords,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// User Time
import UserTime from "../models/UserTime.js";

export const saveTime = async (req, res) => {
  try {
    const { userId, duration } = req.body;

    const today = new Date().toISOString().split("T")[0];

    let record = await UserTime.findOne({ userId, date: today });

    if (!record) {
      record = new UserTime({
        userId,
        date: today,
        duration,
      });
    } else {
      record.duration += duration; // Add time
    }

    await record.save();

    res.json({ success: true, message: "Time saved" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const lastSevenDays = async (req, res) => {
  try {
    const { userId } = req.query;

    const today = new Date();
    const past7 = new Date(today);
    past7.setDate(today.getDate() - 6);

    const records = await UserTime.find({
      userId,
      date: {
        $gte: past7.toISOString().split("T")[0],
        $lte: today.toISOString().split("T")[0],
      },
    });

    const total = records.reduce((sum, r) => sum + r.duration, 0);

    res.json({
      success: true,
      data: records,
      totalHours: (total / 3600).toFixed(2),
      averageHours: (total / 7 / 3600).toFixed(2),
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};
