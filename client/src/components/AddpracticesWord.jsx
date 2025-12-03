import { useState } from "react";
import axios from "axios";
import { Host } from "../api/Host";

export default function AddpracticesWord() {
  const [formData, setFormData] = useState({
    chinese: "",
    pinyin: "",
    english: "",
    sentences: [
      { chinese: "", english: "" },
      { chinese: "", english: "" },
    ],
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSentenceChange = (index, e) => {
    const newSentences = [...formData.sentences];
    newSentences[index][e.target.name] = e.target.value;
    setFormData((prev) => ({ ...prev, sentences: newSentences }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token"); // JWT from login
      if (!token) return alert("Please login first");

      const response = await axios.post(
        `${Host.host}api/words/addPracticesWord`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message);
      console.log("Word added:", response.data.word);

      // Reset form
      setFormData({
        chinese: "",
        pinyin: "",
        english: "",
        sentences: [
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
    <div className="min-h-screen responsive_class flex items-center justify-center">
      <div className="w-full max-w-3xl bg-[rgb(26,41,49)] rounded-3xl shadow-xl px-5 md:px-8 py-8 ">
        <h2 className="text-2xl font-bold text-center text-gray-400 mb-6">
          Add Practices Word
        </h2>
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
              className="w-full px-4 py-3 rounded-xl bg-[rgb(35,53,64)] text-white placeholder-gray-400 border border-gray-600  outline-0  transition"
            />
            <input
              type="text"
              name="pinyin"
              required
              value={formData.pinyin}
              onChange={handleChange}
              placeholder="Pinyin"
              className="w-full px-4 py-3 rounded-xl bg-[rgb(35,53,64)] text-white placeholder-gray-400 border border-gray-600  outline-none transition"
            />
            <input
              type="text"
              name="english"
              required
              value={formData.english}
              onChange={handleChange}
              placeholder="English Meaning"
              className="w-full px-4 py-3 rounded-xl bg-[rgb(35,53,64)] text-white placeholder-gray-400 border border-gray-600   outline-none transition"
            />
          </div>

          {/* Two Sentences */}
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
                  className="w-full px-4 py-3 rounded-xl bg-[rgb(35,53,64)] text-white placeholder-gray-400 border border-gray-600  outline-none transition"
                />
                <input
                  type="text"
                  name="english"
                  required
                  value={sentence.english}
                  onChange={(e) => handleSentenceChange(index, e)}
                  placeholder={`English Meaning ${index + 1}`}
                  className="w-full px-4 py-3 rounded-xl bg-[rgb(35,53,64)] text-white placeholder-gray-400 border border-gray-600  outline-none transition"
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
