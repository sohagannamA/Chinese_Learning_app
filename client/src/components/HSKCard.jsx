import React, { useEffect, useState } from "react";
import axios from "axios";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { NavLink } from "react-router-dom";
import MessageBox from "./MessageBox";
import { ImWarning } from "react-icons/im";
import { Host } from "../api/Host";

export default function HSKCard() {
  const [stats, setStats] = useState([]);
  const token = localStorage.getItem("token");
  const [isShowMessageBox, setShowMessageBox] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch HSK summary
  const fetchStats = async () => {
    try {
      const res = await axios.get(`${Host.host}api/words/hsk-summary`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data && Array.isArray(res.data.hskLevels)) {
        const filteredStats = res.data.hskLevels.filter(
          (lvl) => lvl.totalWords > 0
        );
        setStats(filteredStats);
      } else {
        setStats([]);
      }
    } catch (err) {
      console.error("Stats Error:", err);
      setStats([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchStats();
  }, [token]);
  if (loading) {
    return (
      <p className="text-gray-400 text-center mt-10 text-xl">Loading...</p>
    );
  }

  // Reset progress
  const handleResetProgress = async () => {
    try {
      const res = await axios.put(
        `${Host.host}api/words/reset-progress`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        // Refresh stats after reset
        await fetchStats();
        setShowMessageBox(false);
      }
    } catch (error) {
      console.error("Reset Error:", error);
    }
  };

  const handleClose = () => setShowMessageBox(false);

  if (stats.length === 0) {
    return (
      <p className="text-white text-center mt-10 text-xl">
        No HSK data available.
      </p>
    );
  }

  const resetObject = {
    icon: <ImWarning />,
    message: "Are you sure you want to reset your learning?",
    handleResetProgress: handleResetProgress,
    handleClose: handleClose,
  };

  return (
    <div className="set_width responsive_class mb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
        {isShowMessageBox && <MessageBox resetObject={resetObject} />}

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
                    <NavLink to={`/${hskLevel}`} state={{ words: stats }}>
                      <p className="bg-green-800 rounded text-center text-gray-200 px-2 py-0.5 cursor-pointer hover:bg-green-900">
                        Learn
                      </p>
                    </NavLink>

                    {/* Reset Button: only show if some words completed */}
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
