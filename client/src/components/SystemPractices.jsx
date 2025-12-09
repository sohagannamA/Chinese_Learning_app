import React, { useState, useEffect } from "react";

export default function SystemPractices() {
  const [delay, setDelay] = useState(1); // default timer 1 sec
  const [count, setCount] = useState(0); // auto click counter
  const [active, setActive] = useState(false);

  // Auto-click effect
  useEffect(() => {
    if (!active) return;

    const timer = setInterval(() => {
      setCount((prev) => prev + 1);
    }, delay * 1000); // delay selected by user

    return () => clearInterval(timer);
  }, [delay, active]);

  return (
    <div className="flex items-center justify-center h-[50vh]">
      <div className="text-gray-400">
        <p className="text-[30px]">Click Timer</p>

        {/* SET AUTO CLICK DELAY */}
        <div className="mt-5 flex items-center gap-3">
          {[1, 2, 3, 4].map((num) => (
            <div
              key={num}
              onClick={() => {
                setDelay(num);
                setActive(true); // start auto-click
              }}
              className={`px-10 py-4 rounded cursor-pointer text-[30px] 
                ${
                  delay === num
                    ? "bg-green-600 text-white"
                    : "bg-gray-600 text-gray-300"
                }`}
            >
              {num}
            </div>
          ))}
        </div>

        {/* COUNTER DISPLAY */}
        <div className="mt-5">
          <p>Auto-click delay: {delay} second</p>
          <div className="text-[25px] mt-2">YOU CLICK {count}</div>
        </div>
      </div>
    </div>
  );
}
