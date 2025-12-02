import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { Host } from "../api/Host";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  // ✅ Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token"); // token check
    if (token) {
      navigate("/"); // redirect to Home if logged in
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(
        `${Host.host}api/auth/login`,
        formData
      );
      console.log(data)

      if (data?.user?._id && data?.token) {
        // Save userId and token in localStorage
        localStorage.setItem("userId", data.user._id);
        localStorage.setItem("token", data.token);

        alert("Login successful!");
        navigate("/"); // redirect after login
      } else {
        alert("Login failed: Invalid response from server");
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert(error.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5">
      <div className="w-full max-w-sm bg-gray-800 border border-gray-700 shadow-xl rounded-2xl p-6">
        <h2 className="text-3xl font-semibold text-center text-white mb-6">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full cursor-pointer bg-blue-600 hover:bg-blue-700 transition text-white text-lg py-2 rounded-lg font-medium ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <NavLink to="/registration">
            <button className="w-full cursor-pointer bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition font-medium">
              Create New Account
            </button>
          </NavLink>
        </div>
      </div>
    </div>
  );
}
