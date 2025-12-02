import { useState } from "react";
import axios from "axios";
import { Host } from "../api/Host";

export default function AddWordForm() {
  const [formData, setFormData] = useState({
    chinese: "",
    pinyin: "",
    english: "",
    hskLevel: "HSK-1",
    category: "",
    sentences: [
      { chinese: "", english: "" },
      { chinese: "", english: "" },
      { chinese: "", english: "" },
    ],
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSentenceChange = (index, e) => {
    const newSentences = [...formData.sentences];
    newSentences[index][e.target.name] = e.target.value;
    setFormData({
      ...formData,
      sentences: newSentences,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    try {
      const token = localStorage.getItem("token"); // JWT token from login
      console.log(token);
      if (!token) return alert("Please login first");

      const response = await axios.post(
        `${Host.host}api/words/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message);
      console.log("Word added:", response.data.word);

      // Clear form
      setFormData({
        chinese: "",
        pinyin: "",
        english: "",
        hskLevel: "HSK-1",
        category: "Select Category",
        sentences: [
          { chinese: "", english: "" },
          { chinese: "", english: "" },
          { chinese: "", english: "" },
        ],
      });
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to add word");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-10">
      <div className="w-full max-w-3xl bg-[#333333] rounded-3xl shadow-xl p-8 space-y-6">
        <h2 className="text-4xl font-bold text-center text-white mb-4">
          Add New Word
        </h2>
        <p className="text-gray-400 text-center">
          Add a new Chinese word with HSK level and example sentences
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Word Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              name="chinese"
              required
              value={formData.chinese}
              onChange={handleChange}
              placeholder="Chinese"
              className="w-full px-4 py-3 rounded-xl bg-[#373636] text-white placeholder-gray-400 border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
            <input
              type="text"
              name="pinyin"
              required
              value={formData.pinyin}
              onChange={handleChange}
              placeholder="Pinyin"
              className="w-full px-4 py-3 rounded-xl bg-[#373636] text-white placeholder-gray-400 border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
            <input
              type="text"
              name="english"
              required
              value={formData.english}
              onChange={handleChange}
              placeholder="English Meaning"
              className="w-full px-4 py-3 rounded-xl bg-[#373636] text-white placeholder-gray-400 border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>

          {/* HSK Level Dropdown */}
          <select
            name="hskLevel"
            value={formData.hskLevel}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-[#373636] text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition"
          >
            <option value="HSK-1">HSK-1</option>
            <option value="HSK-2">HSK-2</option>
            <option value="HSK-3">HSK-3</option>
            <option value="HSK-4">HSK-4</option>
          </select>

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-[#373636] text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition"
          >
            <option value="">Select Category</option>
            <option value="adjective">Adjective</option>
            <option value="noun">Noun</option>
            <option value="verb">Verb</option>
            <option value="phrase">Phrase</option>
            <option value="expression">Expression</option>
            <option value="fruit">Fruit</option>
            <option value="vehicle">Vehicle</option>
            <option value="animal">Animal</option>
            <option value="color">Color</option>
            <option value="food">Food</option>
          </select>

          {/* Sentences */}
          <div className="space-y-4">
            {formData.sentences.map((sentence, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <input
                  type="text"
                  name="chinese"
                  required
                  value={sentence.chinese}
                  onChange={(e) => handleSentenceChange(index, e)}
                  placeholder={`Chinese Sentence ${index + 1}`}
                  className="w-full px-4 py-3 rounded-xl bg-[#373636] text-white placeholder-gray-400 border border-gray-600 focus:ring-2 focus:ring-green-500 outline-none transition"
                />
                <input
                  type="text"
                  name="english"
                  required
                  value={sentence.english}
                  onChange={(e) => handleSentenceChange(index, e)}
                  placeholder={`English Meaning ${index + 1}`}
                  className="w-full px-4 py-3 rounded-xl bg-[#373636] text-white placeholder-gray-400 border border-gray-600 focus:ring-2 focus:ring-green-500 outline-none transition"
                />
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-2xl shadow-lg transition"
          >
            Add Word
          </button>
        </form>
      </div>
    </div>
  );
}
