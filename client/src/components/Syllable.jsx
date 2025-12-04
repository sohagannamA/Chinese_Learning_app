import React, { useEffect, useState } from "react";

export default function Syllable() {
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    const loadVoices = () => {
      const synthVoices = window.speechSynthesis.getVoices();
      setVoices(synthVoices);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  // Tones
  const tonesSet = {
    firstTone: ["Mā", "媽", "Mother"],
    secondTone: ["Má", "麻", "Hemp"],
    thirdTone: ["Mǎ", "馬", "Horse"],
    fourthTone: ["Mà", "罵", "Scold"],
  };

  // Initials dataset
  const initialsData = [
    { pinyin: "b", char: "爸", example: "bà" },
    { pinyin: "p", char: "怕", example: "pà" },
    { pinyin: "m", char: "妈", example: "mā" },
    { pinyin: "f", char: "飞", example: "fēi" },
    { pinyin: "d", char: "大", example: "dà" },
    { pinyin: "t", char: "他", example: "tā" },
    { pinyin: "n", char: "你", example: "nǐ" },
    { pinyin: "l", char: "来", example: "lái" },
    { pinyin: "g", char: "哥", example: "gē" },
    { pinyin: "k", char: "看", example: "kàn" },
    { pinyin: "h", char: "好", example: "hǎo" },
    { pinyin: "j", char: "家", example: "jiā" },
    { pinyin: "q", char: "七", example: "qī" },
    { pinyin: "x", char: "下", example: "xià" },
    { pinyin: "z", char: "子", example: "zǐ" },
    { pinyin: "c", char: "从", example: "cóng" },
    { pinyin: "s", char: "三", example: "sān" },
    { pinyin: "zh", char: "中", example: "zhōng" },
    { pinyin: "ch", char: "车", example: "chē" },
    { pinyin: "sh", char: "上", example: "shàng" },
    { pinyin: "r", char: "人", example: "rén" },
  ];

  // Finals dataset
  const finalsData = [
    { pinyin: "a", char: "啊", example: "ā" },
    { pinyin: "e", char: "鹅", example: "é" },
    { pinyin: "o", char: "哦", example: "ó" },
    { pinyin: "i", char: "一", example: "yī" },
    { pinyin: "u", char: "五", example: "wǔ" },
    { pinyin: "ü", char: "鱼", example: "yú" },
    { pinyin: "ai", char: "爱", example: "ài" },
    { pinyin: "ao", char: "好", example: "hǎo" },
    { pinyin: "an", char: "安", example: "ān" },
    { pinyin: "ang", char: "昂", example: "áng" },
    { pinyin: "ei", char: "黑", example: "hēi" },
    { pinyin: "en", char: "恩", example: "ēn" },
    { pinyin: "eng", char: "冷", example: "lěng" },
    { pinyin: "ou", char: "欧", example: "ōu" },
    { pinyin: "ong", char: "中", example: "zhōng" },
    { pinyin: "ia", char: "家", example: "jiā" },
    { pinyin: "ie", char: "写", example: "xiě" },
    { pinyin: "iao", char: "小", example: "xiǎo" },
    { pinyin: "iu", char: "六", example: "liù" },
    { pinyin: "ian", char: "见", example: "jiàn" },
    { pinyin: "in", char: "心", example: "xīn" },
    { pinyin: "iang", char: "想", example: "xiǎng" },
    { pinyin: "ing", char: "明", example: "míng" },
    { pinyin: "iong", char: "兄", example: "xiōng" },
    { pinyin: "ua", char: "花", example: "huā" },
    { pinyin: "uo", char: "国", example: "guó" },
    { pinyin: "uai", char: "快", example: "kuài" },
    { pinyin: "ui", char: "水", example: "shuǐ" },
    { pinyin: "uan", char: "完", example: "wán" },
    { pinyin: "un", char: "问", example: "wèn" },
    { pinyin: "uang", char: "黄", example: "huáng" },
    { pinyin: "ueng", char: "翁", example: "wēng" },
    { pinyin: "üe", char: "月", example: "yuè" },
    { pinyin: "üan", char: "远", example: "yuǎn" },
    { pinyin: "ün", char: "云", example: "yún" },
    { pinyin: "er", char: "二", example: "èr" },
  ];

  const speakText = (text, section = "tone") => {
    if (!window.speechSynthesis) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "zh-CN";

    const xiaoxiao = voices.find(
      (v) => v.name.includes("Xiaoxiao") || v.name.includes("xiaoxiao")
    );
    if (xiaoxiao) utterance.voice = xiaoxiao;

    utterance.rate = section === "tone" ? 0.5 : 1; // tones slow, initials/finals fast
    utterance.pitch = 1.5;

    window.speechSynthesis.speak(utterance);
  };

  const toneEntries = Object.entries(tonesSet);

  return (
    <div className="mt-4 responsive_class set_width mb-20">
      {/* Tones */}
      <div>
        <p className="text-gray-300 text-xl">Tones</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          {toneEntries.map(([toneName, [pinyin, char, meaning]], idx) => {
            const isLastOdd =
              toneEntries.length % 2 !== 0 && idx === toneEntries.length - 1;
            return (
              <div
                key={toneName}
                className={`bg-[rgb(26,41,49)] cursor-pointer ${
                  isLastOdd ? "col-span-2 sm:col-span-2" : ""
                }`}
                onClick={() => speakText(pinyin, "tone")}
              >
                <div className="py-2 rounded text-gray-400 text-xl text-center space-y-2">
                  <p className="text-[30px]">{pinyin}</p>
                  <p>{char}</p>
                  <p>{meaning}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Initials */}
      <div className="mt-8">
        <p className="text-gray-300 text-xl">Initials</p>
        <p className="text-gray-400 text-sm mb-2">
          Sounds at the beginning of a syllable
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3 mt-2">
          {initialsData.map(({ pinyin, char, example }, idx) => (
            <div
              key={idx}
              className="bg-[rgb(26,41,49)] py-2 rounded text-gray-400 text-xl text-center cursor-pointer hover:bg-[rgb(36,51,59)]"
              onClick={() => speakText(char, "initial")}
            >
              <p className="text-[20px]">{pinyin}</p>
              <p>{char}</p>
              <p className="text-sm">{example}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Finals */}
      <div className="mt-8">
        <p className="text-gray-300 text-xl">Finals</p>
        <p className="text-gray-400 text-sm mb-2">
          Sounds at the end of a syllable
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3 mt-2">
          {finalsData.map(({ pinyin, char, example }, idx) => (
            <div
              key={idx}
              className="bg-[rgb(26,41,49)] py-2 rounded text-gray-400 text-xl text-center cursor-pointer hover:bg-[rgb(36,51,59)]"
              onClick={() => speakText(char, "final")}
            >
              <p className="text-[20px]">{pinyin}</p>
              <p>{char}</p>
              <p className="text-sm">{example}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
