import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import DisplayWord from "./DisplayWord";
import { IoMdArrowDown, IoMdArrowUp } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { Host } from "../api/Host";

export default function HSKSection() {
  const location = useLocation();
  const [wordDisplay, setWordDisplay] = useState(false);
  const [selectedPartWords, setSelectedPartWords] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const pathWithoutSlash = location.pathname.startsWith("/")
    ? location.pathname.substring(1)
    : location.pathname;

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

  // ✅ React Query for superfast fetch
  const {
    data: words = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["hsk-words", pathWithoutSlash],
    queryFn: async () => {
      if (!pathWithoutSlash) return [];
      const res = await axios.get(
        `${Host.host}api/words/getword/${pathWithoutSlash}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return (res.data.words || []).map((w) => ({
        ...w,
        isCompleted: w.completedBy.includes(userId),
      }));
    },
    enabled: !!pathWithoutSlash,
    staleTime: 5 * 60 * 1000, // cache 5 min
    refetchOnWindowFocus: false,
  });

  // === CATEGORY MAP ===
  const PART_SIZE = 5;
  const categories = [];
  words.forEach((word) => {
    const catName = word.category || "UNCATEGORIZED";
    let cat = categories.find((c) => c.category === catName.toUpperCase());
    if (!cat) {
      cat = { category: catName.toUpperCase(), words: [], parts: [] };
      categories.push(cat);
    }
    cat.words.push(word);
  });

  categories.forEach((cat) => {
    cat.parts = [];
    for (let i = 0; i < cat.words.length; i += PART_SIZE) {
      cat.parts.push(cat.words.slice(i, i + PART_SIZE));
    }
  });

  // === TOP HSK PROGRESS BAR ===
  const topHSKLevel = words.find((w) => w.hskLevel)?.hskLevel || "HSK";
  const totalWords = words.length;
  const totalCompleted = words.filter((w) => w.isCompleted).length;
  const globalPercent =
    totalWords > 0 ? Math.round((totalCompleted / totalWords) * 100) : 0;

  const toggleWordComplete = async (wordId) => {
    try {
      await axios.post(
        `${Host.host}api/words/toggle/${wordId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const resetCategory = async (catData) => {
    try {
      const wordIds = catData.words.map((w) => w._id);
      await axios.put(
        `${Host.host}words/reset-category`,
        { wordIds },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      refetch();
    } catch (err) {
      console.error(err);
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

  if (isLoading) {
    return (
      <p className="text-gray-400 text-center mt-10 text-xl">Loading...</p>
    );
  }

  return (
    <div className="my-3 responsive_class set_width mb-20">
      {wordDisplay && (
        <div className="bg-[#1f1e1e] fixed top-0 left-0 h-screen w-full z-50">
          <DisplayWord
            words={selectedPartWords}
            wordDisplay={wordDisplay}
            setWordDisplay={setWordDisplay}
            fetchWords={refetch}
            from="hskPart"
            toggleWordComplete={toggleWordComplete}
          />
        </div>
      )}

      {/* ===== TOP HSK PROGRESS BAR ===== */}
      <div className="mb-2 p-4 bg-[rgb(26,41,49)] rounded-lg shadow flex items-center gap-4">
        <p className="text-gray-300 font-semibold">{topHSKLevel}</p>
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
