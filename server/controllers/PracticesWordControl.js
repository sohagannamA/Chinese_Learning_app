import Word from "../models/PracticesWord.js";

// Add new word
export const PracticesWord = async (req, res) => {
  try {
    const { chinese, pinyin, english, sentences } = req.body;
    const userId = req.user.id; // assuming auth middleware sets req.user

    // Check for duplicate word (same Chinese + English) for this user
    const duplicate = await Word.findOne({
      userId,
      chinese: chinese.trim(),
      english: english.trim(),
    });

    if (duplicate) {
      return res
        .status(400)
        .json({ success: false, message: "Duplicate word not allowed." });
    }

    // Create and save new word
    const newWord = new Word({
      chinese: chinese.trim(),
      pinyin: pinyin.trim(),
      english: english.trim(),
      sentences,
      userId,
    });

    await newWord.save();

    res.status(201).json({
      success: true,
      message: "Word added successfully",
      word: newWord,
    });
  } catch (error) {
    console.error("Add Word Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getTotalPracticeWords = async (req, res) => {
  try {
    const userId = req.user.id;

    // Total count
    const count = await Word.countDocuments({ userId });

    // All words for this user
    const words = await Word.find({ userId }).sort({ createdAt: -1 });

    res.json({ totalWords: count, words });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteAllPracticeWords = async (req, res) => {
  try {
    const userId = req.user.id;

    await Word.deleteMany({ userId });

    res.json({ message: "All practice words deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
