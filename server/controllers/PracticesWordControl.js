import Word from "../models/PracticesWord.js";

// Add new word
export const PracticesWord = async (req, res) => {
  try {
    const { chinese, pinyin, english, sentences } = req.body;
    const userId = req.user.id;

    // Check if this exact word already exists for this user
    const existingWord = await Word.findOne({
      userId,
      chinese: chinese.trim(),
      english: english.trim(),
    });

    // --------- TOGGLE LOGIC ---------
    if (existingWord) {
      // If exists → remove it (toggle off)
      await Word.findByIdAndDelete(existingWord._id);

      return res.status(200).json({
        success: true,
        toggled: "removed",
        message: "Word removed successfully",
        wordId: existingWord._id,
      });
    }

    // --------- ADD NEW WORD (toggle on) ---------
    const newWord = new Word({
      chinese: chinese.trim(),
      pinyin: pinyin.trim(),
      english: english.trim(),
      sentences,
      userId,
    });

    await newWord.save();

    return res.status(201).json({
      success: true,
      toggled: "added",
      message: "Word added successfully",
      word: newWord,
    });
  } catch (error) {
    console.error("PracticesWord Toggle Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
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

export const checkPracticesWord = async (req, res) => {
  try {
    const userId = req.user._id;
    const { chinese } = req.query; // receive chinese word

    if (!chinese) {
      return res.status(400).json({ message: "Chinese word required" });
    }

    // Find if this word is already saved by the user
    const exists = await Word.findOne({
      userId,
      chinese: chinese.trim(), // check by chinese field
    });

    return res.status(200).json({
      exists: !!exists, // true if word exists, false otherwise
      word: exists || null,
    });
  } catch (error) {
    console.error("Check Word Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
