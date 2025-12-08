import React, { useState } from "react";
import { RiSpeakAiLine } from "react-icons/ri";
import { NavLink } from "react-router-dom";

export default function SpeakingSection() {
  const speakingItem = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const itemsPerPage = 4;
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = speakingItem.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(speakingItem.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="relative responsive_class set_width min-h-[400px] mt-4">
      <div className="mb-2 p-4 bg-[rgb(26,41,49)] rounded-lg shadow flex items-center gap-4">
        <p className="text-gray-200 font-semibold">HSK-1</p>
        <div className="flex-1 bg-gray-500 h-2 rounded">
          <div
            className="h-full bg-green-500 rounded transition-all duration-500"
            style={{ width: `${50}%` }}
          ></div>
        </div>
        <p className="text-gray-300 whitespace-nowrap">
          {5}/{10}
        </p>
      </div>

      {/* Grid of current items */}
      <div className="grid md:grid-cols-2 gap-2 mb-20">
        {currentItems.map((data, index) => (
          <div
            key={index}
            className="bg-[rgb(26,41,49)] hover:bg-[rgb(35,53,64)] cursor-pointer px-5 py-2 rounded"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <RiSpeakAiLine className="text-gray-400" />
                <p className="text-gray-300 text-[14px] md:text-[16px] set_fontfamily">
                  This is a speaking title {data}
                </p>
              </div>
              <NavLink to={`/speakingdisplay/${data}`}>
                <p className="bg-[#651717] rounded text-center text-gray-200 px-2 py-0.5 cursor-pointer hover:bg-[#2f0303]">
                  Play
                </p>
              </NavLink>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls - fixed at bottom of container */}
      <div className="absolute bottom-0 left-0 w-full flex justify-center mb-4 space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50"
          disabled={currentPage === 1}
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx}
            onClick={() => handlePageChange(idx + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === idx + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-white"
            }`}
          >
            {idx + 1}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
