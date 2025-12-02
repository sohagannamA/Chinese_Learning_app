import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import DisplayWord from "./DisplayWord";
import { Host } from "../api/Host";

export default function CategorySection() {
  const location = useLocation();
  const [wordDisplay, setWordDisplay] = useState(false);
  const [selectedPartWords, setSelectedPartWords] = useState([]);
  const [parts, setParts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [totalCategoryWords, setTotalCategoryWords] = useState(0);
  const [totalCategoryCompleted, setTotalCategoryCompleted] = useState(0);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  // Fetch words by category
  const fetchCategoryWords = async (category) => {
    try {
      const res = await axios.get(
        `${Host.host}api/words/get-category-word/${category}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const words = res.data.words || [];

      if (!words.length) {
        setParts([]);
        setTotalCategoryWords(0);
        setTotalCategoryCompleted(0);
        return;
      }

      // Mark completion per user
      const wordsWithCompletion = words.map((w) => ({
        ...w,
        isCompleted: w.completedBy?.some((id) => id.toString() === userId),
      }));

      const PART_SIZE = 5;
      const allParts = [];

      // ALL words as first part
      allParts.push(wordsWithCompletion);

      // Split into chunks
      for (let i = 0; i < wordsWithCompletion.length; i += PART_SIZE) {
        allParts.push(wordsWithCompletion.slice(i, i + PART_SIZE));
      }

      setParts(allParts);

      // Set counts
      setTotalCategoryWords(wordsWithCompletion.length);
      setTotalCategoryCompleted(
        wordsWithCompletion.filter((w) => w.isCompleted).length
      );
    } catch (err) {
      console.error("Category fetch error:", err);
      setParts([]);
      setTotalCategoryWords(0);
      setTotalCategoryCompleted(0);
    }
  };

  useEffect(() => {
    // Get category name from path
    const pathParts = location.pathname.split("/");
    const categoryFromPath = pathParts[pathParts.length - 1];
    if (categoryFromPath) {
      setCategoryName(categoryFromPath.toUpperCase());
      fetchCategoryWords(categoryFromPath);
    }
  }, [location]);

  const openPart = (words) => {
    setSelectedPartWords(words);
    setWordDisplay(true);
  };

  const getCompleted = (words) => {
    return words.filter((w) => w.isCompleted === true).length;
  };

  const progressPercent =
    totalCategoryWords > 0
      ? Math.round((totalCategoryCompleted / totalCategoryWords) * 100)
      : 0;

  return (
    <div className="my-10 responsive_class">
      {wordDisplay && (
        <div className="bg-[#1f1e1e] fixed top-0 left-0 h-screen w-full z-50">
          <DisplayWord
            words={selectedPartWords}
            wordDisplay={wordDisplay}
            setWordDisplay={setWordDisplay}
            fetchWords={() => fetchCategoryWords(categoryName)}
            from="category"
          />
        </div>
      )}

      {/* ===== CATEGORY PROGRESS BAR ===== */}
      <div className="mb-6 p-4 bg-[rgb(26,41,49)] rounded-lg shadow flex items-center gap-4">
        <p className="text-gray-200 font-semibold">{categoryName}</p>
        <div className="flex-1 bg-gray-500 h-2 rounded">
          <div
            className="h-full bg-green-500 rounded transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        <p className="text-gray-300 whitespace-nowrap">
          {totalCategoryCompleted}/{totalCategoryWords}
        </p>
      </div>

      {/* ===== CATEGORY PARTS COLUMNS ===== */}
      <div className="flex items-start justify-between space-x-2">
        {/* LEFT COLUMN */}
        <section className="w-[50%] space-y-2">
          {parts
            .filter((_, i) => i % 2 === 0)
            .map((partWords, index) => {
              const partNumber = index * 2 + 1;
              const completed = getCompleted(partWords);

              return (
                <div
                  key={index}
                  onClick={() => openPart(partWords)}
                  className={`${
                    completed === partWords.length
                      ? "bg-[#06742d]"
                      : "bg-[rgb(26,41,49)]"
                  } px-5 py-2 rounded flex items-center cursor-pointer hover:bg-[rgb(35,53,64)] justify-between`}
                >
                  <p className="text-[17px] text-gray-200">PART-{partNumber}</p>
                  <div className="flex items-center gap-3">
                    <p className="bg-gray-600 px-3 py-1 text-gray-300 rounded-2xl">
                      {completed}/{partWords.length}
                    </p>
                  </div>
                </div>
              );
            })}
        </section>

        {/* RIGHT COLUMN */}
        <section className="w-[50%] space-y-2">
          {parts
            .filter((_, i) => i % 2 === 1)
            .map((partWords, index) => {
              const partNumber = index * 2 + 2;
              const completed = getCompleted(partWords);

              return (
                <div
                  key={index}
                  onClick={() => openPart(partWords)}
                  className={`${
                    completed === partWords.length
                      ? "bg-[#06742d]"
                      : "bg-[#333333]"
                  } px-5 py-2 rounded flex items-center cursor-pointer hover:bg-[#131313] justify-between`}
                >
                  <p className="text-[17px] text-gray-200">PART-{partNumber}</p>
                  <div className="flex items-center gap-3">
                    <p className="bg-gray-600 px-3 py-1 text-gray-300 rounded-2xl">
                      {completed}/{partWords.length}
                    </p>
                  </div>
                </div>
              );
            })}
        </section>
      </div>
    </div>
  );
}
