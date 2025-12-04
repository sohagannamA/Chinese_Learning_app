import React, { useEffect, useState } from "react";
import axios from "axios";
import DisplayWord from "./DisplayWord";
import { IoMdArrowDown, IoMdArrowUp } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { Host } from "../api/Host";
import { useLocation } from "react-router-dom";

export default function HSKSection() {
  const [wordDisplay, setWordDisplay] = useState(false);
  const [selectedPartWords, setSelectedPartWords] = useState([]);
  const [categories, setCategories] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [topHSKLevel, setTopHSKLevel] = useState("");
  const [totalWords, setTotalWords] = useState(0);
  const [totalCompleted, setTotalCompleted] = useState(0);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const pathWithoutSlash = location.pathname.startsWith("/")
    ? location.pathname.substring(1)
    : location.pathname;

  const fetchWords = async () => {
    try {
      const res = await axios.get(`${Host.host}api/words/getword/${pathWithoutSlash}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const words = res.data.words || [];


      if (!words.length) {
        setCategories([]);
        setTopHSKLevel("");
        setTotalWords(0);
        setTotalCompleted(0);
        return;
      }

      // Mark completion per user
      const wordsWithCompletion = words.map((w) => ({
        ...w,
        isCompleted: w.completedBy.includes(userId),
      }));

      // === CATEGORY SECTIONS (left/right) ===
      const PART_SIZE = 5;
      const categoryMap = {};
      wordsWithCompletion.forEach((word) => {
        const category = word.category || "UNCATEGORIZED";
        if (!categoryMap[category]) categoryMap[category] = [];
        categoryMap[category].push(word);
      });

      const categoryData = Object.keys(categoryMap).map((cat) => {
        const catWords = categoryMap[cat];
        const parts = [];
        for (let i = 0; i < catWords.length; i += PART_SIZE) {
          parts.push(catWords.slice(i, i + PART_SIZE));
        }
        return {
          category: cat.toUpperCase(),
          words: catWords,
          parts,
        };
      });

      setCategories(categoryData);

      // === TOP HSK PROGRESS BAR ===
      const firstHSK = wordsWithCompletion.find((w) => w.hskLevel);
      if (firstHSK) setTopHSKLevel(firstHSK.hskLevel);

      const total = wordsWithCompletion.length;
      const completed = wordsWithCompletion.filter((w) => w.isCompleted).length;
      setTotalWords(total);
      setTotalCompleted(completed);
    } catch (err) {
      console.error("Fetch words error:", err);
    }
  };

  useEffect(() => {
    if (token) fetchWords();
  }, [token]);

  const openPart = (partWords) => {
    setSelectedPartWords(partWords);
    document.body.style.overflow = "hidden";
    setWordDisplay(true);
  };

  const getCompleted = (partWords) =>
    partWords.filter((w) => w.isCompleted).length;

  const toggleCategory = (category) => {
    setExpandedCategory((prev) => (prev === category ? null : category));
  };

  const toggleWordComplete = async (wordId) => {
    try {
      const url = `${Host.host}api/words/toggle/${wordId}`;
      await axios.post(
        url,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchWords();
    } catch (err) {
      console.error("Toggle word error:", err);
    }
  };

  // --- RESET CATEGORY ---
  const resetCategory = async (catData) => {
    try {
      const wordIds = catData.words.map((w) => w._id);
      await axios.put(
        `${Host.host}words/reset-category`,
        { wordIds },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchWords();
    } catch (err) {
      console.error("Reset category error:", err);
    }
  };

  const renderCategoryHeader = (catData, completedWords, totalWords) => {
    const isExpanded = expandedCategory === catData.category;
    return (
      <div
        className={`px-4 py-2 ${
          completedWords === totalWords ? "bg-[#084c20]" : "bg-[rgb(26,41,49)]"
        } text-gray-300 text-[15px] rounded flex justify-between items-center cursor-pointer hover:bg-[rgb(35,53,64)]`}
      >
        <p
          className="font-semibold flex-1"
          onClick={() => toggleCategory(catData.category)}
        >
          {catData.category}
        </p>
        <div className="flex items-center gap-2">
          <p className="bg-[#0a4540] w-[60px] text-[15px] text-center py-1 text-gray-300 rounded-2xl">
            {completedWords}/{totalWords}
          </p>
          <div className="flex items-center space-x-2">
            {/* Expand/Collapse */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                toggleCategory(catData.category);
              }}
              className="flex items-center justify-center h-[30px] w-[30px] border border-gray-500 rounded-full p-1"
            >
              {isExpanded ? (
                <IoMdArrowUp size={16} className="text-gray-300" />
              ) : (
                <IoMdArrowDown size={16} className="text-gray-300" />
              )}
            </div>

            {/* Delete/Reset */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                resetCategory(catData);
              }}
              className="flex items-center justify-center h-[30px] w-[30px] border border-gray-500 rounded-full p-1"
            >
              <MdDelete size={16} className="text-[#ef5c5c]" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAllWords = (catData) => {
    const completedCount = catData.words.filter((w) => w.isCompleted).length;
    const total = catData.words.length;
    return (
      <div
        onClick={() => openPart(catData.words)}
        className={`${
          completedCount === total ? "bg-[#06742d]" : "bg-[#333333]"
        } px-4 py-1 rounded flex items-center cursor-pointer hover:bg-[#131313] justify-between`}
      >
        <p className="text-[16px] text-gray-200">ALL WORDS</p>
        <p className="bg-gray-600 px-3 py-1 text-gray-300 rounded-2xl">
          {completedCount}/{total}
        </p>
      </div>
    );
  };

  const renderParts = (catData) =>
    catData.parts.map((partWords, index) => {
      const completed = getCompleted(partWords);
      return (
        <div
          key={index}
          onClick={() => openPart(partWords)}
          className={`${
            completed === partWords.length ? "bg-[#06742d]" : "bg-[#333333]"
          } px-4 py-2 rounded flex items-center cursor-pointer hover:bg-[#131313] justify-between`}
        >
          <p className="text-[16px] text-gray-200">PART-{index + 1}</p>
          <p className="bg-gray-600 px-3 py-1 text-gray-300 rounded-2xl">
            {completed}/{partWords.length}
          </p>
        </div>
      );
    });

  const globalPercent =
    totalWords > 0 ? Math.round((totalCompleted / totalWords) * 100) : 0;

  return (
    <div className="my-3 responsive_class set_width mb-20">
      {wordDisplay && (
        <div className="bg-[#1f1e1e] fixed top-0 left-0 h-screen w-full z-50">
          <DisplayWord
            words={selectedPartWords}
            wordDisplay={wordDisplay}
            setWordDisplay={setWordDisplay}
            fetchWords={fetchWords}
            from="hskPart"
            toggleWordComplete={toggleWordComplete}
          />
        </div>
      )}

      {/* ===== TOP HSK PROGRESS BAR ===== */}
      <div className="mb-2 p-4 bg-[rgb(26,41,49)] rounded-lg shadow flex items-center gap-4">
        <p className="text-gray-300 font-semibold">{topHSKLevel || "HSK"}</p>
        <div className="flex-1 bg-gray-500 h-2 rounded">
          <div
            className="h-full bg-green-500 rounded transition-all duration-500"
            style={{ width: `${globalPercent}%` }}
          ></div>
        </div>
        <p className="text-gray-300 whitespace-nowrap">
          {totalCompleted}/{totalWords}
        </p>
      </div>

      {/* ===== CATEGORY SECTIONS ===== */}
      <div className="grid md:grid-cols-2 w-full gap-2">
        <section className="space-y-2">
          {categories
            .filter((_, i) => i % 2 === 0)
            .map((catData, catIndex) => {
              const totalWordsCat = catData.words.length;
              const completedWordsCat = catData.words.filter(
                (w) => w.isCompleted
              ).length;
              return (
                <div key={catIndex} className="space-y-1">
                  {renderCategoryHeader(
                    catData,
                    completedWordsCat,
                    totalWordsCat
                  )}
                  {expandedCategory === catData.category && (
                    <>
                      {renderAllWords(catData)}
                      {renderParts(catData)}
                    </>
                  )}
                </div>
              );
            })}
        </section>

        <section className="space-y-2">
          {categories
            .filter((_, i) => i % 2 === 1)
            .map((catData, catIndex) => {
              const totalWordsCat = catData.words.length;
              const completedWordsCat = catData.words.filter(
                (w) => w.isCompleted
              ).length;
              return (
                <div key={catIndex} className="space-y-1">
                  {renderCategoryHeader(
                    catData,
                    completedWordsCat,
                    totalWordsCat
                  )}
                  {expandedCategory === catData.category && (
                    <>
                      {renderAllWords(catData)}
                      {renderParts(catData)}
                    </>
                  )}
                </div>
              );
            })}
        </section>
      </div>
    </div>
  );
}
