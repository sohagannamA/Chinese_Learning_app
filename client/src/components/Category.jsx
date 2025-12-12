import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { NavLink } from "react-router-dom";
import { Host } from "../api/Host";

export default function Category() {
  const token = localStorage.getItem("token");

  // ✅ React Query v5 object signature
  const { data: stats = [], isLoading } = useQuery({
    queryKey: ["category-summary"],
    queryFn: async () => {
      const res = await axios.get(`${Host.host}api/words/category-summary`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.categories || [];
    },
    staleTime: 5 * 60 * 1000, // 5 min cache
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <p className="text-gray-400 text-center mt-10 text-xl">Loading...</p>
    );
  }

  if (!stats || stats.length === 0) {
    return (
      <p className="text-white text-center mt-10 text-xl">
        No categories found.
      </p>
    );
  }

  return (
    <div className="set_width responsive_class mb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
        {stats.map((item) => {
          const { category, totalWords, completedWords } = item;
          const percent =
            totalWords > 0
              ? Math.round((completedWords / totalWords) * 100)
              : 0;

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
    </div>
  );
}
