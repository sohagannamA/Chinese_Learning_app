import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";


import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Host } from "../api/Host";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Progress() {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [words, setWords] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [dailyTrack, setDailyTrack] = useState([]);

  // ------------------ FETCH WORDS ------------------
  useEffect(() => {
    if (!token) return;
    const fetchWords = async () => {
      try {
        const res = await axios.get(`${Host.host}api/words/getall`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWords(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchWords();
  }, [token]);

  // ------------------ FETCH 7 DAYS USAGE ------------------
  useEffect(() => {
    if (!token) return;
    const fetchTime = async () => {
      try {
        const res = await axios.get(
          `${Host.host}api/words/7days?userId=${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const track = res.data.data || [];
        setDailyTrack(
          track.map((t) => ({ date: t.date, minutes: t.duration / 60 }))
        );
      } catch (err) {
        console.error(err);
      }
    };
    fetchTime();
  }, [token, userId]);

  // ------------------ CALCULATIONS ------------------
  const {
    todayWords,
    wordsLearnedToday,
    hourCounts,
    categoryCompleted,
    hskCompleted,
    avgTimeSec,
    todayUsage,
    last7Hours,
    last7Minutes,
  } = useMemo(() => {
    const filteredWords = words.filter((w) => w.completedBy.includes(userId));

    const todayWords = filteredWords.filter((w) =>
      w.updatedAt.startsWith(selectedDate)
    );
    const wordsLearnedToday = todayWords.length;

    // Best Learning Time
    const hourCounts = {};
    todayWords.forEach((w) => {
      const hour = new Date(w.updatedAt).getHours();
      const period = hour >= 12 ? "PM" : "AM";
      const hour12 = hour % 12 === 0 ? 12 : hour % 12;
      const label = `${hour12} ${period}`;
      hourCounts[label] = (hourCounts[label] || 0) + 1;
    });

    // Category Completion
    const categoryCompleted = {};
    filteredWords.forEach((w) => {
      const cat = w.category.toUpperCase();
      categoryCompleted[cat] = (categoryCompleted[cat] || 0) + 1;
    });

    // HSK Level Completion
    const hskLevels = ["HSK-1", "HSK-2", "HSK-3", "HSK-4", "HSK-5", "HSK-6"];
    const hskCompleted = {};
    hskLevels.forEach((level) => {
      const levelWords = filteredWords.filter((w) => w.hskLevel === level);
      if (levelWords.length > 0) hskCompleted[level] = levelWords.length;
    });

    // Average Time Per Word
    const timeSpentPerWord = todayWords.map((w) => {
      const start = new Date(w.createdAt);
      const end = new Date(w.updatedAt);
      return (end - start) / 1000;
    });
    const avgTimeSec = timeSpentPerWord.length
      ? timeSpentPerWord.reduce((a, b) => a + b, 0) / timeSpentPerWord.length
      : 0;

    // Daily Usage
    const todayData = dailyTrack.find((t) => t.date === selectedDate);
    const todayUsage = todayData ? todayData.minutes : 0;

    const last7TotalMin =
      dailyTrack.reduce((sum, t) => sum + t.minutes, 0) - todayUsage;
    const last7Hours = Math.floor(last7TotalMin / 60);
    const last7Minutes = Math.round(last7TotalMin % 60);

    return {
      todayWords,
      wordsLearnedToday,
      hourCounts,
      categoryCompleted,
      hskCompleted,
      avgTimeSec,
      todayUsage,
      last7Hours,
      last7Minutes,
    };
  }, [words, selectedDate, userId, dailyTrack]);

  // ------------------ FORMAT TIME ------------------
  const formatTime = (minutes) => {
    if (minutes < 1) return `${Math.ceil(minutes * 60)} sec`;
    if (minutes < 60) return `${Math.ceil(minutes)} min`;
    const hr = Math.floor(minutes / 60);
    const min = Math.round(minutes % 60);
    if (hr < 24) return `${hr} hr ${min} min`;
    const day = Math.floor(hr / 24);
    const remHr = hr % 24;
    if (day < 30) return `${day} day ${remHr} hr`;
    const month = Math.floor(day / 30);
    const remDay = day % 30;
    if (month < 12) return `${month} month ${remDay} day`;
    const year = Math.floor(month / 12);
    const remMonth = month % 12;
    return `${year} yr ${remMonth} month`;
  };

  const randomChart = (data, color = "#38bdf8", keySuffix = "") => {
    const labels = data.labels.length ? data.labels : ["No Data"];
    const datasetData =
      data.datasets[0].data.length > 0 ? data.datasets[0].data : [0];

    return (
      <Line
        key={keySuffix + labels.join("-")}
        data={{
          labels,
          datasets: [
            {
              ...data.datasets[0],
              data: datasetData,
            },
          ],
        }}
        options={{
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true } },
          tension: 0.3,
        }}
      />
    );
  };

  return (
    <div className="mt-4 text-gray-400 set_width responsive_class">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-[15px] md:text-xl hidden md:block">
          📊 Learning Dashboard
        </h1>

        {/* Date Selector */}
        <div className="w-full md:w-auto">
          <input
            type="date"
            className="w-full md:w-auto text-[#a49e9e] outline-0 px-2 py-1 rounded border cursor-pointer border-[#0a3c43]"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "20px",
        }}
      >
        <Card title="📅 Words Learned Today">
          {randomChart(
            {
              labels: ["Words Learned"],
              datasets: [
                {
                  label: "Words Learned",
                  data: [wordsLearnedToday],
                  backgroundColor: "#38bdf8",
                  borderColor: "#38bdf8",
                },
              ],
            },
            "#38bdf8",
            "wordsToday"
          )}
          <p style={{ marginTop: "12px" }}>
            📘 Total words learned: {wordsLearnedToday}
          </p>
        </Card>

        <Card title="⏰ Best Learning Time">
          {randomChart(
            {
              labels: Object.keys(hourCounts),
              datasets: [
                {
                  label: "Words Learned",
                  data: Object.values(hourCounts),
                  backgroundColor: "#f472b6",
                  borderColor: "#f472b6",
                },
              ],
            },
            "#f472b6",
            "bestTime"
          )}
          <p style={{ marginTop: "12px" }}>
            {Object.keys(hourCounts).length > 0
              ? `Peak hour: ${Object.keys(hourCounts).reduce((a, b) =>
                  hourCounts[a] > hourCounts[b] ? a : b
                )}`
              : "No data"}
          </p>
        </Card>

        <Card title="📚 Category Completion">
          {randomChart(
            {
              labels: Object.keys(categoryCompleted),
              datasets: [
                {
                  label: "Words Completed",
                  data: Object.values(categoryCompleted),
                  backgroundColor: "#a78bfa",
                  borderColor: "#a78bfa",
                },
              ],
            },
            "#a78bfa",
            "category"
          )}
        </Card>

        <Card title="🏷️ HSK Level Completion">
          {randomChart(
            {
              labels: Object.keys(hskCompleted),
              datasets: [
                {
                  label: "Words Completed",
                  data: Object.values(hskCompleted),
                  backgroundColor: "#34d399",
                  borderColor: "#34d399",
                },
              ],
            },
            "#34d399",
            "hsk"
          )}
        </Card>

        <Card title="⏱️ Average Time Spent per Word">
          {randomChart(
            {
              labels: ["Average Time"],
              datasets: [
                {
                  label: "Time",
                  data: [avgTimeSec / 60],
                  backgroundColor: "#fbbf24",
                  borderColor: "#fbbf24",
                },
              ],
            },
            "#fbbf24",
            "avgTime"
          )}
          <p style={{ marginTop: "12px" }}>{formatTime(avgTimeSec / 60)}</p>
        </Card>

        <Card title="🗓️ Daily Time Spent (last 7 days)">
          {randomChart(
            {
              labels: dailyTrack.map((d) => d.date),
              datasets: [
                {
                  label: "Daily Usage (min)",
                  data: dailyTrack.map((d) => d.minutes),
                  backgroundColor: "#60a5fa",
                  borderColor: "#60a5fa",
                },
              ],
            },
            "#60a5fa",
            "dailyTrack"
          )}
          <p style={{ marginTop: "12px" }}>
            Today using – {formatTime(todayUsage)} <br />
            Last 7 days – {formatTime(last7Hours * 60 + last7Minutes)}
          </p>
        </Card>
      </div>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div
      style={{
        background: "rgb(35,53,64)",
        padding: "20px",
        borderRadius: "16px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <h2 style={{ marginBottom: "12px" }}>{title}</h2>
      {children}
    </div>
  );
}
