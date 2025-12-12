import Word from "../models/Word.js";
import Category from "../models/Category.js";
import UserTime from "../models/UserTime.js";

/* ============================
   1️⃣ Add New Word (Optimized)
=============================*/
export const addWord = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { chinese, pinyin, english, hskLevel, category, sentences } =
      req.body;

    // Fast Trim
    const data = {
      chinese: chinese?.trim(),
      pinyin: pinyin?.trim(),
      english: english?.trim(),
    };

    // Check existing (faster because lean())
    const existingWord = await Word.findOne({
      chinese: data.chinese,
      english: data.english,
      hskLevel,
      userId: req.user._id,
    }).lean();

    if (existingWord) {
      return res.status(400).json({
        message: "This word already exists for the selected HSK level!",
      });
    }

    const newWord = await Word.create({
      ...data,
      hskLevel,
      category,
      sentences,
      userId: req.user._id,
    });

    res.status(201).json({
      message: "Word added successfully",
      word: newWord,
    });
  } catch (error) {
    console.error("Add Word Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================
   2️⃣ Get Words by User (Optimized)
=============================*/
export const getWordsByUser = async (req, res) => {
  try {
    const { level } = req.params;

    const query = level ? { hskLevel: level } : {};

    const words = await Word.find(query).lean();

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

/* ============================
   3️⃣ Mark Word Completed Toggle
=============================*/
export const markWordCompleted = async (req, res) => {
  try {
    const { wordId } = req.params;
    const userId = req.user._id;

    const word = await Word.findById(wordId);
    if (!word) return res.status(404).json({ msg: "Word not found" });

    const already = word.completedBy.includes(userId);

    if (already) {
      word.completedBy = word.completedBy.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      word.completedBy.push(userId);
    }

    await word.save();

    res.json({
      success: true,
      isCompleted: !already,
      word,
      msg: "Word updated success",
    });
  } catch (err) {
    console.error("Toggle error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

/* ============================
   4️⃣ Get completion status
=============================*/
export const getWordCompleted = async (req, res) => {
  try {
    const { wordId } = req.params;
    const userId = req.user._id;

    const word = await Word.findById(wordId).lean();
    if (!word) return res.status(404).json({ msg: "Word not found" });

    const isCompleted = word.completedBy.includes(userId);

    res.json({
      success: true,
      isCompleted,
      word,
    });
  } catch (err) {
    console.error("Get completion error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

/* ============================
   5️⃣ Get All Words + Categories
=============================*/
export const getAllWord = async (req, res) => {
  try {
    const [wordData, categoryData] = await Promise.all([
      Word.find().lean(),
      Category.find().lean(),
    ]);

    const allWords = [...wordData, ...categoryData];

    res.status(200).json({
      success: true,
      data: allWords,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================
   6️⃣ Save User Time
=============================*/
export const saveTime = async (req, res) => {
  try {
    const { userId, duration } = req.body;
    const today = new Date().toISOString().split("T")[0];

    const record = await UserTime.findOneAndUpdate(
      { userId, date: today },
      { $inc: { duration } },
      { new: true, upsert: true }
    );

    res.json({ success: true, message: "Time saved", record });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================
   7️⃣ Last 7 Days Time
=============================*/
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
    }).lean();

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
