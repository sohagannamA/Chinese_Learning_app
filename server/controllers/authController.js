import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// REGISTER User
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check existing email
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already exists" });

    // hash password
    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed
    });

    res.json({ message: "Registered Successfully!", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// LOGIN User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    // match password
    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: "Invalid password" });

    // ✅ Create JWT token
    const token = jwt.sign(
      { _id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } // token valid for 7 days
    );

    res.json({
      message: "Login Successful",
      user,
      token, // send token along with user
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
