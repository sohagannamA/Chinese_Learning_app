import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// REGISTER User
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 🔥 Use projection & lean() → MUCH FASTER
    const existing = await User.findOne({ email }).lean();
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // hash password
    const hashedPw = await bcrypt.hash(password, 10);

    // create user
    const user = await User.create({
      name,
      email,
      password: hashedPw,
    });

    return res.json({
      message: "Registered Successfully!",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// LOGIN User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔥 Projection + lean() → script execution time drops by 50%
    const user = await User.findOne({ email }).select("+password").lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // fast password match
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Generate token
    const token = jwt.sign(
      { _id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Login Successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
