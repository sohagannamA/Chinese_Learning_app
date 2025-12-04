import express from "express";
import {
  addWord,
  getAllWord,
  getWordCompleted,
  getWordsByUser,
  lastSevenDays,
  markWordCompleted,
  saveTime,
} from "../controllers/wordController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getAllWordsInParts,
  getCategorySummary,
  getHskSummary,
  getWordCompletedCategory,
  markWordCompletedCategory,
  resetCategoryProgress,
  resetLearningProgress,
} from "../controllers/getHskSummary.js";
import {
  checkPracticesWord,
  deleteAllPracticeWords,
  getTotalPracticeWords,
  PracticesWord,
} from "../controllers/PracticesWordControl.js";

const router = express.Router();

router.post("/add", authMiddleware, addWord);
router.get("/hsk-summary", authMiddleware, getHskSummary);
router.get("/getword/:level", authMiddleware, getWordsByUser);
router.get("/getall", authMiddleware, getAllWord);

router.put("/reset-progress", authMiddleware, resetLearningProgress);
router.put("/reset-category", authMiddleware, resetCategoryProgress);

router.post("/toggle/:wordId", authMiddleware, markWordCompleted);
router.post(
  "/togglecategory/:wordId",
  authMiddleware,
  markWordCompletedCategory
);

router.get("/toggle/:wordId", authMiddleware, getWordCompleted);
router.get("/togglecategory/:wordId", authMiddleware, getWordCompletedCategory);

router.get("/category-summary", authMiddleware, getCategorySummary);
router.get(
  "/get-category-word/:categoryName",
  authMiddleware,
  getAllWordsInParts
);

router.post("/addPracticesWord", authMiddleware, PracticesWord);
router.get("/total", authMiddleware, getTotalPracticeWords);
router.get("/check",authMiddleware,checkPracticesWord)
router.delete(
  "/deleteAllPracticeWords",
  authMiddleware,
  deleteAllPracticeWords
);

router.post("/save", authMiddleware, saveTime);

// Get last 7 days usage
router.get("/7days", authMiddleware, lastSevenDays);

export default router;
