import React, { useEffect, useState } from "react";
import axios from "axios";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { NavLink } from "react-router-dom";
import { Host } from "../api/Host";

export default function Category() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryStats = async () => {
      try {
        const token = localStorage.getItem("token"); // JWT token
        const res = await axios.get(
          `${Host.host}api/words/category-summary`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
       
        setStats(res.data.categories || []);
      } catch (err) {
        console.error("Category Stats Error:", err);
        setStats([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryStats();
  }, []);

  if (loading) {
    return <p className="text-gray-400 text-center mt-10 text-xl">Loading...</p>;
  }

  if (stats.length === 0) {
    return (
      <p className="text-white text-center mt-10 text-xl">
        No categories found.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      {stats.map((item) => {
        const { category, totalWords, completedWords } = item;
        const percent =
          totalWords > 0 ? Math.round((completedWords / totalWords) * 100) : 0;

        return (
          <div
            key={category}
            className="rounded px-8 py-6 bg-gradient-to-b bg-[rgb(26,41,49)] hover:bg-[rgb(35,53,64)]"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h1 className="text-gray-300 text-xl">{category}</h1>
                <p className="text-gray-300">TOTAL : {totalWords}</p>
                <p className="text-gray-300">COMPLETED : {completedWords}</p>

                <NavLink to={`/category/${category}`} state={{ category }}>
                  <p className="bg-green-800 rounded text-center text-gray-200 w-1/2 py-0.5 cursor-pointer hover:bg-green-900">
                    Learn
                  </p>
                </NavLink>
              </div>

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
  );
}
