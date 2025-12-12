import Word from "../models/PracticesWord.js";

/* ================================
   1️⃣ Toggle Practice Word (Fast)
================================= */
export const PracticesWord = async (req, res) => {
  try {
    const userId = req.user.id;
    const { chinese, pinyin, english, sentences } = req.body;

    const chineseTrim = chinese.trim();
    const englishTrim = english.trim();

    // Fast check using lean()
    const existing = await Word.findOne({
      userId,
      chinese: chineseTrim,
      english: englishTrim,
    }).lean();

    // --------- TOGGLE OFF (Delete) ---------
    if (existing) {
      await Word.deleteOne({ _id: existing._id });

      return res.status(200).json({
        success: true,
        toggled: "removed",
        message: "Word removed successfully",
        wordId: existing._id,
      });
    }

    // --------- TOGGLE ON (Create) ---------
    const newWord = await Word.create({
      chinese: chineseTrim,
      pinyin: pinyin.trim(),
      english: englishTrim,
      sentences,
      userId,
    });

    return res.status(201).json({
      success: true,
      toggled: "added",
      message: "Word added successfully",
      word: newWord,
    });
  } catch (error) {
    console.error("Practice Word Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ========================================
   2️⃣ Total + All Practice Words (Fast)
========================================= */
export const getTotalPracticeWords = async (req, res) => {
  try {
    const userId = req.user.id;

    const [count, words] = await Promise.all([
      Word.countDocuments({ userId }),
      Word.find({ userId }).sort({ createdAt: -1 }).lean(),
    ]);

    res.json({ totalWords: count, words });
  } catch (error) {
    console.error("Get Practice Words Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ========================================
   3️⃣ Delete All Practice Words (Fast)
========================================= */
export const deleteAllPracticeWords = async (req, res) => {
  try {
    const userId = req.user.id;

    await Word.deleteMany({ userId });

    res.json({ message: "All practice words deleted successfully" });
  } catch (error) {
    console.error("Delete Practice Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ========================================
   4️⃣ Check if a Practice Word Exists
========================================= */
export const checkPracticesWord = async (req, res) => {
  try {
    const userId = req.user.id;
    const { chinese } = req.query;

    if (!chinese) {
      return res.status(400).json({ message: "Chinese word required" });
    }

    const exists = await Word.findOne({
      userId,
      chinese: chinese.trim(),
    }).lean();

    res.status(200).json({
      exists: !!exists,
      word: exists || null,
    });
  } catch (error) {
    console.error("Check Practice Word Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
