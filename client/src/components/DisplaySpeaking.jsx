import React, { useState, useEffect, useRef } from "react";

import { FaArrowLeft } from "react-icons/fa6";
import { RiSpeakAiLine } from "react-icons/ri";
import { RiSpeakLine } from "react-icons/ri";
import { TbVocabulary } from "react-icons/tb";
import { MdOutlineTranslate } from "react-icons/md";
import { RiCheckboxBlankLine } from "react-icons/ri";

export default function DisplaySpeaking() {
  const [voices, setVoices] = useState([]);
  const [speechRate, setSpeechRate] = useState(0.85);
  const [speechPitch, setSpeechPitch] = useState(1.2);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showOnlyChinese, setShowOnlyChinese] = useState(false);

  const synthesisRef = useRef(null);
  const storyContentRef = useRef(null);
  const currentUtteranceRef = useRef(null);

  // Initialize speech synthesis
  useEffect(() => {
    synthesisRef.current = window.speechSynthesis;

    const loadVoices = () => {
      const availableVoices = synthesisRef.current.getVoices();
      setVoices(availableVoices);
    };

    if (synthesisRef.current.getVoices().length > 0) {
      loadVoices();
    }

    synthesisRef.current.onvoiceschanged = loadVoices;

    return () => {
      if (synthesisRef.current) {
        synthesisRef.current.cancel();
        synthesisRef.current.onvoiceschanged = null;
      }
    };
  }, []);

  // Handle text selection
  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      const text = selection.toString().trim();

      if (text) {
        speakSelectedText(text);
      } else {
        stopSpeaking();
      }
    };

    const handleClick = (e) => {
      if (!storyContentRef.current?.contains(e.target)) {
        window.getSelection().removeAllRanges();
        stopSpeaking();
      }
    };

    const contentElement = storyContentRef.current;
    if (contentElement) {
      contentElement.addEventListener("mouseup", handleSelection);
      document.addEventListener("click", handleClick);
    }

    return () => {
      if (contentElement) {
        contentElement.removeEventListener("mouseup", handleSelection);
      }
      document.removeEventListener("click", handleClick);
    };
  }, [voices, speechRate, speechPitch]);

  // Story data
  const story = [
    {
      cn: "我早上七点起床，然后吃早饭。我喜欢喝牛奶和吃面包。",
      py: "wǒ zǎoshang qī diǎn qǐchuáng, ránhòu chī zǎofàn. wǒ xǐhuān hē niúnǎi hé chī miànbāo.",
      en: "I get up at 7 in the morning, then eat breakfast. I like milk and bread.",
    },
    {
      cn: "八点我去学校，上汉语课。中午我和朋友一起吃午饭，常常吃米饭和蔬菜。",
      py: "bā diǎn wǒ qù xuéxiào, shàng Hànyǔ kè. zhōngwǔ wǒ hé péngyǒu yīqǐ chī wǔfàn, chángcháng chī mǐfàn hé shūcài.",
      en: "At 8, I attend Chinese class. At noon, I eat lunch with friends.",
    },
    {
      cn: "下午我回家做作业，有时候也看书。晚上我吃晚饭，然后听音乐或看电视。",
      py: "xiàwǔ wǒ huí jiā zuò zuòyè, yǒu shíhòu yě kàn shū. wǎnshàng wǒ chī wǎnfàn, ránhòu tīng yīnyuè huò kàn diànshì.",
      en: "In the afternoon I do homework. In the evening I eat dinner, listen to music or watch TV.",
    },
    {
      cn: "我每天都很开心。",
      py: "wǒ měitiān dōu hěn kāixīn.",
      en: "I am happy every day.",
    },
  ];

  // Extract Chinese text
  const extractChineseText = (text) => {
    const chineseRegex = /[\u4e00-\u9fff\u3000-\u303f\uff00-\uffef，。！？、]/g;
    const chineseMatches = text.match(chineseRegex);
    return chineseMatches ? chineseMatches.join("") : "";
  };

  // Stop current speech
  const stopSpeaking = () => {
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
    }
    currentUtteranceRef.current = null;
    setIsSpeaking(false);
  };

  // Speak text
  const speakSelectedText = (text) => {
    if (!text || !voices.length) {
      stopSpeaking();
      return;
    }

    const chineseText = extractChineseText(text);
    if (!chineseText) {
      stopSpeaking();
      return;
    }

    stopSpeaking();
    setIsSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(chineseText);
    utterance.lang = "zh-CN";
    utterance.rate = speechRate;
    utterance.pitch = speechPitch;

    // 🔥 Force Xiaoxiao voice
    let selectedVoice = voices.find((v) =>
      v.name.toLowerCase().includes("xiaoxiao")
    );

    // fallback to any Chinese voice
    if (!selectedVoice) {
      selectedVoice = voices.find((v) => v.lang.startsWith("zh"));
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onend = () => {
      currentUtteranceRef.current = null;
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      currentUtteranceRef.current = null;
      setIsSpeaking(false);
    };

    currentUtteranceRef.current = utterance;
    synthesisRef.current.speak(utterance);
  };

  // Render Chinese
  const renderChinese = (txt) => {
    return txt.split("").map((char, index) => (
      <span key={index} className="inline-block cursor-text select-text">
        {char}
      </span>
    ));
  };

  const handleShowChinese = () => {
    setShowOnlyChinese((prev) => !prev);
  };

  return (
    <div className="responsive_class set_width p-4">
      <div className="flex items-center justify-between">
        <div className=" flex items-center justify-center h-[35px] w-[35px] cursor-pointer bg-[rgb(26,41,49)] hover:bg-[rgb(35,53,64)] rounded-full ">
          <FaArrowLeft className="text-gray-400" />
        </div>
        <div className="flex items-center space-x-2">
          <div>
            <div className="flex items-center justify-center h-[30px] w-[35px] cursor-pointer bg-[rgb(26,41,49)] hover:bg-[rgb(35,53,64)] rounded ">
              <RiSpeakLine className="text-gray-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-center h-[30px] w-[35px] cursor-pointer bg-[rgb(26,41,49)] hover:bg-[rgb(35,53,64)] rounded ">
              <TbVocabulary className="text-gray-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-center h-[30px] w-[35px] cursor-pointer bg-[rgb(26,41,49)] hover:bg-[rgb(35,53,64)] rounded ">
              <RiCheckboxBlankLine className="text-gray-400" />
            </div>
          </div>
          <div>
            <div
              onClick={handleShowChinese}
              className={`flex items-center justify-center h-[30px] w-[35px] cursor-pointer ${
                showOnlyChinese ? "bg-[#771207]" : "bg-[rgb(26,41,49)]"
              } hover:bg-[rgb(35,53,64)] rounded `}
            >
              <MdOutlineTranslate className="text-gray-400" />
            </div>
          </div>
        </div>
      </div>
      {/* Story Content */}
      <div ref={storyContentRef} className="space-y-4 mt-4">
        <div className="p-4 bg-[rgb(26,41,49)] rounded-lg selection:bg-blue-500 selection:text-white">
          <p className="text-xl text-gray-200 font-semibold">
            我早上的例行公事
          </p>
          {!showOnlyChinese && (
            <>
              <p className="text-gray-400 mt-1">Wǒ zǎoshang de lìxínggōngshì</p>
              <p className="text-gray-400 mt-1">My morning routine</p>
            </>
          )}
        </div>

        <div className="p-6 bg-[rgb(26,41,49)] text-gray-200 leading-relaxed rounded-lg selection:bg-blue-500 selection:text-white">
          {story.map((item, index) => (
            <div
              key={index}
              className="mt-3 mb-6 pb-4 border-b border-gray-700 last:border-b-0"
            >
              <p className="text-xl font-semibold mb-3 tracking-wide select-text cursor-text">
                {renderChinese(item.cn)}
              </p>
              {!showOnlyChinese && (
                <>
                  <p className="text-lg text-gray-400 mb-2">{item.py}</p>
                  <p className="text-sm text-gray-500">{item.en}</p>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Selection Tips */}
      <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
        <h3 className="font-bold text-yellow-400 mb-2">Tips:</h3>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• Select any Chinese text with your mouse</li>
          <li>• Text is spoken automatically when selected</li>
          <li>• Click elsewhere to stop speaking</li>
          <li>• Select new text to stop previous and speak new text</li>
          <li>• Only Chinese characters are spoken (English/pinyin ignored)</li>
        </ul>
      </div>

      <style jsx>{`
        .select-text {
          user-select: text;
        }
        ::selection {
          background-color: rgba(59, 130, 246, 0.5);
          color: white;
        }
      `}</style>
    </div>
  );
}
