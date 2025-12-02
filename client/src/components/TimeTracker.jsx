import React, { useEffect, useRef } from "react";
import axios from "axios";
import { Host } from "../api/Host";

export default function TimeTracker() {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const startTimeRef = useRef(Date.now());
  const intervalRef = useRef(null);

  // Function to save time
  const saveTime = async (duration) => {
    try {
      await axios.post(
        `${Host.host}api/words/save`,
        { userId, duration },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Time save error:", err);
    }
  };

  useEffect(() => {
    if (!userId || !token) return;

    // Interval save every 30 sec
    intervalRef.current = setInterval(() => {
      const durationSec = Math.floor(
        (Date.now() - startTimeRef.current) / 1000
      );
      saveTime(durationSec);
      startTimeRef.current = Date.now();
    }, 30000);

    // Save on page unload
    const handleUnload = () => {
      const durationSec = Math.floor(
        (Date.now() - startTimeRef.current) / 1000
      );
      navigator.sendBeacon(
        `${Host.host}api/words/save`,
        JSON.stringify({ userId, duration: durationSec })
      );
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      clearInterval(intervalRef.current);
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [userId, token]);

  return null; // UI নেই, শুধু background tracking
}
