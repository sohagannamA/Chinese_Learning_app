import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function SpeakingCard() {
  const [showMessageBox, setShowMessageBox] = useState(false);

  // Dummy data for stats
  const stats = [
    { hskLevel: "HSK-1", totalWords: 50, completedWords: 20 },
    { hskLevel: "HSK-2", totalWords: 60, completedWords: 45 },
    { hskLevel: "HSK-3", totalWords: 70, completedWords: 10 },
  ];

  return (
    <div className="set_width responsive_class mb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
        {/* Optional Message Box */}
        {showMessageBox && (
          <div className="bg-red-700 text-white p-4 rounded">
            Are you sure you want to reset?
            <button
              onClick={() => setShowMessageBox(false)}
              className="ml-4 bg-white text-red-700 px-2 py-1 rounded"
            >
              Close
            </button>
          </div>
        )}

        {stats.map((item) => {
          const { hskLevel, totalWords, completedWords } = item;
          const percent =
            totalWords > 0
              ? Math.round((completedWords / totalWords) * 100)
              : 0;

          return (
            <div
              key={hskLevel}
              className="rounded px-8 py-6 bg-[rgb(26,41,49)] hover:bg-[rgb(35,53,64)]"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <h1 className="text-gray-300 text-xl">{hskLevel}</h1>
                  <p className="text-gray-300">TOTAL : {totalWords}</p>
                  <p className="text-gray-300">COMPLETED : {completedWords}</p>

                  <div className="flex items-center space-x-4">
                    {/* Learn Button */}
                    <NavLink
                      to={`/speakingsection/${hskLevel}`}
                      state={{ words: stats }}
                    >
                      <p className="bg-green-800 rounded text-center text-gray-200 px-2 py-0.5 cursor-pointer hover:bg-green-900">
                        Learn
                      </p>
                    </NavLink>

                    {/* Reset Button */}
                    {completedWords > 0 && (
                      <button onClick={() => setShowMessageBox(true)}>
                        <p className="bg-[#a41517] rounded text-center text-gray-200 px-2 py-0.5 cursor-pointer hover:bg-[#cb4447]">
                          Reset
                        </p>
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress Circle */}
                <div style={{ width: 100, height: 100 }}>
                  <CircularProgressbar
                    value={percent}
                    text={`${percent}%`}
                    strokeWidth={10}
                    styles={buildStyles({
                      pathColor: "#3b82f6",
                      trailColor: "#e5e7eb",
                      textColor: "#3b82f6",
                      textSize: "20px",
                    })}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
