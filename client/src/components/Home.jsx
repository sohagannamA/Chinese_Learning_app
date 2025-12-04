import React, { useState } from "react";
import HSKCard from "./HSKCard";
import Category from "./Category";
import PracticesCard from "./PracticesCard";
import Syllable from "./Syllable";

export default function Home() {
  const [toggle, setToggle] = useState("learnhsk");

  return (
    <div className="fixed top-0 left-0 bg-gray-600">
      <div>
        <div className="flex items-center space-x-5">
          <div
            onClick={() => setToggle("learnhsk")}
            className={`${
              toggle === "learnhsk" ? "bg-[#060d18]" : "bg-[rgb(26,41,49)]"
            } px-2 py-1 rounded text-[#dddada] cursor-pointer hover:bg-[rgb(35,53,64)]`}
          >
            Learn hsk
          </div>

          <div
            onClick={() => setToggle("syllable")}
            className={`${
              toggle === "syllable" ? "bg-[#060d18]" : "bg-[rgb(26,41,49)]"
            } px-2 py-1 rounded text-[#dddada] cursor-pointer hover:bg-[rgb(35,53,64)]`}
          >
            Syllable
          </div>

          <div
            onClick={() => setToggle("category")}
            className={`${
              toggle === "category" ? "bg-[#060d18]" : "bg-[rgb(26,41,49)]"
            } px-2 py-1 rounded text-[#dddada] cursor-pointer hover:bg-[rgb(35,53,64)]`}
          >
            Category
          </div>
          <div
            onClick={() => setToggle("practice_word")}
            className={`${
              toggle === "practice_word" ? "bg-[#060d18]" : "bg-[rgb(26,41,49)]"
            } px-2 py-1 rounded text-[#dddada] cursor-pointer hover:bg-[rgb(35,53,64)]`}
          >
            Practices word
          </div>
        </div>
      </div>
      <div>
        {toggle === "learnhsk" && <HSKCard />}
        {toggle === "syllable" && <Syllable />}
        {toggle === "category" && <Category />}
        {toggle === "practice_word" && <PracticesCard />}
      </div>
    </div>
  );
}
