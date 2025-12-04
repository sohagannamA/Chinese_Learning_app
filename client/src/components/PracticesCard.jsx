import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import DisplayWord from "./DisplayWord";
import { Host } from "../api/Host";

export default function PracticesCard() {
  const [totalWords, setTotalWords] = useState(0);
  const [learnword, setlearnword] = useState(false);
  const [selectedPartWords, setSelectedPartWords] = useState([]);

  const fetchTotalWords = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${Host.host}api/words/total`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedPartWords(res.data.words);

      setTotalWords(res.data.totalWords || 0);
    } catch (err) {
      console.error("Failed to load word count:", err);
    }
  };
  useEffect(() => {
    fetchTotalWords();
  }, []);

  const handleDeleteAll = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`${Host.host}api/words/deleteAllPracticeWords`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("All words deleted!");
      setTotalWords(0);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="">
      {learnword ? (
        <div className="bg-[#1f1e1e] fixed top-0 left-0 h-screen w-full">
          <DisplayWord
            words={selectedPartWords}
            wordDisplay={learnword}
            setWordDisplay={setlearnword}
            from="practices_word"
            fetchTotalWords={fetchTotalWords}
          />
        </div>
      ) : (
        ""
      )}
      <div className="responsive_class set_width">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          <div className="rounded px-8 py-6 bg-gradient-to-b bg-[rgb(26,41,49)]">
            <p className="text-gray-200 text-xl text-center">PRACTICES SET</p>

            {/* ⭐ Insert total words here */}
            <p className="text-gray-300 text-4xl text-center mt-4">
              {totalWords}
            </p>

            <div className="flex items-center justify-center gap-4 mt-4">
              {totalWords > 0 ? (
                <>
                  <button
                    onClick={() => setlearnword(true)}
                    className="bg-green-800 rounded text-center text-gray-200 px-5 py-1   cursor-pointer hover:bg-green-900"
                  >
                    Learn
                  </button>

                  <button
                    onClick={() => handleDeleteAll()}
                    className="bg-[#ed3939] rounded text-center text-gray-200 px-5 py-1  cursor-pointer hover:bg-[#eb8888]"
                  >
                    Delete
                  </button>
                </>
              ) : (
                <>
                  <NavLink to="/">
                    <button className="bg-green-800 rounded text-center text-gray-200 px-5 py-1   cursor-pointer hover:bg-green-900">
                      Add Practices Word
                    </button>
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
