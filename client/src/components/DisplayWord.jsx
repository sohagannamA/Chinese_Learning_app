import React, { useEffect, useRef, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import { GiSpeaker } from "react-icons/gi";
import { BiLeftArrow, BiShow } from "react-icons/bi";
import { FaRegCheckSquare } from "react-icons/fa";
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import { RiSettings2Line } from "react-icons/ri";
import HanziWriter from "hanzi-writer";
import axios from "axios";
import { PiPlayFill } from "react-icons/pi";
import { IoMdPause } from "react-icons/io";
import { Host } from "../api/Host";
import { IoMdAdd } from "react-icons/io";
import { IoCheckmarkSharp } from "react-icons/io5";

// Shuffle function
const shuffleArray = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export default function DisplayWord({
  wordDisplay,
  setWordDisplay,
  words,
  fetchWords,
  fetchTotalWords,
  from,
}) {
  const [index, setIndex] = useState(0);
  const [shuffledWords, setShuffledWords] = useState(shuffleArray(words));
  const [showEnglish, setShowEnglish] = useState(false);
  const container = useRef(null);
  const [showSetting, setShowSetting] = useState(false);
  const sliderRef = useRef(null);

  const [completed, setCompleted] = useState({
    action: false,
    wordId: null,
  });

  if (!shuffledWords || shuffledWords.length === 0) {
    return (
      <div className="text-center text-gray-200 py-20">No words found.</div>
    );
  }

  const cleanArray = (arr) => {
    return arr
      .map((item) => item.trim().replace(/\//g, "")) // remove `/`
      .filter((item) => item.length > 0); // remove empty strings
  };

  const current = shuffledWords[index];
  let singleWord = [...current.chinese];
  singleWord = cleanArray(singleWord);

  const [activeWordWrite, setActiveWordWrite] = useState(singleWord[0]);

  // Update active word when singleWord changes

  // Load completed status from backend
  const loadWordCompleted = async (wordId) => {
    try {
      const token = localStorage.getItem("token");

      const url =
        from === "hskPart"
          ? `${Host.host}api/words/toggle/${wordId}`
          : `${Host.host}api/words/togglecategory/${wordId}`;

      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCompleted({
        action: res.data.isCompleted,
        wordId: wordId,
      });
    } catch (err) {
      console.error("Load Completed Error:", err);
    }
  };

  useEffect(() => {
    loadWordCompleted(current._id);
    setActiveWordWrite(singleWord[0]);
  }, [index]);

  // Next and previous word navigation
  const nextWord = () => {
    if (index < shuffledWords.length - 1) {
      setIndex(index + 1);
    } else {
      const shuffled = shuffleArray(shuffledWords);
      setShuffledWords(shuffled);
      setIndex(0);
    }
    setShowEnglish(false);
  };

  const prevWord = () => {
    if (index === 0) {
      const shuffled = shuffleArray(shuffledWords);
      setShuffledWords(shuffled);
      setIndex(shuffledWords.length - 1);
    } else {
      setIndex(index - 1);
    }
    setShowEnglish(false);
  };

  // HanziWriter animation
  const writerRef = useRef(null);
  const isAnimatingRef = useRef(false);

  // Effect to handle activeWordWrite change

  const animationFunction = () => {
    if (!container.current || !activeWordWrite) return;

    // Clear container safely
    if (container.current) container.current.innerHTML = "";
    isAnimatingRef.current = false;

    // Create new HanziWriter instance
    writerRef.current = HanziWriter.create(container.current, activeWordWrite, {
      width: 270,
      height: 270,
      padding: 5,
      strokeColor: "#8e2020",
      delayBetweenStrokes: 500,
      strokeAnimationSpeed: 1,
      showOutline: true,
      showCharacter: false,
    });

    // Animate once (no loop)
    isAnimatingRef.current = true;
    writerRef.current.animateCharacter().then(() => {
      isAnimatingRef.current = false;
    });

    // Cleanup
    return () => {
      isAnimatingRef.current = false;
      // Just set to null, no need to call cancelAnimation
      writerRef.current = null;
    };
  };
  useEffect(() => {
    animationFunction();
  }, [activeWordWrite]);

  // Handle word click
  const handleClick = (word) => {
    setActiveWordWrite(word);
    animationFunction();
    speakChinese(word);
  };

  const [text, setText] = useState("");

  const speakChinese = (text) => {
    setText(text);
    if (!text || typeof text !== "string") return;

    // Stop any ongoing speech
    if (speechSynthesis.speaking || speechSynthesis.pending) {
      speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "zh-CN";
    utterance.rate = 0.8;
    utterance.pitch = 1.5;
    utterance.volume = 1;

    const selectVoice = () => {
      const voices = speechSynthesis.getVoices();

      // Try Xiaoxiao first
      let voice = voices.find(
        (v) => v.lang === "zh-CN" && v.name.toLowerCase().includes("xiaoxiao")
      );

      // If Xiaoxiao not found, try other Chinese voices
      if (!voice) {
        voice =
          voices.find(
            (v) =>
              v.lang === "zh-CN" &&
              (v.name.toLowerCase().includes("lihua") ||
                v.name.toLowerCase().includes("female") ||
                v.name.toLowerCase().includes("tingting"))
          ) || voices.find((v) => v.lang === "zh-CN");
      }

      if (voice) utterance.voice = voice;

      speechSynthesis.speak(utterance);
    };

    // Voices already loaded
    if (speechSynthesis.getVoices().length > 0) {
      selectVoice();
    } else {
      // Wait for voices to load
      speechSynthesis.onvoiceschanged = selectVoice;
    }
  };

  // Toggle complete
  const toggleWordComplete = async (wordId) => {
    try {
      const token = localStorage.getItem("token");

      const url =
        from === "hskPart"
          ? `${Host.host}api/words/toggle/${wordId}`
          : `${Host.host}api/words/togglecategory/${wordId}`;

      // Make POST request
      const res = await axios.post(
        url,
        {}, // no body needed
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { word, isCompleted } = res.data;

      // update single-word completed state
      setCompleted({
        action: isCompleted,
        wordId,
      });

      // update local shuffledWords state
      const updatedWords = shuffledWords.map((w) =>
        w._id === wordId
          ? { ...w, isCompleted } // only update per-user completion
          : w
      );

      setShuffledWords(updatedWords);
    } catch (err) {
      console.error("Axios Toggle Error:", err);
    }
  };

  // ===================== POMODORO TIMER =====================
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 min
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" + s : s}`;
  };

  const startTimer = () => {
    if (timerRef.current) return;

    setIsRunning(true);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          setIsRunning(false);
          return 25 * 60;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pauseTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = null;
    setIsRunning(false);
  };

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);
  // ===========================================================

  const [isHideSentence, setHideSentence] = useState(
    localStorage.getItem("hidesentence") === "true" ? true : false
  );

  const [ispromodoro, setpromodoro] = useState(false);

  // Saved status per word
  const [savedWords, setSavedWords] = useState({});

  // Toggle / add/remove word
  const addToPracticesWord = async (word) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Please login first");

      const response = await axios.post(
        `${Host.host}api/words/addPracticesWord`,
        word,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(word);

      // Update saved status for this word only
      setSavedWords((prev) => ({
        ...prev,
        [word._id]: response.data.toggled === "added",
      }));
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to toggle word");
    }
  };

  const checkWordStatus = async (word) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(`${Host.host}api/words/check`, {
        params: { chinese: word.chinese }, // send chinese word
        headers: { Authorization: `Bearer ${token}` },
      });

      // save status using word._id as key
      setSavedWords((prev) => ({
        ...prev,
        [word._id]: res.data.exists,
      }));
    } catch (err) {
      console.log("Check error:", err);
    }
  };

  // Run check whenever current word changes
  useEffect(() => {
    if (current) {
      checkWordStatus(current); // pass whole word
      console.log("Check triggered for:", current.chinese);
    }
  }, [current.chinese]); // dependency is chinese

  return (
    <div className="mx-auto w-full   bg-[#333333] overflow-y-scroll  h-screen relative">
      <div className="flex border-b-2 border-[#414040] bg-[rgb(51,51,51)] sticky top-0 z-50  items-center justify-between px-3 md:px-10 pt-3 pb-3">
        {/* POMODORO TIMER UI */}
        <div className="flex items-center justify-between space-x-3 w-full ">
          <div
            onClick={() => {
              setWordDisplay(!wordDisplay);
              document.body.style.overflowY = "auto";
              if (from === "hskPart") {
                fetchWords();
              }
              if (from === "practices_word") {
                fetchTotalWords();
              }
            }}
            className="h-[35px] w-[35px] bg-[#414141] cursor-pointer hover:bg-[#585757] rounded-2xl flex items-center justify-center"
          >
            <FaArrowLeft className="text-gray-400" />
          </div>
          {ispromodoro ? (
            <div className="flex items-center">
              <div className="h-[35px] px-4 mr-2 bg-[#414141] cursor-pointer rounded-2xl flex items-center justify-center">
                <p className="text-gray-400 text-2xl">{formatTime(timeLeft)}</p>
              </div>

              {isRunning ? (
                <div
                  onClick={pauseTimer}
                  className="h-[35px] w-[35px] bg-[#414141] cursor-pointer hover:bg-[#585757] rounded-2xl flex items-center justify-center"
                >
                  <IoMdPause className="text-gray-400" />
                </div>
              ) : (
                <div
                  onClick={startTimer}
                  className="h-[35px] w-[35px] bg-[#414141] cursor-pointer hover:bg-[#585757] rounded-2xl flex items-center justify-center"
                >
                  <PiPlayFill className="text-gray-400" />
                </div>
              )}
            </div>
          ) : (
            ""
          )}

          <div
            onClick={() => setShowSetting(!showSetting)}
            className="h-[35px] w-[35px] bg-[#414141] cursor-pointer hover:bg-[#585757] rounded-2xl flex items-center justify-center"
          >
            <RiSettings2Line className="text-gray-400" />

            {showSetting ? (
              <div className=" absolute top-[100%] px-2 shadow-2xl right-10 z-50 rounded  bg-[#595959]">
                <div
                  onClick={() => {
                    setHideSentence(!isHideSentence);
                    setShowSetting(!showSetting);
                    localStorage.setItem("hidesentence", !isHideSentence);
                  }}
                  className={` ${
                    localStorage.getItem("hidesentence") === "true"
                      ? "bg-[#242424]"
                      : "bg-[#393737]"
                  } cursor-pointer text-center text-[12px] hover:bg-[#242424] text-gray-200 px-2 py-1 space-x-2 rounded mt-2`}
                >
                  Hide Sentence
                </div>
                <div
                  onClick={() => {
                    setpromodoro(!ispromodoro), setShowSetting(!showSetting);
                  }}
                  className={`${
                    ispromodoro ? "bg-[#242424]" : "bg-[#393737]"
                  } cursor-pointer text-center text-[12px] mb-2 hover:bg-[#242424] text-gray-200 px-2 py-1 space-x-2 rounded mt-2`}
                >
                  Pomodoro
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>

      <div className="grid px-3 md:px-10 md:grid-cols-2 gap-5">
        {/* WORD DISPLAY */}
        <div className="w-full relative h-[85vh] bg-[#414141] px-10 mt-5 ">
          <div
            className={` text-center ${
              showEnglish ? "flex-col" : ""
            } flex items-center justify-center h-[70%] ${
              showEnglish
                ? "text-[50px]"
                : singleWord.length >= 3
                ? "text-[70px] md:text-[120px]"
                : "text-[100px] md:text-[170px]"
            } text-gray-100`}
          >
            {showEnglish ? current.english : current.chinese}
            {showEnglish && (
              <div className="text-2xl text-gray-400">{current.pinyin}</div>
            )}
          </div>

          {/* CONTROLS */}
          <div className="absolute bottom-10 left-0 w-full">
            <p className="text-center mb-5 mt-3 text-xl text-gray-400">
              {index + 1}/{shuffledWords.length}
            </p>
            <div className="flex items-center justify-center bg-[#3b3a3a] mx-0 md:mx-10 rounded-full py-1">
              <div className="flex items-center justify-between w-full px-10">
                {/* PREVIOUS */}
                <div
                  onClick={prevWord}
                  className="hover_class relative text-[20px] h-[35px] text-gray-400 w-[35px] flex items-center justify-center border border-[#4d4c4c] rounded-full cursor-pointer hover:bg-[#4d4c4c]"
                >
                  <FaArrowLeft />
                </div>

                <div className="flex items-center space-x-3">
                  <div
                    onClick={() => setShowEnglish(!showEnglish)}
                    className={`hover_class relative h-[35px] w-[35px] border border-[#4d4c4c] flex items-center justify-center text-[20px] ${
                      showEnglish ? "bg-[#4d4c4c]" : ""
                    } text-gray-400 cursor-pointer hover:bg-[#4d4c4c] rounded`}
                  >
                    <BiShow />
                  </div>

                  <div
                    onClick={() => speakChinese(current.chinese)}
                    className="hover_class relative h-[35px] w-[35px] border border-[#4d4c4c] flex items-center justify-center text-[20px] text-gray-400 cursor-pointer hover:bg-[#4d4c4c] rounded"
                  >
                    <GiSpeaker />
                  </div>

                  {from !== "practices_word" ? (
                    <div
                      onClick={() => toggleWordComplete(current._id)}
                      className="hover_class relative h-[35px] w-[35px] border border-[#4d4c4c] flex items-center justify-center text-[20px] text-gray-400 cursor-pointer hover:bg-[#4d4c4c] rounded"
                    >
                      {completed.action && completed.wordId === current._id ? (
                        <div>
                          <FaRegCheckSquare />
                          <div className="connect_hover left-[-100%]   absolute bottom-[-100%] w-[145px] text-center bg-[#121212] text-[12px] p-0.5 rounded">
                            Remove from Completed
                          </div>
                        </div>
                      ) : (
                        <div>
                          <MdCheckBoxOutlineBlank />
                          <div className="connect_hover left-[-100%] absolute bottom-[-100%] w-[120px] text-center bg-[#121212] text-[12px] p-0.5 rounded">
                            Add to Completed
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    ""
                  )}
                  <div
                    onClick={() => addToPracticesWord(current)}
                    className="hover_class relative h-[35px] w-[35px] border border-[#4d4c4c] flex items-center justify-center text-[20px] text-gray-400 cursor-pointer hover:bg-[#4d4c4c] rounded"
                  >
                    <div className="connect_hover left-[-100%] absolute bottom-[-100%] w-[110px] text-center bg-[#121212] text-[12px] p-0.5 rounded">
                      {savedWords[current._id]
                        ? "Remove Practices"
                        : "Practices next time"}
                    </div>

                    {savedWords[current._id] ? (
                      <IoCheckmarkSharp />
                    ) : (
                      <IoMdAdd />
                    )}
                  </div>
                </div>

                {/* NEXT */}
                <div
                  onClick={nextWord}
                  className="text-[20px] text-gray-400 h-[35px] w-[35px] flex items-center justify-center border border-[#4d4c4c] hover:bg-[#4d4c4c] rounded-full cursor-pointer"
                >
                  <FaArrowRight />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CHARACTER WRITING + SENTENCES */}
        <div className="relative">
          <div className="mb-5">
            <div className="md:mt-5 w-[100%]">
              <div className="grid grid-cols-3 gap-3 ">
                {singleWord.map((word, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleClick(word)}
                    className={`text-center ${
                      activeWordWrite === word ? "bg-[#8e2020]" : "bg-[#414141]"
                    }  px-10 py-1 text-xl text-gray-300 rounded-lg cursor-pointer whitespace-nowrap`}
                  >
                    {word}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#414141] mt-5 h-[100vh] md:h-[85vh]">
              <div className="flex items-center justify-center">
                <span
                  ref={container}
                  className="text-gray-400 mt-20 md:mt-5 "
                />
              </div>
              {!isHideSentence && (
                <div className="w-full absolute bottom-6 mt-10">
                  {current.sentences?.map((sentence) => (
                    <div
                      key={sentence._id}
                      className="bg-[#363535] px-5 py-2 my-2 mx-2 rounded flex items-center justify-between"
                    >
                      <div className="space-y-1">
                        <p className="text-2xl text-gray-50">
                          {sentence.chinese}
                        </p>
                        <p className="text-xl text-gray-400">
                          {sentence.english}
                        </p>
                      </div>
                      <div
                        onClick={() => speakChinese(sentence.chinese)}
                        className="h-[35px] w-[35px] border border-[#4d4c4c] flex items-center justify-center text-[20px] text-gray-400 cursor-pointer hover:bg-[#4d4c4c] rounded"
                      >
                        <GiSpeaker />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* SENTENCES */}
        </div>
      </div>
    </div>
  );
}
